/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {ActivityIndicator, View, StyleSheet, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GLOBALS from '../UtilityClass/Globals';
class CustumProgress extends Component {
  // state = {animating: true};

  // closeActivityIndicator = () =>
  //   setTimeout(
  //     () =>
  //       this.setState({
  //         animating: false,
  //       }),
  //     60000,
  //   );

  // componentDidMount = () => this.closeActivityIndicator();
  render() {
    // const animating = this.state.animating;
    return (
      <View style={[styles.container]}>
        <View style={[
              {
                width: 70,
                height: 65,
                borderRadius: 8,
                position: 'absolute',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:GLOBALS.COLOR.YELLOW,
                
                shadowColor:'gray',
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {height: 0, width: 0},
                elevation: 5,
              },
            ]}>
    
          <ActivityIndicator            
            style={[
              {
                alignItems: 'center',
                alignContent: 'center',
                alignSelf:'center',
                top: Platform.OS == 'ios' ? 1.5 : 0,
                left: Platform.OS == 'ios' ? 1.5 : 0,
              },
            ]}
            size="large"
            color={GLOBALS.COLOR.WHITE}
          />
        </View>
      </View>
    );
  }
}
export default CustumProgress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GLOBALS.COLOR.TRANSPARENT_COLOR,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});
