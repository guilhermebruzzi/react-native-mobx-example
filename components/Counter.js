import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Button from 'react-native-button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    margin: 10,
  },
});

const Counter = ({ store }) => {
  const goToPageTwo = (url) => store.navigate({ name: 'pageTwo', url });
  const goToWebview = (url) => () => goToPageTwo(url);
  return (<View style={styles.container}>
    <Text style={styles.welcome}>
      Welcome to React Native Reactive!
    </Text>
    <Text>Counter: {store.counter}</Text>
    <Text>Total clicks: {store.total}</Text>
    <Button onPress={store.increase}>+</Button>
    <Button onPress={store.decrease}>-</Button>
    <Button onPress={goToWebview('http://g1.globo.com')} style={styles.button}> Go to webview g1</Button>
    <Button onPress={goToWebview('http://globoesporte.globo.com')} style={styles.button}> Go to webview ge</Button>
    <Button onPress={goToWebview('http://gshow.globo.com')} style={styles.button}> Go to webview gshow</Button>
  </View>);
};

Counter.propTypes = {
  store: PropTypes.object,
};

export default Counter;
