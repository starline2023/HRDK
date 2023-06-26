import React from "react";
import {
  StyleSheet,
  NativeAppEventEmitter,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ImageBackground,
} from "react-native";
import GLOBALS from "../UtilityClass/Globals";
import CustumProgress from "../UtilityClass/CustumProgress";
import MarqueeBottom from "../UtilityClass/MarqueeBottom";
import MarqueeTop from "../UtilityClass/MarqueeTop";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
import PreferenceGlobals from "../UtilityClass/PreferenceGlobals";
import { NavigationActions } from "react-navigation";
import NavigationService from "../NavigationService";

export default class UpdatesScreen extends React.Component {
  constructor() {
    super();
    console.warn();

    this.state = {
      isProgress: false,
      UserData: "",
      GroupDataSymbol: "",
      isConnected: true,
      GSTNumber: "",
      Password: "",
      isCheckAdvanceMode: "",
      Marque: "",
      Marque_Bottom: "",
    };

    this.eventListener = NativeAppEventEmitter.addListener(
      "eventKeyUserAccountDetail",
      (params) => this.handleEventUserAccountDetail(params)
    );
  }

  handleEventUserAccountDetail(e) {
    let UserData = GLOBALS.SettingUserAccountDetail;
    if (UserData != "") {
      if (UserData["LoginId"] !== undefined) {
        this.setState({ UserData: UserData });
      }
    }
    let Group = GLOBALS.SettingGroup;
    if (Group != "") {
      this.setState({ GroupDataSymbol: Group });
    }
  }

