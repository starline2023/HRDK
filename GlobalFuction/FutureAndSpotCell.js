import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
let Window = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';

export function SpotRateCell(productRefrance, productRefrancePreve, objRefranceComex) {

  return (
    <View>
      <View style={[{ height: 5 }]} />
      {/* {objRefranceComex.length > 0 ? renderHeaderSpot("SPOT RATE") : null} */}
      <View style={[{ paddingHorizontal: 4, flex: 1, flexDirection: 'row' }]}>

        {productRefrance?.map((item, index) => {

          let symbole = item.symbol;
          var ObjSymbole;
          if (objRefranceComex != null) {
            if (objRefranceComex.length > 0) {
              objRefrancesource = (name) => {
                return objRefranceComex.find(data => data.Source === name);
              };
              ObjSymbole = objRefrancesource(symbole);
            }
          }

          if (ObjSymbole != undefined) {
            if (ObjSymbole.IsDisplay == true) {
              if (symbole == 'XAUUSD' || symbole == 'XAGUSD' || symbole == 'INRSpot') {

                var localStore = productRefrancePreve[index];
                //  var BGColorBid;
                //  var textColorBid = GLOBALS.COLOR.TEXT_COLOR;
                var BGColorAsk;
                var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;

                if (localStore != undefined) {

                  //  let BidStatus = StatusUpDownColorSpot(localStore.Bid,item.Bid);
                  //  BGColorBid = BidStatus.BGColor;
                  //  textColorBid = BidStatus.textColor;

                  let AskStatus = StatusUpDownColorSpot(localStore.Ask, item.Ask);
                  BGColorAsk = AskStatus.BGColor;
                  textColorAsk = AskStatus.textColor;
                }


                return (

                  <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, backgroundColor: GLOBALS.COLOR.WHITE, justifyContent: 'center', alignContent: 'center', height: 95, borderColor: GLOBALS.COLOR.BORDER_COLOR, borderWidth: 1.5, marginHorizontal: 2, borderRadius: 4 }}>

                      <View style={{ height: 30, justifyContent: 'center', alignContent: 'center', backgroundColor: GLOBALS.COLOR.WHITE,borderTopColor:GLOBALS.COLOR.BLUE, borderTopWidth:1, borderBottomColor:GLOBALS.COLOR.BLUE,borderBottomWidth:1 }}>
                      {/* <LinearGradient colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
                        style={{ height: 30, justifyContent: 'center', alignContent: 'center' }}
                        // start={{ x: 0, y: 0 }}
                        // end={{ x: 0, y: 1 }}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}> */}

                        <Text numberOfLines={1} style={{ marginTop: 0, color: GLOBALS.COLOR.BLACK, textAlign: 'center', textAlignVertical: 'center', fontSize: 14, fontWeight: 'bold' }}>{ObjSymbole.Symbol_Name}</Text>
                        </View>
                      {/* </LinearGradient> */}
                      <View style={[{ width: '50%', height: 1, backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, marginVertical: 3, alignSelf: 'center' }]} />
                      <View style={{ backgroundColor: BGColorAsk, borderRadius: 4, width: '80%', height: 25, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR }}>
                        <Text style={{ color: textColorAsk, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>{item.Ask}</Text>
                      </View>

                      <View style={{ flexDirection: 'row', flex: 1, height: 12, marginTop: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 4, }}>
                        <Text
                          numberOfLines={1}
                          style={[
                            {
                              // flex:1,
                              fontSize: 9,
                              fontWeight: 'bold',
                              textAlign: 'center',
                              alignItems: 'center',
                              alignSelf: 'center',
                              color: GLOBALS.COLOR.TEXT_COLOR,
                              width: '100%',
                            },
                          ]}>
                          {'L ' + item.Low + ' / ' + 'H ' + item.High}
                        </Text>
                      </View>
                    </View>
                  </View>

                );
              }
            }
          }
        })
        }
      </View>
    </View>

  )
}

