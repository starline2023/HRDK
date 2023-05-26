/* eslint-disable no-labels */
/* eslint-disable no-return-assign */
/* eslint-disable no-unreachable */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  NativeAppEventEmitter,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import CustumProgress from '../UtilityClass/CustumProgress';
import LinearGradient from 'react-native-linear-gradient';
// import MarqueeTop from '../UtilityClass/MarqueeTop';
// import MarqueeBottom from '../UtilityClass/MarqueeBottom';
import CoinOrderScreen from '../SRC/CoinOrderScreen';
import LoginTerminalScreen from '../SRC/LoginScreen';
import PreferenceGlobals, { UserLoginDetail } from '../UtilityClass/PreferenceGlobals';
import AsyncStorage from '@react-native-community/async-storage';

import { NavigationActions } from 'react-navigation';
import NavigationService from '../NavigationService';

let Window = Dimensions.get('window');
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

var GoldCoinHeader = '';
var SilverCoinHeader = '';

export default class CoinRateScreen extends React.Component {

  constructor(props) {
    super(props);
    console.warn();

    this.state = {
      isProgress: true,
      mainSymbol: [],
      mainSymbolPreve: [],

      mainSymbolSilver: [],
      mainSymbolPreveSilver: [],

      isBuy: 'true',
      isSell: 'true',
      RateDisplay: 'true',
      SymbolCount: '0',

      GoldCoinIsDisplay: '',
      SilverCoinIsDisplay: '',
      Marque: '',
      Marque_Bottom: '',

      isOrderModalVisible: false,
      isTerminalLogin: false,
      isLoginModalVisible: false,
      isTyep: '',
      selectedItem: null,
      selectedIDSymbol: null,
      selectedPreItem: null,
    };

    this.sizeRef = React.createRef();
  }