  async componentDidMount() {
    this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener(
      "eventKey",
      (params) => this.handleEvent(params)
    );
    this.handleEventUserAccountDetail();
  }

  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
  }

  handleEvent = () => {
    let C_Detaild = GLOBALS.ContactDetail;

    if (C_Detaild != "") {
      this.setState({ Marque: C_Detaild.Marquee });
      this.setState({ Marque_Bottom: C_Detaild.Marquee2 });
    }
  };

  handleGSTNo = (text) => {
    this.setState({ GSTNumber: text });
  };

  handlePassword = (text) => {
    this.setState({ Password: text });
  };

  passwordEvent = (password) => {
    if (password.length == 0) {
      Alert.alert(
        GLOBALS.App_Name,
        "Please enter password",
        [
          {
            text: "OK",
            onPress: () => console.log("NO Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
      return;
    }

    this.setState({ isProgress: true });
    let objUpdatePassword = new Object();
    objUpdatePassword["ClientId"] = GLOBALS.ClientID;
    objUpdatePassword["loginid"] = parseInt(GLOBALS.Client_LoginID);
    objUpdatePassword["Password"] = password;

    fetch(GLOBALS.Terminal_BASE_URL + "UpdatePassword", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8", // <-- Specifying the Content-Type
      }),
      body: JSON.stringify(objUpdatePassword),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        try {
          if (responseJson.d != "") {
            if (parseInt(responseJson.d) > 0) {
              Alert.alert(
                GLOBALS.App_Name,
                "Your password has been changed successfully! Thank you",
                [
                  {
                    text: "OK",
                    onPress: () => console.log("NO Pressed"),
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            } else {
              alert("somethig went wrong");
            }
          } else {
            alert("somethig went wrong");
          }

          this.setState({ isProgress: false });
        } catch (error) {
          console.log("error", error);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  deleteAccount = () => {
    Alert.alert(
      GLOBALS.App_Name,
      "Are you sure you want to delete your account ?",
      [
        {
          text: "NO",
          onPress: () => console.log("NO Pressed"),
          style: "cancel",
        },
        {
          text: "YES",
          onPress: () => this.deleteAccountEvent(),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  deleteAccountEvent = () => {
    this.setState({ isProgress: true });
    let objDeleteAccount = new Object();
    objDeleteAccount["ClientId"] = GLOBALS.ClientID;
    objDeleteAccount["LoginId"] = parseInt(GLOBALS.Client_LoginID);

    fetch(GLOBALS.BASE_URL + "deleteAccountByMobile", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json; charset=utf-8", // <-- Specifying the Content-Type
      }),
      body: "{'Obj':'" + JSON.stringify(objDeleteAccount) + "'}",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        try {
          if (responseJson.d != "") {
            let data = JSON.parse(responseJson.d);

            if (parseInt(data[0]["ERROR_CODE"]) == 200) {
              Alert.alert(
                GLOBALS.App_Name,
                "Your account has been delete successfully! Thank you",
                [
                  {
                    text: "OK",
                    onPress: () => this._signOutAsync(),
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            } else {
              alert("somethig went wrong");
            }
          } else {
            alert("somethig went wrong");
          }

          this.setState({ isProgress: false });
        } catch (error) {
          console.log("error", error);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  _signOutAsync = async () => {
    await PreferenceGlobals.setisLogin(false);
    await PreferenceGlobals.setUserLoginDetail(null);
    GLOBALS.isLoginTerminal = false;
    GLOBALS.THIs_CLass_Side_Menu.props.navigation.navigate("TabBarBullion");
    NavigationService.navigate("LIVE RATE");
    GLOBALS.SelectedItem = 0;
    NativeAppEventEmitter.emit("eventKeyLogOut");
  };

  navigateToScreen = (route) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
  };

  navigateToTabBar = (route, isLoginScreenOpen) => {
    this.navigateToScreen("TabBarBullion");
    NavigationService.navigate(route, {
      isLogin: this.state.isLoginLogout,
      isLoginScreenOpen: isLoginScreenOpen,
    });
  };

  renderHeader() {
    return (
      <View style={styles.itemHeader}>
        <View style={[{ alignItems: "center", flex: 1, flexDirection: "row" }]}>
          <View style={styles.itemHeadersymbolName}>
            <Text style={[styles.itemHeaderSymbol, { fontWeight: "700" }]}>
              Symbol
            </Text>
          </View>

          <View style={styles.itemHeaderRowBuyCell}>
            <Text style={[styles.itemHeaderName, { fontWeight: "700" }]}>
              One Click
            </Text>
          </View>

          <View style={styles.itemHeaderRowBuyCell}>
            <Text style={[styles.itemHeaderName, { fontWeight: "700" }]}>
              In Total
            </Text>
          </View>
        </View>
      </View>
    );
  }
  renderItem(data) {
    let { item, index } = data;

    return (
      <View style={styles.itemHeader}>
        <View style={[{ alignItems: "center", flex: 1, flexDirection: "row" }]}>
          <View
            style={[
              {
                paddingLeft: 10,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 4,
              },
            ]}
          >
            <Text
              style={[
                { width: 140, fontSize: 13, color: GLOBALS.COLOR.TEXT_COLOR },
              ]}
            >
              {item.SymbolName}
            </Text>
          </View>

          <View style={styles.itemHeaderRowBuyCell}>
            <Text style={styles.itemHeaderName}>{item.OneClick}</Text>
          </View>

          <View style={styles.itemHeaderRowBuyCell}>
            <Text style={styles.itemHeaderName}>{item.InTotal}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    let UserData = this.state.UserData;

    return (
      <ImageBackground
        style={[{width: '100%', height: '100%'}]}
        imageStyle={{resizeMode: 'stretch'}}
        source={require('../Images/bg.png')}>
      <View style={styles.container}>
        <MarqueeTop />

        <ScrollView
          style={{ backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR }}
        >
          <View
            style={[
              {
                flex: 1,
                margin: 12,
                backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
                borderRadius: 4,
                borderColor: GLOBALS.COLOR.BLUE,
                borderWidth: 1.5,
              },
            ]}
          >
            {/* <LinearGradient 
                  colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                  start={{ x: 0, y: 0}} 
                  end={{x: 0, y: 1}} 
                  style={[{height:30,justifyContent:'center',alignItems:'center',backgroundColor:GLOBALS.COLOR.TRANSPARENT_COLOR,borderTopStartRadius:4,borderTopEndRadius:4,}]}> */}

            {/* <Text style={[{color:GLOBALS.COLOR.TEXT_COLOR,fontSize:16,fontWeight:'700'}]}>PROFILE</Text> */}
            <View
              style={[
                {
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: GLOBALS.COLOR.YELLOW,
                  borderTopStartRadius: 3,
                  borderTopEndRadius: 3,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: GLOBALS.COLOR.WHITE,
                    fontSize: 16,
                    fontWeight: "700",
                  },
                ]}
              >
                PROFILE
              </Text>
            </View>
            {/* </LinearGradient> */}

            <View
              style={[
                {
                  justifyContent: "center",
                  backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
                },
              ]}
            >
              {/* USER ID */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  USER ID
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.LoginId}
                </Text>
              </View>

              {/* AUTHORISED PERSON NAME */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  AUTHORISED PERSON NAME
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.Name}
                </Text>
              </View>

              {/* Firmname */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  FIRM NAME
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.Firmname}
                </Text>
              </View>

              {/* CONTACT NO */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  CONTACT NO
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.Number}
                </Text>
              </View>

              {/* EMAIL ID */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  EMAIL ID
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.Email}
                </Text>
              </View>

              {/* ADDRESS */}
              <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    marginLeft: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      marginVertical: 8,
                      flex: 1,
                    },
                  ]}
                >
                  ADDRESS
                </Text>
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 14,
                      marginVertical: 8,
                      flex: 1,
                      marginRight: 5,
                    },
                  ]}
                >
                  {":   " + UserData.City}
                </Text>
              </View>

              {/* Password */}
              {/* <View
                style={[
                  {
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: 5,
                  },
                ]}
              >
                <Text
                  style={[
                    {
                      color: GLOBALS.COLOR.TEXT_COLOR,
                      fontSize: 13,
                      fontWeight: "700",
                      marginLeft: 5,
                      textAlignVertical: "center",
                    },
                  ]}
                >
                  PASSWORD{" "}
                </Text>

                <TextInput
                  selectionColor={GLOBALS.COLOR.BLACK}
                  style={[
                    {
                      color: GLOBALS.COLOR.BLACK,
                      backgroundColor: GLOBALS.COLOR.WHITE,
                      flex: 1,
                      marginVertical: 5,
                      marginHorizontal: 8,
                      borderColor: GLOBALS.COLOR.BORDER_COLOR,
                      borderWidth: 0.4,
                      borderRadius: 4,
                      paddingLeft: 6,
                      fontSize: 12,
                      height: 35,
                    },
                  ]}
                  ref="2"
                  underlineColorAndroid="transparent"
                  placeholder="Password"
                  placeholderTextColor="darkgray"
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={this.handlePassword}
                  returnKeyType={"done"}
                  blurOnSubmit={true}
                //onSubmitEditing={() => { this._focusNextField('2')}}
                />

                <TouchableOpacity
                  onPress={() => this.passwordEvent(this.state.Password)}
                >
                  <View
                    style={[
                      {
                        backgroundColor: GLOBALS.COLOR.YELLOW,
                        borderColor: GLOBALS.COLOR.YELLOW,
                        borderWidth: 0.6,
                        flex: 1,
                        justifyContent: "center",
                        marginVertical: 5,
                        marginRight: 4,
                        borderRadius: 4,
                        width: 80,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        {
                          color: GLOBALS.COLOR.WHITE,
                          textAlign: "center",
                          fontWeight: "700",
                          marginHorizontal: 5,
                        },
                      ]}
                    >
                      {" "}
                      Update{" "}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View> */}

              {/* DELETE ACCOUNT */}
              {UserData.Firmname == "Starline" || UserData.Firmname == "starline" || UserData.Firmname == "SL" || UserData.Firmname == "sl" ? (
                <View
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      margin: 5,
                      borderRadius: 4,
                      backgroundColor: "#e9e9e9",
                      flex: 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: GLOBALS.COLOR.BLACK,
                        fontSize: 13,
                        fontWeight: "700",
                        flex: 1,
                        marginLeft: 8,
                        textAlignVertical: "center",
                      },
                    ]}
                  >
                    DELETE MY ACCOUNT{" "}
                  </Text>

                  <TouchableOpacity onPress={() => this.deleteAccount()}>
                    <View
                      style={[
                        {
                          backgroundColor: GLOBALS.COLOR.YELLOW,
                          borderColor: GLOBALS.COLOR.YELLOW,
                          borderWidth: 0.6,
                          flex: 1,
                          paddingVertical: 9,
                          justifyContent: "center",
                          marginVertical: 5,
                          marginRight: 4,
                          borderRadius: 4,
                          width: 100,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          {
                            color: GLOBALS.COLOR.WHITE,
                            textAlign: "center",
                            fontWeight: "700",
                            marginHorizontal: 5,
                          },
                        ]}
                      >
                        {" "}
                        DELETE{" "}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>

          <View
            style={[
              {
                flex: 1,
                margin: 12,
                backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
                borderRadius: 4,
                borderColor: GLOBALS.COLOR.BLUE,
                borderWidth: 1.5,
              },
            ]}
          >
            {/* <LinearGradient 
                  colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                  start={{ x: 0, y: 0}} 
                  end={{x: 0, y: 1}} 
                  style={[{height:30,justifyContent:'center',alignItems:'center',backgroundColor:GLOBALS.COLOR.TRANSPARENT_COLOR,borderTopStartRadius:4,borderTopEndRadius:4,}]}>

              <Text style={[{color:GLOBALS.COLOR.TEXT_COLOR,fontSize:16,fontWeight:'700'}]}>TRADE PERMISSION</Text> */}
            <View
              style={[
                {
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: GLOBALS.COLOR.YELLOW,
                  borderTopStartRadius: 3,
                  borderTopEndRadius: 3,
                },
              ]}
            >
              <Text
                style={[
                  {
                    color: GLOBALS.COLOR.WHITE,
                    fontSize: 16,
                    fontWeight: "700",
                  },
                ]}
              >
                TRADE PERMISSION
              </Text>
            </View>
            {/* </LinearGradient> */}
            <FlatList
              ListHeaderComponent={this.renderHeader}
              keyExtractor={this._keyExtractor}
              data={this.state.GroupDataSymbol}
              renderItem={this.renderItem.bind(this)}
            />
            <View style={[{ height: 5 }]} />
          </View>
        </ScrollView>

        {this.state.isProgress ? (
          <View
            style={{
              position: "absolute",
              flex: 1,
              alignItems: "center",
              alignContent: "center",
              alignSelf: "center",
              height: "100%",
            }}
          >
            <CustumProgress />
          </View>
        ) : null}

        <MarqueeBottom />
      </View>
     </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    //backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },

  //* List  Header
  itemHeader: {
    flexDirection: "row",
    borderRadius: 4,
  },
  itemHeadersymbolName: {
    paddingLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  itemHeaderRowBuyCell: {
    flex: 1,
    width: 85,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  itemHeaderSymbol: {
    width: 140,
    fontSize: 15,
    color: GLOBALS.COLOR.TEXT_COLOR,
  },
  itemHeaderName: {
    fontSize: 13,
    justifyContent: "center",
    alignItems: "center",
    color: GLOBALS.COLOR.TEXT_COLOR,
  },
});
