/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Text,
  AppRegistry,
  View,
  Image,
  Dimensions,
  Alert,
  TouchableOpacity,
  StatusBar,
  NativeAppEventEmitter,
  Modal,
  ScrollView,
  Platform,
  ActivityIndicator,
  Share,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import GLOBALS from "../UtilityClass/Globals";
import AsyncStorage from "@react-native-community/async-storage";

import { createStackNavigator, Header } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createAppContainer } from "react-navigation";
//import { SafeAreaView } from "react-native-safe-area-context";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "react-navigation-tabs";
import NavigationService from "../NavigationService";
export const USER_KEY = "isLogin";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
export const USER_Terminal = "isLoginTerminal";
import UpdatesPopupScreen from "../UtilityClass/UpdatesPopup";
import PreferenceGlobals from "../UtilityClass/PreferenceGlobals";

export const MenuIcon = (navigation) => (
  <TouchableOpacity onPress={() => navigation.openDrawer()}>
    <Image
      style={[
        {
          alignSelf: "center",
          height: 35,
          width: 25,
          resizeMode: "contain",
          //marginLeft: 15,
          margin: 15,
          tintColor: GLOBALS.COLOR.BORDER_COLOR,
        },
      ]}
      source={require("../Images/menu.png")}
    />
  </TouchableOpacity>
);

import LiveRateScreen from "./LiveRateScreen";
import UpdatesScreen from "./UpdatesScreen";
import BankDetailsScreen from "./BankDetailsScreen";
import ContactScreen from "./ContactScreen";
import EconomicCalenderScreen from "./EconomicCalender";
// import KYCScreen from "./KYC";

import LoginTerminalScreen from "./LoginScreen";
import TradeScreen from "./TradeScreen";
import SettingScreen from "./SettingScreen";
import CoinRateScreen from "./CoinRateScreen";
import CoinTradeScreen from "./CoinTradeScreen";

import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
// import firebase from "react-native-firebase";
// import type { Notification, NotificationOpen } from "react-native-firebase";

import SideMenu from "./SideMenuBullion";
import MarqueeBottom from "../UtilityClass/MarqueeBottom";
import MarqueeTop from "../UtilityClass/MarqueeTop";
var ContactDetails = "";
var ContactDetailsCopy = "";

export function SelectedTabItem(name) {
  if (name == "LIVE RATE") {
    GLOBALS.SelectedItem = 0;
  }
  // else if (name == 'COIN RATE') {
  //   GLOBALS.SelectedItem = 1;
  // }
  else if (name == "TRADE") {
    GLOBALS.SelectedItem = 1;
  }
  // else if (name == "COIN TRADE") {
  //   GLOBALS.SelectedItem = 3;
  // }

  // else if (name == "KYC") {
  //   GLOBALS.SelectedItem = 4;
  // }

  else if (name == "UPDATES") {
    GLOBALS.SelectedItem = 2;
  } else if (name == "BANK DETAIL") {
    GLOBALS.SelectedItem = 3;
  }
  else if (name == "Economic Calender") {
    GLOBALS.SelectedItem = 4;
  } 
  // else if (name == "KYC") {
  //   GLOBALS.SelectedItem = 5;
  // }
  else if (name == "CONTACT US") {
    GLOBALS.SelectedItem = 5;
  } else if (name == "Setting") {
    GLOBALS.SelectedItem = 6;
  } else if (name == "LOGOUT") {
    GLOBALS.SelectedItem = 7;
  }
}

class TabBarBullion extends Component {
  constructor(props) {
    super(props);
    console.warn();

    this.state = {
      BookingNumber: "0",
      WhatsAppNumber: "0",
      Marque: "",
      MarqueBottom: "",
      isLoginTerminal: false,
      ClientHeaderDetails: "",
      isConnected: true,

      isModalVisible: false,
      isImg: true,
      imgURL: "",

      isUpdateModalVisible: false,
      notificationBody: "",
    };
  }

