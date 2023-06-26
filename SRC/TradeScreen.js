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
  Dimensions,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import CustumProgress from '../UtilityClass/CustumProgress';
import DatePicker from '../UtilityClass/DatePicker';
const editImage = <Image
  style={[{ height: 25, width: 20, resizeMode: 'contain', tintColor: 'black' }]}
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
      LimitOrder: [],
      DeleteOrder: [],
      RequestOrder: [],
      ClosedOrder: [],
      SymbolAll: [],
      isConnected: true,
      isTabLine: 0,
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
      this.GetOrderDetail(this.StartDate, this.EndDate);
    }
    );

    this.eventListener = NativeAppEventEmitter.addListener('eventTradeSymbol', (params) => this.handleTradeSymbol(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyOpenOderDetails', (params) => this.handleEvent(params));
    this.eventListener = NativeAppEventEmitter.addListener('eventKeyOrderSuccessfullyNavigation', (params) => {

      setTimeout(function () {
        this.handleNavigationIndex(params)
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
    this.GetOrderDetail(this.StartDate, this.EndDate);
  }

  handleTradeSymbol = (event) => {
    console.log("----------------------event " + event);

    this.setState({ SymbolAll: event });
    this.setState({ OpenOrder: this.state.OpenOrder });
    this.setState({ RequestOrder: this.state.RequestOrder });
    this.setState({ LimitOrder: this.state.LimitOrder });
  }

  GetOrderDetail(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = parseInt(GLOBALS.Client_LoginID);
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetOpenOrderDetails', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      // body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
      body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {

            let Obj = JSON.parse(responseJson.d);
            // console.log("---------------------- " + Obj);
            if (Obj["ReturnCode"] == "400") {
              if (Obj.OpenOrder != "") {
                let arrayOpenOrder = [];
                let arrayLimitOrder = [];
                let arrayRequestOrder = [];

                let OpenOrder = JSON.parse(Obj.OpenOrder);
                for (let order in OpenOrder) {
                  let orderList = OpenOrder[order];
                  let TradeMode = orderList.TradeMode.toString().trim();
                  if (orderList.TradeType == "1" && TradeMode == "M" || orderList.TradeType == "2" && TradeMode == "M") {
                    arrayOpenOrder.push(orderList);
                  } else if (orderList.TradeType == "1" && TradeMode == "R" || orderList.TradeType == "2" && TradeMode == "R") {
                    arrayRequestOrder.push(orderList);
                  } else if (orderList.TradeType == "3" || orderList.TradeType == "4") {
                    arrayLimitOrder.push(orderList);
                  }
                }
                //RequestOrder
                this.setState({ OpenOrder: arrayOpenOrder });
                this.setState({ RequestOrder: arrayRequestOrder });
                this.setState({ LimitOrder: arrayLimitOrder });
              }

              if (Obj.Accountdetails != "") {
                let Accountdetails = JSON.parse(Obj.Accountdetails);
                this.setState({ Accountdetails: Accountdetails });
              }

            } else {
              alert(Obj.ReturnMsg);
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

  GetCloseOrderDetails(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = parseInt(GLOBALS.Client_LoginID)
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetCloseOrderDetails', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      // body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
      body: "{'Obj':'" + JSON.stringify(ObjTrade) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {

            let Obj = JSON.parse(responseJson.d);
            // console.log("---------------------- " + Obj);
            if (Obj["ReturnCode"] == "400") {

              if (Obj.ClosedOrder != "") {
                let ClosedOrder = JSON.parse(Obj.ClosedOrder);
                this.setState({ ClosedOrder: ClosedOrder });
              }

            } else {
              alert(Obj.ReturnMsg);
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

  GetDeleteOrderDetails(StartDate, EndDate) {

    // this.setState({ 
    //   isProgress:true,
    // })

    let ObjTrade = new Object();
    ObjTrade["loginid"] = parseInt(GLOBALS.Client_LoginID)
    ObjTrade["Firmname"] = GLOBALS.ClientName;
    ObjTrade["ClientID"] = GLOBALS.ClientID;
    ObjTrade["Fromdate"] = StartDate;
    ObjTrade["Todate"] = EndDate;

    fetch(GLOBALS.Terminal_BASE_URL + 'GetDeleteOrderDetails', {
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
            // console.log("---------------------- " + Obj);
            if (Obj["ReturnCode"] == "400") {

              if (Obj.DeleteOrder != "") {
                let DeleteOrder = JSON.parse(Obj.DeleteOrder);
                this.setState({ DeleteOrder: DeleteOrder });
              }

            } else {
              alert(Obj.ReturnMsg);
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


  _onScroll(e) {

    try {
      let contentOffset = e.nativeEvent.contentOffset;
      let viewSize = e.nativeEvent.layoutMeasurement;

      let newPageNum = Math.round(contentOffset.x / viewSize.width + 1);

      if (newPageNum == 1) {
        this.setState({ isTabLine: 0 });
      } else if (newPageNum == 2) {
        this.setState({ isTabLine: 1 });
      } else if (newPageNum == 3) {
        this.setState({ isTabLine: 2 });
      } else if (newPageNum == 4) {
        this.GetCloseOrderDetails(this.StartDate, this.EndDate);
        this.setState({ isTabLine: 3 });
      } else if (newPageNum == 5) {
        this.GetDeleteOrderDetails(this.StartDate, this.EndDate);
        this.setState({ isTabLine: 4 });
      }
      this.setState({ selectedItem: null });
    } catch (error) {
    }
  }

  handleNavigationIndex = (index) => {
    try {
      if (index != null) {
        this._scrollView.scrollTo({ x: index * Dimensions.get('window').width, y: 0, animated: true });
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
    this.GetDeleteOrderDetails(this.StartDate, this.EndDate);
    this.GetCloseOrderDetails(this.StartDate, this.EndDate);
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
        Trade_Type = "Sell";
      } else if (TradeType == "3") {
        Trade_Type = "Buy Limit";
      } else if (TradeType == "4") {
        Trade_Type = "Sell Limit";
      }

      // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);

      let gramkg = "";
      if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
        gramkg = "gm";
      } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
        gramkg = "kg";
      }
      gramkg = Volume + " " + gramkg;
      var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;

      return (

        <TouchableWithoutFeedback
          onPress={() => this.onSelect(DealNo)}
        >
          <View style={[styles.itemRow, { height: RowHieght }]}>

            <View style={[{ flex: 1, margin: 5 }]}>
              {/* title Title */}
              <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <Text numberOfLines={1} style={[{ fontSize: 14, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
                {/* <Text style={[{fontSize:14,color:GLOBALS.COLOR.TEXT_COLOR,fontWeight:'500'}]}>{'P & L : ' + P_and_L}</Text> */}
              </View>
              {/*Rate */}
              <View style={[{ flex: 1, flexDirection: 'row' }]}>
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>
                  <Text style={[{ fontSize: 12, color: TradeType == "1" || TradeType == "3" ? GLOBALS.COLOR.RATE_UP : GLOBALS.COLOR.RATE_DOWN, marginTop: 5 }]}>
                    {Trade_Type}
                  </Text>
                  {str_Tyep_gram}
                </Text>

              </View>

              {isSelected ? <View style={[{ height: 40 }]}>
                {/* Date */}
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

                {/* Deal No */}
                <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
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
      Trade_Type = "Sell";
    } else if (TradeType == "3") {
      Trade_Type = "Buy Limit";
    } else if (TradeType == "4") {
      Trade_Type = "Sell Limit";
    }

    // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);
    let gramkg = "";
    if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
      gramkg = "gm";
    } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
      gramkg = "kg";
    }
    gramkg = Volume + " " + gramkg;
    var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;


    return (

      <TouchableWithoutFeedback
        onPress={() => this.onSelect(DealNo)}
      >
        <View style={[styles.itemRow, { height: RowHieght }]}>

          <View style={[{ flex: 1, margin: 5 }]}>
            {/* title Title */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text numberOfLines={1} style={[{ fontSize: 14, color: 'black', flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
              <TouchableOpacity onPress={() => this.onSelectEdit(item, index)}>
                <View style={[{ flex: 1, width: 20, alignItems: 'center', marginRight: 5 }]}>
                  {this.state.isTabLine == 1 ? editImage : null}
                </View>
              </TouchableOpacity>

            </View>
            {/*Rate */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>
                <Text style={[{ fontSize: 12, color: TradeType == "1" || TradeType == "3" ? GLOBALS.COLOR.RATE_UP : GLOBALS.COLOR.RATE_DOWN, marginTop: 5 }]}>
                  {Trade_Type}
                </Text>
                {str_Tyep_gram}
              </Text>
            </View>

            {isSelected ? <View style={[{ height: 40 }]}>
              {/* Date */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

              {/* Deal No */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
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
      Trade_Type = "Sell";
    } else if (TradeType == "3") {
      Trade_Type = "Buy Limit";
    } else if (TradeType == "4") {
      Trade_Type = "Sell Limit";
    }

    // let totalrate = parseFloat(parseFloat(Volume) * parseFloat(Prize)).toFixed(2);
    let gramkg = "";
    if (Source.toLocaleLowerCase().trim() == "gold" || Source.toLocaleLowerCase().trim() == "goldnext") {
      gramkg = "gm";
    } else if (Source.toLocaleLowerCase().trim() == "silver" || Source.toLocaleLowerCase().trim() == "silvernext") {
      gramkg = "kg";
    }
    gramkg = Volume + " " + gramkg;
    var str_Tyep_gram = ` (${gramkg}) : ${Rate} -> ${Total}`;


    return (

      <TouchableWithoutFeedback
        onPress={() => this.onSelect(DealNo)}
      >
        <View style={[styles.itemRow, { height: RowHieght }]}>

          <View style={[{ flex: 1, margin: 5 }]}>
            {/* title Title */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text numberOfLines={1} style={[{ fontSize: 14, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1, fontWeight: '700' }]}>{SymbolName}</Text>
            </View>
            {/*Rate */}
            <View style={[{ flex: 1, flexDirection: 'row' }]}>
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>
                <Text style={[{ fontSize: 12, color: TradeType == "1" || TradeType == "3" ? GLOBALS.COLOR.RATE_UP : GLOBALS.COLOR.RATE_DOWN, marginTop: 5 }]}>
                  {Trade_Type}
                </Text>
                {str_Tyep_gram}
              </Text>
            </View>

            {isSelected ? <View style={[{ height: 60 }]}>

              {/* ClosePrice */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{'Close Price : ' + ClosePrice}</Text>

              {/* Date */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{OpenTradeDateTime}</Text>

              {/* Deal No */}
              <Text style={[{ fontSize: 12, color: GLOBALS.COLOR.TEXT_COLOR, marginTop: 5 }]}>{'Deal No : ' + DealNo}</Text>
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
          {/* <View style={{height:0.5,width:'100%',backgroundColor:GLOBALS.COLOR.BLACK,flexDirection:'row'}}/> */}
          <View
            style={[
              {
                // margin: 8,
                backgroundColor: GLOBALS.COLOR.WHITE,
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
                backgroundColor: GLOBALS.COLOR.BLUE,
                borderColor: GLOBALS.COLOR.BLUE,
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
          <View style={{ height: 0.8, width: '100%', backgroundColor: GLOBALS.COLOR.BORDER_COLOR, flexDirection: 'row' }}></View>
          {this.state.Accountdetails.length > 0 ? <View
            style={[
              {
                margin: 8,
                flexDirection: 'column',
                //height: 30,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'flex-end', }}>
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{'Balance :'}</Text>
              <View style={{ height: 1, flex: 1, borderRadius: 0.5, marginBottom: 3, borderWidth: 0.4, borderColor: GLOBALS.COLOR.DARKGRAY, borderStyle: 'dashed' }} />
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{numberFormat(this.state.Accountdetails[0].Balance)}</Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'flex-end', marginVertical: 13 }}>
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{'Used Margin :'}</Text>
              <View style={{ height: 1, flex: 1, borderRadius: 0.5, marginBottom: 3, borderWidth: 0.4, borderColor: GLOBALS.COLOR.DARKGRAY, borderStyle: 'dashed' }} />
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{numberFormat(this.state.Accountdetails[0].UsedMargin)}</Text>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{'Free Margin :'}</Text>
              <View style={{ height: 1, flex: 1, borderRadius: 0.5, marginBottom: 3, borderWidth: 0.4, borderColor: GLOBALS.COLOR.DARKGRAY, borderStyle: 'dashed' }} />
              <Text style={{ color: GLOBALS.COLOR.TEXT_COLOR, fontSize: 14, }}>{numberFormat(this.state.Accountdetails[0].FreeMargin)}</Text>
            </View>



          </View> : null}
          <View style={[{
            backgroundColor: GLOBALS.COLOR.BLUE, height: 45, flexDirection: 'row', borderTopWidth: 0.5, borderBottomWidth: 0.8, borderColor: GLOBALS.COLOR.BORDER_COLOR
          }]}>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleNavigationIndex(0)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.WHITE, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Open \n Order"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isTabLine == 0 ? GLOBALS.COLOR.BLACK : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleNavigationIndex(1)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.WHITE, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Pending \nOrder"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isTabLine == 1 ? GLOBALS.COLOR.BLACK : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleNavigationIndex(2)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.WHITE, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Requests \nOrder"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isTabLine == 2 ? GLOBALS.COLOR.BLACK : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleNavigationIndex(3)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.WHITE, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Close \nTrade"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isTabLine == 3 ? GLOBALS.COLOR.BLACK : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={
                () => this.handleNavigationIndex(4)
              }>
              <View style={[{ flexDirection: 'column', flex: 1 }]}>
                <View style={[{ flexDirection: 'column', flex: 1, justifyContent: 'center' }]} >
                  <Text style={[{ color: GLOBALS.COLOR.WHITE, alignSelf: 'center', fontWeight: '700', fontSize: 12, textAlign: 'center' }]}>{"Deleted \nTrade"}</Text>
                </View>

                <View style={[{ backgroundColor: this.state.isTabLine == 4 ? GLOBALS.COLOR.BLACK : GLOBALS.COLOR.TRANSPARENT_COLOR, height: 1.5, bottom: 0 }]}></View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <ScrollView
            ref={(scr) => this._scrollView = scr}
            decelerationRate={0}
            scrollEventThrottle={0}
            style={{ width: Dimensions.get('window').width, backgroundColor: GLOBALS.COLOR.BG_COLOR }}
            horizontal={true}
            pagingEnabled={true}
            onScroll={(event) => this._onScroll(event)}
            //onMomentumScrollEnd={(event) => this._onScroll(event)}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            //nestedScrollEnabled={true}
            automaticallyAdjustContentInsets={false}
          >

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.OpenOrder}
                renderItem={this.renderItem.bind(this)}
                extraData={this.state}
              />

            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.LimitOrder}
                renderItem={this.renderItemLimit.bind(this)}
                extraData={this.state}
              />
            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.RequestOrder}
                renderItem={this.renderItem.bind(this)}
                extraData={this.state}
              />

            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.ClosedOrder}
                renderItem={this.renderCloseItem.bind(this)}
                extraData={this.state}
              />
            </View>

            <View style={{ width: width_window, flex: 1, marginTop: 0 }}>
              <FlatList
                contentContainerStyle={[{ flexGrow: 1, paddingBottom: 5 }]}
                keyExtractor={(item, index) => index.toString()}
                data={this.state.DeleteOrder}
                renderItem={this.renderItem.bind(this)}
                extraData={this.state}
              />
            </View>

          </ScrollView>

          {this.state.isModalUpdateAndDeleteLimit && <UpdateAndDeleteLimit
            modalVisible={this.state.isModalUpdateAndDeleteLimit}
            hideModal={this._hideSymbolEdit}
            OrderLimit={this.state.limitUpdatesSelecteditem}
            LimitRespons={(Orders) => this.setState({ LimitOrder: Orders })}
          />}

          {this.state.isProgress == true ? <View style={{
            position: 'absolute', flex: 1, alignItems: 'center',
            alignContent: 'center',
            alignSelf: 'center', height: "100%"
          }}><CustumProgress />
          </View> : null}

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
    backgroundColor: '#fcfcfc',
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.YELLOW,
    borderWidth: 1.0,
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

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
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
    borderColor: GLOBALS.COLOR.DARKGRAY,
    borderWidth: 0.5,
    borderRadius: 4,
    color: GLOBALS.COLOR.BLACK,
    backgroundColor: GLOBALS.COLOR.WHITE
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
    backgroundColor: GLOBALS.COLOR.BLUE,
  },
  submitButtonCancle: {

    padding: 10,
    marginTop: 7,
    margin: 5,
    marginBottom: 0,
    height: 40,
    borderRadius: 4,
    backgroundColor: GLOBALS.COLOR.BLUE,
  },
  submitButtonText: {
    color: GLOBALS.COLOR.WHITE,
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
    borderWidth: 0.5,
    height: 29,
    justifyContent: 'center',
  },
  textCalendar: {
    color: GLOBALS.COLOR.WHITE,
    fontSize: 14,
    textAlign: 'center',
  },

});

class UpdateAndDeleteLimit extends React.Component {
  constructor(props) {
    super(props);
    let OrderItems = this.props.OrderLimit;

    let grameKg = "";
    let source = OrderItems.Source.toLocaleLowerCase().trim()
    if (source == "gold" || source == "goldnext") {
      grameKg = "gm";
    } else {
      grameKg = 'kg';
    }

    this.state = {
      Price: OrderItems.Rate,
      Volume: OrderItems.Volume + ' ' + grameKg,
      SymbolName: OrderItems.SymbolName,
      DealNo: OrderItems.DealNo,

    };
  };

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
      { cancelable: false },
    );
  }

  handlePrice = (text) => {
    this.setState({ Price: text })
  }
  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  OrderUpdateLimitData(Price) {

    if (Price.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter price');
      return;
    }

    Alert.alert(
      GLOBALS.App_Name,
      'Are you sure you want to update ?',
      [
        {
          text: 'NO',
          onPress: () => console.log('NO Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.OrderUpadets(Price) },
      ],
      { cancelable: false },
    );

  }

  OrderUpadets = (Price) => {
    //var idMac = DeviceInfo.getUniqueID();

    if (Price.length == 0) {
      this.showAlert(GLOBALS.App_Name, 'Please enter Price');
    } else {

      this.setState({
        isProgress: true,
      })



      let itemP = this.props.OrderLimit;
      let updateLimit = new Object();
      updateLimit["DealNo"] = itemP.DealNo.toString();
      updateLimit["Volume"] = itemP.Volume.toString();
      updateLimit["Rate"] = Price.toString();
      updateLimit["Token"] = GLOBALS.Token_User_Login;
      updateLimit["OpenOrderID"] = itemP.OpenOrderID.toString();
      updateLimit["SymbolID"] = itemP.SymbolID.toString();
      updateLimit["TradeType"] = itemP.TradeType.toString();



      fetch(GLOBALS.Terminal_BASE_URL + 'UpdateLimitByDeal', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
        }),
        body: "{'ObjOrder':'" + JSON.stringify(updateLimit) + "'}",
      })
        .then(response => response.json())
        .then(responseJson => {
          try {

            if (responseJson.d != '') {


              let Obj = JSON.parse(responseJson.d);

              if (Obj["ReturnCode"] == "E511") {

                Alert.alert(
                  GLOBALS.App_Name,
                  Obj.ReturnMsg,
                  [{ text: 'OK', onPress: () => this.props.hideModal() }],
                  { cancelable: false },
                );

              } else {
                this.setState({ isProgress: false });
                this.showAlert(GLOBALS.App_Name, Obj.ReturnMsg);
              }
              this.setState({ isProgress: false });
            } else {
              this.setState({ isProgress: false });
            }
          } catch (error) {
            console.log('error', error);
          }
        })
        .catch(error => {
          console.log('error', error);
        });

    }
  }

  OrderDeleteClose() {
    let DealNo = this.props.OrderLimit.DealNo;
    Alert.alert(
      GLOBALS.App_Name,
      'Are you sure you want to delete the Deal : ' + DealNo + ' ?',
      [
        {
          text: 'NO',
          onPress: () => console.log('NO Pressed'),
          style: 'cancel',
        },
        { text: 'YES', onPress: () => this.DeleteCloseOrder(DealNo) },
      ],
      { cancelable: false },
    );

  }

  DeleteCloseOrder(DealNo) {

    this.setState({
      isProgress: true,
    })

    let objDeleteOrder = new Object();
    objDeleteOrder["LoginId"] = parseInt(GLOBALS.Client_LoginID)
    objDeleteOrder["DealNo"] = DealNo;
    objDeleteOrder["ClientId"] = GLOBALS.ClientID;
    objDeleteOrder["Token"] = GLOBALS.Token_User_Login;


    fetch(GLOBALS.Terminal_BASE_URL + 'DeleteCloseOrder', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: "{'ObjOrder':'" + JSON.stringify(objDeleteOrder) + "'}",
    })
      .then(response => response.json())
      .then(responseJson => {
        try {

          if (responseJson.d != '') {


            let Obj = JSON.parse(responseJson.d);

            if (Obj["ReturnCode"] == "E512") {
              NativeAppEventEmitter.emit("eventKeyOpenOderDetails");
              this.setState({ isProgress: false });

              Alert.alert(
                GLOBALS.App_Name,
                Obj.ReturnMsg,
                [{ text: 'OK', onPress: () => this.props.hideModal() }],
                { cancelable: false },
              );

            } else {
              this.setState({ isProgress: false });
              this.showAlert(GLOBALS.App_Name, Obj.ReturnMsg);
            }
            this.setState({ isProgress: false });
          } else {
            this.setState({ isProgress: false });
          }
        } catch (error) {
          console.log('error', error);
        }
      })
      .catch(error => {
        console.log('error', error);
      });

  }


  _focusNextField(nextField) {
    this.refs[nextField].focus()
  }

  render() {


    return (

      <Modal
        animationType='slide'
        transparent={true}
        closeModal={false}
        visible={this.props.modalVisible}
        onRequestClose={() => this.props.hideModal()}
      >
        <View style={[{ backgroundColor: 'black', opacity: 0.4, flex: 1 }]} />

        <View style={[{ position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'transparent', height: '100%', width: '100%' }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={[{ flex: 1, justifyContent: 'center' }]}>
            <DismissKeyboard>
              <View style={[{ flexDirection: 'column', marginHorizontal: 20, borderColor: GLOBALS.COLOR.BLUE, borderWidth: 2, borderRadius: 4, backgroundColor: GLOBALS.COLOR.WHITE, paddingBottom: 5 }]}>

                {/* <LinearGradient 
                  colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                  start={{ x: 0, y: 0}} 
                  end={{x: 0, y: 1}} 
                  style={[{backgroundColor:GLOBALS.COLOR.YELLOW,height:40,justifyContent:'center',alignItems:'center',borderTopLeftRadius:2,borderTopRightRadius:2}]}> */}
                <View style={[{ backgroundColor: GLOBALS.COLOR.BLUE, height: 40, justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 2, borderTopRightRadius: 2 }]}>
                  <Text style={[{ textAlign: 'center', color: GLOBALS.COLOR.WHITE, fontSize: 16, fontWeight: '700' }]}>UPDATE AND DELETE LIMIT</Text>
                </View>

                {/* <View style={[{hieght:100,backgroundColor:'red',flexDirection:'row',marginHorizontal:5,marginTop:5}]}>
                          <Text>Symbol Name : </Text>
                          <Text>{this.state.SymbolName.toString()}</Text>
                       </View> */}
                <View style={[{ backgroundColor: GLOBALS.COLOR.WHITE, flexDirection: 'column', marginHorizontal: 5, marginTop: 5, borderRadius: 4, borderColor: GLOBALS.COLOR.DARKGRAY, borderWidth: 1 }]}>
                  <View style={[{ flexDirection: 'row', padding: 8, backgroundColor: GLOBALS.COLOR.WHITE, marginRight: 1, borderRadius: 4 }]}>
                    <Text
                      style={[
                        { fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, width: 150 },
                      ]}>
                      Symbol Name
                    </Text>
                    <Text style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR }]}>
                      {'  :  '}
                    </Text>
                    <Text
                      style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1 }]}>
                      {this.state.SymbolName.toString()}
                    </Text>
                  </View>

                  <View style={[{ flexDirection: 'row', padding: 8, }]}>
                    <Text
                      style={[
                        { fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, width: 150 },
                      ]}>
                      Deal No
                    </Text>
                    <Text style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR }]}>
                      {'  :  '}
                    </Text>
                    <Text
                      style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1 }]}>
                      {this.state.DealNo.toString()}
                    </Text>
                  </View>

                  <View style={[{ flexDirection: 'row', padding: 8, }]}>
                    <Text
                      style={[
                        { fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, width: 150 },
                      ]}>
                      Quantity
                    </Text>
                    <Text style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR }]}>
                      {'  :  '}
                    </Text>
                    <Text
                      style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1 }]}>
                      {this.state.Volume.toString()}
                    </Text>
                  </View>




                  <View style={[{ flexDirection: 'row', paddingHorizontal: 8, paddingBottom: 8 }]}>
                    <View style={{ justifyContent: 'center' }}>
                      <Text
                        style={[
                          { fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, width: 150 },
                        ]}>
                        Price
                      </Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <Text style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR }]}>
                        {'  :  '}
                      </Text>
                    </View>

                    <TextInput
                      selectionColor={'black'}
                      style={styles.input}

                      ref={ref => this.textPriceRef = ref}
                      value={this.state.Price.toString()}
                      underlineColorAndroid={GLOBALS.COLOR.TRANSPARENT_COLOR}
                      placeholder="Price"
                      placeholderTextColor="gray"
                      textAlign="left"
                      autoCapitalize="none"
                      keyboardType="numeric"
                      onChangeText={this.handlePrice}
                      returnKeyType={'done'}
                      blurOnSubmit={true}
                    />
                  </View>

                </View>

                <View style={[{ flexDirection: 'column' }]}>
                  <View style={[{ flexDirection: 'row', marginTop: 3 }]}>
                    <View style={styles.submitButton} >
                      {/* <LinearGradient 
                                colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                                start={{ x: 0, y: 0}} 
                                end={{x: 0, y: 1}} 
                                style = {styles.submitButton} > */}
                      <TouchableOpacity
                        onPress={() => this.OrderUpdateLimitData(this.state.Price)}>
                        <Text style={styles.submitButtonText}> UPDATE LIMIT </Text>
                      </TouchableOpacity>

                    </View>

                    <View style={styles.submitButton} >
                      {/* <LinearGradient 
                                colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                                start={{ x: 0, y: 0}} 
                                end={{x: 0, y: 1}} 
                                style = {styles.submitButton} > */}
                      <TouchableOpacity
                        onPress={() => this.OrderDeleteClose()}>
                        <Text style={styles.submitButtonText}> DELETE LIMIT </Text>
                      </TouchableOpacity>

                    </View>
                  </View>

                  <View style={styles.submitButtonCancle} >
                    {/* <LinearGradient 
                                colors={[GLOBALS.COLOR.GLD_GRADIENT_START_COLOR, GLOBALS.COLOR.GLD_GRADIENT_END_COLOR]} 
                                start={{ x: 0, y: 0}} 
                                end={{x: 0, y: 1}} 
                                style = {styles.submitButtonCancle} > */}
                    <TouchableOpacity
                      onPress={
                        () => this.props.hideModal()
                      }>
                      <Text style={styles.submitButtonText}> CANCEL </Text>
                    </TouchableOpacity>

                  </View>
                </View>

              </View>
            </DismissKeyboard>
          </KeyboardAvoidingView>
        </View>

      </Modal>

    );
  }
}

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