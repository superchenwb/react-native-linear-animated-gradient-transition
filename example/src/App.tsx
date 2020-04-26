import * as React from 'react';
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