  componentWillUnmount() {
    this.messageListener();
    //this.notificationListener();
    //this.notificationOpenedListener();
  }
  async componentDidMount() {

    this.eventListener = NativeAppEventEmitter.addListener(
      "eventKeychecklogin",
      (params) => this.handleEventchecklogin(params)
    );
    this.eventListener = NativeAppEventEmitter.addListener(
      "eventKeyClientHeaderDetails",
      (params) => this.handleEventClientHeaderDetails(params)
    );

    this.eventListener = NativeAppEventEmitter.addListener(
      "eventKeyUserAccountDetailLogout",
      (params) => this.eventKeyUserAccountDetailLogout(params)
    );

    NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      this.setState({ isConnected: state.isConnected });
    });

    
    messaging().subscribeToTopic(GLOBALS.TopicFCM_Name);
    this.checkApplicationPermission();
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus) {
      console.log('Permission status:', authorizationStatus);
    }

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      const { bit } = remoteMessage.data;
      if (bit == "1") {
        // this.props.navigation.navigate('UPDATES');
         NavigationService.navigate("UPDATES", { userName: "Lucy" });
      } else if (bit == "2") {
         NavigationService.navigate("LIVE RATE", { userName: "Lucy" });
      } else {
      }
     
    });

    // Check whether an initial notification is available
    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          const { bit } = remoteMessage.data;
          if (bit == "1") {
             //this.props.navigation.navigate('UPDATES');
             NavigationService.navigate("UPDATES", { userName: "Lucy" });
          } else if (bit == "2") {
             NavigationService.navigate("LIVE RATE", { userName: "Lucy" });
          } else {
          }
          //setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
       
      });


    notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          var { bit } = detail.notification.data;
          if (bit == "1") {
             // this.props.navigation.navigate('UPDATES');
            NavigationService.navigate("UPDATES", { userName: "Lucy" });
          } else if (bit == "2") {
            NavigationService.navigate("LIVE RATE", { userName: "Lucy" });
          } else {
          }
          break;
        case EventType.DELIVERED:
          console.log('User pressed notification', detail.notification);
          var { bit } = detail.notification.data;
          if (bit == '1') {
            this._ShowUpdateModel(detail.notification);
          }
          break;
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      // Check if the user pressed the "Mark as read" action
      if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
        // Update external API
        await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
          method: 'POST',
        });

        // Remove the notification
        await notifee.cancelNotification(notification.id);
      }
    });
  }

  handleEventchecklogin = async (data) => {
    if (data == false) {
      this._signOutAsync();
      NativeAppEventEmitter.emit('eventKeyLogOut');
    }
  };

  eventKeyUserAccountDetailLogout = async (data) => {
    this._signOutAsync();
    NativeAppEventEmitter.emit('eventKeyLogOut');
  };

  _signOutAsync = async () => {
    await PreferenceGlobals.setisLogin(false);
    await PreferenceGlobals.setUserLoginDetail(null);
    GLOBALS.isLoginTerminal = false;
    NavigationService.navigate("LIVE RATE", { userName: "Lucy" });
    GLOBALS.SelectedItem = 0;
  };

  handleEventClientHeaderDetails(data) {
    try {
      if (data != "") {
        ContactDetailsCopy = JSON.stringify(data);

        if (ContactDetails.toString() != ContactDetailsCopy) {
          if (data.MessageType == "Header") {
            ContactDetails = JSON.stringify(data);
            var objCLientDetail = JSON.parse(data.Data)[0];

            GLOBALS.ProductHeader.HighRate = objCLientDetail.HighRate;
            GLOBALS.ProductHeader.LowRate = objCLientDetail.LowRate;
            GLOBALS.ProductHeader.RateDisplay = objCLientDetail.RateDisplay;
            GLOBALS.ProductHeader.CoinRateDisplay =
              objCLientDetail.CoinRateDisplay;
            GLOBALS.ProductHeader.Symbol_Count = objCLientDetail.SYMBOL_COUNT;

            GLOBALS.ProductHeader.MARQUE = objCLientDetail.Marquee;
            GLOBALS.ProductHeader.MARQUE_BOTTOM = objCLientDetail.Marquee2;

            this.setState({ BookingNumber: objCLientDetail.BookingNo1 });
            this.setState({ WhatsAppNumber: objCLientDetail.whatsapp_no1 });
            this.setState({ Marque: objCLientDetail.Marquee });
            this.setState({ imgURL: objCLientDetail.BannerApp });

            GLOBALS.ProductHeader.GoldCoinHeader =
              objCLientDetail.GoldCoinHeader;
            GLOBALS.ProductHeader.SilverCoinHeader =
              objCLientDetail.SilverCoinHeader;
            GLOBALS.ProductHeader.GoldCoinIsDisplay =
              objCLientDetail.GoldCoinIsDisplay;
            GLOBALS.ProductHeader.SilverCoinIsDisplay =
              objCLientDetail.SilverCoinIsDisplay;
            GLOBALS.ProductHeader.Symbol_Count_Coin =
              objCLientDetail.COIN_COUNT;

            GLOBALS.ContactDetail = objCLientDetail;
            NativeAppEventEmitter.emit("eventKey", objCLientDetail);

            if (this.state.isImg) {
              if (this.state.imgURL != " ") {
                this.setState({ isImg: false });
                this._ShowMyModel();
              }
            }
          }
        }
      }
    } catch (error) { }
  }

  showModal = () => this.setState({ isModalVisible: true });
  hideModal = () => this.setState({ isModalVisible: false });

  _ShowMyModel() {
    this.setState({ isModalVisible: true });
  }
  _hideMyModal = () => {
    this.setState({ isModalVisible: false });
  };

  _ShowUpdateModel(item) {
    this.setState({ isUpdateModalVisible: true });
    this.setState({ notificationBody: item });
  }
  _hideUpdateModal = () => {
    this.setState({ isUpdateModalVisible: false });
  };

  async checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      this.getToken();
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }

  //3
  async getToken() {
    await messaging().registerDeviceForRemoteMessages();
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  render() {
    return (
      <ImageBackground
          style={[{width: '100%', height: '100%'}]}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../Images/bg.png')}>

      <View style={[{ flex: 1}]}>
        <MarqueeTop />

        {!this.state.isConnected ? (
          <View
            style={[
              {
                width: "100%",
                height: 25,
                backgroundColor: "red",
                justifyContent: "center",
              },
            ]}
          >
            <Text style={[{ color: GLOBALS.COLOR.WHITE, textAlign: "center" }]}>
              Please Check Internet Connection.
            </Text>
          </View>
        ) : null}

        <AppContainerconst
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          onNavigationStateChange={(prevState, currentState) => {
            const currentScreen = getActiveRouteName(currentState);

            SelectedTabItem(currentScreen);
          }}
        />

        {this.state.imgURL != null && this.state.imgURL != "" ? (
          <MyModal
            modalVisible={this.state.isModalVisible}
            imageURL={this.state.imgURL}
            hideModal={this._hideMyModal}
          />
        ) : null}

        <UpdateModal
          modalVisible={this.state.isUpdateModalVisible}
          notificationBody={this.state.notificationBody}
          hideUpdateModal={this._hideUpdateModal}
        />

        <UpdatesPopupScreen />
      </View>
       </ImageBackground>
    );
  }
  
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  }
}

