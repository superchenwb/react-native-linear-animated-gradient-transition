import React, { Component } from 'react';
import { Animated } from 'react-native';
import _ from 'lodash';

import NativeLinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

type IProps = LinearGradientProps & {
  [animatedColor: string]: string;
};

class LinearGradient extends Component<IProps> {
  // Generate back the colors array with all transformed props
  _generateColorsArray(props: IProps) {
    const propsKeys = Object.keys(props);
    const colorsArray: string[] = [];

    propsKeys.forEach((key) => {
      if (
        key.indexOf('animatedColor') !== -1 &&
        props[key] &&
        typeof props[key] === 'string'
      ) {
        colorsArray.push(props[key]);
      }
    });

    return colorsArray;
  }

  render() {
    const { children, ...props } = this.props;
    const colorsArray = this._generateColorsArray(props);
    const nativeLinearProps = _.omit(props, Object.keys(colorsArray));

    return (
      <NativeLinearGradient {...nativeLinearProps} colors={colorsArray}>
        {children}
      </NativeLinearGradient>
    );
  }
}

export default Animated.createAnimatedComponent(LinearGradient) as any;
