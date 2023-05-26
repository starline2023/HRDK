/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-new-object */
import React from 'react';
import {StyleSheet, Text, View,NativeAppEventEmitter,ImageBackground} from 'react-native';
import WebView from 'react-native-webview';
import GLOBALS from '../UtilityClass/Globals';
import NetInfo from '@react-native-community/netinfo';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
import CustumProgress from '../UtilityClass/CustumProgress';
import AutoScrolling from 'react-native-auto-scrolling';
import MarqueeBottom from '../UtilityClass/MarqueeBottom';
import MarqueeTop from '../UtilityClass/MarqueeTop';

const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width,width=device-width initial-scale=0.9, maximum-scale=0.9, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
let HTML = `
<script type="text/javascript" src="https://c.mql5.com/js/widgets/calendar/widget.js?6"></script>
<div id="economicCalendarWidget"></div>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
<script type="text/javascript">
    new economicCalendar({ width: "100%", height: "100%", mode: 1, lang: "en" });
</script>
`;

export default class EconomicCalenderScreen extends React.Component {
  constructor() {
    super();
    console.warn();

    this.state = {
      isLoging: false,
      NewsData: '',
      Marque: '',
      Marque_Bottom: '',
    };
  }

  componentDidMount() {
    this.handleEvent();
    this.eventListener = NativeAppEventEmitter.addListener('eventKey', params =>
      this.handleEvent(params),
    );
  }
  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
  }
  handleEvent = () => {
    let C_Detaild = GLOBALS.ContactDetail;

    if (C_Detaild != '') {

      this.setState({Marque: C_Detaild.Marquee});
      this.setState({Marque_Bottom: C_Detaild.Marquee2});
     
    }
  }

  render() {
    // if (this.state.isLoging) {
    //   return <CustumProgress />;
    // } else {
      return (
        <ImageBackground
          style={[{width: '100%', height: '100%',backgroundColor:GLOBALS.COLOR.IMG_BG_COLOR}]}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../Images/bg.png')}>
        <View style={{flex: 1}}>
          <MarqueeTop />
          <View style={styles.container}>
           
          <WebView
                style={{
                  flex: 1,
                  backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
                  marginTop: 5,
                }}
                scrollEnabled={false}
                source={{html: HTML}}
                javaScriptEnabled={true}
                startInLoadingState={true}
                injectedJavaScript={INJECTEDJAVASCRIPT}
              />
            
          </View>
            <MarqueeBottom />
        </View>
       </ImageBackground>
      );
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    marginBottom: -30,
    backgroundColor: GLOBALS.COLOR.BG_COLOR,
  },
});