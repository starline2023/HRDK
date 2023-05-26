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
  Dimensions,
  NativeAppEventEmitter,
  Image,
  Animated,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import CustumProgress from '../UtilityClass/CustumProgress';
import NewOrderScreen from '../SRC/NewOrderScreen';
import LoginTerminalScreen from '../SRC/LoginScreen';
import PreferenceGlobals from '../UtilityClass/PreferenceGlobals';
import AsyncStorage from '@react-native-community/async-storage';
import Slideshow from 'react-native-image-slider-show';
import NetInfo from '@react-native-community/netinfo';

import { SpotRateCell, FutureCell } from '../GlobalFuction/FutureAndSpotCell'
import { SocketManagerIOEmit } from '../SocketManager/SocketManager';

import { renderItemMainCellBullion, renderItemMainCellTerminal, renderHeaderMain } from '../GlobalFuction/RenderItemMainCell'

let Window = Dimensions.get('window');
import { ScrollView } from 'react-native-gesture-handler';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

export default class LiveRateScreen extends React.Component {

  constructor(props) {
    super(props);

    console.warn();

    this.objRefrance = [];
    // this.GroupDetail = [];
    // this.ObjGroup = [];

    this.state = {
      isTerminalLogin: false,
      isProductGoldAndSilver: false,
      isProgress: true,
      mainSymbol: [],
      mainSymbolPreve: [],
      productRefrance: [],
      productRefrancePreve: [],
      objRefrance: '',
      ObjGroup: [],
      GroupDetail: [],
      DisplayRateMessage: '',
      isBuy: true,
      isSell: true,
      ProductnameHeader: 'PRODUCT',
      HighRate: true,
      LowRate: true,
      RateDisplay: true,
      SymbolCount: '0',
      isOrderModalVisible: false,
      selectedItem: null,
      selectedIDSymbol: null,
      selectedPreItem: null,
      isLoginModalVisible: false,

      position: 0,
      interval: null,
      dataSource: [],
    };

    this.sizeRef = React.createRef();
  }