const TabBarStack = createStackNavigator({
  TabBarBullion: {
    screen: TabBarBullion,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "transparent",
        height: 65,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: null,
      headerLeft: MenuIcon(navigation),
      // headerRight:(MenuIconRight(navigation)),
      header: (props) => <GradientHeader {...props} />,
    }),
  },
});

// const CoinRateScreenStack = createStackNavigator({
//   CoinRate: {
//     screen: CoinRateScreen,
//     navigationOptions: ({ navigation }) => ({
//       headerStyle: {
//         backgroundColor: "transparent",
//         height: 65,
//         elevation: 0,
//         shadowOpacity: 0,
//       },
//       headerTitle: null,
//       headerLeft: MenuIcon(navigation),
//       // headerRight:(MenuIconRight(navigation)),
//       header: (props) => <GradientHeader {...props} />,
//     }),
//   },
// });



const LoginTerminalStack = createStackNavigator({
  LoginTerminal: {
    screen: LoginTerminalScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "transparent",
        height: 65,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: null,
      headerLeft: MenuIcon(navigation),
      // headerRight:(MenuIconRight(navigation)),
      header: (props) => <GradientHeader {...props} />,
    }),
  },
});

const SettingScreenStack = createStackNavigator({
  Setting: {
    screen: SettingScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "transparent",
        height: 65,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: null,
      headerLeft: MenuIcon(navigation),
      // headerRight:(MenuIconRight(navigation)),
      header: (props) => <GradientHeader {...props} />,
    }),
  },
});
const EconomicCalenderStack = createStackNavigator({
  EconomicCalender: {
    screen: EconomicCalenderScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: "transparent",
        height: 65,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitle: null,
      headerLeft: MenuIcon(navigation),
      // headerRight:(MenuIconRight(navigation)),
      header: (props) => <GradientHeader {...props} />,
    }),
  },
});

