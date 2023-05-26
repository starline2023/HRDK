/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Linking,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Platform,
  TouchableWithoutFeedback,
  NativeAppEventEmitter,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import {ScrollView} from 'react-native-gesture-handler';
import {Keyboard} from 'react-native';
import CustumProgress from '../UtilityClass/CustumProgress';
import LinearGradient from 'react-native-linear-gradient';

export default class ContactScreen extends React.Component {
  constructor() {
    super();
    console.warn();

    this.state = {
      isLoging: true,
      isFeedBack: false,
      BookingNumberList: '',
      isConnected: true,
      toScroll: true,
      Name: '',
      Mobile: '',
      Email: '',
      Subject: '',
      Message: '',
      text: '',
      height: 0,

      OfficeAddress1: '',
      OfficeAddress2: '',
      OfficeAddress3: '',
      Email1: '',
      Email2: '',
      BookingNo1: '',
      BookingNo2: '',
      BookingNo3: '',
      BookingNo4: '',
      BookingNo5: '',
      BookingNo6: '',
      BookingNo7: '',
    };
  }

  componentDidMount() {

    this.setState({
      isLoging: true,
    });

    this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', params =>
      this.handleEvent(params),
    );
  }
  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
  }
  stringRemoveSpace = (str) => {
    str=str.replace(" ","");
    str=str.replace("-","");
    str=str.replace("(","");
    str=str.replace(")","");
    return str
  }
  handleEvent = () => {
    let C_Detaild = GLOBALS.ContactDetail;

    if (C_Detaild != '') {

      this.setState({OfficeAddress1: C_Detaild.Address_client});
      this.setState({OfficeAddress2: C_Detaild.Address_client2});
      this.setState({OfficeAddress3: C_Detaild.Address_client3});
      this.setState({Email1: C_Detaild.Email1});
      this.setState({Email2: C_Detaild.Email2});
      this.setState({BookingNo1: C_Detaild.BookingNo1});
      this.setState({BookingNo2: C_Detaild.BookingNo2});
      this.setState({BookingNo3: C_Detaild.BookingNo3});
      this.setState({BookingNo4: C_Detaild.BookingNo4});
      this.setState({BookingNo5: C_Detaild.BookingNo5});
      this.setState({BookingNo6: C_Detaild.BookingNo6});
      this.setState({BookingNo7: C_Detaild.BookingNo7});
    }

    this.setState({
      isLoging: false,
    });
  };

  renderItemAdress(data) {
    let {item} = data;
    if (item != '0') {
      return (
        <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}]}>
          <Text
            style={[
              {
                fontSize: 16,
                marginHorizontal: 10,
                textAlign: 'center',
                marginBottom: 10,
              },
            ]}>
            {item}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
  }
  renderItemEmail(data) {
    let {item} = data;
    var r = /\d+/;
    if (item != '0') {
      return (
        <View style={[{flexDirection: 'row', justifyContent: 'flex-start'}]}>
          <Text
            style={[{fontSize: 15, marginLeft: 3}]}
            onPress={() => {
              Linking.openURL('tmailto:' + item.match(r));
            }}>
            {item}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
  renderItemContactUS(data) {
    let {item} = data;

    var r = /\d+/;

    if (item != '0') {
      return (
        <View
          style={[
            {flexDirection: 'row', justifyContent: 'flex-start', marginTop: 10},
          ]}>
          <Image
            style={[
              {
                width: 18,
                height: 20,
                resizeMode: 'contain',
                tintColor: 'black',
                marginRight: 6,
              },
            ]}
            source={require('../Images/ic_call.png')}
          />
          <Text
            style={[{fontSize: 15}]}
            onPress={() => {
              Linking.openURL('tel:' + item.match(r));
            }}>
            {item}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  handleName = text => {
    this.setState({Name: text});
  };
  handleMobile = text => {
    this.setState({Mobile: text});
  };
  handleEmail = text => {
    this.setState({Email: text});
  };
  handleSubject = text => {
    this.setState({Subject: text});
  };
  handleMessage = text => {
    this.setState({Message: text});
  };

  login = (Name, Mobile, Email, Subject, Message) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    // var idMac = DeviceInfo.getUniqueID();
    if (
      Name.length == 0 &&
      Mobile.length == 0 &&
      Email.length == 0 &&
      // Subject.length == 0 &&
      Message.length == 0
    ) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your information.');
    } else if (Name.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Name.');
    } else if (Mobile.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Phone Number.');
    } else if (Mobile.length < 10) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your valid Phone Number.');
    } else if (Email.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Email.');
    } else if (reg.test(String(Email).toLowerCase()) === false) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your valid Email id.');
    } else if (Message.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter your Message.');
    } else {
      
      this.setState({
        isFeedBack: true,
      });

      if (this.state.isConnected) {
        let Obj = new Object();
        (Obj = JSON.stringify({
          Name: Name,
          Email: Email,
          Phone: Mobile,
          Sub: Subject,
          Message: Message,
          Client: GLOBALS.ClientID,
        })),        
        
          fetch(GLOBALS.BASE_URL + 'Feedback', {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
            }),

            body: JSON.stringify({
              Obj: Obj,
            }),
          })
            .then(response => response.text())
            .then(responseText => {
              var str = JSON.parse(responseText);

              let responOK = str.d;
              if (responOK.length > 0) {
                this.clearText('11');
                this.clearText('12');
                this.clearText('13');
                this.clearText('14');
                this.clearText('15');                

                this.setState({
                  Name: '',
                  Mobile: '',
                  Email: '',
                  Subject: '',
                  Message: '',
                });                

                this.showAlert(
                  GLOBALS.App_Name,
                  'Thank You For Valuable Feedback.',
                );
                this.setState({isFeedBack: false});
              } else {
                this.showAlert(GLOBALS.App_Name, 'Feedback Save Fail');
              }

              this.setState({
                isFeedBack: false,
              });
            })
            .catch(error => {
              console.error(error);
              this.setState({
                isFeedBack: false,
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
    if (this.state.isLoging) {
      return <CustumProgress />;
    } else {
      return (
        <KeyboardAvoidingView
          style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={100}>
          <DismissKeyboard>
            <ScrollView>
              <View style={[{flex: 1}]}>
                {/* Address */}
                {this.state.OfficeAddress1 !=null && this.state.OfficeAddress1 !=""  && this.state.OfficeAddress1 !=" " ||
                this.state.OfficeAddress2 !=null && this.state.OfficeAddress2 !="" && this.state.OfficeAddress2 !=" " ||
                this.state.OfficeAddress3 !=null && this.state.OfficeAddress3 !="" && this.state.OfficeAddress3 !=" " ? (
                  <View
                    style={[
                      {margin: 10, flexDirection: 'column', marginTop: 10},
                    ]}>
                    <View
                      style={[
                        {
                          flexDirection: 'column',
                          backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
                          borderColor: 'gray',
                          borderRadius: 4,
                          borderWidth: 0.6,

                          // shadowColor: GLOBALS.COLOR.BLACK,
                          // shadowOpacity: 0.4,
                          // shadowRadius: 3.0,
                          // shadowOffset: {height: 0, width: 0},
                          // elevation: 3,
                        },
                      ]}>
                      <Image
                        style={[
                          {
                            alignSelf: 'center',
                            marginTop: 10,
                            height: 62,
                            width: 62,
                            resizeMode: 'contain',
                            tintColor: GLOBALS.COLOR.BLUE,
                          },
                        ]}
                        source={require('../Images/map.png')}
                      />
                        {this.setAddressOffice(this.state.OfficeAddress1)}
                        {this.setAddressOffice(this.state.OfficeAddress2)}
                        {this.setAddressOffice(this.state.OfficeAddress3)}
                       
                    </View>
                  </View>
                ) : null}

                {/* Email */}
                {this.state.Email1 !=null && this.state.Email1 !="" && this.state.Email1 !=" "  ||
                this.state.Email2 !=null && this.state.Email2 !="" && this.state.Email2 !=" " ? (
                  <View
                    style={[
                      {margin: 10, flexDirection: 'column', marginTop: 5},
                    ]}>
                    <View
                      style={[
                        {
                          flexDirection: 'column',
                          backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
                          borderColor: 'gray',
                          borderRadius: 4,
                          borderWidth: 0.6,

                          // shadowColor: GLOBALS.COLOR.BLACK,
                          // shadowOpacity: 0.4,
                          // shadowRadius: 3.0,
                          // shadowOffset: {height: 0, width: 0},
                          // elevation: 3,
                        },
                      ]}>
                      <Image
                        style={[
                          {
                            alignSelf: 'center',
                            marginTop: 10,
                            height: 50,
                            width: 50,
                            resizeMode: 'contain',
                            tintColor: GLOBALS.COLOR.BLUE,
                          },
                        ]}
                        source={require('../Images/mail.png')}
                      />

                      <View style={[{flexDirection: 'column', marginRight: 5}]}>
                        <Text
                          style={[
                            {
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginBottom: 5,
                              marginTop: 5,
                              color: GLOBALS.COLOR.BLUE,
                              textAlign: 'center',
                            },
                          ]}>
                          EMAIL
                        </Text>
                        <View style={[{flexDirection: 'column'}]}>
                          {this.state.Email1 != null && this.state.Email1 != "" && this.state.Email1 != " " ? (
                            <Text
                              style={[
                                {
                                  fontSize: 16,
                                  marginHorizontal: 10,
                                  textAlign: 'center',
                                  marginBottom: 10,
                                  color: GLOBALS.COLOR.BLACK,
                                },
                              ]}
                              onPress={() => {
                                Linking.openURL(
                                  'mailto:',
                                  this.state.Email1.match(/\d+/) +
                                    '?subject=&body=',
                                );
                              }}>
                              {this.state.Email1}
                            </Text>
                          ) : null}
                          {this.state.Email2 != null && this.state.Email2 != "" && this.state.Email2 != " " ? (
                            <Text
                              style={[
                                {
                                  fontSize: 16,
                                  marginHorizontal: 10,
                                  textAlign: 'center',
                                  marginBottom: 5,
                                  color: GLOBALS.COLOR.BLACK,
                                },
                              ]}
                              onPress={() => {
                                Linking.openURL(
                                  'mailto:',
                                  this.state.Email2.match(/\d+/) +
                                    '?subject=&body=',
                                );
                              }}>
                              {this.state.Email2}
                            </Text>
                          ) : null}
                        </View>
                        <View style={[{height: 10}]} />
                      </View>
                    </View>
                  </View>
                ) : null}

                {/* Booking Number */}
                {this.state.BookingNo1 !=null && this.state.BookingNo1 !="" && this.state.BookingNo1 !=" "  ||
                this.state.BookingNo2 !=null && this.state.BookingNo2 !="" && this.state.BookingNo2 !=" "||
                this.state.BookingNo3 !=null && this.state.BookingNo3 !="" && this.state.BookingNo3 !=" " ||
                this.state.BookingNo4 !=null && this.state.BookingNo4 !="" && this.state.BookingNo4 !=" " ||
                this.state.BookingNo5 !=null && this.state.BookingNo5 !="" && this.state.BookingNo5 !=" " || 
                this.state.BookingNo6 !=null && this.state.BookingNo6 !="" && this.state.BookingNo6 !=" " ||
                this.state.BookingNo7 !=null && this.state.BookingNo7 !="" && this.state.BookingNo7 !=" " ? (
                  <View style={[{margin: 10, flexDirection: 'column',marginTop:5}]}>
                    <View
                      style={[
                        {
                          flexDirection: 'column',
                          backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
                          borderColor: 'gray',
                          borderRadius: 4,
                          borderWidth: 0.6,

                          // shadowColor: GLOBALS.COLOR.BLACK,
                          // shadowOpacity: 0.4,
                          // shadowRadius: 3.0,
                          // shadowOffset: {height: 0, width: 0},
                          // elevation: 3,
                        },
                      ]}>
                      <Image
                        style={[
                          {
                            alignSelf: 'center',
                            marginTop: 10,
                            height: 50,
                            width: 50,
                            justifyContent: 'center',
                            resizeMode: 'contain',
                            tintColor: GLOBALS.COLOR.BLUE,
                          },
                        ]}
                        source={require('../Images/call.png')}
                      />

                      <View style={[{flexDirection: 'column', marginRight: 5}]}>
                        <Text
                          style={[
                            {
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginBottom: 5,
                              marginTop: 5,
                              color: GLOBALS.COLOR.BLUE,
                              textAlign: 'center',
                            },
                          ]}>
                          BOOKING NUMBER
                        </Text>
                        <View style={[{flexDirection: 'column'}]}>
                         {/* booking no */}
                            {this.setBookingNumber(this.state.BookingNo1)}
                            {this.setBookingNumber(this.state.BookingNo2)}
                            {this.setBookingNumber(this.state.BookingNo3)}
                            {this.setBookingNumber(this.state.BookingNo4)}
                            {this.setBookingNumber(this.state.BookingNo5)}
                            {this.setBookingNumber(this.state.BookingNo6)}
                            {this.setBookingNumber(this.state.BookingNo7)}
                        </View>
                        <View style={[{height: 10}]} />
                      </View>
                    </View>
                  </View>
                ) : null}
              </View>

              {/* ContactUS */}
              {this.state.BookingNumberList.length > 0 ? (
                <View
                  style={[{margin: 10, flexDirection: 'column', marginTop: 5}]}>
                  <View
                    style={[
                      {
                        flexDirection: 'column',
                        backgroundColor: GLOBALS.COLOR.WHITE,
                        borderColor: GLOBALS.COLOR.BORDER_COLOR,
                        borderRadius: 4,
                        borderWidth: 1.0,

                        // shadowColor: GLOBALS.COLOR.BLACK,
                        // shadowOpacity: 0.4,
                        // shadowRadius: 3.0,
                        // shadowOffset: {height: 0, width: 0},
                        // elevation: 3,
                      },
                    ]}>
                    <Image
                      color={'red'}
                      style={[
                        {
                          alignSelf: 'center',
                          height: 70,
                          width: 70,
                          justifyContent: 'center',
                          resizeMode: 'contain',
                          tintColor: GLOBALS.COLOR.THEAMCOLOR,
                        },
                      ]}
                      source={require('../Images/call.png')}
                    />

                    <View style={[{flexDirection: 'column', marginRight: 5}]}>
                      <Text
                        style={[
                          {
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginVertical: 5,
                            textAlign: 'center',
                            color: GLOBALS.COLOR.THEAMCOLOR,
                          },
                        ]}>
                        CONTACT US
                      </Text>

                      <FlatList
                        bounces={false}
                        alignItems="center"
                        keyExtractor={this._keyExtractor}
                        data={this.state.BookingNumberList}
                        renderItem={this.renderItemContactUS.bind(this)}
                      />
                      <View style={[{height: 10}]} />
                    </View>
                  </View>
                </View>
              ) : null}

              {/* Feedback */}

              <View style={styles.containerView}>
                <Text
                  style={[
                    {
                      flexDirection: 'row',
                      alignSelf: 'center',
                      color: GLOBALS.COLOR.BLUE,
                      fontSize: 24,
                      marginTop: 20,
                      fontWeight: 'bold',
                    },
                  ]}>
                  FEEDBACK FORM
                </Text>

                <Text
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: -12,
                      color: 'darkgray',
                      marginTop: 7,
                    },
                  ]}>
                  Name *
                </Text>
                <TextInput
                  style={styles.input}
                  ref="11"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Please enter your name"
                  placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                  autoCapitalize="words"
                  onChangeText={this.handleName}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this._focusNextField('12');
                  }}
                />
                <Text
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: -12,
                      color: 'darkgray',
                      marginTop: 7,
                    },
                  ]}>
                  Phone *
                </Text>
                <TextInput
                  style={styles.input}
                  ref="12"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Please enter your phone"
                  placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                  autoCapitalize="none"
                  onChangeText={this.handleMobile}
                  returnKeyType={'next'}
                  keyboardType="phone-pad"
                  maxLength={10}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this._focusNextField('13');
                  }}
                />
                <Text
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: -12,
                      color: 'darkgray',
                      marginTop: 7,
                    },
                  ]}>
                  Email *
                </Text>
                <TextInput
                  style={styles.input}
                  ref="13"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Please enter your email"
                  placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                  autoCapitalize="none"
                  onChangeText={this.handleEmail}
                  returnKeyType={'next'}
                  keyboardType="email-address"
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this._focusNextField('14');
                  }}
                />
                <Text
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: -12,
                      color: 'darkgray',
                      marginTop: 7,
                    },
                  ]}>
                  Subject
                </Text>
                <TextInput
                  style={styles.input}
                  ref="14"
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Please enter your subject"
                  placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                  autoCapitalize="words"
                  onChangeText={this.handleSubject}
                  returnKeyType={'next'}
                  blurOnSubmit={false}
                  onSubmitEditing={() => {
                    this._focusNextField('15');
                  }}
                />
                <Text
                  style={[
                    {
                      marginHorizontal: 20,
                      marginBottom: -12,
                      color: 'darkgray',
                      marginTop: 7,
                    },
                  ]}>
                  Message *
                </Text>
                <TextInput
                  style={styles.input}
                  ref="15"
                  autoCorrect={false}
                  // multiline
                  underlineColorAndroid="transparent"
                  placeholder="Message for me"
                  placeholderTextColor={GLOBALS.COLOR.DARKGRAY}
                  autoCapitalize="words"
                  onChangeText={this.handleMessage}
                  returnKeyType={'done'}
                  blurOnSubmit={true}
                  // onContentSizeChange={event => {
                  //   this.setState({
                  //     height: event.nativeEvent.contentSize.height,
                  //   });
                  // }}
                  value={this.state.Message}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                />
                <LinearGradient
            colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
                  style = {styles.submitButton} >
                
                  <TouchableOpacity 
                      style={{
                        height:'100%',
                        width:'100%',
                      }}

                    onPress={() =>
                      this.login(
                        this.state.Name,
                        this.state.Mobile,
                        this.state.Email,
                        this.state.Subject,
                        this.state.Message,
                      )}>
                    <Text style={styles.submitButtonText}>SUBMIT</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>

              <View style={[{height: 10}]} />
              {/* {this.state.isFeedBack == true ? <CustumProgress /> : null} */}
            </ScrollView>
          </DismissKeyboard>
        </KeyboardAvoidingView>
      );
    }
  }
  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  setAddressOffice(addres_office){
    if (addres_office == '0' || addres_office == '' || addres_office == ' ' || addres_office == undefined) {return}
    return(

      <View style={[{flexDirection: 'column', marginRight: 5}]}>
                        <Text
                          style={[
                            {
                              fontSize: 18,
                              fontWeight: 'bold',
                              marginBottom: 5,
                              marginTop: 5,
                              color: GLOBALS.COLOR.BLUE,
                              textAlign: 'center',
                            },
                          ]}>
                          ADDRESS
                        </Text>
                        
                          <View style={[{flexDirection: 'row', alignSelf: 'center'}]}>
                                <Text
                                  style={[
                                    {
                                      fontSize: 16,
                                      marginHorizontal: 10,
                                      textAlign: 'center',
                                      marginBottom: 10,
                                      color: GLOBALS.COLOR.BLACK,
                                    },
                                  ]}>
                                  {addres_office}
                                </Text>
                          </View>
              <View style={[{height: 10}]} />
            </View>
     
    )
  }
  setBookingNumber(Booking_No) {
    
    if (Booking_No == '0' || Booking_No == '' || Booking_No == ' ' || Booking_No == undefined) {return}
    
    return( 
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
            source={require('../Images/ic_call.png')}
          />
          <Text
            style={{fontSize: 14, marginLeft: 5, color: GLOBALS.COLOR.BLACK,}}
            onPress={() => {
              Linking.openURL('tel:' + this.stringRemoveSpace(Booking_No).match(/\d+/));
            }}>
            {Booking_No}
          </Text>
        </View>
        )
  }
}

const DismissKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: GLOBALS.COLOR.WHITE,
  },
  containerView: {
    flexDirection: 'column',
    marginTop: 5,
    justifyContent: 'center',
    marginHorizontal: 10,
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 0.6,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,

    // shadowColor: GLOBALS.COLOR.BLACK,
    // shadowOpacity: 0.4,
    // shadowRadius: 3.0,
    // shadowOffset: {height: 0, width: 0},
    // elevation: 3,
  },
  input: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 40,
    borderWidth: 1.0,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.YELLOW,
    backgroundColor: GLOBALS.COLOR.WHITE,
    padding: 10,
  },
  inputMessage: {
    marginHorizontal: 20,
    marginTop: 15,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#D3D3D3',
    backgroundColor: '#EDF0F5',
    padding: 5,
  },
  submitButton: {
    // padding: 10,
    margin: 20,
    height: 40,
    borderRadius: 4,
    backgroundColor: GLOBALS.COLOR.BLUE,
    borderColor:GLOBALS.COLOR.THEAMCOLOR,
    borderWidth:1,

    // shadowColor:'black',
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
    // shadowOffset: {height: 0, width: 0},
    // elevation: 2,

    // shadowColor: GLOBALS.COLOR.BLACK,
    // shadowOpacity: 0.4,
    // shadowRadius: 3.0,
    // shadowOffset: {height: 0, width: 0},
    // elevation: 3,
  },
  submitButtonText: {
    height:40,
    color: GLOBALS.COLOR.WHITE,
    // backgroundColor:'red',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 15,
    fontWeight:'bold',
    marginTop:10,
    //  delayLongPress:500,
  },
  LogOutButton: {
    color: GLOBALS.COLOR.TEXT_COLOR,
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
