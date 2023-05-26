/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import {
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
  NativeAppEventEmitter,
  Linking,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../NavigationService';
import { DrawerActions } from 'react-navigation-drawer';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';
import PreferenceGlobals from '../UtilityClass/PreferenceGlobals';
import LoginTerminalScreen from '../SRC/LoginScreen';

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoginLogout: '',
      MenuItem: [],
      selectedItem: 0,
      isLoginModalVisible: false,
      UserName: '',
    };
  }

  componentDidMount() {

    this.eventListener = NativeAppEventEmitter.addListener('eventKeyReloadUserName', (params) => this.handleEvent(params));

    AsyncStorage.getItem('UserLoginDetail').then((value) => {
      if (value != null && value != "null" && value != undefined) {

        try {
          const UserAccountDetail = JSON.parse(value);
          let dataUser = JSON.parse(UserAccountDetail);
          let data = dataUser["Data"][0];

          this.setState({ UserName: data["Name"] });
        } catch (error) {
        }
      }
    })
  }

  handleEvent = (event) => {

    try {
      let data = event;
      this.setState({ UserName: data["Name"] });
    } catch (error) {
    }
  }

  componentDidUpdate(prevProps) {
    const isDrawerOpen = this.props.navigation.state.isDrawerOpen;
    const wasDrawerOpen = prevProps.navigation.state.isDrawerOpen;

    if (!wasDrawerOpen && isDrawerOpen) {
      this.UpdateDrawerAction();
    } else if (wasDrawerOpen && !isDrawerOpen) {
      this.UpdateDrawerAction();
    }
  }
  _hideLoginModal = () => {
    this.setState({ isLoginModalVisible: false });
  };
  componentWillMount() {
    this.UpdateDrawerAction();
  }

  async UpdateDrawerAction() {
    let isLogin = await PreferenceGlobals.getisLogin();
    this.setState({ isLoginLogout: isLogin });
    this.setState({
      MenuItem: [
        {
          name: 'Live Rate',
          image: require('../Images/img/Liverate.png'),
        },
        // {
        //   name: 'Coin Rate',
        //   image: require('../Images/img/Coin.png'),
        // },
        {
          name: 'Trade',
          image: require('../Images/img/Trade.png'),
        },
        // {
        //   name: 'Coin Trade',
        //   image: require('../Images/img/Trade.png'),
        // },

        // {
        //   name: 'KYC',
        //   image: require('../Images/img/KYC.png'),
        // },

        {
          name: 'Updates',
          image: require('../Images/img/Updates.png'),
        },
        {
          name: 'Bank Detail',
          image: require('../Images/img/Bank.png'),
        },
        {
          name: 'Economic Calendar',
          image: require('../Images/img/EcoCalendar.png'),
        },
        // {
        //   name: 'KYC',
        //   image: require('../Images/img/KYC.png'),
        // },
        {
          name: 'Contact Us',
          image: require('../Images/img/Contact.png'),
        },
        {
          name: 'Profile',
          image: require('../Images/img/Portfolio.png'),
        },
        {
          name: isLogin ? 'Logout' : 'Login',
          image: this.state.isLoginLogout ? require('../Images/img/Logout.png') : require('../Images/img/Login.png'),
        },
      ],
    });
  }

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  navigateToTabBar = (route, isLoginScreenOpen) => {
    this.navigateToScreen('TabBarBullion');
    NavigationService.navigate(route, {
      isLogin: this.state.isLoginLogout,
      isLoginScreenOpen: isLoginScreenOpen,
    });
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  GetItem(item, index) {
    GLOBALS.SelectedItem = index;

    if (index == 0) {
      this.navigateToTabBar('LIVE RATE');
    }
    // else if (index == 1) {
    //   this.navigateToTabBar('COIN RATE');
    // }
    else if (index == 1) {
      this.navigateToTabBar('TRADE');
    }
    // else if (index == 3) {
    //   this.navigateToTabBar('COIN TRADE');
    // }

    // else if (index == 4) {
    //   Linking.openURL(GLOBALS.KYC_BASEURL).catch((err) =>
    //     console.error("An error occurred", err)
    //   );
    // }
    else if (index == 2) {
      this.navigateToTabBar('UPDATES');
    }
    else if (index == 3) {
      this.navigateToTabBar('BANK DETAIL');
    }
    else if (index == 4) {
      this.navigateToScreen('EconomicCalender');
    }
    // else if (index == 5) {
    //   this.navigateToScreen('KYC');
    // }
    else if (index == 5) {
      this.navigateToTabBar('CONTACT US');
    } else if (index == 6) {
      if (this.state.isLoginLogout) {
        this.navigateToScreen('Setting');

      } else {
        Alert.alert(
          GLOBALS.App_Name,
          'Please Login',
          [
            {
              text: 'OK',
              onPress: () => console.log('NO Pressed'),
              style: 'cancel',
            }
          ],
          { cancelable: false },
        );
      }
    } else if (index == 7) {
      if (this.state.isLoginLogout) {
        Alert.alert(
          GLOBALS.App_Name,
          'Are you sure you want to logout ?',
          [
            {
              text: 'NO',
              onPress: () => console.log('NO Pressed'),
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => this._signOutAsync(),
            },
          ],
          { cancelable: false },
        );
      } else {
        this.navigateToTabBar('LIVE RATE', true);
      }
    } else {
    }
  }

  _signOutAsync = async () => {
    await PreferenceGlobals.setisLogin(false);
    await PreferenceGlobals.setUserLoginDetail(null);
    GLOBALS.isLoginTerminal = false;
    this.setState({ isLoginLogout: false });
    this.navigateToTabBar('LIVE RATE');
    GLOBALS.SelectedItem = 0;
  };

  renderItem(data) {
    let { item, index } = data;
    // let colorSelected = index == GLOBALS.SelectedItem ? [GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR] : ['transparent','transparent'];
    return (
      <TouchableWithoutFeedback onPress={this.GetItem.bind(this, item, index)}>
        <View
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              height: 48,
              backgroundColor:
                index == GLOBALS.SelectedItem ? GLOBALS.COLOR.BLUE : 'transparent',
            },
          ]}>
          <Image
            style={[
              {
                resizeMode: 'contain',
                height: 26,
                width: 26,
                alignSelf: 'center',
                marginLeft: 18,
                tintColor:
                  index == GLOBALS.SelectedItem
                    ? GLOBALS.COLOR.WHITE
                    : GLOBALS.COLOR.BLACK,
              },
            ]}
            source={item.image}
          />
          <Text
            style={[
              {
                fontWeight: 'bold',
                alignSelf: 'center',
                marginLeft: 15,
                width: '100%',
                color:
                  index == GLOBALS.SelectedItem
                    ? GLOBALS.COLOR.WHITE
                    : GLOBALS.COLOR.BLACK,
              },
            ]}>
            {item.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  render() {
    return (
      <View style={[{ flex: 1, backgroundColor: GLOBALS.COLOR.WHITE }]}>
        <ImageBackground
          style={{
            width: '100%',
            backgroundColor: GLOBALS.COLOR.HEADER_COLOR,
            height: 150,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={[
              {
                resizeMode: 'contain',
                alignSelf: 'center',
                height: 80,
                width: '65%',

                // shadowColor: 'gray',
                // shadowOpacity: 0.3,
                // shadowRadius: 3,
                // shadowOffset: {height: 0, width: 0},
                // elevation: 3,
              },
            ]}
            source={require('../Images/OtrLogo.png')}
          />
          {this.state.isLoginLogout == true && this.state.UserName != "" ? <Text
            numberOfLines={1}
            style={[
              {
                top: 15,
                fontWeight: 'bold',
                fontSize: 11,
                marginHorizontal: 10,
                alignSelf: 'center',
                textAlign: 'center',
                width: '100%',
                color: GLOBALS.COLOR.BLACK,
              },
            ]}>
            {'Welcome - ' + this.state.UserName}
          </Text> : null}
        </ImageBackground>
        <View style={[{ height: 2, backgroundColor: GLOBALS.COLOR.YELLOW }]} />
        <FlatList
          style={[{ paddingTop: 0 }]}
          bounces={false}
          keyExtractor={this._keyExtractor}
          data={this.state.MenuItem}
          renderItem={this.renderItem.bind(this)}
        />
        <SafeAreaView />

        {this.state.isLoginModalVisible ? (
          <LoginTerminalScreen
            modalVisible={this.state.isLoginModalVisible}
            dismiss={this._hideLoginModal}
            isLogin={(islogin) => this.setState({ isTerminalLogin: islogin })}
            isSideMenu={'false'}
          />
        ) : null}
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object,
};

export default SideMenu;