export function FutureCell(productRefrance, productRefrancePreve, objRefranceFuture) {

  return (
    <View style={[{ paddingRight: 6 }]}>
      <View style={[{ height: 4 }]} />
      {/* {objRefranceFuture.length > 0 ? renderHeader("FUTURE RATE") : null} */}
      {/* <View style={[{paddingHorizontal:5,flex:1,flexDirection:'row'}]}> */}

      <FlatList
        columnWrapperStyle={{ justifyContent: 'space-between', }}
        data={productRefrance}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        numColumns={2}
        renderItem={({ item, index }) => {
          let symbole = item.symbol;
          var ObjSymbole;
          if (objRefranceFuture != null) {
            if (objRefranceFuture.length > 0) {
              objRefrancesource = (name) => {
                return objRefranceFuture.find(data => data.Source === name);
              };
              ObjSymbole = objRefrancesource(symbole);
            }
          }

          if (ObjSymbole != undefined) {
            if (ObjSymbole.IsDisplay == true) {
              if (symbole != 'XAUUSD' && symbole != 'XAGUSD' && symbole != 'INRSpot') {

                var localStore = productRefrancePreve[index];
                var BGColorBid;
                var textColorBid = GLOBALS.COLOR.TEXT_COLOR;
                var BGColorAsk;
                var textColorAsk = GLOBALS.COLOR.TEXT_COLOR;

                if (localStore != undefined) {

                  let BidStatus = StatusUpDownColor(localStore.Bid, item.Bid);
                  BGColorBid = BidStatus.BGColor;
                  textColorBid = BidStatus.textColor;

                  let AskStatus = StatusUpDownColor(localStore.Ask, item.Ask);
                  BGColorAsk = AskStatus.BGColor;
                  textColorAsk = AskStatus.textColor;
                }

                return (

                  <View style={{ flex: 1, paddingLeft: 6, marginVertical: 3 }}>

                    <View style={{ flex: 1, backgroundColor: GLOBALS.COLOR.WHITE, height: 115, borderRadius: 4, borderColor: GLOBALS.COLOR.BORDER_COLOR, borderWidth: 1.5 }}>
                      <View style={{ height: 30, justifyContent: 'center', alignContent: 'center', backgroundColor: GLOBALS.COLOR.WHITE,borderTopColor:GLOBALS.COLOR.BLUE, borderTopWidth:1, borderBottomColor:GLOBALS.COLOR.BLUE,borderBottomWidth:1 }}>
                      {/* <LinearGradient colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
                        style={{ height: 30, justifyContent: 'center', alignContent: 'center' }}
                        // start={{ x: 0, y: 0 }}
                        // end={{ x: 0, y: 1 }}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}> */}

                        <Text numberOfLines={1} style={{ marginTop: 0, color: GLOBALS.COLOR.BLACK, textAlign: 'center', textAlignVertical: 'center', fontSize: 14, fontWeight: 'bold' }}>{ObjSymbole.Symbol_Name}</Text>
                        </View>
                      {/* </LinearGradient> */}
                      <View style={[{ flex: 1, flexDirection: 'row', marginTop: 10 }]}>
                        <View style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginTop: 6 }]}>
                          <Text style={{ color: GLOBALS.COLOR.YELLOW, textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{'BID'}</Text>
                          <View style={{ borderRadius: 4, marginVertical: 4, width: '90%', height: 25, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR, backgroundColor: BGColorBid }}>
                            <Text style={{ color: textColorBid, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>{item.Bid}</Text>
                          </View>
                        </View>

                        <View style={[{ flex: 1, flexDirection: 'column', justifyContent: 'center', marginTop: 6 }]}>
                          <Text style={{ color: GLOBALS.COLOR.YELLOW, textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{'ASK'}</Text>
                          <View style={{ borderRadius: 4, marginVertical: 4, width: '90%', height: 25, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderColor: GLOBALS.COLOR.TRANSPARENT_COLOR, backgroundColor: BGColorAsk }}>
                            <Text style={{ color: textColorAsk, textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>{item.Ask}</Text>
                          </View>
                        </View>

                      </View>

                      {/* High & Low */}
                      <View
                        style={[
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            alignContent: 'center',
                            flex: 1,
                          },
                        ]}>



                        {/* Low Name */}
                        <View style={[styles.itemHieghLowCell]}>
                          <Text
                            style={[
                              {
                                fontSize: 12,
                                fontWeight: '700',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: GLOBALS.COLOR.TEXT_COLOR,
                                width: '100%',
                                textAlign: 'right',
                              },
                            ]}>
                            {'L / ' + item.Low}
                          </Text>
                        </View>

                        {/* High Name */}
                        <View style={[styles.itemHieghLowCell]}>
                          <Text
                            style={[
                              {
                                fontSize: 12,
                                fontWeight: '700',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: GLOBALS.COLOR.TEXT_COLOR,
                                width: '100%',
                                textAlign: 'left',
                              },
                            ]}>
                            {'H / ' + item.High}
                          </Text>
                        </View>

                      </View>

                    </View>

                  </View>

                );
              }
            }
          } else {
            return;
          }


        }}
      />
    </View>
  )
}


///Render Header ---->
function renderHeader(ProductName) {
  return (

    // <LinearGradient 
    //   colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
    //   start={{ x: 0, y: 0}} 
    //   end={{x: 0, y: 1}} 
    //   style={styles.itemHeader}>
    <View style={styles.itemHeader}>
      <View style={styles.itemHeadersymbolName}>
        <Text style={styles.itemHeaderSymbol}>{ProductName}</Text>
      </View>
      <View style={[{ alignSelf: 'center', marginVertical: 4, marginLeft: 4, height: '70%', width: 7, resizeMode: 'stretch' }]} />
      <View style={[{ alignItems: 'center', flexDirection: 'column', flex: 1 }]}>

        <View style={[{ alignItems: 'center', flexDirection: 'row', flex: 1 }]}>
          {/* Buy Name */}

          <View
            style={[
              styles.itemHeaderRowBuyCell,
              {
                //backgroundColor: BGColorBid,
                marginHorizontal: 10,
              },
            ]}>
            <Text style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}>
              {"BID"}
            </Text>
          </View>


          {/* Sell Name */}

          <View
            style={[
              styles.itemHeaderRowBuyCell,
              {
                //backgroundColor: BGColorAsk,
                marginHorizontal: 10,
              },
            ]}>
            <Text style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}>
              {"ASK"}
            </Text>
          </View>

        </View>
      </View>
    </View>
  );
}

///Render Header ---->
function renderHeaderSpot(ProductName) {
  return (

    // <LinearGradient 
    //   colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
    //   start={{ x: 0, y: 0}} 
    //   end={{x: 0, y: 1}} 
    //   style={styles.itemHeader}>
    <View style={styles.itemHeaderSpot}>
      <View style={styles.itemHeadersymbolName}>
        <Text style={styles.itemHeaderSymbolSpot}>{ProductName}</Text>
      </View>
      <View style={[{ alignSelf: 'center', marginVertical: 4, marginLeft: 4, height: '70%', width: 7, resizeMode: 'stretch' }]} />
      <View style={[{ alignItems: 'center', flexDirection: 'column', flex: 1 }]}>

        <View style={[{ alignItems: 'center', flexDirection: 'row', flex: 1 }]}>
          {/* Buy Name */}

          <View
            style={[
              styles.itemHeaderRowBuyCell,
              {
                //backgroundColor: BGColorBid,
                marginHorizontal: 10,
              },
            ]}>
            <Text style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}>
              {"BID"}
            </Text>
          </View>


          {/* Sell Name */}

          <View
            style={[
              styles.itemHeaderRowBuyCell,
              {
                //backgroundColor: BGColorAsk,
                marginHorizontal: 10,
              },
            ]}>
            <Text style={[styles.itemHeaderName, { color: GLOBALS.COLOR.BLACK }]}>
              {"ASK"}
            </Text>
          </View>

        </View>
      </View>
    </View>
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
      textColor = GLOBALS.COLOR.TEXT_COLOR;
    }
  } catch (e) {
    BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
    textColor = GLOBALS.COLOR.TEXT_COLOR;
  }
  const strColor = JSON.stringify({ BGColor: BGColor, textColor: textColor });
  return JSON.parse(strColor);
}