// const KYCStack = createStackNavigator({
//   KYC: {
//     screen: KYCScreen,
//     navigationOptions: ({ navigation }) => ({
//       headerStyle: {
//         backgroundColor: "transparent",
//         height: 65,
//         elevation: 0,
//         shadowOpacity: 0,
//       },
//       headerTitle: null,
//       headerLeft: MenuIcon(navigation),
//       // headerRight:(MenuIconRight(navigation)),
//       header: (props) => <GradientHeader {...props} />,
//     }),
//   },
// });

// const TradeScreenStack = createStackNavigator({
//   Trade: {
//     screen: TradeScreen,
//     navigationOptions: ({ navigation }) => ({
//       headerStyle: {
//         backgroundColor: "transparent",
//         height: 65,
//         elevation: 0,
//         shadowOpacity: 0,
//       },
//       headerTitle: null,
//       headerLeft: MenuIcon(navigation),
//       // headerRight:(MenuIconRight(navigation)),
//       header: (props) => <GradientHeader {...props} />,
//     }),
//   },
// });



const BullionDrawerNavigator = createDrawerNavigator(
  {
    TabBarBullion: {
      screen: TabBarStack,
    },
    EconomicCalender: {
      screen: EconomicCalenderStack,
    },
    // KYC:{
    //   screen: KYCStack,
    // },
    // UPDATES: {
    //   screen: UpdatesScreenStack,
    // },
    // BANKDETAIL: {
    //   screen:BankDetailsStack,
    // },
    // MarketTrandz: {
    //   screen: MarketTrandzStack,
    // },
    LoginTerminal: {
      screen: LoginTerminalStack,
    },
    Setting: {
      screen: SettingScreenStack,
    },
  },
  {
    contentComponent: SideMenu,
    drawerWidth: Dimensions.get("window").width - 90,
  }
);

export default createAppContainer(BullionDrawerNavigator);

const GradientHeader = (props) => {
  return (
    <View style={{ backgroundColor: GLOBALS.COLOR.WHITE }}>
      {/* <SafeAreaView style={{ flex: 1 }}/> */}
      <View>
        <Image
          style={[
            {
              alignSelf: "center",
              height: 55,
              width: 260,
              position: "absolute",
              bottom: 7,
              resizeMode: "contain",
            },
          ]}
          source={require("../Images/headerLogo.png")}
        />
        <StatusBar
          backgroundColor={GLOBALS.COLOR.BLUE}
          barStyle="dark-content"
        />
        <Header {...props} style={{ backgroundColor: "transparent" }} />
        {/* <View style={[{width:'100%',height:1,backgroundColor:GLOBALS.COLOR.BLUE}]}/> */}
      </View>
    </View>
  );
};

async function onDisplayNotification(notifi) {
  // Request permissions (required for iOS)
  await notifee.requestPermission()
   
  var noti = notifi.data;
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: noti.title,
    body: noti.body,
    data:{bit: noti.bit},
    android: {
      channelId,
      //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default',
      },
    },
  });
}
//
//This is for receiving notification Background
//
function onMessageReceivedBackground(message) {
  notifee.displayNotification(message.data);
}
//
//This is for receiving notification onForeground
//
function onMessageReceivedFore(message) {
  onDisplayNotification(message);
  // notifee.displayNotification(message);
}

