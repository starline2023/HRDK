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
  Alert,
  TouchableWithoutFeedback,
  Modal,
  ImageBackground,
  NativeAppEventEmitter,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import t from 'prop-types';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import DeviceInfo from 'react-native-device-info';
export const USER_KEY = 'isLogin';
import CustumProgress from '../UtilityClass/CustumProgress';
import AsyncStorage from '@react-native-community/async-storage';

class ClientRegistration extends React.Component {
  static propTypes = {
    // children: t.node.isRequired,
    visible: t.bool.isRequired,
    dismiss: t.func.isRequired,
    transparent: t.bool,
    animationType: t.string,
  };

  static defaultProps = {
    animationType: 'none',
    transparent: false,
  };

  componentDidMount() {
    NetInfo.addEventListener(state => {
      //console.log('Connection type', state.type);
      //console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.setState({isConnected: state.isConnected});
      }
    });
  }

  constructor(props) {
    super(props);
    console.warn();
  }

  state = {
    isConnected: true,
    isLoging: false,
    Name: '',
    FirmName: '',
    Mobile: '',
    City: '',
    Mac: '',
  };

  handleName = text => {
    this.setState({Name: text});
  };
  handleFirmName = text => {
    this.setState({FirmName: text});
  };
  handleMobile = text => {
    this.setState({Mobile: text});
  };
  handleCity = text => {
    this.setState({City: text});
  };

  async setValue() {
    AsyncStorage.setItem(USER_KEY, 'false');
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  login = (Name, FirmName, Mobile, City) => {
    // var idMac = DeviceInfo.getUniqueId();

    if (
      Name.length == 0 &&
      FirmName.length == 0 &&
      Mobile.length == 0 &&
      City.length == 0
    ) {
      alert('Please enter your information');
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else if (Name.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Name.');
    } else if (FirmName.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Firm Name.');
    } else if (Mobile.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Mobile Number.');
    } else if (Mobile.length < 10) {
      this.showAlert(
        GLOBALS.App_Name,
        'Please enter your valid Mobile Number.',
      );
    } else if (City.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your City.');
    } else {
      this.setState({
        isLoging: true,
      });
      if (this.state.isConnected) {
        // let Obj = new Object();
        // (Obj = JSON.stringify([
        //   {
        //     CleintId: GLOBALS.ClientID.toString(),
        //     Name: Name,
        //     FirmName: FirmName,
        //     City: City,
        //     ContactNo: Mobile,
        //   },
        // ])),
        //   console.log('Obj', Obj);

        fetch(GLOBALS.BASE_URL + 'InsertOtr', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json; charset=utf-8;', // <-- Specifying the Content-Type
          }),

          body:
            "{'ClientDetails':'" +
            JSON.stringify([
              {
                ClientId: GLOBALS.ClientID.toString(),
                Name: Name,
                FirmName: FirmName,
                City: City,
                ContactNo: Mobile,
              },
            ]) +
            "'}",
        })
          .then(response => response.json())
          .then(responseJson => {            
            try {
              var str = JSON.parse(responseJson.d);
              console.log('OTR', str);
              
              if (str != 0) {
                this.setValue();
                if (Platform.OS == 'android') {
                  NativeAppEventEmitter.emit('AndroidTutorialEventKey');
                }
                this.setState({isLogin: 'false'});
                this.props.dismiss();
              } else {
                alert('Registration Fail');
              }

              this.setState({
                isLoging: false,
              });
            } catch (error) {}
          })
          .catch(error => {
            console.error(error);
            this.setState({
              isLoging: false,
            });
          });
      } else {
        alert('Please check internet connection...');
      }
    }
  };

  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }
  render() {
    const {props} = this;
    return (
      <View>      
        <Modal
          visible={props.visible}
          transparent={props.transparent}
          //onRequestClose={props.dismiss}
          dismiss={props.dismiss}
          animationType={props.animationType}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={[{flex: 1, backgroundColor: GLOBALS.COLOR.THEAMCOLOR}]}>
              {/* <ImageBackground
                style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BLACK}]}
                imageStyle={{resizeMode: 'stretch'}}
                source={require('../Images/bg.png')}> */}
            <DismissKeyboard>
              
                <View style={styles.container}>
                  <View style={styles.containerView}>
                    <Image
                      style={[
                        {
                          alignSelf: 'center',
                          height: 140,
                          width: 170,
                          // marginTop: 25,
                          resizeMode: 'contain',
                        },
                      ]}
                      source={require('../Images/OtrLogo.png')}
                    />
                    <View
                    style={{
                      flexDirection: 'row',
                      borderRadius:22,
                      marginBottom:10,
                      marginHorizontal: 20,
                      flexDirection: 'row',
                      backgroundColor:GLOBALS.COLOR.YELLOW,
                      alignSelf: 'center',
                      // marginVertical:0,
                    }}
                      >
                    
                  <Text
                    style={[
                      {
                        flexDirection: 'row',
                        flex:1,
                        textAlign:'center',
                        alignSelf: 'center',
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 18,
                        paddingVertical: 10,
                        // paddingHorizontal: 20,
                        fontWeight: 'bold',
                      },
                    ]}>
                    ONE TIME REGISTRATION
                  </Text>
                  </View>

                    <TextInput
                      style={styles.input}
                      ref="1"
                      placeholder="Name"
                      autoCapitalize="words"
                      placeholderTextColor="grey"
                      autoCapitalize="none"
                      onChangeText={this.handleName}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('2');
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      ref="2"
                      placeholder="Firm Name"
                      autoCapitalize="words"
                      placeholderTextColor="grey"
                      autoCapitalize="none"
                      onChangeText={this.handleFirmName}
                      returnKeyType={'next'}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('3');
                      }}
                    />
                    <TextInput
                      style={styles.input}
                      ref="3"
                      placeholder="Mobile Number"
                      placeholderTextColor="grey"
                      autoCapitalize="none"
                      onChangeText={this.handleMobile}
                      returnKeyType={'next'}
                      keyboardType="phone-pad"
                      maxLength={10}
                      blurOnSubmit={false}
                      onSubmitEditing={() => {
                        this._focusNextField('4');
                      }}
                    />

                    <TextInput
                      style={styles.input}
                      ref="4"
                      placeholder="City"
                      autoCapitalize="words"
                      placeholderTextColor="grey"
                      autoCapitalize="none"
                      onChangeText={this.handleCity}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                      onSubmitEditing={() => {
                        Keyboard.dismiss();
                      }}
                    />

                  {/* <LinearGradient 
                    colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                    start={{ x: 0, y: 0}} 
                    end={{x: 0, y: 1}} 
                    style={styles.submitButton}> */}
                    <View style={styles.submitButton}>
                      <TouchableOpacity
                        onPress={() =>
                          this.login(
                            this.state.Name,
                            this.state.FirmName,
                            this.state.Mobile,
                            this.state.City,
                          )
                        }>
                        <Text style={styles.submitButtonText}> REGISTER </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {this.state.isLoging ? (
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
             
            </DismissKeyboard>
            {/* </ImageBackground> */}
          </KeyboardAvoidingView>
        </Modal>        
      </View>
    );
  }
}

const DismissKeyboard = ({children}) => (
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },
  containerView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: GLOBALS.COLOR.THEAMCOLOR,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: GLOBALS.COLOR.YELLOW,
  },
  input: {
    marginHorizontal: 20,
    marginTop: 10,
    height: 40,
    color: GLOBALS.COLOR.BLACK,
    fontSize: 16,
    backgroundColor: GLOBALS.COLOR.WHITE,
    padding: 8,

    borderWidth: 0.5,
    borderColor: GLOBALS.COLOR.YELLOW,    
    borderRadius:4,
  },
  submitButton: {
    padding: 10,
    margin: 20,
    height: 42,
    borderRadius: 4,
    backgroundColor: GLOBALS.COLOR.YELLOW,

    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {height: 0, width: 0},
    elevation: 2,
  },
  submitButtonText: {
    color: GLOBALS.COLOR.BLACK,
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default ClientRegistration;