  componentDidMount() {

    AsyncStorage.getItem('isLoginTerminal').then((value) => {
      if (value != null) {
        this.setState({ isTerminalLogin: value == "true" ? true : false });
        GLOBALS.isLoginTerminal = value == "true" ? true : false;
      }
    })

    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.handleEventLogOut();
    }
    );

    this.handleEvent();
    this.handleEventCoin();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', (params) => this.handleEvent(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyCoin', (params) => this.handleEventCoin(params));
  }

  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
  }

  componentWillReceiveProps(newProps) {

    const { isLogin } = newProps.navigation.state.params;
    if (isLogin != null) {
      this.setState({ isTerminalLogin: isLogin })

    }
    const { isLoginScreenOpen } = newProps.navigation.state.params;
    if (isLoginScreenOpen) {
      this.setState({ isLoginModalVisible: true });
    }
  }

  handleEventLogOut() {
    AsyncStorage.getItem('isLoginTerminal').then((value) => {
      if (value != null) {
        this.setState({ isTerminalLogin: value == "true" ? true : false });
        GLOBALS.isLoginTerminal = value == "true" ? true : false;
      }
    })
  }
  isLoginTerminal(isLogin) {
    this.setState({ isTerminalLogin: isLogin })
  }

  _hideOderModal = () => {
    this.setState({ isOrderModalVisible: false });
  };

  _hideLoginModal = () => {
    this.setState({ isLoginModalVisible: false });
  };

  GetItemBullion = async (item, istyep) => {

    this.setState({ selectedItem: item, selectedIDSymbol: item.CoinsId });

    let isLogin = await PreferenceGlobals.getisLogin();
    if (isLogin) {
      this.setState({ isOrderModalVisible: true, isTyep: istyep });
    } else {
      this.setState({ isLoginModalVisible: true });
    }
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    GLOBALS.THIs_CLass_Side_Menu.props.navigation.dispatch(navigateAction);
  };

  navigateToTabBar = (route) => {
    this.navigateToScreen('TabBarBullion');
    NavigationService.navigate(route);
  }

  handleEventCoin = (event) => {

    var coin = GLOBALS.ProductHeader.CoinRate.CoinRate;
    try {
      if (coin != '') {
        var mainGold = [];
        var mainSilver = [];

        for (var i in coin) {
          var symbol = coin[i];
          let source = symbol.CoinsBase.toLowerCase();
          let id = symbol.CoinsId;
          if (id == this.state.selectedIDSymbol) {
            NativeAppEventEmitter.emit('eventselectedCoinItem', symbol);
          }
          if (source == 'gold' || source == 'goldnext') {
            mainGold.push(symbol);
          } else {
            mainSilver.push(symbol);
          }
        }

        this.setState({ mainSymbolPreve: this.state.mainSymbol, isProgress: false });
        this.setState({ mainSymbol: mainGold });

        this.setState({ mainSymbolPreveSilver: this.state.mainSymbolSilver });
        this.setState({ mainSymbolSilver: mainSilver });

      } else {

        this.setState({ mainSymbol: [] });
        this.setState({ mainSymbolSilver: [] });
        this.setState({ isProgress: false });
      }
    } catch (error) {
      console.log(error);
      this.setState({ isProgress: false });
    }
  }

  handleEvent = (event) => {

    let C_Detaild = GLOBALS.ContactDetail;

    this.setState({ Marque: C_Detaild.Marquee });
    this.setState({ Marque_Bottom: C_Detaild.Marquee2 });

    this.setState({ RateDisplay: GLOBALS.ProductHeader.CoinRateDisplay });
    this.setState({ SymbolCount: GLOBALS.ProductHeader.Symbol_Count_Coin });

    GoldCoinHeader = GLOBALS.ProductHeader.GoldCoinHeader;
    SilverCoinHeader = GLOBALS.ProductHeader.SilverCoinHeader;

    this.setState({ GoldCoinIsDisplay: GLOBALS.ProductHeader.GoldCoinIsDisplay });
    this.setState({ SilverCoinIsDisplay: GLOBALS.ProductHeader.SilverCoinIsDisplay });
  }

  GetItem(item) {
    this.setState({ isModalVisible: true, selectedItem: item });
  }

  _hideMyModal = () => {
    this.setState({ isModalVisible: false });
  };

  handleConnectionChange = isConnected => {
    this.setState({ isConnected: isConnected });
    console.log(`is connected: ${this.state.status}`);
  };

  //  Cell Main Product
  renderItemMainCell(item, index) {

    try {
      let lv = item;
      if (lv == '') {
        return;
      }
      let Sname = lv.CoinsName;
      let Ask = lv.Ask;

      let lvlocal = this.state.mainSymbolPreve[index];

      var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;
      var BGColorAsk;

      if (lvlocal != undefined) {

        let lvs = lvlocal;
        let Asklocal = lvs.Ask;

        let AskStatus = StatusUpDownColor(Asklocal, Ask);
        BGColorAsk = AskStatus.BGColor;
        textColorAsk = AskStatus.textColor;
      }

      return (

         <TouchableWithoutFeedback key={index} onPress={this.GetItemBullion.bind(this, lv, 1)}>
        <View style={styles.itemRow}>
          {/* coin icon */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
            <Image
              style={[
                {
                  alignSelf: 'center',
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                },
              ]}
              source={require('../Images/gold-coin.png')}
            />
          </View>
          {/* symbol Name */}
          <View style={[{ alignItems: 'center', flex: 1, flexDirection: 'row' }]}>
            <View style={styles.itemsymbolName}>
              <Text numberOfLines={2} style={styles.itemSymbol}>{Sname}</Text>
            </View>
          </View>
          <View style={[{ alignItems: 'center', flexDirection: 'column', flex: 1 }]}>
            <View
              style={[
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                },
              ]}>
              {/* Buy Name */}
              {this.state.isBuy == 'true' ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      // marginTop: this.state.LowRate == true || this.state.HighRate == true ? 5 : 0,
                      backgroundColor: BGColorAsk,
                      marginHorizontal: 10,
                    },
                  ]}>
                  <Text style={[styles.itemName, { color: textColorAsk }]}>
                    {'₹ ' + Ask}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {/* <View style={[{alignSelf:'center',height:28,width:50,marginRight:10,alignItems:'center',justifyContent: 'center',
          alignItems: 'center' }]}>  
             <Image
              style={[
              {
                alignSelf: 'center',
                height: 20,
                width: 20,
                resizeMode: 'contain',
              },
            ]}
            source={
              item.Stock == "true"
                ? require("../Images/stockIn.png")
                : require("../Images/stockOut.png")
            }
          /> 
          </View> */}

          <LinearGradient
              colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[{
                alignSelf: 'center', height: 28, width: 60, borderRadius: 4, marginRight: 10, alignItems: 'center', justifyContent: 'center',
                alignItems: 'center', backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR
              }]}>
              <Text style={[styles.itemName, { color: GLOBALS.COLOR.BLACK, fontSize: 14, }]}>
                {'BUY'}
              </Text>
            </LinearGradient>
          {/* <Image style={[{alignSelf:'center',height:'70%',width:35,resizeMode: 'stretch',position:'absolute',right:0,top:0}]} source={require('../Images/buy.png')}/>      */}
        </View>
         </TouchableWithoutFeedback>

      );
    } catch (error) {
    }
  }

  renderItemMainCellSilver(item, index) {

    try {
      let lv = item;
      if (lv == '') {
        return;
      }
      let Sname = lv.CoinsName;
      let Ask = lv.Ask;

      let lvlocal = this.state.mainSymbolPreveSilver[index];

      var BGColorAsk;
      var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;

      if (lvlocal != undefined) {

        let lvs = lvlocal;
        let Asklocal = lvs.Ask;

        let AskStatus = StatusUpDownColor(Asklocal, Ask);
        BGColorAsk = AskStatus.BGColor;
        textColorAsk = AskStatus.textColor;
      }

      return (

        <TouchableWithoutFeedback key={index} onPress={this.GetItemBullion.bind(this, lv, 1)}>
        <View style={styles.itemRow}>
          {/* coin icon */}
          <View style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
            <Image
              style={[
                {
                  alignSelf: 'center',
                  height: 30,
                  width: 30,
                  resizeMode: 'contain',
                },
              ]}
              source={require('../Images/silver-coin.png')}
            />
          </View>
          {/* symbol Name */}
          <View style={[{ alignItems: 'center', flex: 1, flexDirection: 'row' }]}>
            <View style={styles.itemsymbolName}>
              <Text numberOfLines={2} style={styles.itemSymbol}>{Sname}</Text>
            </View>
          </View>
          <View style={[{ alignItems: 'center', flexDirection: 'column', flex: 1 }]}>
            <View
              style={[
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                  flex: 1,
                },
              ]}>
              {/* Buy Name */}
              {this.state.isBuy == 'true' ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      // marginTop: this.state.LowRate == true || this.state.HighRate == true ? 5 : 0,
                      backgroundColor: BGColorAsk,
                      marginHorizontal: 10,
                    },
                  ]}>
                  <Text style={[styles.itemName, { color: textColorAsk }]}>
                    {'₹ ' + Ask}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* <View style={[{alignSelf:'center',height:28,width:50,marginRight:10,alignItems:'center',justifyContent: 'center',
          alignItems: 'center' }]}>  
            <Image
              style={[
              {
                alignSelf: 'center',
                height: 20,
                width: 20,
                resizeMode: 'contain',
              },
            ]}
            source={
              item.Stock == "true"
                ? require("../Images/stockIn.png")
                : require("../Images/stockOut.png")
            }
          /> 
          </View>*/}

          <LinearGradient
              colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[{
                alignSelf: 'center', height: 28, width: 60, borderRadius: 4, marginRight: 10, alignItems: 'center', justifyContent: 'center',
                alignItems: 'center', backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR
              }]}>
              <Text style={[styles.itemName, { color: GLOBALS.COLOR.BLACK, fontSize: 14, }]}>
                {'BUY'}
              </Text>
            </LinearGradient>
          {/* <Image style={[{alignSelf:'center',height:'70%',width:35,resizeMode: 'stretch',position:'absolute',right:0,top:0}]} source={require('../Images/buy.png')}/>      */}
        </View>
         </TouchableWithoutFeedback>
      );
    } catch (error) {
    }
  }

  render() {

    if (this.state.isProgress) {
      return <CustumProgress />;
    } else {
      return (

        // <ImageBackground
        //   style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BLACK}]}
        //   imageStyle={{resizeMode: 'stretch'}}
        //   source={require('../Images/bg.png')}>
        <View style={{ flex: 1 }}>
          {/* <MarqueeTop /> */}
          <ScrollView style={{ backgroundColor: GLOBALS.COLOR.BG_COLOR }}>

            <View style={[{ height: 6 }]} />

            {this.state.RateDisplay == false ? (<View style={[{ alignItems: 'center', justifyContent: 'center', height: 40 }]}>
              <Text style={[{ fontSize: 20, fontWeight: 'bold', color: 'red' }]}>
                {'Live Rate Currently Not Available'}
              </Text>
            </View>) : (<View>

              {this.state.mainSymbol.length > 0 && this.state.SymbolCount > 0 && this.state.GoldCoinIsDisplay == true ? renderHeader(true, true, "GOLD") : null}
              {this.state.SymbolCount > 0 && this.state.GoldCoinIsDisplay == true ? <View style={[{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, paddingHorizontal: 5, paddingTop: 0 }]}>
                {this.state.mainSymbol?.map((item, index) => {
                  return (this.renderItemMainCell(item, index));
                })
                }
              </View> : null}

              <View style={[{ height: 8 }]} />

              {this.state.mainSymbolSilver.length > 0 && this.state.SymbolCount > 0 && this.state.SilverCoinIsDisplay == true ? renderHeaderSilver(true) : null}
              {this.state.SymbolCount > 0 && this.state.SilverCoinIsDisplay == true ? <View style={[{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, paddingHorizontal: 5, paddingTop: 0 }]}>
                {this.state.mainSymbolSilver?.map((item, index) => {
                  return (this.renderItemMainCellSilver(item, index));
                })
                }
              </View> : null}

            </View>
            )}

            <View style={[{ height: 6 }]} />

            {this.state.isOrderModalVisible ? <CoinOrderScreen
              modalVisible={this.state.isOrderModalVisible}
              hideModal={this._hideOderModal}
              selectedItem={this.state.selectedItem}
              isTyep={this.state.isTyep}
            /> : null}

            {this.state.isLoginModalVisible ? <LoginTerminalScreen
              modalVisible={this.state.isLoginModalVisible}
              dismiss={this._hideLoginModal}
              isLogin={(islogin) => this.setState({ isTerminalLogin: islogin })}
              isSideMenu={'false'}
            /> : null}

          </ScrollView>
        </View>
        //  </ImageBackground>
      );
    }
  }
}



