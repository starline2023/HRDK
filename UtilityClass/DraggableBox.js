/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Animated,
  StyleSheet,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  View,
} from 'react-native';
import GLOBALS from '../UtilityClass/Globals';
import LinearGradient from 'react-native-linear-gradient';
import {AppTourView} from 'imokhles-react-native-app-tour';
import {
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

import t from 'prop-types';
let Window = Dimensions.get('window');

const IS_IPHONE_6plus = (Window.height == 736.0 ? true : false);
const IS_IPHONE_6 = (Window.height == 667.0 ? true : false);
const IS_IPHONE_5 = (Window.height == 568.0 ? true : false);
const IS_IPHONE_4s = (Window.height == 480.0 ? true : false);

let bottomPadding;

if (Platform.OS == "ios") {
  if (IS_IPHONE_5 || IS_IPHONE_6 || IS_IPHONE_6plus || IS_IPHONE_4s) {
    bottomPadding = 90;     
  } else {
    bottomPadding = 120;    
  }
} else {
  bottomPadding = 100;
}

export default class DraggableBox extends Component {
  static propTypes = {
    Clickevent: t.func.isRequired,
  };
  constructor(props) {
    super(props);
    this._translateX = new Animated.Value(0);
    this._translateY = new Animated.Value(0);
    this._lastOffset = {x: 0, y: 0};    
    
    this._onGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY,
          },
        },
      ],
      {useNativeDriver: true},
    );

    this.state = {
      isModalVisible: false,
    };
  }

  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };
  handleClick = () => {
    this.setState({isModalVisible: true});
  };

  closeModal = () => {
    this.setState({isModalVisible: false});
  };

  render() {
    const {props} = this;
    return (
      <PanGestureHandler
        {...this.props}
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}>
        <Animated.View
          onTouchEnd={() => props.Clickevent()}
          style={[
            styles.box,
            {
              transform: [
                {translateX: this._translateX},
                {translateY: this._translateY},
              ],
            },
            this.props.boxStyle,
          ]}>
          <LinearGradient
            colors={[GLOBALS.COLOR.GRADIENT_1_COLOR, GLOBALS.COLOR.GRADIENT_2_COLOR, GLOBALS.COLOR.GRADIENT_3_COLOR]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          style={[
            {
              position: 'absolute',
              backgroundColor: GLOBALS.COLOR.YELLOW,
              opacity: 0.9,
              width: 50,
              height: 50,
              borderRadius: 25,
              borderColor:GLOBALS.COLOR.BORDER_COLOR,
              borderWidth: 0.8,             
            },
          ]}
        />
          <TouchableWithoutFeedback
            style={[
              {
                flex: 1,
              },
            ]}
            key={'Bottom Call'}
            title={''}
            ref={ref => {
              if (!ref) {
                return;
              }

              let props = {
                order: 32,
                title: 'Booking Number',
                titleTextColor:'white',
                titleTextSize: 25,
                description: 'Tap here to call for booking.',
                descriptionTextColor:'white',
                descriptionTextSize: 18,
                outerCircleColor: GLOBALS.COLOR.WHITE,
                targetCircleColor:'#000000',
              };

              this.props.addAppTourTarget &&
                this.props.addAppTourTarget(AppTourView.for(ref, {...props}));
            }}
            onPress={() => {}}>
            <Image
              style={[
                {
                  width: 25,
                  height: 25,
                  alignSelf: 'center',
                  flex: 1,
                  resizeMode: 'contain',
                  tintColor:GLOBALS.COLOR.WHITE,
                },
              ]}
              source={require('../Images/ic_call.png')}
            />
          </TouchableWithoutFeedback>
        </Animated.View>
      </PanGestureHandler>
    );
  }
}

let CIRCLE_RADIUS = 25;
Window = Dimensions.get('window');
const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignSelf: 'center',
    zIndex: 200,
    top: Window.height - CIRCLE_RADIUS - bottomPadding,
    left: 50 - CIRCLE_RADIUS,
    borderRadius: CIRCLE_RADIUS,
    // shadowColor: 'grey',
    // shadowOffset: {width: 3, height: 3},
    // shadowRadius: 5,
    // shadowOpacity: 1.0,
  },
});
