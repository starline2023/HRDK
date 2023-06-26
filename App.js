/* eslint-disable eslint-comments/no-unused-disable */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Linking,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
  Text,
  BackHandler,
} from 'react-native';
import GLOBALS from './UtilityClass/Globals';
import AsyncStorage from '@react-native-community/async-storage';

export const USER_KEY = 'isLogin';
export const USER_Terminal = "isLoginTerminal";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import TabBarBullion from './SRC/TabBarBullion';
import ClientRegistration from './SRC/ClientRegistration';
import DraggableBox from './UtilityClass/DraggableBox';
import DraggableWhatsApp from './UtilityClass/DraggableWhatsApp';
import { AppTour, AppTourSequence } from 'imokhles-react-native-app-tour';
import { handalSocketData } from './SRC/LiveRateScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketManagerIO } from './SocketManager/SocketManager';

//********************/////////////Bullion Application ///////////*******************//
class HomeActivity extends Component {
  constructor(props) {
    super(props);
    console.warn();

    SocketManagerIO();

    this.appTourTargets = [];
    this.appTourTargets2 = [];

    this.state = {
      isModalVisible: false,
      isBookingModel: false,
      bookingNo1: '0',
      bookingNo2: '0',
      bookingNo3: '0',
      bookingNo4: '0',
      bookingNo5: '0',
      bookingNo6: '0',
      bookingNo7: '0',
      bookingNo8: '0',
      isLogin: '',

      AppTourCount: 1,
      BookingNumber: '0',
      WhatsAppNumber: '0',
    };
  }

  async setValue() {
    AsyncStorage.setItem('iosLogin', 'Yes');
  }