///Render Header ---->
function renderHeader() {
  return (

    <LinearGradient
      colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.itemHeader}>

      <View style={[{ alignItems: 'center', flex: 1, flexDirection: 'row' }]}>

        <View style={styles.itemHeadersymbolName}>
          <Text numberOfLines={2} style={styles.itemHeaderSymbol}>{GoldCoinHeader}</Text>
        </View>
        {/* <View style={{justifyContent: 'center',alignItems: 'center'}}>
                <Image
                  style={[
                  {
                    alignSelf: 'center',
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',
                    marginLeft:5,
                  },
                ]}
                //source={require('../Images/img/gold_coin.png')}
              /> */}
        {/* </View> */}


      </View>
      <View style={styles.itemHeaderRowBuyCell}>
        <Text numberOfLines={1} style={styles.itemHeaderName}>{'PRICE'}</Text>
      </View>

      {/* <View
        style={[{
          alignSelf: 'center', height: 28, width: 50, borderRadius: 4, marginRight: 15, alignItems: 'center', justifyContent: 'center',
          alignItems: 'center',
        }]}>
        <Text style={[styles.itemName, { color: GLOBALS.COLOR.WHITE, fontSize: 14, }]}>
          {''}
        </Text>
      </View> */}

    </LinearGradient>
  );
}

