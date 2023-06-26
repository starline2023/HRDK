/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import AutoScrolling from 'react-native-auto-scrolling';
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../UtilityClass/Globals';

class MarqueeTop extends Component {

  constructor() {
    super();
    console.warn();
    this.state = {
      key: 1, // add a key property to force re-render
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(prevState => ({
        key: prevState.key + 1, // change key value to force re-render
      }));
    }, 20000); // re-render every 5 seconds
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <View>
        {GLOBALS.ProductHeader.MARQUE != null && GLOBALS.ProductHeader.MARQUE != "" && GLOBALS.ProductHeader.MARQUE != " " ? (

          // <View style={[
          //     {backgroundColor: GLOBALS.COLOR.BLUE, flexDirection: 'row',},
          // ]}>
          <LinearGradient
          colors={['white', 'white', 'white']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            key={this.state.key}
            style={{ flexDirection: 'row' , borderColor:GLOBALS.COLOR.BORDER_COLOR,borderWidth:1}}>

            <AutoScrolling
              style={[
                { backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR, flexDirection: 'row', padding: 5, }
              ]}
              endPadding={50}>
              <Text style={[{ color: GLOBALS.COLOR.BLACK, textAlign: 'center', fontWeight: '700' }]}>
                {GLOBALS.ProductHeader.MARQUE}
              </Text>
            </AutoScrolling>

          </LinearGradient>
        ) : null}

      </View>
    );
  }
}
export default MarqueeTop;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GLOBALS.COLOR.MARQUE_BG,
    flexDirection: 'row',

    shadowColor: 'darkgray',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowOffset: { height: 0, width: 2 },
    elevation: 5,
  },
});