///Status UpDowun ---->
function StatusUpDownColorSpot(strPre, strCur) {

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
      textColor = GLOBALS.COLOR.TEXT_COLOR;
    }
  } catch (e) {
    BGColor = GLOBALS.COLOR.TRANSPARENT_COLOR;
    textColor = GLOBALS.COLOR.TEXT_COLOR;
  }
  const strColor = JSON.stringify({ BGColor: BGColor, textColor: textColor });
  return JSON.parse(strColor);
}


const styles = StyleSheet.create({

  itemHeader: {
    flexDirection: 'row',
    height: 35,
    marginHorizontal: 5,
    //marginTop: 4,
    backgroundColor: GLOBALS.COLOR.YELLOW,
    // paddingHorizontal:5,
  }, itemHeaderSpot: {
    flexDirection: 'row',
    height: 35,
    marginHorizontal: 5,
    //marginTop: 4,
    backgroundColor: GLOBALS.COLOR.BLUE,
    // paddingHorizontal:5,
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
    borderColor: GLOBALS.COLOR.DARKGRAY_THEAM,
  },
  itemHeaderSymbol: {
    width: 140,
    fontSize: 15,
    fontWeight: '700',
    color: GLOBALS.COLOR.BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderSymbolSpot: {
    width: 140,
    fontSize: 15,
    fontWeight: '700',
    color: GLOBALS.COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderName: {
    fontSize: 15,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    color: GLOBALS.COLOR.WHITE,
    width: '100%',
    //backgroundColor:'red',
    textAlign: 'center',
  },

  //* List Row
  //* List Row
  itemRow: {
    marginHorizontal: 5,
    flexDirection: 'row',
    height: 47,
    // marginTop: 2,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    // borderRadius: 4,
    borderBottomWidth: 0.8,
    borderRightWidth: 0.8,
    borderLeftWidth: 0.8,
    borderColor: GLOBALS.COLOR.BLUE,
  },
  itemRowSpot: {
    marginHorizontal: 5,
    flexDirection: 'row',
    height: 50,
    // marginTop: 2,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    // borderRadius: 4,
    borderBottomWidth: 0.8,
    borderRightWidth: 0.8,
    borderLeftWidth: 0.8,
    borderColor: GLOBALS.COLOR.YELLOW,
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
    borderColor: GLOBALS.COLOR.DARKGRAY_THEAM,
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
    fontWeight: '700',
    color: GLOBALS.COLOR.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRowBuyCell: {
    flex: 1,
    width: 85,
    height: 25,
    // marginTop: 5,
    borderRadius: 4,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: GLOBALS.COLOR.DARKGRAY_THEAM,
  },
  itemHieghLowCell: {
    flex: 1,
    width: 85,
    marginTop: 3,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',

  },
});