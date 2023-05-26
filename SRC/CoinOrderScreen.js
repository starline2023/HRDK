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
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import NavigationService from '../NavigationService';
import GLOBALS from '../UtilityClass/Globals';
import CustumProgress from '../UtilityClass/CustumProgress';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
let Window = Dimensions.get('window');

export default class OderModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      Quantity: '1',
      isOrderModalVisible: false,
      isProgress: false,
      OrderItem: this.props.selectedItem,
      OrderItemPreve: [],
      notificationBody: '',
      fcmToken: '',
      TradeType: 0,
      ReturnCode: '',
      disabled: true,
    };

    this.eventListener = NativeAppEventEmitter.addListener(
      'eventselectedCoinItem',
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
    this.eventListener.remove();
  }

  handleEvent = event => {

    try {
      this.setState({ OrderItemPreve: this.state.OrderItem });
      this.setState({ OrderItem: event });
    } catch (error) {
      console.log(error);
    }
  };

  handleQuantity = text => {
    this.setState({ Quantity: text });
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

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  _hideOrderModal = (ReturnMsg, TradeTyep, ReturnCode) => {
    setTimeout(function () {
      if (ReturnCode == '200') {

        NativeAppEventEmitter.emit('eventKeyCoinOrderSuccessfullyNavigation', 0);
        NavigationService.navigate('COIN TRADE')
        this.props.hideModal()
        this.setState({ isOrderModalVisible: false });

      } else {
        this.setState({ isOrderModalVisible: false });
      }
    }.bind(this), 100);
  };

  eventOderNow(Qty, isBuySell) {

    if (parseInt(Qty) > 0) {
      this.InsertOpenOrderDetail(Qty, isBuySell);
    } else if (parseInt(Qty) == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter Quantity');
    } else {
      this.showAlert(GLOBALS.App_Name, 'Please enter valid Quantity');
    }
  }

  InsertOpenOrderDetail(Quantity, TradeType) {

    this.setState({ isProgress: true });
    let fcmToken = this.state.fcmToken;
    let ObjTrade = new Object();
    ObjTrade["SymbolId"] = this.state.OrderItem.CoinsId.toString();
    ObjTrade["Token"] = GLOBALS.Token_User_Login;
    ObjTrade["Quantity"] = Quantity;
    ObjTrade["TradeFrom"] = Platform.OS;
    ObjTrade["TradeType"] = '1';
    ObjTrade["DeviceToken"] = fcmToken;
    ObjTrade['BuyLimitPrice'] = "0";
    ObjTrade["SellLimitPrice"] = "0";


    fetch(GLOBALS.Terminal_BASE_URL + 'InsertCoinOpenOrderDetailWithRegID', {
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
            var obj = JSON.parse(responseJson.d);

            if (obj != '') {

              // this.textQuantityRef.clear();
              this.setState({ Quantity: '1' });

              if (obj.ReturnCode == "200") {
                this._ShowOrderModel(obj, TradeType, obj.ReturnCode);
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

  pressMinusButton(item) {

    if (parseInt(item) == 1) {
      return;
    }

    var qty = parseInt(item) - 1;
    this.setState({
      Quantity: qty.toString()
    });
  }

  pressPluseButton(item) {

    var qty = parseInt(item) + 1;
    this.setState({
      Quantity: qty.toString()
    });
  }

  render() {
    var item = this.state.OrderItem;
    var Sname = item.CoinsName;
    var Ask = item.Ask;

    var Total = Ask * parseInt(this.state.Quantity);

    try {
      let lvlocal = this.state.OrderItemPreve;

      var BGColorAsk;
      var textColorAsk = GLOBALS.COLOR.BLACK;

      if (lvlocal != undefined) {

        let Asklocal = lvlocal.Ask;

        let AskStatus = StatusUpDownColor(Asklocal, Ask);
        BGColorAsk = AskStatus.BGColor;
        textColorAsk = AskStatus.textColor;
      }
    } catch (error) {
    }

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
        <LinearGradient
          colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            {
              height: 70,
              flexDirection: 'row',
              backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
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
                  color: GLOBALS.COLOR.BLACK,
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
                    tintColor: GLOBALS.COLOR.BLACK,
                  },
                ]}
                source={require('../Images/BackBtn.png')}
              />
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>


        {/* <ImageBackground
          style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BG_IMG_COLOR}]}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../Images/bg.png')}> */}
        <View style={styles.containerView}>
          <LinearGradient
            colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              {
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
                borderRadius: 4,
                borderColor: GLOBALS.COLOR.YELLOW,
                borderWidth: 2,
                margin: 12,
              },
            ]}>
            <View
              style={[
                {
                  paddingVertical: 5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  marginVertical: 10,
                },
              ]}>
              <Text
                numberOfLines={0}
                style={[
                  {
                    flex: 1,
                    textAlign: 'center',
                    color: GLOBALS.COLOR.BLACK,
                    fontSize: 20,
                    marginHorizontal: 20,
                    fontWeight: 'bold',
                  },
                ]}>
                {Sname}
              </Text>
            </View>

            <View style={[{ flexDirection: 'row', marginBottom: 5, marginHorizontal: 5 }]}>


              {/* ///////BID////////// */}
              <View style={[{ height: 70, flex: 1, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, margin: 8, marginHorizontal: 20, borderRadius: 8, borderWidth: 2, borderColor: BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : BGColorAsk }]}>
                <Text
                  style={[
                    { height: 24, textAlign: 'center', fontSize: 16, fontWeight: '700', marginTop: 9, color: BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : BGColorAsk },
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
                      color: BGColorAsk == 'transparent' ? GLOBALS.COLOR.BLACK : BGColorAsk,
                    },
                  ]}>
                  {Ask}
                </Text>
              </View>
            </View>

            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginRight: 15,
                  marginVertical: 7,
                },
              ]}>
              <View
                style={[
                  {
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{ color: GLOBALS.COLOR.BLACK, fontWeight: '700', }}>Quantity : </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.Quantity != "") {
                    this.pressMinusButton(this.state.Quantity)
                  } else {
                    this.showAlert(GLOBALS.App_Name, 'Please enter valid Quantity')
                  }

                }}>
                <View
                  style={[
                    {
                      height: 35,
                      width: 35,
                      borderRadius: 17.5,
                      borderColor: GLOBALS.COLOR.BLACK,
                      borderWidth: 0.8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 8,
                    },
                  ]}>

                  <Text style={{ color: GLOBALS.COLOR.BLACK, fontWeight: '700', fontSize: 25, alignItems: 'center', alignContent: 'center', alignSelf: 'center', marginBottom: 5 }}>
                    -
                  </Text>
                </View>
              </TouchableOpacity>
              <TextInput
                selectionColor={GLOBALS.COLOR.BLACK}
                style={[
                  {
                    width: 100,
                    height: 35,
                    textAlign: 'center',
                    padding: 8,
                    fontSize: 15,
                    borderColor: GLOBALS.COLOR.BLACK,
                    borderWidth: 1,
                    borderRadius: 8,
                    color: GLOBALS.COLOR.BLACK,
                  },
                ]}

                value={this.state.Quantity}
                ref={ref => this.textQuantityRef = ref}
                underlineColorAndroid={GLOBALS.COLOR.TRANSPARENT_COLOR}
                placeholder="Quantity"
                placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                textAlign="center"
                autoCapitalize="none"
                keyboardType="numeric"
                onChangeText={this.handleQuantity}
                returnKeyType={'done'}
                blurOnSubmit={true}
              />
              <TouchableOpacity
                onPress={() => {
                  if (this.state.Quantity != "") {
                    this.pressPluseButton(this.state.Quantity)
                  } else {
                    this.showAlert(GLOBALS.App_Name, 'Please enter valid Quantity')
                  }
                }}>
                <View
                  style={[
                    {
                      height: 35,
                      width: 35,
                      borderRadius: 17.5,
                      borderColor: GLOBALS.COLOR.BLACK,
                      borderWidth: 0.8,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 8,
                    },
                  ]}>

                  <Text style={{ color: GLOBALS.COLOR.BLACK, fontWeight: '700', fontSize: 20, alignItems: 'center', alignContent: 'center', alignSelf: 'center', marginBottom: 4 }}>
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            </View>


            <View
              style={[
                {
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginRight: 70,
                },
              ]}>
              <View
                style={[
                  {
                    height: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{ color: GLOBALS.COLOR.BLACK, fontWeight: '700', }}>Total : </Text>
              </View>
              <View
                style={[
                  {
                    height: 35,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{ color: GLOBALS.COLOR.BLACK, fontWeight: '700', }}>{Total == NaN ? 0 : Total}</Text>
              </View>
            </View>

            {/* BUY & SELL BUTTON */}
            <View style={[{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', alignSelf: 'center', }]}>

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
                    this.pressBuyButton(this.state.Quantity)
                  }}>
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

                </TouchableOpacity>
              }

            </View>
          </LinearGradient>


        </View>
        {/* </ImageBackground> */}

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

///Status UpDowun ---->
function StatusUpDownColor(strPre, strCur) {

  var BGColor;
  var textColor;
  var PreValue = parseFloat(strPre);
  var CurValue = parseFloat(strCur);

  try {
    if (PreValue < CurValue) {
      BGColor = GLOBALS.COLOR.RATE_UP;
      textColor = GLOBALS.COLOR.WHITE;
    } else if (PreValue > CurValue) {
      BGColor = GLOBALS.COLOR.RATE_DOWN;
      textColor = GLOBALS.COLOR.WHITE;
    } else {
      BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
      textColor = GLOBALS.COLOR.BLACK;
    }
  } catch (e) {
    BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
    textColor = GLOBALS.COLOR.BLACK;
  }
  const strColor = JSON.stringify({ BGColor: BGColor, textColor: textColor });
  return JSON.parse(strColor);
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
    backgroundColor: GLOBALS.COLOR.YELLOW,
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
    backgroundColor: GLOBALS.COLOR.YELLOW,
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
      // onRequestClose={() => this.props._hideOrderModal(ReturnMsg,TradeTyep,ReturnCode)}
      >

        <View style={{ flex: 1, backgroundColor: GLOBALS.COLOR.TRANSPARENT_BLACK, justifyContent: 'center' }}>

          {/* Order Susess */}
          {ReturnCode == '200' ? (<View style={{ alignSelf: 'center', width: 280, backgroundColor: GLOBALS.COLOR.THEAMCOLOR, borderRadius: 4, borderColor: GLOBALS.COLOR.YELLOW, borderWidth: 2 }}>
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
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '700', color: GLOBALS.COLOR.YELLOW, marginTop: 35, marginHorizontal: 20 }}>{ReturnMsg.ReturnMsg}</Text>

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
                backgroundColor: GLOBALS.COLOR.YELLOW,

                shadowColor: 'gray',
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { height: 0, width: 0 }, elevation: 2,
              }}>


                <Text style={{
                  color: GLOBALS.COLOR.TEXT_COLOR,
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
              <View style={{ alignSelf: 'center', width: 280, backgroundColor: GLOBALS.COLOR.THEAMCOLOR, borderRadius: 4, borderColor: GLOBALS.COLOR.YELLOW, borderWidth: 2 }}>
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
                <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: '700', color: GLOBALS.COLOR.YELLOW, marginTop: 35, marginHorizontal: 20 }}>{ReturnMsg.ReturnMsg == "" ? 'Your Trade is Not Placed.' : ReturnMsg.ReturnMsg}</Text>

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
                    backgroundColor: GLOBALS.COLOR.YELLOW,

                    shadowColor: 'gray',
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    shadowOffset: { height: 0, width: 0 }, elevation: 2,
                  }}>

                    <Text style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      fontSize: 15,
                      color: GLOBALS.COLOR.TEXT_COLOR,
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