function renderHeaderSilver() {
  return (

    <LinearGradient
      colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.itemHeader}>

      <View style={[{ alignItems: 'center', flex: 1, flexDirection: 'row' }]}>

        <View style={styles.itemHeadersymbolName}>
          <Text numberOfLines={2} style={styles.itemHeaderSymbol}>{SilverCoinHeader}</Text>
        </View>
        {/* <View style={{justifyContent: 'center',alignItems: 'center'}}>
            <Image
              style={[
              {
                alignSelf: 'center',
                height: 30,
                width: 30,
                resizeMode: 'contain',
                marginLeft:5,
              },
            ]}
            //source={require('../Images/img/silver_coin.png')}
          />
         </View> */}

      </View>

      <View style={styles.itemHeaderRowBuyCell}>
        <Text numberOfLines={1} style={styles.itemHeaderName}>{'PRICE'}</Text>
      </View>

      {/* <View
        style={[{
          alignSelf: 'center', height: 28, width: 50, borderRadius: 4, marginRight: 15, alignItems: 'center', justifyContent: 'center',
          alignItems: 'center',
        }]}>
        <Text style={[styles.itemName, { color: GLOBALS.COLOR.WHITE, fontSize: 14, }]}>
          {''}
        </Text>
      </View> */}

    </LinearGradient>
  );
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
  container: {
    flex: 1,
    marginTop: 0,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },
  //* List  Header
  itemHeader: {
    flexDirection: 'row',
    marginHorizontal: 5,
    height: 40,
    // marginTop: 0,
    backgroundColor: GLOBALS.COLOR.YELLOW,
    borderRadius: 4,
  },
  itemHeadersymbolName: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderRowBuyCell: {
    flex: 1,
    // width: 85,
    // height: 28,
    //marginTop: 5,
    //marginLeft: 40,
    // marginRight: 10,
    //marginHorizontal: 10,
    justifyContent: 'center',
    //alignItems: 'flex-end',
    alignSelf: 'center',
    borderRadius: 4,
  },
  itemHeaderSymbol: {
    // width: 60,
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: GLOBALS.COLOR.HEADER_COLOR,
  },
  itemHeaderName: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: 'bold',
    alignItems: 'center',
    color: GLOBALS.COLOR.HEADER_COLOR,
    width: '100%',
  },

  //* List Row
  itemRow: {
    flexDirection: 'row',
    height: 55,
    marginTop: 2.0,
    backgroundColor: GLOBALS.COLOR.WHITE,
    borderRadius: 2,
    // borderBottomWidth:0.8,
    // borderRightWidth:0.8,
    // borderLeftWidth:0.8,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 0.5,
  },
  //* Spot List Row
  SpotitemRow: {
    flexDirection: 'column',
    flex: 3,
    height: 55,
    width: Window.width / 3 - 20,
    marginTop: 5,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_BLACK,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 0.8,
  },
  itemsymbolName: {
    paddingLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSymbol: {
    width: 140,
    fontSize: 14,
    fontWeight: 'bold',
    color: GLOBALS.COLOR.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRowBuyCell: {
    flex: 1,
    //width: 85,
    height: 28,
    // marginTop: 5,
    //backgroundColor:'red',
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  itemHieghLowCell: {
    flex: 1,
    width: 85,
    marginTop: 0,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
  },
});


