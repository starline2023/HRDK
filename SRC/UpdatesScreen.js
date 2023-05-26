/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-new-object */
/* eslint-disable no-undef */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeAppEventEmitter,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import DatePicker from '../UtilityClass/DatePicker';
import CustumProgress from '../UtilityClass/CustumProgress';
//import MarqueeTop from '../UtilityClass/MarqueeTop';
//import MarqueeBottom from '../UtilityClass/MarqueeBottom';

var StartDate = '';
var EndDate = '';

export default class UpdatesScreen extends React.Component {

  constructor() {
    super();
    console.warn();

    this.state = {
      isLoging: true,
      NewsData: '',
      isConnected: true,
      Marque: '',
      Marque_Bottom: '',
    };
  }

  componentDidMount() {

    this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', params =>
      this.handleEvent(params),
    );

    var dateA = new Date()
      .getDate()
      .toString()
      .padStart(2, 0); //Current Date
    var monthA = (new Date().getMonth() + 1).toString().padStart(2, 0); //Current Month
    var yearA = new Date().getFullYear(); //Current Year
    this.StartDate = `${dateA}/${monthA}/${yearA}`;
    this.EndDate = `${dateA}/${monthA}/${yearA}`;

    this.willFocusSubscription = this.props.navigation.addListener('willFocus', () => {
      this.SearchDate(this.StartDate, this.EndDate, false);
    }
    );

    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.SearchDate(this.StartDate, this.EndDate, true);
      }
    });
  }

  handleEvent = () => {
    let C_Detaild = GLOBALS.ContactDetail;

    if (C_Detaild != '') {
      this.setState({ Marque: C_Detaild.Marquee });
      this.setState({ Marque_Bottom: C_Detaild.Marquee2 });
    }
  }

  SearchDate(StartDate, EndDate, isProgress) {
    this.setState({ isLoging: isProgress });
    let Obj = new Object();

    Obj = JSON.stringify({
      StartDate: StartDate,
      EndDate: EndDate,
      Client: GLOBALS.ClientID,
    });

    fetch(GLOBALS.BASE_URL + 'GetNewsDateWise', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify({
        Obj: Obj,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          let obj = new Object();
          if (responseJson.d != '') {
            obj = JSON.parse(responseJson.d);

            if (obj.length > 0) {
              this.setState({
                isLoging: false,
                NewsData: Object.values(obj),
              });

            } else {
              this.setState({
                isLoging: false,
                NewsData: [],
              });
            }
          } else {
            this.setState({
              isLoging: false,
              NewsData: [],
            });
          }
        } catch (error) { }
      })
      .catch(error => {
      });
  }

  renderItem(data) {
    let { item } = data;
    if (item == "") { return }

    return (
      <View style={styles.itemRow}>
        <View style={styles.itemDateLeftView}>
          {/* title Date */}
          <Text
            style={[
              {
                fontSize: 20,
                color: GLOBALS.COLOR.BLUE,
                fontWeight: 'bold',
                marginVertical: 1,
              },
            ]}>
            {item.Day}
          </Text>

          {/* time month */}
          <Text
            style={[
              {
                fontSize: 15,
                color: GLOBALS.COLOR.BLUE,
                fontWeight: 'bold',
                marginVertical: 1,
              },
            ]}>
            {item.Month + ' ' + item.Year}
          </Text>
        </View>

        <View style={styles.itemLine} />

        <View style={styles.itemDetailRieghtView}>
          {/* title Title */}
          <Text
            style={[
              {
                fontSize: 16,
                color: GLOBALS.COLOR.BLUE,
                fontWeight: 'bold',
                marginVertical: 3,
              },
            ]}>
            {item.Title}
          </Text>

          {/* time time */}
          <Text style={[{ fontSize: 13, color: GLOBALS.COLOR.TEXT_COLOR, marginVertical: 3 }]}>
            {item.Time}
          </Text>

          {/* Description Description */}
          <Text style={[{ fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, marginVertical: 3 }]}>
            {item.Description}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <MarqueeTop /> */}
        {/* <View style={{height:1,width:'100%',backgroundColor:GLOBALS.COLOR.YELLOW,flexDirection:'row'}}></View> */}
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
            onPress={() => this.SearchDate(this.StartDate, this.EndDate, true)}
            style={{
              backgroundColor: GLOBALS.COLOR.BLUE,
              borderColor: GLOBALS.COLOR.BLUE,
              marginHorizontal: 4,
              marginRight: 8,
              width: 70,
              borderRadius: 4,
              borderWidth: 1,
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

        <View style={{ height: 0.8, width: '100%', backgroundColor: GLOBALS.COLOR.YELLOW, flexDirection: 'row' }}></View>

        {this.state.isLoging ? (
          <CustumProgress />
        ) : (
          <View style={[{ flex: 1 }]}>
            {this.state.NewsData.length > 0 ? (
              <ScrollView>
                <FlatList
                  keyExtractor={this._keyExtractor}
                  data={this.state.NewsData}
                  renderItem={this.renderItem.bind(this)}
                />
                <View style={[{ height: 5 }]} />
              </ScrollView>
            ) : (
              <View
                style={[
                  {
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                  },
                ]}>
                <Text
                  style={[
                    {
                      textAlignVertical: 'center',
                      fontWeight: 'bold',
                      color: GLOBALS.COLOR.TEXT_COLOR,
                    },
                  ]}>
                  {'Updates Not Available'}
                </Text>
              </View>
            )}
          </View>
        )}
        {/* <MarqueeBottom /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 3,
    // paddingLeft: 7,
    // paddingRight: 7,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  //* List Row
  itemRow: {
    flexDirection: 'row',
    marginTop: 7,
    marginHorizontal: 5,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.BORDER_COLOR,
    borderWidth: 2,

    // shadowOffset: {width: 4, height: 4},
    // shadowColor: 'black',
    // shadowOpacity: 0,
    // shadowRadius: 0,
    // elevation: 0,
  },
  itemDateLeftView: {
    flexDirection: 'column',
    marginLeft: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetailRieghtView: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 7,
    marginBottom: 7,
    marginRight: 7,
    alignItems: 'flex-start',
  },
  itemLine: {
    flexDirection: 'column',
    width: 1,
    margin: 7,
    alignItems: 'flex-start',
    backgroundColor: GLOBALS.COLOR.YELLOW,
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
    color: GLOBALS.COLOR.WHITE,
    fontSize: 14,
    textAlign: 'center',
  },
});
