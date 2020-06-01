import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
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
    /**
     * _.pickBy(object, [predicate=_.identity])
     * 创建一个对象，这个对象组成为从 object 中经 predicate 判断为真值的属性。 predicate调用2个参数：(value, key)
     */
    const animatedColor = _.pickBy(props, (value, key) => {
      return (
        key.indexOf('animatedColor') !== -1 &&
        value &&
        typeof value === 'string'
      );
    });
    /**
     * _.values(object)
     * 创建 object 自身可枚举属性的值为数组。
     *
     */
    return _.values(animatedColor);
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

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface LinearAnimatedGradientTransitionProps extends LinearGradientProps {
  animation?: Animated.TimingAnimationConfig;
}

interface LinearAnimatedGradientTransitionState {
  colors: (string | number)[];
  prevColors: (string | number)[];
  animatedColors: Animated.Value[];
}

class LinearAnimatedGradientTransition extends Component<
  LinearAnimatedGradientTransitionProps,
  LinearAnimatedGradientTransitionState
> {
  static defaultProps = {
    animation: {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    },
  };

  constructor(props: LinearAnimatedGradientTransitionProps) {
    super(props);

    this.state = {
      colors: props.colors,
      prevColors: props.colors,
      animatedColors: props.colors.map(() => new Animated.Value(0)),
    };
  }

  static getDerivedStateFromProps(
    nextProps: LinearAnimatedGradientTransitionProps,
    prevState: LinearAnimatedGradientTransitionState
  ) {
    const keys = ['colors'];
    /**
     * _.pick(object, [props])
     * 创建一个从 object 中选中的属性的对象。
     */
    const mutableProps = _.pick(nextProps, keys);
    const stateToCompare = _.pick(prevState, keys);
    let animatedColors = prevState.animatedColors;

    animatedColors = LinearAnimatedGradientTransition.animateGradientTransition(
      animatedColors,
      mutableProps.colors || [],
      prevState.colors,
      (nextProps.animation =
        LinearAnimatedGradientTransition.defaultProps.animation)
    );

    if (!_.isEqual(mutableProps, stateToCompare)) {
      return {
        ...mutableProps,
        animatedColors,
        prevColors: prevState.colors,
      };
    }

    return null;
  }

  static animateGradientTransition(
    animatedColors: Animated.Value[],
    curColors: (string | number)[],
    prevColors: (string | number)[],
    animation: Animated.TimingAnimationConfig
  ) {
    // Animate only if the new colors are different
    if (!_.isEqual(prevColors, curColors)) {
      // Update number of animatedValue if the length is different
      if (animatedColors.length !== curColors.length) {
        animatedColors = curColors.map(() => new Animated.Value(0));
      } else {
        animatedColors.forEach((animatedColor: Animated.Value) =>
          animatedColor.setValue(0)
        );
      }

      // Parallel animation of all background colors
      Animated.parallel(
        animatedColors.map((animatedColor: Animated.Value) => {
          return Animated.timing(animatedColor, {
            toValue: animation.toValue,
            duration: animation.duration,
            easing: animation.easing,
            useNativeDriver: animation.useNativeDriver,
          });
        })
      ).start();
    }

    return animatedColors;
  }

  _getColorSafely(colors: (string | number)[], index: number) {
    if (colors[index]) {
      return colors[index];
    }

    return colors.slice(-1)[0];
  }

  _getInterpolatedColors() {
    const { colors, prevColors, animatedColors } = this.state;

    return animatedColors.map((animatedColor, index) => {
      const start = this._getColorSafely(prevColors, index);
      const end = this._getColorSafely(colors, index);
      if (typeof start === 'string' && typeof end === 'string') {
        return animatedColor.interpolate({
          inputRange: [0, 1],
          outputRange: [start, end],
        });
      } else if (typeof start === 'number' && typeof end === 'number') {
        return animatedColor.interpolate({
          inputRange: [0, 1],
          outputRange: [start, end],
        });
      }
      return new Animated.Value(0);
    });
  }

  // Send all colors as props to enable Animated api to transform it
  _generateColorsProps(interpolatedColors: Animated.AnimatedInterpolation[]) {
    let props: { [animatedColor: string]: Animated.AnimatedInterpolation } = {};

    interpolatedColors.forEach((interpolateColor, index) => {
      const key = `animatedColor${index}`;

      props = _.merge(props, {
        [key]: interpolateColor,
      });

      return {
        [key]: interpolateColor,
      };
    });

    return props;
  }

  render() {
    const { children, ...props } = this.props;
    const interpolatedColors = this._getInterpolatedColors();
    const animatedColorsProps = this._generateColorsProps(interpolatedColors);
    return (
      <AnimatedLinearGradient {...props} {...animatedColorsProps}>
        {children}
      </AnimatedLinearGradient>
    );
  }
}

export default LinearAnimatedGradientTransition;
