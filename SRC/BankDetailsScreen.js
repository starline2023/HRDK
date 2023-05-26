/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-new-object */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import CustumProgress from '../UtilityClass/CustumProgress';
let deviceWidth = Dimensions.get('window').width;
import MarqueeTop from '../UtilityClass/MarqueeTop';
import MarqueeBottom from '../UtilityClass/MarqueeBottom';

export default class BankDetailsScreen extends React.Component {

  constructor() {
    super();
    console.warn();

    this.state = {
      isLoging: true,
      NewsData: '',
    };
  }

  componentDidMount() {
    this.getSurfaces();
    NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      if (state.isConnected) {
        this.getSurfaces();
      }
    });
  }

  getSurfaces() {
    fetch(GLOBALS.BASE_URL + 'BankDetail', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=utf-8', // <-- Specifying the Content-Type
      }),
      body: JSON.stringify({
        ClientId: GLOBALS.ClientID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        try {
          let obj = new Object();
          if (responseJson.d != '') {
            obj = JSON.parse(responseJson.d);
          }
          this.setState({
            isLoging: false,
            NewsData: Object.values(obj),
          });
        } catch (error) {}
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentWillUnmount() {
  }

  renderItem(data) {
    let {item} = data;

    return (
      <View style={styles.itemRow}>
        <View
          style={[
            {flexDirection: 'column', flex: 1, justifyContent: 'center'},
          ]}>
          <View
            style={[
              {
                height: 60,
                flexDirection: 'row',
                justifyContent: 'center',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                // borderColor: GLOBALS.COLOR.BORDER_COLOR,
                // borderWidth: 1,
              },
            ]}>
            <Image
              style={[
                {
                  height: 60,
                  width: deviceWidth - 17,
                  resizeMode: 'stretch',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,                  
                  // marginTop: 1,
                },
              ]}
              source={{
                uri: item.BankLogo
              }}
            />
          </View>

          <View style={styles.itemDetailRieghtView}>
            {/*  BankName */}
            <View style={[{flexDirection: 'row', marginTop: 2}]}>
              <Text
                style={[
                  {fontSize: 16, color: GLOBALS.COLOR.BLUE, width: 150},
                ]}>
                Bank Name
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR}]}>
                {'  ::  '}
              </Text>
              <Text
                style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1}]}>
                {item.BankName}
              </Text>
            </View>

            {/*  AccountName */}
            <View style={[{flexDirection: 'row', marginTop: 10}]}>
              <Text
                style={[
                  {fontSize: 16, color: GLOBALS.COLOR.BLUE, width: 150},
                ]}>
                Account Name
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR}]}>
                {'  ::  '}
              </Text>
              <Text
                style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1}]}>
                {item.AccountName}
              </Text>
            </View>

            {/* AccountNo */}
            <View style={[{flexDirection: 'row', marginTop: 10}]}>
              <Text
                style={[
                  {fontSize: 16, color: GLOBALS.COLOR.BLUE, width: 150},
                ]}>
                Account No
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR}]}>
                {'  ::  '}
              </Text>
              <Text
                style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1}]}>
                {item.AccountNo}
              </Text>
            </View>

            {/* Ifsc */}
            <View style={[{flexDirection: 'row', marginTop: 10}]}>
              <Text
                style={[
                  {fontSize: 16, color: GLOBALS.COLOR.BLUE, width: 150},
                ]}>
                IFSC Code
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR}]}>
                {'  ::  '}
              </Text>
              <Text
                style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1}]}>
                {item.Ifsc}
              </Text>
            </View>

            {/* BranchName */}
            <View style={[{flexDirection: 'row', marginTop: 10}]}>
              <Text
                style={[
                  {fontSize: 16, color: GLOBALS.COLOR.BLUE, width: 150},
                ]}>
                Branch Name
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR}]}>
                {'  ::  '}
              </Text>
              <Text style={[{fontSize: 16, color: GLOBALS.COLOR.TEXT_COLOR, flex: 1}]}>
                {item.BranchName}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  render() {
    if (this.state.isLoging) {
      return <CustumProgress />;
    } else {
      return (
        <View style={styles.container}>
          {/* <MarqueeTop />  */}
          {this.state.NewsData.length > 0 ? (
            <ScrollView>
              <FlatList
                keyExtractor={this._keyExtractor}
                data={this.state.NewsData}
                renderItem={this.renderItem.bind(this)}
              />
              <View style={[{height: 5}]} />
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
                {'Bank Detail Not Available'}
              </Text>
            </View>
          )}
          {/* <MarqueeBottom /> */}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    // paddingLeft: 7,
    // paddingRight: 7,
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  //* List Row
  itemRow: {
    flexDirection: 'row',
    // marginTop: 7,
    margin:7,
    backgroundColor: GLOBALS.COLOR.PRODUCT_BG,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.YELLOW_COLOR,
    borderWidth: 2,

    // shadowOffset: {width: 4, height: 4},
    // shadowColor: 'gray',
    // shadowOpacity: 0,
    // shadowRadius: 0,
    // elevation: 0,
  },
  itemDetailRieghtView: {
    flex: 1,
    flexDirection: 'column',
    margin: 7,
    alignItems: 'flex-start',
  },
});
