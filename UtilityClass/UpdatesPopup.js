/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Linking,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import DeviceInfo from 'react-native-device-info';
export const USER_KEY = 'isLogin';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';

export default class UpdatesPopup extends React.Component {

  componentDidMount() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.getVersionLink();
      }
    });
  }
  componentWillUnmount() {
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        this.getVersionLink();
      }
    });
  }

  constructor() {
    super();
    console.warn();
  }
  state = {
    isModalpopup: false,
  };

  clickEventLink = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL(
        GLOBALS.iOSAppURL,
      ).catch(err => console.error('An error occurred', err));
    } else if (Platform.OS === 'android') {
      Linking.openURL(
        GLOBALS.AndroidAppURL,
      ).catch(err => console.error('An error occurred', err));
    } else {
    }
  };

  getVersionLink = () => {
    let Obj = new Object();

    Obj = JSON.stringify({
      ClientId: 2,
    });
    if (Platform.OS === 'ios') {
      var getBildVersionios = DeviceInfo.getVersion();
      fetch(GLOBALS.BASE_URL + 'GetVersionApple', {
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
          let serviceVersion = str.d;
          if (serviceVersion > getBildVersionios) {
            this.setState({ isModalpopup: true });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            isModalpopup: false,
          });
        });

    } else if (Platform.OS === 'android') {

      var getBildVersionAndroid = DeviceInfo.getVersion();

      fetch(GLOBALS.BASE_URL + 'GetVersionAndroid', {
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
          let serviceVersion = str.d;

          if (serviceVersion > getBildVersionAndroid) {
            this.setState({ isModalpopup: true });
          }
        })
        .catch(error => {
          console.error(error);
          this.setState({
            isModalpopup: false,
          });
        });
    }
  };

  render() {
    return (
      <Modal
        visible={this.state.isModalpopup}
        transparent={true}
        //onRequestClose={}
        animationType={'slide'}>
        <View style={styles.container}>
          <View style={styles.containerView}>
            <Image
              style={[
                { alignSelf: 'center', height: 95, width: '65%', resizeMode: 'contain', marginVertical: 20 },
              ]}
              source={require('../Images/OtrLogo.png')}
            />
            <Text
              style={[
                {
                  flexDirection: 'row',
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginHorizontal: 20,
                  color: GLOBALS.COLOR.BLACK,
                  fontSize: 17,
                  fontWeight: 'bold',
                  marginTop: 0,
                },
              ]}>
              {'New version is available, please update now for exploring best features of ' + GLOBALS.App_Name}
            </Text>

            <View
              style={styles.submitButton}>

              <TouchableOpacity onPress={() => this.clickEventLink()}>
                <Text style={styles.submitButtonText}> UPDATE NOW</Text>
              </TouchableOpacity>
              {/* </LinearGradient> */}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: GLOBALS.COLOR.HEADER_COLOR,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: GLOBALS.COLOR.YELLOW_COLOR,
  },
  input: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#D3D3D3',
    backgroundColor: GLOBALS.COLOR.WHITE,
    padding: 5,
  },
  submitButton: {
    padding: 10,
    margin: 20,
    height: 40,
    borderRadius: 4,
    backgroundColor: GLOBALS.COLOR.YELLOW,

    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { height: 0, width: 0 },
    elevation: 2,
  },
  submitButtonText: {
    color: GLOBALS.COLOR.WHITE,
    flexDirection: 'row',
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