messaging().onMessage(onMessageReceivedFore);
messaging().setBackgroundMessageHandler(onMessageReceivedBackground);

const BottomTabNavigator = createBottomTabNavigator(
  {
    "LIVE RATE": { screen: LiveRateScreen },
    //'COIN RATE': { screen: CoinRateScreen },
    TRADE: { screen: TradeScreen },
    //'COIN TRADE': { screen: CoinTradeScreen },
    UPDATES: { screen: UpdatesScreen },
    "BANK DETAIL": { screen: BankDetailsScreen },
    "CONTACT US": { screen: ContactScreen },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        if (routeName === "LIVE RATE") {
          const image = focused
            ? require("../Images/img/Liverate.png")
            : require("../Images/img/Liverate.png");
          return (
            <Image
              style={{
                resizeMode: "contain",
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={image}
            />
          );
        }
        // else if (routeName === 'COIN RATE') {
        //   const image = focused
        //     ? require('../Images/img/Coin.png')
        //     : require('../Images/img/Coin.png');
        //   return (
        //     <Image
        //       style={{
        //         resizeMode: 'contain',
        //         height: 25,
        //         width: 25,
        //         tintColor: tintColor,
        //       }}
        //       source={image}
        //     />
        //   );
        // }
        else if (routeName === "TRADE") {
          const image = focused
            ? require("../Images/img/Trade.png")
            : require("../Images/img/Trade.png");
          return (
            <Image
              style={{
                resizeMode: "contain",
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={image}
            />
          );
        }

        else if (routeName === "BANK DETAIL") {
          const image = focused
            ? require("../Images/img/Bank.png")
            : require("../Images/img/Bank.png");
          return (
            <Image
              style={{
                resizeMode: "contain",
                height: 28,
                width: 28,
                tintColor: tintColor,
              }}
              source={image}
            />
          );
        }

        else if (routeName === "UPDATES") {
          const image = focused
            ? require("../Images/img/Updates.png")
            : require("../Images/img/Updates.png");
          return (
            <Image
              style={{
                resizeMode: "contain",
                height: 28,
                width: 28,
                tintColor: tintColor,
              }}
              source={image}
            />
          );
        }
        
        // else if (routeName === "COIN TRADE") {
        //   const image = focused
        //     ? require("../Images/img/Trade.png")
        //     : require("../Images/img/Trade.png");
        //   return (
        //     <Image
        //       style={{
        //         resizeMode: "contain",
        //         height: 25,
        //         width: 25,
        //         tintColor: tintColor,
        //       }}
        //       source={image}
        //     />
        //   );
        // }
        else if (routeName === "CONTACT US") {
          const image = focused
            ? require("../Images/img/Contact.png")
            : require("../Images/img/Contact.png");
          return (
            <Image
              style={{
                resizeMode: "contain",
                height: 25,
                width: 25,
                tintColor: tintColor,
              }}
              source={image}
            />
          );
        }
      },
    }),
    initialRouteName: "LIVE RATE",

    tabBarComponent: (props) => {
      return (
        <View>
          <MarqueeBottom />

            <SafeAreaView style={{marginBottom: Platform.OS === 'ios' ? 20 : 0, }}>
              <BottomTabBar
                {...props}
                style={{ backgroundColor: GLOBALS.COLOR.WHITE }}
              />
            </SafeAreaView>
            
        </View>
      );
    },

    tabBarOptions: {
      labelStyle: {
        fontSize: 10,
        fontWeight: "700",
      },
      activeTintColor: GLOBALS.COLOR.TAB_ACTIVECOLOR,
      // activeBackgroundColor: GLOBALS.COLOR.TAB_ACTIVECOLOR,

      inactiveTintColor: GLOBALS.COLOR.TAB_DEACTIVECOLOR,
      // inactiveBackgroundColor: GLOBALS.COLOR.TAB_DEACTIVECOLOR,

      backgroundColor: GLOBALS.COLOR.TAB_BGCOLOR,
    },
  }
);

const AppContainerconst = createAppContainer(BottomTabNavigator);

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

class MyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  _onLoadEnd = () => {
    this.setState({
      loading: false,
    });
  };

  render() {
    return (
      // <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={false}
        closeModal={false}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.hideModal()}
      >
        <Image
          style={[
            {
              flex: 1,
              backgroundColor: GLOBALS.COLOR.WHITE,
              justifyContent: "center",
              alignSelf: "center",
              resizeMode: "contain",
              height: "100%",
              width: "100%",
            },
          ]}
          onLoadEnd={this._onLoadEnd}
          source={{ uri: this.props.imageURL }}
        />

        <ActivityIndicator
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
          animating={this.state.loading}
          size="large"
          color={GLOBALS.COLOR.BLACK}
        />

        <SafeAreaView>
          {/* <LinearGradient 
          colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
          start={{ x: 0, y: 0}} 
          end={{x: 0, y: 1}} 
          style={{height: 40}}> */}
          <View style={{ height: 40, backgroundColor: GLOBALS.COLOR.YELLOW }}>
            <TouchableOpacity onPress={() => this.props.hideModal()}>
              <Text
                style={{
                  color: GLOBALS.COLOR.WHITE,
                  flexDirection: "row",
                  alignSelf: "center",
                  fontSize: 20,
                  fontWeight: "bold",
                  marginTop: 6,
                }}
              >
                {" "}
                SKIP{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      // </SafeAreaView>
    );
  }
}

