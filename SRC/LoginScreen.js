/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-string-refs */
/* eslint-disable no-alert */
// Modal.js
import React from 'react';
import {
  View,
  Keyboard,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  SafeAreaView,
  ImageBackground,
  NativeAppEventEmitter,
  Alert,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import t from 'prop-types';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import DeviceInfo from 'react-native-device-info';
export const USER_KEY = 'isLogin';
export const ClientID = 'ClientID';
export const USERID = 'UserLoginID';
export const PASSWORD = 'Password';
import CustumProgress from '../UtilityClass/CustumProgress';
import PreferenceGlobals from '../UtilityClass/PreferenceGlobals';
import AsyncStorage from '@react-native-community/async-storage';
let Window = Dimensions.get('window');

export default class LoginScreen extends React.Component {
  static propTypes = {
    // children: t.node.isRequired,
    // visible: t.bool.isRequired,
    dismiss: t.func.isRequired,
    transparent: t.bool,
    animationType: t.string,
    msg: t.string,
  };

  static defaultProps = {
    animationType: 'slide',
    transparent: false,
  };

  constructor(props) {
    super(props);
    console.warn();

    this.state = {
      isRemember: false,
      isConnected: true,
      isProgress: false,
      UserLoginID: '',
      Password: '',
      isForgotModalVisible: false,
      isRegisterModalVisible: false,
    };
  }

  async componentDidMount() {
    let Pre_UserLoginID = await PreferenceGlobals.getUserLoginID();
    let Pre_Password = await PreferenceGlobals.getPassword();

    if (Pre_UserLoginID != null && Pre_Password != null) {
      this.setState({
        isRemember: true,
        UserLoginID: Pre_UserLoginID,
        Password: Pre_Password,
      });
    } else {
      this.setState({ isRemember: false });
    }

    // console.log('user :- ' + Pre_UserLoginID);
    // console.log('pass :- ' + Pre_Password);

    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({ isConnected: state.isConnected });
      }
    });
  }
  _hideForgotModal = () => {
    this.setState({ isForgotModalVisible: false });
  };

  _hideRegistationModal = () => {
    this.setState({ isRegisterModalVisible: false });
  };

  RegistationScreenNavigation() {
    this.setState({ isRegisterModalVisible: true });
  }

  handleName = (text) => {
    this.setState({ UserLoginID: text });
  };
  handleFirmName = (text) => {
    this.setState({ Password: text });
  };
  forgotScreenNavigation() {
    this.setState({ isForgotModalVisible: true });
  }
  async rememberUserDetail() {
    let UserLoginID = this.state.UserLoginID;
    let Password = this.state.Password;

    if (UserLoginID.length == 0 && Password.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else if (UserLoginID.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your UserId.');
    } else if (Password.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Password.');
    } else {
      let Pre_UserLoginID = null;
      let Pre_Password = null;

      if (this.state.isRemember) {
        Pre_UserLoginID = null;
        Pre_Password = null;

        this.setState({ isRemember: false });
      } else {
        Pre_UserLoginID = UserLoginID;
        Pre_Password = Password;

        this.setState({ isRemember: true });
      }

      await PreferenceGlobals.setUserLoginID(Pre_UserLoginID);
      await PreferenceGlobals.setPassword(Pre_Password);
    }
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }
  async setPreferenceLoginDetail(data) {
    await PreferenceGlobals.setisLogin(true);
    await PreferenceGlobals.setUserLoginDetail(data);
  }

  async login(UserLoginID, Password) {
    // var idMac = DeviceInfo.getUniqueId();

    if (UserLoginID.length == 0 && Password.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else if (UserLoginID.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your UserId.');
    } else if (Password.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Password.');
    } else {
      if (this.state.isRemember) {
        await PreferenceGlobals.setUserLoginID(UserLoginID);
        await PreferenceGlobals.setPassword(Password);
      }

      this.setState({ isProgress: true });
      if (this.state.isConnected) {
        let Obj = new Object();
        Obj["loginid"] = parseFloat(UserLoginID);
        Obj["Password"] = Password;
        Obj["ClientId"] = GLOBALS.ClientID;
        Obj['Firmname'] = GLOBALS.ClientName;

        fetch(GLOBALS.Terminal_BASE_URL + 'GetLoginDetails', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json; charset=utf-8;', // <-- Specifying the Content-Type
          }),
          body: "{'Obj':'" + JSON.stringify(Obj) + "'}",
        })
          .then((response) => response.json())
          .then((responseJson) => {
            try {
              let Obj = JSON.parse(responseJson.d);
              console.log('respons :- ' + Obj);

              if (Obj['ReturnCode'] == '200') {
                GLOBALS.UserAccountDetail = JSON.parse(responseJson.d);
                const UserAccountDetail = JSON.parse(responseJson.d);
                let data = UserAccountDetail["Data"][0];
                GLOBALS.isLoginTerminal = true;
                this.setPreferenceLoginDetail(responseJson.d);
                this.props.isLogin(true);
                this.props.dismiss();
                NativeAppEventEmitter.emit("eventKeyReloadUserName", data);
              } else {
                this.showAlert(GLOBALS.App_Name, Obj["ReturnMsg"]);
              }
            } catch (error) {
              console.log(error);
            }
            this.setState({ isProgress: false });
          })
          .catch((error) => {
            this.showAlert(GLOBALS.App_Name, 'Login Fail');
            console.log(error);
            this.setState({ isProgress: false });
          });
      } else {
        this.showAlert(GLOBALS.App_Name, 'Please check internet connection...');
      }
    }
  };

  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }
  render() {
    const { props } = this;
    return (
      <View>
        <Modal
          visible={props.visible}
          transparent={props.transparent}
          onRequestClose={props.dismiss}
          dismiss={props.dismiss}
          animationType={props.animationType}>
          <SafeAreaView
            style={[{ backgroundColor: GLOBALS.COLOR.HEADER_COLOR }]}
          />
          <View
            style={[
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
                Login
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.dismiss();
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
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={[{ flex: 1 }]}>
            <DismissKeyboard>
              <ImageBackground
              style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BLACK}]}
              imageStyle={{resizeMode: 'stretch'}}
              source={require('../Images/bg.png')}>
              <View style={styles.container}>
                <View style={styles.containerView}>
                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        alignSelf: 'center',
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingVertical: 5,
                        paddingHorizontal: 12,
                        marginTop: 15,
                      },
                    ]}>
                    LOGIN
                  </Text>

                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    USER ID :
                  </Text>
                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.input}
                      ref="1"
                      value={this.state.UserLoginID}
                      placeholder="USER ID"
                      keyboardType="number-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleName}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('2');
                      }}
                    >
                    </TextInput>
                    <Image
                      style={[
                        {
                          marginTop: 20,
                          marginLeft: 30,
                          resizeMode: 'contain',
                          position: 'absolute',
                          height: 25,
                          width: 25,
                          tintColor: GLOBALS.COLOR.YELLOW,
                        },
                      ]}
                      source={require('../Images/user.png')}
                    />
                  </View>

                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        fontWeight: 'bold',
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 13,
                        marginLeft: 20,
                        marginTop: 15,
                      },
                    ]}>
                    PASSWORD :
                  </Text>

                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.input}
                      ref="2"
                      value={this.state.Password}
                      keyboardType="default"
                      placeholder="PASSWORD"
                      secureTextEntry={true}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleFirmName}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                    // onSubmitEditing={() => {
                    //   this._focusNextField('2');
                    // }}
                    >
                    </TextInput>
                    <Image
                      style={[
                        {
                          marginTop: 12,
                          marginLeft: 20,
                          resizeMode: 'contain',
                          position: 'absolute',
                          height: 40,
                          width: 40,
                          tintColor: GLOBALS.COLOR.YELLOW,
                        },
                      ]}
                      source={require('../Images/password.png')}
                    />
                  </View>

                  <View style={[{ flexDirection: 'row', marginHorizontal: 20 }]}>
                    <TouchableWithoutFeedback
                      onPress={() => this.rememberUserDetail()}>
                      <View
                        style={[{ flexDirection: 'row', marginVertical: 10 }]}>
                        <Image
                          style={[
                            {
                              resizeMode: 'contain',
                              height: 25,
                              width: 25,
                              tintColor: GLOBALS.COLOR.WHITE,
                            },
                          ]}
                          source={
                            this.state.isRemember
                              ? require('../Images/ic_check_box.png')
                              : require('../Images/ic_uncheck_box.png')
                          }
                        />

                        <View style={[{ justifyContent: 'center' }]}>
                          <Text
                            style={[
                              {
                                fontSize: 13,
                                color: GLOBALS.COLOR.WHITE,
                                fontWeight: 'bold',
                              },
                            ]}>
                            {' '}
                            Remember Me{' '}
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>

                    <View
                      style={[
                        {
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginVertical: 10,
                        },
                      ]}>
                      <TouchableWithoutFeedback
                        onPress={() => this.forgotScreenNavigation()}>
                        <View style={[{ justifyContent: 'center' }]}>
                          <Text
                            style={[
                              {
                                fontSize: 13,
                                color: GLOBALS.COLOR.WHITE,
                                fontWeight: 'bold',
                              },
                            ]}>
                            {' '}
                            Forgot Password?{' '}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  {/* <LinearGradient 
                    colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                    start={{ x: 0, y: 0}} 
                    end={{x: 0, y: 1}} 
                    style={styles.submitButton}> */}
                  <View style={styles.submitButton}>
                    <TouchableOpacity
                      onPress={() =>
                        this.login(this.state.UserLoginID, this.state.Password)
                      }>
                      <Text style={styles.submitButtonText}> LOGIN </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginTop: 30 }}>
                  <TouchableOpacity
                    onPress={() =>
                      this.RegistationScreenNavigation()
                    }>
                    <Text style={styles.submitButtonText}> Or Create New Account </Text>
                  </TouchableOpacity>
                </View>

                {this.state.isProgress ? (
                  <View
                    style={{
                      position: 'absolute',
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CustumProgress />
                  </View>
                ) : null}
                {/* <Text style={[{color:'red',width:'100%',textAlign: 'center',marginVertical:20}]}>{props.msg}</Text>                */}
              </View>
              </ImageBackground>
            </DismissKeyboard>
          </KeyboardAvoidingView>

          {this.state.isForgotModalVisible ? (
            <ForgotScreen
              modalVisible={this.state.isForgotModalVisible}
              dismiss={this._hideForgotModal}
              hideForgotModal={this._hideForgotModal}
            />
          ) : null}

          {this.state.isRegisterModalVisible ? (
            <RegistationScreen
              modalVisible={this.state.isRegisterModalVisible}
              dismiss={this._hideRegistationModal}
              hideForgotModal={this._hideRegistationModal}
            />
          ) : null}

        </Modal>
      </View>
    );
  }
}

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    margin: '5%',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: GLOBALS.COLOR.WHITE,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    //backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },
  containerView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: GLOBALS.COLOR.BLUE,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: GLOBALS.COLOR.YELLOW,
  },
  input: {
    marginHorizontal: 20,
    marginTop: 10,
    height: 45,
    fontSize: 14,
    backgroundColor: GLOBALS.COLOR.WHITE,
    padding: 8,
    paddingHorizontal: 40,
    //borderBottomWidth: 1,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 0.8,
    borderRadius: 4,
  },
  inputRegister: {
    marginHorizontal: 20,
    marginTop: 10,
    height: 45,
    fontSize: 14,
    backgroundColor: GLOBALS.COLOR.WHITE,
    // padding: 8,
    paddingHorizontal: 10,
    //borderBottomWidth: 1,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 0.8,
    borderRadius: 4,
  },
  submitButton: {
    padding: 10,
    margin: 20,
    height: 42,
    borderRadius: 4,
    backgroundColor: GLOBALS.COLOR.WHITE,
    // borderColor: GLOBALS.COLOR.THEAMCOLOR,
    // borderWidth: 1,
  },
  submitButtonText: {
    color: GLOBALS.COLOR.BLACK,
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

class ForgotScreen extends React.Component {
  static propTypes = {
    // children: t.node.isRequired,
    // visible: t.bool.isRequired,
    dismiss: t.func.isRequired,
    transparent: t.bool,
    animationType: t.string,
  };

  static defaultProps = {
    animationType: 'slide',
    transparent: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isProgress: false,
      UserLoginID: '',
      EmailID: '',
      MobileNo: '',
      Mac: '',
    };
  }

  async componentDidMount() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({ isConnected: state.isConnected });
      }
    });
  }

  handleUserLoginID = (text) => {
    this.setState({ UserLoginID: text });
  };
  handleMobileNo = (text) => {
    this.setState({ MobileNo: text });
  };
  forgotScreenNavigation() {
    //this.props.navigation.navigate('ForgotScreen');
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  async forgot(UserLoginID, MobileNo) {

    if (UserLoginID.length == 0 && MobileNo.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else {
      if (MobileNo.length < 10 && MobileNo.length > 0) {
        this.showAlert(
          GLOBALS.App_Name,
          'Please enter your valid Mobile Number.',
        );
      } else {
        this.forgotPassword(UserLoginID, MobileNo);
      }
    }
  };

  async forgotPassword(UserLoginID, MobileNo) {

    if (UserLoginID == "") {
      UserLoginID = '0';
    }

    this.setState({ isProgress: true });
    if (this.state.isConnected) {
      let Objdata = new Object();
      Objdata["LoginId"] = String(UserLoginID);
      Objdata["Number"] = MobileNo;
      Objdata["ClientId"] = String(GLOBALS.ClientID);

      fetch(GLOBALS.Terminal_BASE_URL + 'ForgotPasswardApp', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json; charset=utf-8;', // <-- Specifying the Content-Type
        }),
        body: "{'Obj':'" + JSON.stringify(Objdata) + "'}",
      })
        .then((response) => response.json())
        .then((responseJson) => {
          try {
            let Obj = JSON.parse(responseJson.d);
            console.log('respons :- ' + Obj);
            let result = JSON.parse(Obj.ReturnMsg);
            if (result[0]['Status'] == 1) {

              Alert.alert(
                GLOBALS.App_Name,
                result[0].Msg,
                [{ text: 'OK', onPress: () => this.props.dismiss() }],
                { cancelable: false },
              );

            } else {
              Alert.alert(
                GLOBALS.App_Name,
                result[0].Msg,
                [{ text: 'OK', onPress: () => this.props.dismiss() }],
                { cancelable: false },
              );
            }

          } catch (error) {
            console.log(error);
          }
          this.setState({ isProgress: false });
        })
        .catch((error) => {
          this.showAlert(GLOBALS.App_Name, 'Forgot Passward Fail');
          console.log(error);
          this.setState({ isProgress: false });
        });
    } else {
      this.showAlert(GLOBALS.App_Name, 'Please check internet connection...');
    }
  };

  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }
  render() {
    const { props } = this;
    return (
      <View>
        <Modal
          visible={props.visible}
          transparent={props.transparent}
          onRequestClose={props.dismiss}
          dismiss={props.dismiss}
          animationType={props.animationType}>
          <SafeAreaView
            style={[{ backgroundColor: GLOBALS.COLOR.HEADER_COLOR }]}
          />
          <View
            style={[
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
                Forgot
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.hideForgotModal();
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

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={[{ flex: 1 }]}>
            <DismissKeyboard>
            <ImageBackground
                style={[{ width: '100%', height: '100%'}]}
                imageStyle={{ resizeMode: 'stretch' }}
                source={require('../Images/bg.png')}>
              <View style={styles.container}>
                <View style={styles.containerView}>
                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        alignSelf: 'center',
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingVertical: 5,
                        paddingHorizontal: 12,
                        marginTop: 15,
                      },
                    ]}>
                    FORGOT
                  </Text>

                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    USER ID :
                  </Text>
                  <View>
                    <TextInput
                      style={styles.inputRegister}
                      ref="1"
                      value={this.state.UserLoginID}
                      placeholder="USER ID"
                      //keyboardType="phone-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleUserLoginID}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('2');
                      }}
                    />
                    {/* <Image
                      style={[
                        {
                          marginTop: 20,
                          marginLeft: 30,
                          resizeMode: 'contain',
                          position: 'absolute',
                          height: 25,
                          width: 25,
                          tintColor: GLOBALS.COLOR.YELLOW,
                        },
                      ]}
                      source={require('../Images/user.png')}
                    /> */}
                  </View>

                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        fontWeight: 'bold',
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 13,
                        marginLeft: 20,
                        marginTop: 15,
                      },
                    ]}>
                    MOBILE NUMBER :
                  </Text>

                  <View>
                    <TextInput
                      style={styles.inputRegister}
                      ref="2"
                      keyboardType="phone-pad"
                      value={this.state.MobileNo}
                      placeholder="MOBILE NUMBER"
                      maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleMobileNo}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                    />

                    {/* <Image
                      style={[
                        {
                          marginTop: 20,
                          marginLeft: 30,
                          resizeMode: 'contain',
                          position: 'absolute',
                          height: 25,
                          width: 22,
                          tintColor: GLOBALS.COLOR.YELLOW,
                        },
                      ]}
                      source={require('../Images/mail_box.png')}
                    /> */}
                  </View>

                  <View style={styles.submitButton}>
                    <TouchableOpacity
                      onPress={() =>
                        this.forgot(this.state.UserLoginID, this.state.MobileNo)
                      }>
                      <Text style={styles.submitButtonText}> SUBMIT </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.isProgress ? (
                  <View
                    style={{
                      position: 'absolute',
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CustumProgress />
                  </View>
                ) : null}

              </View>
              </ImageBackground>
            </DismissKeyboard>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

class RegistationScreen extends React.Component {
  static propTypes = {
    // children: t.node.isRequired,
    // visible: t.bool.isRequired,
    dismiss: t.func.isRequired,
    transparent: t.bool,
    animationType: t.string,
    msg: t.string,
  };

  static defaultProps = {
    animationType: 'slide',
    transparent: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isConnected: true,
      isProgress: false,
      UserLoginID: '',
      EmailID: '',
      Mac: '',
      name: '',
      contactNo: '',
      email: '',
      city: '',
      gst: '',
      Firmname: '',
    };
  }

  async componentDidMount() {
    NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        this.setState({ isConnected: state.isConnected });
      }
    });
  }

  handleName = (text) => {
    this.setState({ name: text });
  };
  handleContactNo = (text) => {
    this.setState({ contactNo: text });
  };
  handleEmail = (text) => {
    this.setState({ email: text });
  };
  handleCity = (text) => {
    this.setState({ city: text });
  };
  handleGST = (text) => {
    this.setState({ gst: text });
  };
  handleFirmName = (text) => {
    this.setState({ Firmname: text });
  };


  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  async Registation(name, firmname, contactNo, email, city, gst ) {
    // var idMac = DeviceInfo.getUniqueId();
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (name.length == 0 && firmname.length == 0 && contactNo.length == 0 ) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else if (name.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Name.');
    } else if (firmname.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Firm Name.');
    } else if (contactNo.length == 0) {
      this.showAlert(
        GLOBALS.App_Name,
        'Please enter your Contact Number.',
      );
    } else if (contactNo.length < 10) {
      this.showAlert(
        GLOBALS.App_Name,
        'Please enter your valid Contact Number.',
      );
    } else if (email.length > 0 && reg.test(String(email).toLowerCase()) === false) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your valid Email.');
    } 
     else {
      this.setState({ isProgress: true });
      if (this.state.isConnected) {

        let ObjAccount = new Object();
        ObjAccount["AccountId"] = 0;
        ObjAccount["Name"] = name;
        ObjAccount["Firmname"] = firmname;
        ObjAccount["Number"] = contactNo;
        ObjAccount["Email"] = email;
        ObjAccount["City"] = city;
        ObjAccount["GST"] = gst;
        ObjAccount["Flag"] = "New";
        ObjAccount["ClientId"] = String(GLOBALS.ClientID);

        fetch(GLOBALS.Terminal_BASE_URL + 'insertRegister', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json; charset=utf-8;', // <-- Specifying the Content-Type
          }),
          body: "{'Obj':'" + JSON.stringify(ObjAccount) + "'}",
        })
          .then((response) => response.json())
          .then((responseJson) => {
            try {
              let msg = JSON.parse(responseJson.d).ReturnMsg;
              // let clientid = JSON.parse(msg)[0].ClientId;
              let loginid = JSON.parse(msg)[0].LoginId;
              if (loginid > 0) {
                // alert('Register has been Successfully');

                Alert.alert(
                  GLOBALS.App_Name,
                  'Register has been Successfully',
                  [{ text: 'OK', onPress: () => this.props.dismiss() }],
                  { cancelable: false },
                );
              }

            } catch (error) {
              console.log(error);
            }
            this.setState({ isProgress: false });
          })
          .catch((error) => {
            this.showAlert(GLOBALS.App_Name, 'Register Fail');
            console.log(error);
            this.setState({ isProgress: false });
          });
      } else {
        this.showAlert(GLOBALS.App_Name, 'Please check internet connection...');
      }
    }
  };

  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }
  render() {
    const { props } = this;
    return (
      <View>
        <Modal
          visible={props.visible}
          transparent={props.transparent}
          onRequestClose={props.dismiss}
          dismiss={props.dismiss}
          animationType={props.animationType}>
          <SafeAreaView
            style={[{ backgroundColor: GLOBALS.COLOR.HEADER_COLOR }]}
          />
          <View
            style={[
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
                Registration
              </Text>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                this.props.hideForgotModal();
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

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={[{ flex: 1 }]}>
            <DismissKeyboard>
              <ImageBackground
              style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BLACK}]}
              imageStyle={{resizeMode: 'stretch'}}
              source={require('../Images/bg.png')}>
              <View style={styles.container}>
                <View style={styles.containerView}>
                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        alignSelf: 'center',
                        color: GLOBALS.COLOR.WHITE,
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingVertical: 5,
                        paddingHorizontal: 12,
                        marginTop: 15,
                      },
                    ]}>
                    REGISTRATION
                  </Text>

                  {/* <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    NAME :
                  </Text> */}
                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="1"
                      value={this.state.name}
                      placeholder="NAME"
                      //keyboardType="phone-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleName}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('2');
                      }}
                    />
                  </View>

                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="2"
                      value={this.state.Firmname}
                      placeholder="FIRM NAME"
                      //keyboardType="phone-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleFirmName}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('3');
                      }}
                    />
                  </View>

                  {/* <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    CONTACT NUMBER :
                  </Text> */}
                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="3"
                      value={this.state.contactNo}
                      placeholder="CONTACT NUMBER"
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleContactNo}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('4');
                      }}
                    />

                  </View>

                  {/* <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        fontWeight: 'bold',
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        marginLeft: 20,
                        marginTop: 15,
                      },
                    ]}>
                    EMAIL ID :
                  </Text> */}

                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="4"
                      keyboardType="email-address"
                      value={this.state.email}
                      placeholder="EMAIL ID (optional)"
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleEmail}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('5');
                      }}
                    />


                  </View>

                  {/* <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    CITY :
                  </Text> */}
                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="5"
                      value={this.state.city}
                      placeholder="CITY(optional)"
                      //keyboardType="phone-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleCity}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('6');
                      }}
                    />

                  </View>

                  {/* <Text
                    style={[
                      {
                        flexDirection: 'row',
                        height: 15,
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        fontWeight: 'bold',
                        marginLeft: 20,
                      },
                    ]}>
                    GST NUMBER :
                  </Text> */}
                  <View>
                    <TextInput
                      selectionColor={'black'}
                      style={styles.inputRegister}
                      ref="6"
                      value={this.state.gst}
                      placeholder="GST NUMBER (optional)"
                      //keyboardType="phone-pad"
                      //maxLength={10}
                      placeholderTextColor={GLOBALS.COLOR.DARKGRAY_THEAM}
                      autoCapitalize="none"
                      onChangeText={this.handleGST}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                    // onSubmitEditing={() => {
                    //   this._focusNextField('2');
                    // }}
                    />

                  </View>

                  <View
                    style={styles.submitButton}>
                    <TouchableOpacity
                      onPress={() =>
                        this.Registation(this.state.name, this.state.Firmname, this.state.contactNo, this.state.email, this.state.city, this.state.gst)
                      }>
                      <Text style={styles.submitButtonText}> SUBMIT </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.isProgress ? (
                  <View
                    style={{
                      position: 'absolute',
                      flex: 1,
                      width: '100%',
                      height: '100%',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CustumProgress />
                  </View>
                ) : null}

              </View>
              </ImageBackground>
            </DismissKeyboard>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}