  handleBackButton = () => {
    Alert.alert(
      GLOBALS.App_Name,
      'Are you sure you want to quit App?',
      [
        {
          text: 'NO',
          onPress: () => console.log('NO Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false },
    );

    return true;
  };

  async componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', params =>
      this.handleEvent(params),
    );

    this.eventListener = NativeAppEventEmitter.addListener(
      'AndroidTutorialEventKey',
      params =>
        AsyncStorage.getItem('AppTourTargetBit')
          .then(value => {
            if (value != 'true') {
              setTimeout(() => {
                let appTourSequence = new AppTourSequence();
                this.appTourTargets.forEach(appTourTarget => {
                  appTourSequence.add(appTourTarget);
                });

                AppTour.ShowSequence(appTourSequence);
              }, 1000);
            }
          })
          .done(),
    );

    if (Platform.OS == 'ios') {
      AsyncStorage.getItem('AppTourTargetBit')
        .then(value => {
          if (value != 'true') {
            setTimeout(() => {
              let appTourSequence = new AppTourSequence();
              this.appTourTargets.forEach(appTourTarget => {
                appTourSequence.add(appTourTarget);
              });

              AppTour.ShowSequence(appTourSequence);
            }, 1000);
          }
        })
        .done();
    }


    AsyncStorage.getItem(USER_KEY)
      .then(value => {
        if (Platform.OS == 'ios') {
          if (value == null) {
            AsyncStorage.getItem('iosLogin')
              .then(value => {
                if (value == null) {
                  this.setState({ isModalVisible: false });
                  this.setValue();
                } else {
                  this.setState({ isModalVisible: true });
                }
              })
              .done();
          } else {
            this.setState({ isLogin: value });
            if (value == 'true') {
              this.setState({ isModalVisible: true });
            } else {
              this.setState({ isModalVisible: false });
            }
          }
        } else {
          if (value == null) {
            this.setState({ isModalVisible: true });
            //this.setState({"isLogin":'true'});
          } else {
            this.setState({ isLogin: value });
            if (value == 'true') {
              this.setState({ isModalVisible: true });
            } else {
              this.setState({ isModalVisible: false });
            }
          }
        }
      })
      .done();
  }

  componentWillUnmount() {
    // remove listener
    this.eventListener.remove();
  }

  handleEvent = () => {
    let C_Detaild = GLOBALS.ContactDetail;
    if (C_Detaild != '') {
      this.setState({ BookingNumber: C_Detaild.BookingNo1 });
      this.setState({ WhatsAppNumber: C_Detaild.whatsapp_no1 });

      this.setState({ bookingNo1: C_Detaild.BookingNo1 });
      this.setState({ bookingNo2: C_Detaild.BookingNo2 });
      this.setState({ bookingNo3: C_Detaild.BookingNo3 });
      this.setState({ bookingNo4: C_Detaild.BookingNo4 });
      this.setState({ bookingNo5: C_Detaild.BookingNo5 });
      this.setState({ bookingNo6: C_Detaild.BookingNo6 });
      this.setState({ bookingNo7: C_Detaild.BookingNo7 });
    }
  };
  stringRemoveSpace = (str) => {
    str = str.replace(" ", "");
    str = str.replace("-", "");
    str = str.replace("(", "");
    str = str.replace(")", "");
    return str
  }
  handleClickContactCall = () => {
    this.showBookingModal();
  };

  handleClickContactWhatsApp = () => {
    const url = `whatsapp://send?phone=${this.state.WhatsAppNumber}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert(GLOBALS.App_Name, 'WhatsApp is not installed');
      }
    });
  };

  componentWillMount() {
    this.registerSequenceStepEvent();
    this.registerFinishSequenceEvent();
  }

  _AppTourTargetAsync = async () => {
    await AsyncStorage.setItem('AppTourTargetBit', 'true');
  };

  showModal = () => this.setState({ isModalVisible: true });
  hideModal = () => this.setState({ isModalVisible: false });

  showBookingModal = () => this.setState({ isBookingModel: true });
  hideBookingModal = () => this.setState({ isBookingModel: false });

  registerSequenceStepEvent = () => {
    if (this.sequenceStepListener) {
      this.sequenceStepListener.remove();
    }
    this.sequenceStepListener = DeviceEventEmitter.addListener(
      'onShowSequenceStepEvent',
      (e: Event) => {
        console.log(e);
        //alert(JSON.stringify(e));
        if (this.state.AppTourCount <= 1) {
          let appTourSequence = new AppTourSequence();
          this.appTourTargets2.forEach(appTourTarget => {
            appTourSequence.add(appTourTarget);
          });
          // AppTour.ShowSequence(appTourSequence);
        } else {
          this._AppTourTargetAsync();
        }

        this.setState({ AppTourCount: this.state.AppTourCount + 1 });
      },
    );
  };

  registerFinishSequenceEvent = () => {
    if (this.finishSequenceListener) {
      this.finishSequenceListener.remove();
    }

    this.finishSequenceListener = DeviceEventEmitter.addListener(
      'onFinishSequenceEvent',
      (e: Event) => {
        console.log(e);
        if (this.state.AppTourCount <= 2) {
          let appTourSequence = new AppTourSequence();
          this.appTourTargets2.forEach(appTourTarget => {
            appTourSequence.add(appTourTarget);
          });
          AppTour.ShowSequence(appTourSequence);
        } else {
          this._AppTourTargetAsync();
        }

        this.setState({ AppTourCount: this.state.AppTourCount + 2 });
      },
    );
  };

  setModalVisible(visible) {
    this.setState({
      isBookingModel: visible,
    });
  }

  setBookingNumber(Booking_No) {

    if (Booking_No == '0' || Booking_No == '' || Booking_No == undefined) { return }

    return (
      <View
        style={{
          marginTop: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignitems: 'center',
        }}>
        <Image
          style={[
            {
              width: 18,
              height: 18,
              resizeMode: 'contain',
              tintColor: GLOBALS.COLOR.BLACK,
              marginRight: 6,
            },
          ]}
          source={require('./Images/ic_call.png')}
        />
        <Text
          style={{ fontSize: 14, marginLeft: 5, color: GLOBALS.COLOR.BLACK, }}
          onPress={() => {
            Linking.openURL('tel:' + this.stringRemoveSpace(Booking_No).match(/\d+/));
          }}>
          {Booking_No}
        </Text>
      </View>
    )
  }

  render() {
    return (

      <View style={[{ flex: 1 }]}>
        <SafeAreaView style={{ flex: 1, backgroundColor: GLOBALS.COLOR.HEADER_COLOR }} forceInset={{ top: 'always', bottom: 'always' }} >
        <ImageBackground
          style={[{width: '100%', height: '100%'}]}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('./Images/img/bg.png')}>
        {/* <View style={[{width:'100%',height:1,backgroundColor:GLOBALS.COLOR.DARKGRAY_THEAM}]}></View> */}
        <TabBarBullion />

        <DraggableBox
          Clickevent={this.handleClickContactCall}
          addAppTourTarget={appTourTarget => {
            this.appTourTargets.push(appTourTarget);
          }}
        />

        <DraggableWhatsApp
          Clickevent={this.handleClickContactWhatsApp}
          addAppTourTarget={appTourTarget => {
            this.appTourTargets2.push(appTourTarget);
          }}
        />

        <Modal
          visible={this.state.isBookingModel}
          transparent={true}
          onRequestClose={() => {
            this.setModalVisible(false);
          }}
          animationType={'slide'}
          style={{
            justifyContent: 'center',
            alignitems: 'center',
            backgroundColor: '#000000',
          }}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.5)' }}
            activeOpacity={1}
            onPress={() => {
              this.setModalVisible(false);
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignitems: 'center',
                alignSelf: 'center',
                // flexDirection: 'column',
              }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    // left: 40,
                    // top: 150,
                    borderColor: GLOBALS.COLOR.YELLOW,
                    borderRadius: 8,
                    borderWidth: 2,
                    backgroundColor: GLOBALS.COLOR.WHITE,
                    width: '70%',
                    //height: '45%',

                    paddingVertical: 20,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignitems: 'center',
                    flexDirection: 'column',
                  }}>
                  <Text
                    style={{
                      marginLeft: 5,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: GLOBALS.COLOR.YELLOW,
                      width: '100%',
                      marginBottom: 10,
                    }}>
                    BOOKING NUMBER
                  </Text>
                  {/* booking no */}
                  {this.setBookingNumber(this.state.bookingNo1)}
                  {this.setBookingNumber(this.state.bookingNo2)}
                  {this.setBookingNumber(this.state.bookingNo3)}
                  {this.setBookingNumber(this.state.bookingNo4)}
                  {this.setBookingNumber(this.state.bookingNo5)}
                  {this.setBookingNumber(this.state.bookingNo6)}
                  {this.setBookingNumber(this.state.bookingNo7)}
                  {/* {this.setBookingNumber(this.state.bookingNo8)} */}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableOpacity>
        </Modal>
        </ImageBackground>

        {/* <ClientRegistration
          visible={this.state.isModalVisible}
          dismiss={this.hideModal}
        /> */}
</SafeAreaView>
      </View>
    );
  }


}

const AppNavigatorBullion = createSwitchNavigator(
  {
    Main: HomeActivity,
    BullionApp: TabBarBullion,
    // TerminalApp: TabBarTerminal
  },
  { headerMode: 'none' },
);
const AppContain = createAppContainer(AppNavigatorBullion);
export default AppContain;

