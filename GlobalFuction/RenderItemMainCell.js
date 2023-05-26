import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  NativeAppEventEmitter,
} from "react-native";
import GLOBALS from "../UtilityClass/Globals";
import {
  liveRateItemCalculationTerminal,
  liveRateItemCalculationBullion,
} from "./GlobalFuction";
import LinearGradient from "react-native-linear-gradient";

let Window = Dimensions.get("window");

export function renderItemMainCellBullion(
  thisClass,
  item,
  index,
  itemPreve,
  isBuy,
  isSell,
  isHighRate,
  isLowRate,
  isSource,
  isSourceNext
) {
  try {
    let curentItem = liveRateItemCalculationBullion(
      item,
      itemPreve[index],
      isSource,
      isSourceNext
    );
    if (curentItem == undefined) {
      return;
    }
  
    return (
      <TouchableWithoutFeedback
        onPress={thisClass.GetItemBullion.bind(this, curentItem)}
      >
        <View style={styles.itemRow}>
          <Image
            style={[
              {
                alignSelf: "center",
                marginVertical: 4,
                marginLeft: 4,
                height: "70%",
                width: 7,
                resizeMode: "stretch",
              },
            ]}
            source={require("../Images/greencolum.png")}
          />
          {/* symbol Name */}
          <View style={styles.itemsymbolName}>
            <Text numberOfLines={2} style={styles.itemSymbol}>
              {curentItem.Sname}{" "}
            </Text>
            <Text
              style={[
                {
                  width: 130,
                  marginVertical: 3,
                  fontWeight: "700",
                  fontSize: 9,
                  color: GLOBALS.COLOR.BLACK,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {"Time - " + curentItem.Time}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/> */}
          <View
            style={[{ alignItems: "center", flexDirection: "column", flex: 1 }]}
          >
            <View
              style={[
                {
                  alignItems: "center",
                  flexDirection: "row",
                  flex: isLowRate == true || isHighRate == true ? 0 : 1,
                },
              ]}
            >

              {/* Buy Name */}
              {isBuy == true ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      marginTop:
                        isLowRate == true || isHighRate == true ? 5 : 0,
                      backgroundColor: curentItem.BGColorBid,
                      marginHorizontal: isSell == false ? 50 : 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { color: curentItem.textColorBid },
                    ]}
                  >
                    {curentItem.Bid}
                  </Text>
                </View>
              ) : null}

              {/* {isBuy == true && isSell == true ? <View style={{height:'100%',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/>: null} */}
              {/* Sell Name */}
              {isSell == true ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      marginTop:
                        isLowRate == true || isHighRate == true ? 5 : 0,
                      backgroundColor: curentItem.BGColorAsk,
                      marginHorizontal: isBuy == false ? 50 : 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { color: curentItem.textColorAsk },
                    ]}
                  >
                    {curentItem.Ask}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* High & Low */}
            {/* {isLowRate == true || isHighRate == true ?  */}
            <View
              style={[
                {
                  alignItems: "center",
                  flexDirection: "row",
                  alignContent: "center",
                  flex: 1,
                },
              ]}
            >
              
              {/* High Name */}
              {isLowRate == true ? (
                <View style={[styles.itemHieghLowCell]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        fontSize: 10,
                        fontWeight: "700",
                        justifyContent: "center",
                        alignItems: "center",
                        color: GLOBALS.COLOR.LOWHIGHTEXTCOLOR,
                        width: "100%",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {"L - " + curentItem.Low}
                  </Text>
                </View>
              ) : null}

              {/* {isLowRate == true && isHighRate == true ? <View style={{height:'100%',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/>: null} */}
              {/* Low Name */}
              {isHighRate == true ? (
                <View style={[styles.itemHieghLowCell]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        fontSize: 10,
                        fontWeight: "700",
                        justifyContent: "center",
                        alignItems: "center",
                        color: GLOBALS.COLOR.LOWHIGHTEXTCOLOR,
                        width: "100%",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {"H - " + curentItem.High}
                  </Text>
                </View>
              ) : null}

            
            </View>
            {/* : null} */}
          </View>

          <Image style={[{ alignSelf: 'center', height: '70%', width: 35, resizeMode: 'stretch', position: 'absolute', right: 0, top: 0 }]} source={require('../Images/buy.png')} />
        </View>
      </TouchableWithoutFeedback>
    );
  } catch (error) {
    console.log(error);
  }
}

