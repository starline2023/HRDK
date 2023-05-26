

import React from 'react';
import {
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  FlatList,
  Modal,
  ScrollView,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  NativeAppEventEmitter,
  TextInput,
  Dimensions
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';
import CustumProgress from '../UtilityClass/CustumProgress';
// import MarqueeTop from '../UtilityClass/MarqueeTop';
// import MarqueeBottom from '../UtilityClass/MarqueeBottom';

import DatePicker from '../UtilityClass/DatePicker';
const editImage = <Image
  style={[{ height: 25, width: 20, resizeMode: 'contain', tintColor: GLOBALS.COLOR.BLACK }]}
  source={require('../Images/trade_edit.png')} />
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

export default class Trade extends React.Component {

  constructor(props) {
    super(props);

    console.warn()

    this.state = {
      isLogin: false,
      isProgress: true,
      OpenOrder: [],
      CoinOpenOrder: [],
      LimitOrder: [],
      DeleteOrder: [],
      CoinDeleteOrder: [],
      RequestOrder: [],
      ClosedOrder: [],
      CoinClosedOrder: [],
      SymbolAll: [],
      isConnected: true,
      isTabLine: 0,
      isCoinTabLine: 0,
      selectedItem: null,
      dataSource: [],
      isModalUpdateAndDeleteLimit: false,
      limitUpdatesSelecteditem: [],
      Accountdetails: [],
    }
  }


  componentDidMount() {

    var dateA = new Date()
      .getDate()
      .toString()
      .padStart(2, 0); //Current Date 
    var monthA = (new Date().getMonth() + 1).toString().padStart(2, 0); //Current Month
    var yearA = new Date().getFullYear(); //Current Year
    this.StartDate = `${dateA}/${monthA}/${yearA}`;
    this.EndDate = `${dateA}/${monthA}/${yearA}`;

    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.setState({ isLogin: GLOBALS.isLoginTerminal })
      this.GetCoinOrderDetail(this.StartDate, this.EndDate);
    }
    );

    this.eventListener = NativeAppEventEmitter.addListener('eventTradeSymbol', (params) => this.handleTradeSymbol(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyOpenOderDetails', (params) => this.handleEvent(params));

    this.eventListener = NativeAppEventEmitter.addListener('eventKeyCoinOrderSuccessfullyNavigation', (params) => {
      this.setState({ isProductGoldAndSilver: true })
      setTimeout(function () {
        this.handleCoinNavigationIndex(params)
      }.bind(this), 200);
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  _hideSymbolEdit = () => {

    if (this.state.isTabLine == 1) {
      this.setState({ isModalUpdateAndDeleteLimit: false })
    }
  }

  handleEvent = (event) => {
    this.GetCoinOrderDetail(this.StartDate, this.EndDate);
  }

  handleTradeSymbol = (event) => {
    console.log("----------------------event " + event);

    this.setState({ SymbolAll: event });
    this.setState({ OpenOrder: this.state.OpenOrder });
    this.setState({ RequestOrder: this.state.RequestOrder });
    this.setState({ LimitOrder: this.state.LimitOrder });
  }

  GetCoinOrderDetail(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = GLOBALS.Client_LoginID;
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetCoinsOpenOrderDetails', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {

            let Obj = JSON.parse(responseJson.d);

            if (Obj["ReturnCode"] == "400") {
              if (Obj.OpenOrder != "") {

                let OpenOrder = JSON.parse(Obj.OpenOrder);
                this.setState({ CoinOpenOrder: OpenOrder });
              }

              // if (Obj.Accountdetails != "") {
              //   let Accountdetails = JSON.parse(Obj.Accountdetails);
              //   this.setState({Accountdetails:Accountdetails});
              // }

            } else {
            }
            this.setState({ isProgress: false });
          } else {
            this.setState({ isProgress: false });
          }
        } catch (error) {
          console.log('error', error);
          this.setState({ isProgress: false });
        }
      })
      .catch(error => {
        console.log('error', error);
        this.setState({ isProgress: false });
      });
  }

  GetCoinCloseOrderDetails(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = GLOBALS.Client_LoginID;
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetCloseOrderCoinDetails', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {

            let Obj = JSON.parse(responseJson.d);
            if (Obj["ReturnCode"] == "400") {

              if (Obj.ClosedOrder != "") {
                let ClosedOrder = JSON.parse(Obj.ClosedOrder);
                this.setState({ CoinClosedOrder: ClosedOrder });
              }

            } else {
            }
            this.setState({ isProgress: false });
          } else {
            this.setState({ isProgress: false });
          }
        } catch (error) {
          console.log('error', error);
          this.setState({ isProgress: false });
        }
      })
      .catch(error => {
        console.log('error', error);
        this.setState({ isProgress: false });
      });
  }

  GetCoinDeleteOrderDetails(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = GLOBALS.Client_LoginID;
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetDeleteOrderCoinDetails', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {

            let Obj = JSON.parse(responseJson.d);
            if (Obj["ReturnCode"] == "400") {

              if (Obj.DeleteOrder != "") {
                let DeleteOrder = JSON.parse(Obj.DeleteOrder);
                this.setState({ CoinDeleteOrder: DeleteOrder });
              }

            } else {
            }
            this.setState({ isProgress: false });
          } else {
            this.setState({ isProgress: false });
          }
        } catch (error) {
          console.log('error', error);
          this.setState({ isProgress: false });
        }
      })
      .catch(error => {
        console.log('error', error);
        this.setState({ isProgress: false });
      });
  }

  _onScrollCoin(e) {

    try {

      let contentOffset = e.nativeEvent.contentOffset;
      let viewSize = e.nativeEvent.layoutMeasurement;

      let newPageNum = Math.round(contentOffset.x / viewSize.width + 1);

      if (newPageNum == 1) {
        this.setState({ isCoinTabLine: 0 });
      } else if (newPageNum == 2) {
        this.GetCoinCloseOrderDetails(this.StartDate, this.EndDate);
        this.setState({ isCoinTabLine: 1 });
      } else if (newPageNum == 3) {
        this.GetCoinDeleteOrderDetails(this.StartDate, this.EndDate);
        this.setState({ isCoinTabLine: 2 });
      }

    } catch (error) {
    }
  }

  handleCoinNavigationIndex = (index) => {
    try {
      if (index != null) {
        this._scrollViewCoin.scrollTo({ x: index * Dimensions.get('window').width, y: 0, animated: true });
      }

    } catch (error) {
    }
  }

  onSelectEdit(item, index) {
    if (this.state.isTabLine == 1) {
      this.setState({ isModalUpdateAndDeleteLimit: true, limitUpdatesSelecteditem: item })
    }
  }

  SearchEvent() {
    this.GetCoinDeleteOrderDetails(this.StartDate, this.EndDate);
    this.GetCoinCloseOrderDetails(this.StartDate, this.EndDate);
  }

  onSelect(selectedItem) {

    const isSelected = (this.state.selectedItem === selectedItem);
    if (isSelected) {
      this.setState({ selectedItem: null });
    } else {
      this.setState({ selectedItem });
    }
  }

  renderItem(data) {
    let { item, index } = data;

    try {

      let TradeType = item.TradeType;
      let Source = item.Source;
      let Volume = item.Volume;
      let OpenTradeDateTime = item.OpenTradeDateTime;
      let DealNo = item.DealNo;
      let SymbolName = item.SymbolName;
      let SymbolID = item.SymbolID;
      let Rate = item.Rate;
      // let Prize = item.Prize;
      let Total = item.Total;

      const isSelected = (this.state.selectedItem === DealNo);
      const RowHieght = isSelected ? 95 : 55;

      let Trade_Type = "";
      if (TradeType == "1") {
        Trade_Type = "Buy";
      } else if (TradeType == "2") {
        Trade_Type = "Buy";
      } else if (TradeType == "3") {
        Trade_Type = "Buy Limit";
      } else if (TradeType == "4") {
        Trade_Type = "Sell Limit";
      }

      // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);

      let gramkg = "";
      // if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
      //     gramkg = "gm";
      // } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
      //     gramkg = "kg";
      // }
      gramkg = Volume + " Qty";
      var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;

      return (

        <TouchableWithoutFeedback
          onPress={() => this.onSelect(DealNo)}
        >
          <View style={[styles.itemRow, { height: RowHieght }]}>

            <View style={[{ flex: 1, margin: 5 }]}>
              {/* title Title */}
              <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <Text numberOfLines={1} style={[{ fontSize: 14, color: GLOBALS.COLOR.YELLOW, flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
              </View>
              {/*Rate */}
              <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>
                  <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.RATE_UP, marginTop: 5 }]}>
                    {Trade_Type}
                  </Text>
                  {str_Tyep_gram}
                </Text>

              </View>

              {isSelected ? <View style={[{ height: 40 }]}>
                {/* Date */}
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

                {/* Deal No */}
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
              </View> : null}

            </View>
          </View>
        </TouchableWithoutFeedback>

      )

    } catch (error) {
    }
  }

  renderItemLimit(data) {
    let { item, index } = data;


    let TradeType = item.TradeType;
    let Source = item.Source;
    let Volume = item.Volume;
    let OpenTradeDateTime = item.OpenTradeDateTime;
    let DealNo = item.DealNo;
    let SymbolName = item.SymbolName;
    let SymbolID = item.SymbolID;
    let Rate = item.Rate;
    // let Prize = item.Prize;
    let Total = item.Total;

    const isSelected = (this.state.selectedItem === DealNo);
    const RowHieght = isSelected ? 95 : 55;

    let Trade_Type = "";
    if (TradeType == "1") {
      Trade_Type = "Buy";
    } else if (TradeType == "2") {
      Trade_Type = "Buy";
    } else if (TradeType == "3") {
      Trade_Type = "Buy Limit";
    } else if (TradeType == "4") {
      Trade_Type = "Sell Limit";
    }

    // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);
    let gramkg = "";
    // if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
    //     gramkg = "gm";
    // } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
    //     gramkg = "kg";
    // }
    gramkg = Volume + " Qty";
    var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;


    return (

      <TouchableWithoutFeedback
        onPress={() => this.onSelect(DealNo)}
      >
        <View style={[styles.itemRow, { height: RowHieght }]}>

          <View style={[{ flex: 1, margin: 5 }]}>
            {/* title Title */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text numberOfLines={1} style={[{ fontSize: 14, color: GLOBALS.COLOR.THEAMCOLOR, flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
              <TouchableOpacity onPress={() => this.onSelectEdit(item, index)}>
                <View style={[{ flex: 1, width: 20, alignItems: 'center', marginRight: 5 }]}>
                  {this.state.isTabLine == 1 ? editImage : null}
                </View>
              </TouchableOpacity>

            </View>
            {/*Rate */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.RATE_UP, marginTop: 5 }]}>
                  {Trade_Type}
                </Text>
                {str_Tyep_gram}
              </Text>
            </View>

            {isSelected ? <View style={[{ height: 40 }]}>
              {/* Date */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

              {/* Deal No */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
            </View> : null}

          </View>
        </View>
      </TouchableWithoutFeedback>

    )
  }


  renderCloseItem(data) {
    let { item, index } = data;


    let TradeType = item.TradeType;
    let Source = item.Source;
    let Volume = item.Volume;
    let OpenTradeDateTime = item.OpenTradeDateTime;
    let DealNo = item.DealNo;
    let SymbolName = item.SymbolName;
    let SymbolID = item.SymbolID;
    let Rate = item.Rate;
    // let Prize = item.Prize;
    let ClosePrice = item.ClosePrice;
    let Total = item.Total;

    const isSelected = (this.state.selectedItem === DealNo);
    const RowHieght = isSelected ? 117 : 55;

    let Trade_Type = "";
    if (TradeType == "1") {
      Trade_Type = "Buy";
    } else if (TradeType == "2") {
      Trade_Type = "Buy";
    } else if (TradeType == "3") {
      Trade_Type = "Buy Limit";
    } else if (TradeType == "4") {
      Trade_Type = "Sell Limit";
    }

    // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);
    let gramkg = "";
    //   if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
    //     gramkg = "gm";
    // } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
    //     gramkg = "kg";
    // }
    gramkg = Volume + " Qty";
    var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;


    return (

      <TouchableWithoutFeedback
        onPress={() => this.onSelect(DealNo)}
      >
        <View style={[styles.itemRow, { height: RowHieght }]}>

          <View style={[{ flex: 1, margin: 5 }]}>
            {/* title Title */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text numberOfLines={1} style={[{ fontSize: 14, color: GLOBALS.COLOR.THEAMCOLOR, flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
            </View>
            {/*Rate */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.RATE_UP, marginTop: 5 }]}>
                  {Trade_Type}
                </Text>
                {str_Tyep_gram}
              </Text>
            </View>

            {isSelected ? <View style={[{ height: 60 }]}>

              {/* ClosePrice */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{'Close Price : ' + ClosePrice}</Text>

              {/* Date */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

              {/* Deal No */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.BLACK, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
            </View> : null}

          </View>
        </View>
      </TouchableWithoutFeedback>

    )
  }



  render() {
    let width_window = Dimensions.get('window').width;

    if (!this.state.isLogin) {
      return (
        <View style={[{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center', }]}>
          <Text style={[{ textAlignVertical: 'center', fontWeight: 'bold', fontSize: 15, color: GLOBALS.COLOR.BLACK }]}>
            {'Please Login'}
          </Text>
        </View>
      )

    } else {

      return (


        <View style={styles.container}>
          {/* <ImageBackground
            style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.BG_IMG_COLOR}]}
            imageStyle={{resizeMode: 'stretch'}}
            source={require('../Images/bg.png')}> */}
          {/* <MarqueeTop /> */}

          <View
            style={[
              {
                backgroundColor: GLOBALS.COLOR.THEAMCOLOR,
                flexDirection: 'row',
                height: 45,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <Text style={{ color: GLOBALS.COLOR.BLACK, fontSize: 16, marginLeft: 8 }}>Date</Text>

            <DatePicker
              style={[styles.containerCalendar]}
              renderDate={({ year, month, day, date }) => {
                if (!date) {
                  return (
                    <Text style={[styles.textCalendar]}>{this.StartDate}</Text>
                  );
                }

                const dateStr = `${day}/${month}/${year}`;
                this.StartDate = dateStr;
                return <Text style={styles.textCalendar}>{dateStr}</Text>;
              }}
            />

            <Text style={{ color: GLOBALS.COLOR.BLACK, fontSize: 16 }}>to</Text>

            <DatePicker
              style={[styles.containerCalendar]}
              renderDate={({ year, month, day, date }) => {
                if (!date) {
                  return (
                    <Text style={[styles.textCalendar]}>{this.EndDate}</Text>
                  );
                }
                const dateStr = `${day}/${month}/${year}`;
                this.EndDate = dateStr;
                return <Text style={styles.textCalendar}>{dateStr}</Text>;
              }} />

            <TouchableOpacity
              onPress={() => this.SearchEvent()}
              style={{
                backgroundColor: GLOBALS.COLOR.BLACK,
                borderColor: GLOBALS.COLOR.YELLOW,
                marginHorizontal: 4,
                marginRight: 8,
                width: 70,
                borderRadius: 4,
                borderWidth: 0.5,
                height: 29,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: GLOBALS.COLOR.WHITE,
                  fontSize: 14,
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                Search
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[{ backgroundColor: GLOBALS.COLOR.YELLOW, height: 45, flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.8, borderColor: GLOBALS.COLOR.DARKGRAY }]}>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleCoinNavigationIndex(0)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.BLACK, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Open \n Order"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isCoinTabLine == 0 ? GLOBALS.COLOR.WHITE : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleCoinNavigationIndex(1)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.BLACK, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Close \nTrade"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isCoinTabLine == 1 ? GLOBALS.COLOR.WHITE : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleCoinNavigationIndex(2)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.BLACK, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Deleted \nTrade"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isCoinTabLine == 2 ? GLOBALS.COLOR.WHITE : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <ScrollView
            ref={(scr) => this._scrollViewCoin = scr}
            decelerationRate={0}
            scrollEventThrottle={0}
            style={{ width: Dimensions.get('window').width, backgroundColor: GLOBALS.COLOR.BG_COLOR }}
            horizontal={true}
            pagingEnabled={true}
            onScroll={(event) => this._onScrollCoin(event)}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            automaticallyAdjustContentInsets={false}
          >

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.CoinOpenOrder}
                renderItem={this.renderItem.bind(this)}
                extraData={this.state}
              />

            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.CoinClosedOrder}
                renderItem={this.renderCloseItem.bind(this)}
                extraData={this.state}
              />
            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.CoinDeleteOrder}
                renderItem={this.renderItem.bind(this)}
                extraData={this.state}
              />
            </View>

          </ScrollView>

          {/* {this.state.isModalUpdateAndDeleteLimit && <UpdateAndDeleteLimit 
                  modalVisible={this.state.isModalUpdateAndDeleteLimit} 
                  hideModal={this._hideSymbolEdit}
                  OrderLimit={this.state.limitUpdatesSelecteditem}
                  LimitRespons={(Orders) => this.setState({LimitOrder:Orders})}
                  /> } */}

          {this.state.isProgress == true ? <View style={{
            position: 'absolute', flex: 1, alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center', height: "100%"
          }}><CustumProgress />
          </View> : null}

          {/* <MarqueeBottom /> */}
          {/* </ImageBackground> */}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },

  //* List Row
  itemRow: {
    flexDirection: 'row',
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.BORDER_COLOR,
    borderWidth: 1,
    marginTop: 5,
    marginHorizontal: 5,

    // shadowOffset: { width: 0, height: 0 },
    // shadowColor: 'black',
    // shadowOpacity: 0.1,
    // shadowRadius: 0.2,
    // elevation: 2,
  },
  itemLine: {
    flexDirection: 'column',
    width: 0.5,
    margin: 7,
    alignItems: 'flex-start',
    backgroundColor: "gray",
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  input: {

    //width: 150,
    flex: 1,
    height: 35,
    textAlign: 'center',
    padding: 8,
    fontSize: 15,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 0.5,
    borderRadius: 4,
    color: GLOBALS.COLOR.YELLOW,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR
  },
  submitButton: {
    padding: 10,
    // margin: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    marginBottom: 0,
    height: 40,
    borderRadius: 4,
    flex: 1,
    // backgroundColor:GLOBALS.COLOR.YELLOW,
  },
  submitButtonCancle: {
    padding: 10,
    marginTop: 7,
    margin: 5,
    marginBottom: 0,
    height: 40,
    borderRadius: 4,
    // backgroundColor:GLOBALS.COLOR.YELLOW,
  },
  submitButtonText: {
    color: GLOBALS.COLOR.YELLOW,
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 15,
    height: 40,
    fontWeight: '700',
  },
  containerCalendar: {
    backgroundColor: GLOBALS.COLOR.YELLOW,
    borderColor: GLOBALS.COLOR.YELLOW,
    marginHorizontal: 6,
    flex: 1,
    borderRadius: 4,
    borderWidth: 1,
    height: 29,
    justifyContent: 'center',
  },
  textCalendar: {
    color: GLOBALS.COLOR.BLACK,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },

});


const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const numberFormat = (value) =>
  new Intl.NumberFormat('en-IN', {
    //style: 'currency',
    currency: 'INR'
  }).format(value);