  componentDidMount() {

    this.getSurfaces();
    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.getSurfaces();
      }
    });

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

    this.eventListener = NativeAppEventEmitter.addListener('eventKeyLogOut', () => this.handleEventLogOut());
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', (params) => this.handleEvent(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyClientData', (params) => this.handleEventClientData(params));

    this.eventListener = NativeAppEventEmitter.addListener('eventKeymessage', (params) => this.handleEventmessage(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyLiverate', (params) => this.handleEventKeyLiverate(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyGroup', (params) => this.handleEventGroup(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyOrders', (params) => this.handleEventOrders(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyGroupDetails', (params) => this.handleEventGroupDetails(params));

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

  handleEventClientData(data) {
    try {
      if (data != '') {

        this.setState(function () {
          this.objRefrance = JSON.parse(data);
        });
      }
    } catch (e) {
    }
  }

  handleEventmessage(data) {
    try {
      if (data != '') {

        let rates = data.Rate;
        this.setState({ mainSymbolPreve: this.state.mainSymbol });
        this.setState({ mainSymbol: rates });

      } else {
        this.setState({ mainSymbol: [] });
      }

      if (this.state.isProgress) {
        this.setState({ isProgress: false });
      }

    } catch (error) {
    }
  }

  handleEventKeyLiverate(data) {
    try {
      if (data != '') {

        let Refrance = data;
        this.setState({ productRefrancePreve: this.state.productRefrance });
        this.setState({ productRefrance: Refrance });

      } else {
        this.setState({ productRefrance: [] });
      }

      if (this.state.isProgress) {
        this.setState({ isProgress: false });
      }

    } catch (error) {
    }
  }

  handleEventGroup(data) {
    try {
      if (data != "") {

        this.setState({ ObjGroup: data });
        GLOBALS.SettingGroup = data;
        NativeAppEventEmitter.emit('eventKeyUserAccountDetail');
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleEventOrders(data) {

    try {
      if (data != "" && data == "true") {
        NativeAppEventEmitter.emit('eventKeyOpenOderDetails');
      } else if (data != "" && data.split("~~")[0] == "true") {
        NativeAppEventEmitter.emit('eventKeyOpenOderDetails');
      }
    } catch (e) {
      console.log(e);
    }
  }

  handleEventGroupDetails(data) {

    try {
      if (data != "") {
        if (data[0].Status == false) {
          this.setState({ GroupDetail: [] })
        } else {
          this.setState({ GroupDetail: data })
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  getSurfaces() {
    fetch(GLOBALS.BASE_URL + 'GetSliderByClient', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify({
        ClientID: GLOBALS.ClientID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          let obj = new Object();
          if (responseJson.d != '') {
            obj = JSON.parse(responseJson.d);

            var imageArr = [];
            for (var i in obj) {
              var imageURL = obj[i];
              let lv = imageURL.SliderImagePath;
              imageArr.push({ url: lv });
            }
            this.setState({
              //isLoging: false,
              dataSource: Object.values(imageArr),
            });
          }
        } catch (error) { }
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillMount() {

    this.animatedMargin = new Animated.Value(0);

    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 3000)
    });
  }

  isLoginTerminal(isLogin) {
    this.setState({ isTerminalLogin: isLogin })
  }

  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
  }

  _hideOderModal = () => {
    this.setState({ isOrderModalVisible: false });
  };

  _hideLoginModal = () => {
    this.setState({ isLoginModalVisible: false });
    if (GLOBALS.isLoginTerminal == true) {
      SocketManagerIOEmit()
    }
  };

  handleEvent = (event) => {

    this.setState({ HighRate: event.HighRate });
    this.setState({ LowRate: event.LowRate });
    this.setState({ isBuy: event.BuyRate });
    this.setState({ isSell: event.SellRate });
    this.setState({ RateDisplay: event.RateDisplay });
    this.setState({ SymbolCount: event.SYMBOL_COUNT });
  }

  GetItemBullion = async (item) => {

    this.setState({ selectedItem: item, selectedIDSymbol: item.IDSymbol });

    let isLogin = await PreferenceGlobals.getisLogin();
    if (isLogin) {
      this.setState({ isOrderModalVisible: true });
    } else {
      this.setState({ isLoginModalVisible: true });
    }
  }

  render() {

    if (this.state.isProgress) {
      return <CustumProgress />;
    } else {
      return (
        <View style={[{ flex: 1 }]}>

          <ScrollView style={{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR }}>

          <View style={[{ height: 6 }]} />

          <View>{SpotRateCell(this.state.productRefrance, this.state.productRefrancePreve, this.objRefrance)}</View>

            {this.state.dataSource.length > 0 ? <View style={[{ height: 5 }]} /> : null}

            {this.state.dataSource.length > 0 ? <Slideshow
              containerStyle={{ marginHorizontal: 5 }}
              dataSource={this.state.dataSource}
              position={this.state.position}
              scrollEnabled={true}
              onPositionChanged={position => this.setState({ position })}
            /> : null}

            <View style={[{ height: 3 }]} />

            {this.state.mainSymbol.length > 0 ?
              <View>
                {this.state.isTerminalLogin == false ?
                  <View>
                    {this.state.RateDisplay == true ? renderHeaderMain(this.state.isBuy, this.state.isSell, 'PRODUCTS') : null}
                  </View>
                  :
                  renderHeaderMain(this.state.isBuy, this.state.isSell, 'PRODUCTS')
                }
              </View>
              : null}

            {this.state.isTerminalLogin == false ? (
              <View>
                {this.state.RateDisplay == false ? (<View style={[{ alignItems: 'center', justifyContent: 'center', height: 25, marginBottom: 2, marginTop: 5 }]}>
                  <Text style={[{ fontSize: 20, fontWeight: 'bold', color: GLOBALS.COLOR.RATE_DOWN }]}>
                    {'Live Rate Currently Not Available'}
                  </Text>
                </View>

                ) : (

                  <View style={[{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, paddingHorizontal: 5 }]}>

                    {this.state.mainSymbol.map((item, index) => (renderItemMainCellBullion(
                      this,
                      item,
                      index,
                      this.state.mainSymbolPreve,
                      this.state.isBuy,
                      this.state.isSell,
                      this.state.HighRate,
                      this.state.LowRate,
                      'gold',
                      'goldnext')))}

                  </View>)}
              </View>

            ) : (

              <View style={[{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, paddingHorizontal: 5 }]}>

                {this.state.mainSymbol.map((item, index) => (renderItemMainCellTerminal(
                  this,
                  item,
                  index,
                  this.state.mainSymbolPreve,
                  this.state.isBuy,
                  this.state.isSell,
                  this.state.HighRate,
                  this.state.LowRate,
                  this.state.GroupDetail,
                  this.state.ObjGroup,
                  this.state.selectedIDSymbol,
                  'gold',
                  'goldnext')))}

              </View>)}

            <View style={[{ height: 3 }]} />

            <View>{FutureCell(this.state.productRefrance, this.state.productRefrancePreve, this.objRefrance)}</View>

            <View style={[{ height: 5 }]} />

            {this.state.isOrderModalVisible ? <NewOrderScreen
              modalVisible={this.state.isOrderModalVisible}
              hideModal={this._hideOderModal}
              selectedItem={this.state.selectedItem}
            /> : null}

            {this.state.isLoginModalVisible ? <LoginTerminalScreen
              modalVisible={this.state.isLoginModalVisible}
              dismiss={this._hideLoginModal}
              isLogin={(islogin) => this.setState({ isTerminalLogin: islogin })}
              isSideMenu={'false'}
            /> : null}

          </ScrollView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  animated: {
    position: 'absolute'
  },
  //* List  Header
  itemHeader: {
    flexDirection: 'row',
    height: 30,
    //marginTop: 4,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
    paddingHorizontal: 5,
  },
  itemHeadersymbolName: {
    paddingLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderRowBuyCell: {
    flex: 1,
    width: 85,
    height: 28,
    // marginTop: 5,
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  itemHeaderSymbol: {
    width: 140,
    fontSize: 15,
    fontWeight: '700',
    color: GLOBALS.COLOR.TEXT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderName: {
    fontSize: 15,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    color: GLOBALS.COLOR.TEXT_COLOR,
    width: '100%',
    //backgroundColor:'red',
    textAlign: 'center',
  },

});




