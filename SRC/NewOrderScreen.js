/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  Image,
  Platform,
  Dimensions,
  TextInput,
  SafeAreaView,
  NativeAppEventEmitter,
  ImageBackground,
  
} from 'react-native';
import NavigationService from '../NavigationService';
import GLOBALS from '../UtilityClass/Globals';
import ModalDropdown from 'react-native-modal-dropdown';
import CustumProgress from '../UtilityClass/CustumProgress';
import AsyncStorage from '@react-native-community/async-storage';

let Window = Dimensions.get('window');
let selected_Gram;

export default class OderModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedGram: this.props.selectedItem.GramAndKG[0],
      selectedMarketAndLimit: "Market",
      Price: '',
      isOrderModalVisible: false,
      isProgress: false,
      OrderItem: this.props.selectedItem,
      notificationBody: '',
      fcmToken: '',
      TradeType: 0,
      ReturnCode: '',
      disabled: true,
    };

    this.eventListener = NativeAppEventEmitter.addListener(
      'eventselectedItem',
      params => this.handleEvent(params),
    );
  }
  async componentDidMount() {
    try {
      let fcmToken = await AsyncStorage.getItem("fcmToken");
      this.setState({ fcmToken: fcmToken });
    } catch (err) {
      // handle errors
    }
  }
  componentWillUnmount() {
    //remove listener
    selected_Gram = "";
    this.eventListener.remove();
  }

  handleEvent = event => {

    try {
      let gram = event.GramAndKG[0];
      if (selected_Gram != gram) {
        selected_Gram = gram;
        this.setState({ selectedGram: gram });
      }
      this.setState({ OrderItem: event });

    } catch (error) {
      console.log(error);
    }

  };


  dropDownOnSelect(value, indx) {
    this.setState({ selectedGram: value });
  }

  handlePrice = text => {
    this.setState({ Price: text });
  };

  ComponentMarketAndLimit(tyep) {
    this.setState({ selectedMarketAndLimit: tyep });
  };

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  _ShowOrderModel(item, TradeType, ReturnCode) {
    this.setState({ isOrderModalVisible: true });
    this.setState({ notificationBody: item });
    this.setState({ TradeType: TradeType });
    this.setState({ ReturnCode: ReturnCode });

  }

  _hideOrderModal = (ReturnMsg, TradeTyep, ReturnCode) => {
    setTimeout(function () {
      if (ReturnCode == '200') {

        if (ReturnMsg["code"] == "E555" || ReturnMsg["code"] == "E554" || ReturnMsg["code"] == "E553") {

          if (TradeTyep == "3" || TradeTyep == "4") {
            NativeAppEventEmitter.emit('eventKeyOrderSuccessfullyNavigation', 1);
          } else {
            NativeAppEventEmitter.emit('eventKeyOrderSuccessfullyNavigation', 0);
          }
          NavigationService.navigate('TRADE')
          this.props.hideModal()
          this.setState({ isOrderModalVisible: false });

        } else if (ReturnMsg["code"] == "E560") {

          if (TradeTyep == "3" || TradeTyep == "4") {
            NativeAppEventEmitter.emit('eventKeyOrderSuccessfullyNavigation', 1);
          } else {
            NativeAppEventEmitter.emit('eventKeyOrderSuccessfullyNavigation', 0);
          }
          NavigationService.navigate('TRADE')
          this.props.hideModal()
          this.setState({ isOrderModalVisible: false });

        } else {
          this.setState({ isOrderModalVisible: false });
        }

      } else {
        this.setState({ isOrderModalVisible: false });
      }
    }.bind(this), 100);
  };

  eventOderNow(TradeTyep, isClickBS) {
    let Quantity = this.state.selectedGram.toString();
    Quantity = Quantity.replace("kg", "");
    Quantity = Quantity.replace("gm", "");
    Quantity = Quantity.replace(" ", "");

    let LimitPrice = this.state.Price;

    if (TradeTyep == "Market" && isClickBS == "Buy") {

      this.InsertOpenOrderDetail(Quantity, "1", "", "");

    } else if (TradeTyep == "Market" && isClickBS == "Sell") {

      this.InsertOpenOrderDetail(Quantity, "2", "", "");

    } else if (TradeTyep == "Limit" && isClickBS == "Buy") {

      if (LimitPrice.length > 0) {
        this.InsertOpenOrderDetail(Quantity, "3", LimitPrice, "");
      } else {
        this.showAlert(GLOBALS.App_Name, 'Please enter price');
      }
    } else if (TradeTyep == "Limit" && isClickBS == "Sell") {

      if (LimitPrice.length > 0) {
        this.InsertOpenOrderDetail(Quantity, "4", "", LimitPrice);
      } else {
        this.showAlert(GLOBALS.App_Name, 'Please enter price');
      }
    }
  }

  InsertOpenOrderDetail(Quantity, TradeType, BuyLimitPrice, SellLimitPrice) {

    this.setState({ isProgress: true });
    let fcmToken = this.state.fcmToken;
    let ObjTrade = new Object();
    ObjTrade["SymbolId"] = this.state.OrderItem.IDSymbol;
    ObjTrade["Token"] = GLOBALS.Token_User_Login;
    ObjTrade["Quantity"] = Quantity;
    ObjTrade["TradeFrom"] = Platform.OS;
    ObjTrade["TradeType"] = TradeType;
    ObjTrade["DeviceToken"] = fcmToken;
    ObjTrade['BuyLimitPrice'] = BuyLimitPrice;
    ObjTrade["SellLimitPrice"] = SellLimitPrice;


    fetch(GLOBALS.Terminal_BASE_URL + 'InsertOpenOrderDetailWithRegID', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: "{'ObjOrder':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {
            let obj = JSON.parse(responseJson.d);

            if (obj != '') {

              if (TradeType == "3" || TradeType == "4") {
                this.textPriceRef.clear();
                this.setState({ Price: '' });
              }

              if (obj.ReturnCode == "200") {

                if (obj["code"] == "E555" || obj["code"] == "E554" || obj["code"] == "E553") {
                  this._ShowOrderModel(obj, TradeType, obj.ReturnCode);
                } else if (obj["code"] == "E560") {
                  this._ShowOrderModel(obj, TradeType, '400');
                } else {
                  this._ShowOrderModel(obj, TradeType, '400');
                }

              } else {
                this._ShowOrderModel(obj, TradeType, obj.ReturnCode);
              }


              this.setState({
                isProgress: false,
              });

            } else {
              this.setState({
                isProgress: false,
              });
            }
          } else {
            this.setState({
              isProgress: false,
            });
          }
        } catch (error) {
          console.log('error', error);
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  pressBuyButton(item) {
    this.setState({
      disabled: false,
    });

    if (this.state.disabled == false) {
      return;
    }

    setTimeout(() => {
      this.setState({
        disabled: true,
      });
    }, 1000);

    this.eventOderNow(item, "Buy")
  }

  pressSellButton(item) {
    this.setState({
      disabled: false,
    });

    if (this.state.disabled == false) {
      return;
    }

    setTimeout(() => {
      this.setState({
        disabled: true,
      });
    }, 1000);

    this.eventOderNow(item, "Sell")
  }

  render() {
    var item = this.state.OrderItem;

    return (
      <Modal
        animationType="slide"
        transparent={false}
        closeModal={false}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.hideModal()}>

        <View
          style={[
            {
              position: 'absolute',
              backgroundColor: GLOBALS.COLOR.BG_COLOR,
              width: Window.width,
              height: Window.height,
            },
          ]}
        />
        <SafeAreaView style={[{ backgroundColor: GLOBALS.COLOR.HEADER_COLOR }]} />
        <View style={[
          {
            height: 70,
            flexDirection: 'row',
            backgroundColor: GLOBALS.COLOR.HEADER_COLOR,
            borderBottomColor: GLOBALS.COLOR.DARKGRAY,
            borderBottomWidth: 1,
          },
        ]}>
          <View
            style={[
              {
                alignSelf: 'center',
                alignItems: 'center',
                position: 'absolute',
                width: Window.width,
              },
            ]}>
            <Text
              style={[
                {
                  alignSelf: 'center',
                  color: GLOBALS.COLOR.YELLOW,
                  textAlign: 'center',
                  fontSize: 18,
                  fontWeight: '700',
                  flex: 1,
                },
              ]}>
              New Order
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              this.props.hideModal();
            }}>
            <View
              style={[
                {
                  backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
                  justifyContent: 'center',
                },
              ]}>
              <Image
                style={[
                  {
                    alignSelf: 'center',
                    margin: 15,
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    tintColor: GLOBALS.COLOR.YELLOW,
                  },
                ]}
                source={require('../Images/BackBtn.png')}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>


        <ImageBackground
          style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BLACK}]}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../Images/bg.png')}>
        <View style={styles.containerView}>
          <View
            style={[
              {
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: GLOBALS.COLOR.WHITE,
                borderRadius: 4,
                borderColor: GLOBALS.COLOR.BORDER_COLOR,
                borderWidth: 2,
                margin: 12,
              },
            ]}>
            <View
              style={[
                {
                  // height: 40,
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  //backgroundColor:GLOBALS.COLOR.THEAMCOLOR,
                  // marginBottom:12,
                  marginVertical: 6,
                  borderTopEndRadius: 4,
                  borderTopStartRadius: 4,
                },
              ]}>
              <Text
                numberOfLines={0}
                style={[
                  {
                    flex: 1,
                    textAlign: 'center',
                    color: GLOBALS.COLOR.TEXT_COLOR,
                    fontSize: 20,
                    marginHorizontal: 20,
                    fontWeight: 'bold',
                  },
                ]}>
                {item.Sname}
              </Text>
            </View>

            {/* ///////Segment Button////////// */}
            <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }]}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    flex: 1,
                    height: 36,
                    borderRadius: 8,
                    borderColor: GLOBALS.COLOR.BLUE,
                    borderWidth: 2.0,
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginHorizontal: 40,
                  },
                ]}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    this.ComponentMarketAndLimit("Market");
                  }}>
                  <View
                    style={
                      this.state.selectedMarketAndLimit == "Market" // condition to add dynamic selector
                        ? styles.selectedMarketAndLimitStyle
                        : styles.buttonStyle
                    }>
                    <Text
                      style={[
                        { textAlign: 'center', paddingTop: 7, fontWeight: '700' },
                        {
                          color:
                            this.state.selectedMarketAndLimit == "Market"
                              ? GLOBALS.COLOR.WHITE
                              : GLOBALS.COLOR.TEXT_COLOR,
                        },
                      ]}>
                      Market
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() => {
                    this.ComponentMarketAndLimit("Limit");
                  }}>
                  <View
                    style={
                      this.state.selectedMarketAndLimit == "Limit" // condition to add dynamic selector
                        ? styles.selectedMarketAndLimitStyle2
                        : styles.buttonStyle2
                    }>
                    <Text
                      style={[
                        { textAlign: 'center', paddingTop: 7, fontWeight: '700' },
                        {
                          color:
                            this.state.selectedMarketAndLimit == "Limit"
                              ? GLOBALS.COLOR.WHITE
                              : GLOBALS.COLOR.TEXT_COLOR,
                        },
                      ]}>
                      Limit
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>

            <View style={[{ flexDirection: 'row', marginBottom: 5, marginHorizontal: 5 }]}>


              {/* ///////ASK////////// */}
              <View style={[{ height: 70, flex: 1, backgroundColor: GLOBALS.COLOR.WHITE, margin: 8, marginRight: 10, borderRadius: 8, borderWidth: 2, borderColor: item.BGColorBid == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorBid }]}>
                <Text
                  style={[
                    { height: 24, textAlign: 'center', fontSize: 16, fontWeight: '700', marginTop: 9, color: item.BGColorBid == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorBid },
                  ]}>
                  SELL
                </Text>
                <Text
                  style={[
                    {
                      height: 24,
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      margin: 3,
                      color: item.BGColorBid == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorBid,
                    },
                  ]}>
                  {item.Bid}
                </Text>
              </View>

              {/* ///////BID////////// */}
              <View style={[{ height: 70, flex: 1, backgroundColor: GLOBALS.COLOR.WHITE, margin: 8, marginLeft: 10, borderRadius: 8, borderWidth: 2, borderColor: item.BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorAsk }]}>
                <Text
                  style={[
                    { height: 24, textAlign: 'center', fontSize: 16, fontWeight: '700', marginTop: 9, color: item.BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorAsk },
                  ]}>
                  BUY
                </Text>
                <Text
                  style={[
                    {
                      height: 24,
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                      margin: 3,
                      color: item.BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : item.BGColorAsk,
                    },
                  ]}>
                  {item.Ask}
                </Text>
              </View>
            </View>

            {/* ///////ModalDropdown////////// */}
            {item.GramAndKG.length > 0 ? <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginRight: 15,
                  marginVertical: 5,
                },
              ]}>
              <View
                style={[
                  {
                    height: 35,
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR }}>Quantity : </Text>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.dropDown && this.dropDown.show();
                }}>
                <View
                  style={[
                    {
                      backgroundColor: GLOBALS.COLOR.WHITE,
                      height: 35,
                      width: 150,
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 4,
                      borderColor: GLOBALS.COLOR.BLACK,
                      borderWidth: 0.8,
                    },
                  ]}>

                  <ModalDropdown
                    ref={el => {
                      this.dropDown = el;
                    }}
                    defaultIndex={0}
                    defaultValue={''}
                    options={item.GramAndKG}
                    onSelect={(indx, value) =>
                      this.dropDownOnSelect(value, indx)
                    }

                    textStyle={[
                      {
                        textAlign: 'center',
                        color: GLOBALS.COLOR.TRANSPARENT_COLOR,
                        marginHorizontal: 24,
                        fontSize: 15,
                        fontWeight: '700',
                      },
                    ]}
                    dropdownTextHighlightStyle={[{ color: GLOBALS.COLOR.YELLOW_COLOR, fontWeight: '700', }]}
                    dropdownStyle={[{ width: 150, marginTop: 8, marginHorizontal: -29, backgroundColor: GLOBALS.COLOR.WHITE, borderColor: GLOBALS.COLOR.BLACK, borderWidth: 0.8, paddingEnd: 1 }]}
                    dropdownTextStyle={{ textAlign: 'center', fontSize: 16, color: GLOBALS.COLOR.BLACK, backgroundColor: GLOBALS.COLOR.WHITE, borderColor: GLOBALS.COLOR.BLACK, borderWidth: 0.4 }}
                  />
                  <Text style={[{ color: GLOBALS.COLOR.TEXT_COLOR, marginRight: 12, width: 16, fontSize: 18 }]}>
                    ▼
                  </Text>
                  <Text style={[{ width: '100%', textAlign: 'center', color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 17, fontWeight: '700', position: 'absolute' }]}>{this.state.selectedGram}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View> : null}

            {this.state.selectedMarketAndLimit == "Limit" ? (
              <View
                style={[
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 12,
                    marginRight: 15,
                  },
                ]}>
                <View
                  style={[
                    {
                      height: 35,
                      textAlign: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Text style={{ color: GLOBALS.COLOR.BLACK }}>Price : </Text>
                </View>
                <View
                  style={[
                    {
                      textAlign: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 4,
                    },
                  ]}>
                  <TextInput
                    selectionColor={'black'}
                    style={[
                      {
                        width: 150,
                        height: 35,
                        textAlign: 'center',
                        padding: 8,
                        fontSize: 15,
                        borderColor: GLOBALS.COLOR.YELLOW,
                        borderWidth: 1,
                        borderRadius: 8,
                        color: GLOBALS.COLOR.BLACK,
                      },
                    ]}

                    ref={ref => this.textPriceRef = ref}
                    underlineColorAndroid={GLOBALS.COLOR.TRANSPARENT_COLOR}
                    placeholder="Price"
                    placeholderTextColor="gray"
                    textAlign="center"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    onChangeText={this.handlePrice}
                    returnKeyType={'done'}
                    blurOnSubmit={true}
                  />
                </View>
              </View>
            ) : null}

            {/* BUY & SELL BUTTON */}
            <View style={[{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', }]}>

              {this.state.disabled == true ?
                <TouchableOpacity
                  style={{
                    backgroundColor: GLOBALS.COLOR.RATE_DOWN,
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginHorizontal: 15,
                    marginVertical: 15,
                    borderRadius: 4,
                    height: 50,
                  }}
                  onPress={() => {

                    if (item.GramAndKG.length > 0) {
                      this.pressSellButton(this.state.selectedMarketAndLimit)
                    } else {
                      this.showAlert(GLOBALS.App_Name, 'This symbol quantity not available.');
                    }
                  }}
                >
                  <Text style={[{
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 17,
                    fontWeight: '700',
                    color: GLOBALS.COLOR.WHITE,
                  },
                  ]}>
                    {"SELL"}
                  </Text>
                  {item.GramAndKG.length > 0 ? false : true ? <View style={[{ backgroundColor: GLOBALS.COLOR.RATE_DOWN, height: '100%', width: '100%', position: 'absolute', borderRadius: 4, justifyContent: 'center', alignItems: 'center', }]}>
                    <View style={[{ backgroundColor: GLOBALS.COLOR.WHITE, height: 10, width: '30%', borderRadius: 5 }]} />
                  </View> : null}

                </TouchableOpacity>

                :

                <TouchableOpacity
                  style={{
                    backgroundColor: GLOBALS.COLOR.RATE_DOWN,
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginHorizontal: 15,
                    marginVertical: 15,
                    borderRadius: 4,
                    height: 50,
                  }}
                >
                  <Text style={[{
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 17,
                    fontWeight: '700',
                    color: GLOBALS.COLOR.WHITE,
                  },
                  ]}>
                    {"SELL"}
                  </Text>
                  {item.GramAndKG.length > 0 ? false : true ? <View style={[{ backgroundColor: GLOBALS.COLOR.RATE_DOWN, height: '100%', width: '100%', position: 'absolute', borderRadius: 4, justifyContent: 'center', alignItems: 'center', }]}>
                    <View style={[{ backgroundColor: GLOBALS.COLOR.WHITE, height: 10, width: '30%', borderRadius: 5 }]} />
                  </View> : null}

                </TouchableOpacity>}


              {/* //// */}

              {this.state.disabled == true ?
                <TouchableOpacity
                  style={{
                    backgroundColor: GLOBALS.COLOR.RATE_UP,
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginHorizontal: 15,
                    marginVertical: 15,
                    borderRadius: 4,
                    height: 50,
                  }}
                  onPress={() => {

                    if (item.GramAndKG.length > 0) {
                      this.pressBuyButton(this.state.selectedMarketAndLimit)
                    } else {
                      this.showAlert(GLOBALS.App_Name, 'This symbol quantity not available.');
                    }
                  }}
                >
                  <Text style={[{
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 17,
                    fontWeight: '700',
                    color: GLOBALS.COLOR.WHITE,
                  },
                  ]}>
                    {"BUY"}
                  </Text>
                  {item.GramAndKG.length > 0 ? false : true ? <View style={[{ backgroundColor: GLOBALS.COLOR.RATE_UP, height: '100%', width: '100%', position: 'absolute', borderRadius: 4, justifyContent: 'center', alignItems: 'center', }]}>
                    <View style={[{ backgroundColor: GLOBALS.COLOR.WHITE, height: 10, width: '30%', borderRadius: 5 }]} />
                  </View> : null}

                </TouchableOpacity>

                :

                <TouchableOpacity
                  style={{
                    backgroundColor: GLOBALS.COLOR.RATE_UP,
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    marginHorizontal: 15,
                    marginVertical: 15,
                    borderRadius: 4,
                    height: 50,
                  }}
                >
                  <Text style={[{
                    alignItems: 'center',
                    alignSelf: 'center',
                    fontSize: 17,
                    fontWeight: '700',
                    color: GLOBALS.COLOR.WHITE,
                  },
                  ]}>
                    {"BUY"}
                  </Text>
                  {item.GramAndKG.length > 0 ? false : true ? <View style={[{ backgroundColor: GLOBALS.COLOR.RATE_UP, height: '100%', width: '100%', position: 'absolute', borderRadius: 4, justifyContent: 'center', alignItems: 'center', }]}>
                    <View style={[{ backgroundColor: GLOBALS.COLOR.WHITE, height: 10, width: '30%', borderRadius: 5 }]} />
                  </View> : null}

                </TouchableOpacity>
              }

            </View>
          </View>


        </View>
        </ImageBackground>

        {this.state.isProgress ? <View style={{
          position: 'absolute', flex: 1, alignItems: 'center',
          alignContent: 'center',
          alignSelf: 'center', top: '50%', left: '50%'
        }}><CustumProgress />
        </View> : null}

        <OrderModal
          modalVisible={this.state.isOrderModalVisible}
          ReturnMsg={this.state.notificationBody}
          ReturnCode={this.state.ReturnCode}
          TradeType={this.state.TradeType}
          _hideOrderModal={this._hideOrderModal} />

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  ///////SegmentButton/////
  buttonStyle: {
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
    flex: 1,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  selectedMarketAndLimitStyle: {
    backgroundColor: GLOBALS.COLOR.BLUE,
    flex: 1,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  buttonStyle2: {
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
    flex: 1,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  selectedMarketAndLimitStyle2: {
    backgroundColor: GLOBALS.COLOR.BLUE,
    flex: 1,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
});

class OrderModal extends React.Component {

  constructor(props) {
    super(props);
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    var ReturnMsg = this.props.ReturnMsg;
    var TradeTyep = this.props.TradeType;
    var ReturnCode = this.props.ReturnCode;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        closeModal={false}
        visible={this.props.modalVisible}
      // onRequestClose={() => this.props._hideOrderModal()}
      >

        <View style={{ flex: 1, backgroundColor: GLOBALS.COLOR.TRANSPARENT_BLACK, justifyContent: 'center' }}>

          {/* Order Susess */}
          {ReturnCode == '200' ? (<View style={{ alignSelf: 'center', width: 280, backgroundColor: GLOBALS.COLOR.BLUE, borderRadius: 4, borderColor: GLOBALS.COLOR.YELLOW, borderWidth: 2 }}>
            <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '700', color: '#55d369', marginTop: 50 }}>Success!</Text>
            <View style={{ height: 190, width: 190, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', borderColor: '#55d369', borderRadius: 95, borderWidth: 22, marginTop: 40 }}>
              <View style={{ height: 160, width: 160, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', borderColor: '#4ecd65', borderRadius: 80, borderWidth: 20 }}>
                <Image
                  style={[
                    {
                      alignSelf: 'center',
                      height: 130,
                      width: 130,
                      resizeMode: 'contain',
                    },
                  ]}
                  source={require('../Images/1.png')}
                />
              </View>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '700', color: GLOBALS.COLOR.WHITE, marginTop: 35, marginHorizontal: 20 }}>{ReturnMsg.ReturnMsg}</Text>

            <TouchableWithoutFeedback
              onPress={() =>
                this.props._hideOrderModal(ReturnMsg, TradeTyep, ReturnCode)
              }>
              <View style={{
                marginVertical: 25, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center',
                height: 45,
                width: 150,
                borderRadius: 22.5,
                borderColor: GLOBALS.COLOR.YELLOW,
                borderWidth: 3,
                backgroundColor: GLOBALS.COLOR.WHITE,

                shadowColor: 'gray',
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { height: 0, width: 0 }, elevation: 2,
              }}>


                <Text style={{
                  color: GLOBALS.COLOR.BLACK,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  fontSize: 15,

                  fontWeight: 'bold',
                }}> Done </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          )
            :
            (
              // {/* Order fail */}
              <View style={{ alignSelf: 'center', width: 280, backgroundColor: GLOBALS.COLOR.BLUE, borderRadius: 4, borderColor: GLOBALS.COLOR.YELLOW, borderWidth: 2 }}>
                <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '700', color: '#d13b3b', marginTop: 50 }}>Oops!</Text>
                <View style={{ height: 190, width: 190, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', borderColor: '#d13b3b', borderRadius: 95, borderWidth: 22, marginTop: 40 }}>
                  <View style={{ height: 160, width: 160, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center', borderColor: '#ca3939', borderRadius: 80, borderWidth: 20 }}>
                    <Image
                      style={[
                        {
                          alignSelf: 'center',
                          resizeMode: 'contain',
                          height: 130,
                          width: 130,
                          // borderRadius:75,
                          // borderWidth:20,
                        },
                      ]}
                      source={require('../Images/0.png')}
                    />
                  </View>

                </View>
                <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '700', color: GLOBALS.COLOR.WHITE, marginTop: 35, marginHorizontal: 20 }}>{ReturnMsg.ReturnMsg == "" ? 'Your Trade is Not Placed.' : ReturnMsg.ReturnMsg}</Text>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.props._hideOrderModal(ReturnMsg, TradeTyep, ReturnCode)
                  }>
                  <View style={{
                    marginVertical: 30, justifyContent: 'center', alignItems: 'center', alignContent: 'center', alignSelf: 'center',
                    height: 45,
                    width: 150,
                    borderRadius: 22.5,
                    borderColor: GLOBALS.COLOR.YELLOW,
                    borderWidth: 3,
                    backgroundColor: GLOBALS.COLOR.WHITE,

                    shadowColor: 'gray',
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    shadowOffset: { height: 0, width: 0 }, elevation: 2,
                  }}>

                    <Text style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      fontSize: 15,
                      color: GLOBALS.COLOR.BLACK,
                      fontWeight: 'bold',
                    }}> Close </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}

        </View>
      </Modal>
    );
  }
}