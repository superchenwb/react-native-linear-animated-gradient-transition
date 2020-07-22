import React, { Component } from 'react';
import { Easing, Animated } from 'react-native';
import _ from 'lodash';
import AnimatedLinearGradient from './AnimatedLinearGradient';
import type { LinearGradientProps } from 'react-native-linear-gradient';

export interface IProps extends LinearGradientProps {
  animation?: Animated.TimingAnimationConfig;
}

interface IState {
  colors: (string | number)[];
  prevColors: (string | number)[];
  animatedColors: Animated.Value[];
}

class AnimatedGradientTransition extends Component<IProps, IState> {
  static defaultProps = {
    colors: ['#fff', '#fff'],
    animation: {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false,
    },
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      colors: props.colors,
      prevColors: props.colors,
      animatedColors: props.colors.map(() => new Animated.Value(0)),
    };
  }

  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    const keys = ['colors'];
    const mutableProps = _.pick(nextProps, keys);
    const stateToCompare = _.pick(prevState, keys);
    let animatedColors = prevState.animatedColors;

    animatedColors = AnimatedGradientTransition.animateGradientTransition(
      animatedColors,
      mutableProps.colors,
      prevState.colors,
      (nextProps.animation = AnimatedGradientTransition.defaultProps.animation)
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
    curColors: (string | number)[] | undefined,
    prevColors: (string | number)[],
    animation: Animated.TimingAnimationConfig
  ) {
    // Animate only if the new colors are different
    if (!_.isEqual(prevColors, curColors)) {
      // Update number of animatedValue if the length is different
      if (curColors && animatedColors.length !== curColors.length) {
        animatedColors = curColors.map(() => new Animated.Value(0));
      } else {
        animatedColors.forEach((animatedColor) => animatedColor.setValue(0));
      }

      // Parallel animation of all background colors
      Animated.parallel(
        animatedColors.map((animatedColor) => {
          return Animated.timing(animatedColor, {
            toValue: animation.toValue,
            duration: animation.duration,
            easing: animation.easing,
            useNativeDriver: false,
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
    let props = {};

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
    const otherProps = _.omit(props, 'animation');
    return (
      <AnimatedLinearGradient {...otherProps} {...animatedColorsProps}>
        <>{children}</>
      </AnimatedLinearGradient>
    );
  }
}

export default AnimatedGradientTransition;