class UpdateModal extends React.Component {
  constructor(props) {
    super(props);
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
      // <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        closeModal={false}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.hideUpdateModal()}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "stretch",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <ScrollView
            contentContainerStyle={{ flex: 1, justifyContent: "center" }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: GLOBALS.COLOR.HEADER_COLOR,
                marginHorizontal: 20,
                borderWidth: 2,
                borderRadius: 4,
                borderColor: GLOBALS.COLOR.YELLOW,
                shadowColor: "gray",
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { height: 0, width: 0 },
                elevation: 2,
              }}
            >
              <Image
                style={[
                  {
                    alignSelf: "center",
                    height: 80,
                    width: "55%",
                    resizeMode: "contain",
                    marginVertical: 20,
                  },
                ]}
                source={require("../Images/OtrLogo.png")}
              />
              <Text
                style={[
                  {
                    flexDirection: "row",
                    alignSelf: "center",
                    textAlign: "center",
                    color: GLOBALS.COLOR.YELLOW,
                    fontSize: 18,
                    fontWeight: "bold",
                    marginTop: 0,
                  },
                ]}
              >
                {this.props.notificationBody.title}
              </Text>
              <Text
                style={[
                  {
                    flexDirection: "row",
                    alignSelf: "center",
                    textAlign: "center",
                    color: GLOBALS.COLOR.BLACK,
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 8,
                  },
                ]}
              >
                {this.props.notificationBody.body}
              </Text>
              {/* <LinearGradient 
              colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
              start={{ x: 0, y: 0}} 
              end={{x: 0, y: 1}} 
              style={{margin: 20,height: 40,borderRadius: 4,backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,shadowColor:'gray',shadowOpacity: 0.3,shadowRadius: 3,shadowOffset: {height: 0, width: 0},elevation: 2,}}> */}
              <View
                style={{
                  margin: 20,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: GLOBALS.COLOR.YELLOW,
                  shadowColor: "gray",
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  shadowOffset: { height: 0, width: 0 },
                  elevation: 2,
                }}
              >
                <TouchableOpacity
                  style={{ width: "100%", height: "100%" }}
                  onPress={() => this.props.hideUpdateModal()}
                >
                  <Text
                    style={{
                      color: GLOBALS.COLOR.WHITE,
                      flexDirection: "row",
                      alignSelf: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                      marginTop: 10,
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
                {/* </LinearGradient> */}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      // </SafeAreaView>
    );
  }
}

AppRegistry.registerComponent("BullionApp", () => TabBarBullion);
