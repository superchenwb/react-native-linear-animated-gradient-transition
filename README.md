# react-native-linear-animated-gradient-transition

`<LinearAnimatedGradientTransition>` component for react-native.
The component draws a linear gradient and does the transition animation automatically when the `colors` prop is changed.

This component uses [react-native-linear-gradient](https://github.com/react-native-community/react-native-linear-gradient)
and is based on their [example](https://github.com/react-native-community/react-native-linear-gradient/tree/master/Examples/AnimatedGradientTransition).

## Installation

```sh
npm install react-native-linear-animated-gradient-transition
```

## Usage

```js
import { StyleSheet, View, Button } from 'react-native';
import LinearAnimatedGradientTransition from 'react-native-linear-animated-gradient-transition';

export default function App() {
  const [clicked, setClicked] = React.useState<boolean>();
  return (
    <View style={styles.container}>
      <LinearAnimatedGradientTransition
        style={styles.gradient}
        colors={clicked ? ['#F37144', '#F0A148'] : ['#2b32b2', '#1488cc']}
      />
      <Button title="Click" onPress={() => setClicked(!clicked)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: 200,
    height: 200,
    margin: 20,
  },
});

```

## License

MIT