export function renderItemMainCellTerminal(
  thisClass,
  item,
  index,
  itemPreve,
  isBuy,
  isSell,
  isHighRate,
  isLowRate,
  GroupDetail,
  ObjGroup,
  selectedIDSymbol,
  isSource,
  isSourceNext
) {
  try {
    let curentItem = liveRateItemCalculationTerminal(
      item,
      itemPreve[index],
      GroupDetail,
      ObjGroup,
      isSource,
      isSourceNext
    );
    if (curentItem == undefined) {
      return;
    }

    if (selectedIDSymbol == curentItem.IDSymbol) {
      NativeAppEventEmitter.emit("eventselectedItem", curentItem);
    }
    return (
      <TouchableWithoutFeedback
        onPress={thisClass.GetItemBullion.bind(thisClass, curentItem)}
      >
        <View style={styles.itemRow}>
          <Image
            style={[
              {
                alignSelf: "center",
                marginVertical: 4,
                marginLeft: 4,
                height: "70%",
                width: 7,
                resizeMode: "stretch",
              },
            ]}
            source={require("../Images/greencolum.png")}
          />
          {/* symbol Name */}
          <View style={styles.itemsymbolName}>
            <Text numberOfLines={2} style={styles.itemSymbol}>
              {curentItem.Sname}
            </Text>
            <Text
              style={[
                {
                  width: 130,
                  marginVertical: 3,
                  fontWeight: "700",
                  fontSize: 9,
                  color: GLOBALS.COLOR.BLACK,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              {"Time - " + curentItem.Time}
            </Text>
          </View>
          {/* <View style={{flexDirection: 'row',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/> */}
          <View
            style={[{ alignItems: "center", flexDirection: "column", flex: 1 }]}
          >
            <View
              style={[
                {
                  alignItems: "center",
                  flexDirection: "row",
                  flex: isLowRate == true || isHighRate == true ? 0 : 1,
                },
              ]}
            >

              {/* Buy Name */}
              {isBuy == true ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      marginTop:
                        isLowRate == true || isHighRate == true ? 5 : 0,
                      backgroundColor: curentItem.BGColorBid,
                      marginHorizontal: isSell == false ? 50 : 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { color: curentItem.textColorBid },
                    ]}
                  >
                    {curentItem.Bid}
                  </Text>
                </View>
              ) : null}
              {/* {isBuy == true && isSell == true ? <View style={{height:'100%',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/>: null} */}
              {/* Sell Name */}
              {isSell == true ? (
                <View
                  style={[
                    styles.itemRowBuyCell,
                    {
                      marginTop:
                        isLowRate == true || isHighRate == true ? 5 : 0,
                      backgroundColor: curentItem.BGColorAsk,
                      marginHorizontal: isBuy == false ? 50 : 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { color: curentItem.textColorAsk },
                    ]}
                  >
                    {curentItem.Ask}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* High & Low */}
            {/* {isLowRate == true || isHighRate == true ? */}
            <View
              style={[
                {
                  alignItems: "center",
                  flexDirection: "row",
                  alignContent: "center",
                  flex: 1,
                },
              ]}
            >

              {/* High Name */}
              {isLowRate == true ? (
                <View style={[styles.itemHieghLowCell]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        fontSize: 10,
                        fontWeight: "700",
                        justifyContent: "center",
                        alignItems: "center",
                        color: GLOBALS.COLOR.LOWHIGHTEXTCOLOR,
                        width: "100%",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {"L - " + curentItem.Low}
                  </Text>
                </View>
              ) : null}
              {/* {isLowRate == true && isHighRate == true ? <View style={{height:'100%',width: 1,backgroundColor:GLOBALS.COLOR.BORDER_COLOR}}/>: null} */}
              {/* Low Name */}
              {isHighRate == true ? (
                <View style={[styles.itemHieghLowCell]}>
                  <Text
                    numberOfLines={1}
                    style={[
                      {
                        fontSize: 10,
                        fontWeight: "700",
                        justifyContent: "center",
                        alignItems: "center",
                        color: GLOBALS.COLOR.LOWHIGHTEXTCOLOR,
                        width: "100%",
                        textAlign: "center",
                      },
                    ]}
                  >
                    {"H - " + curentItem.High}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <Image style={[{ alignSelf: 'center', height: '70%', width: 35, resizeMode: 'stretch', position: 'absolute', right: 0, top: 0 }]} source={require('../Images/buy.png')} />
        </View>
      </TouchableWithoutFeedback>
    );
  } catch (error) {
    console.log(error);
  }
}

export function renderHeaderMain(isBuy, isSell, ProductName) {
  return (
    <LinearGradient
      colors={[
        GLOBALS.COLOR.GRADIENT_1_COLOR,
        GLOBALS.COLOR.GRADIENT_2_COLOR,
        GLOBALS.COLOR.GRADIENT_3_COLOR,
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.itemHeader}
    >
      <View style={styles.itemHeadersymbolName}>
        <Text numberOfLines={1} style={styles.itemHeaderSymbol}>
          {ProductName}
        </Text>
      </View>
      <View
        style={[
          {
            alignSelf: "center",
            marginVertical: 4,
            marginLeft: 4,
            height: "70%",
            width: 7,
            resizeMode: "stretch",
          },
        ]}
      />
      <View
        style={[{ alignItems: "center", flexDirection: "column", flex: 1 }]}
      >
        <View style={[{ alignItems: "center", flexDirection: "row", flex: 1 }]}>

          {/* Buy Name */}
          {isBuy == true ? (
            <View
              style={[
                styles.itemHeaderRowBuyCell,
                {
                  //backgroundColor: BGColorBid,
                  marginHorizontal: 5,
                },
              ]}
            >
              <Text
                style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}
              >
                {"BUY"}
              </Text>
            </View>
          ) : null}

          {/* Sell Name */}
          {isSell == true ? (
            <View
              style={[
                styles.itemHeaderRowBuyCell,
                {
                  //backgroundColor: BGColorAsk,
                  marginHorizontal: 5,
                },
              ]}
            >
              <Text
                style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}
              >
                {"SELL"}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  //* List  Header
  itemHeader: {
    flexDirection: "row",
    height: 38,
    marginTop: 4,
    //backgroundColor: GLOBALS.COLOR.YELLOW,
    // paddingHorizontal:5,
    marginHorizontal: 5,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 1,
  },
  itemHeadersymbolName: {
    paddingLeft: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  itemHeaderRowBuyCell: {
    flex: 1,
    width: 85,
    height: 28,
    // marginTop: 5,
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  itemHeaderSymbol: {
    width: 140,
    fontSize: 15,
    fontWeight: "700",
    color: GLOBALS.COLOR.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  itemHeaderName: {
    fontSize: 14,
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
    color: GLOBALS.COLOR.TEXT_COLOR,
    width: "100%",
    //backgroundColor:'red',
    textAlign: "center",
  },

  //* List Row
  itemRow: {
    flexDirection: "row",
    height: 55,
    marginTop: 3,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    borderRadius: 4,

    borderColor: GLOBALS.COLOR.BORDER_COLOR,
    borderWidth: 1,

    // borderBottomWidth:0.8,
    // borderBottomColor:GLOBALS.COLOR.BORDER_COLOR,

    // borderRightWidth:0.8,
    // borderRightColor:GLOBALS.COLOR.BORDER_COLOR,

    // borderLeftWidth:0.8,
    // borderLeftColor:GLOBALS.COLOR.BORDER_COLOR,
  },
  //* Spot List Row
  SpotitemRow: {
    flexDirection: "column",
    flex: 3,
    height: 55,
    width: Window.width / 3 - 20,
    marginTop: 5,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_BLACK,
    borderRadius: 4,
    borderColor: "gray",
    borderWidth: 0.8,
  },
  itemsymbolName: {
    paddingLeft: 5,
    marginRight: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  itemSymbol: {
    width: 130,
    fontSize: 13,
    fontWeight: "700",
    color: GLOBALS.COLOR.BLACK,
    justifyContent: "center",
    alignItems: "center",
  },
  itemRowBuyCell: {
    flex: 1,
    width: 85,
    height: 28,
    // marginTop: 5,
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  itemHieghLowCell: {
    flex: 1,
    width: 85,
    marginTop: 0,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  itemMrateCell: {
    flex: 1,
    width: 85,
    marginTop: 0,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "700",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    textAlign: "center",
  },
});
