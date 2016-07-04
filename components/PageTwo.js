import React, { Component, PropTypes } from 'react';
import {
  View,
  WebView,
  StyleSheet,
} from 'react-native';
import {
  reaction,
} from 'mobx';
import Button from 'react-native-button';
import autobind from 'autobind-decorator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  addressBarRow: {
    flexDirection: 'column',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#cccccc',
  },
  button: {
    flex: 1,
    textAlign: 'left',
    margin: 10,
  },
  webView: {
    backgroundColor: '#eeeeee',
    marginTop: 60,
    flex: 1,
  },
});

const normalizeUrl = (url) => {
  if (!url) {
    return url;
  }
  return url.trim().replace(/\/$/, '').split('#')[0];
};

class PageTwo extends Component {

  constructor(props) {
    super(props);
    this.lastUrl = null;
    this.webview = null;
    const store = this.props.store;
    reaction(() => store.currentScene.url, () => {
      console.log('PageTwo reaction currentScene.url');
      const url = normalizeUrl(store.currentScene.url);
      const shouldUpdate = url
        && normalizeUrl(store.currentScene.webviewUrl) !== url
        && this.lastUrl !== url
        && store.currentScene.name === 'pageTwo';
      if (shouldUpdate) {
        console.log('webview updating webviewUrl',
          url, this.lastUrl, store.currentScene.webviewUrl
        );
        store.currentScene.webviewUrl = store.currentScene.url;
      }
    });
    reaction(() => store.currentScene.shouldGoBack, () => {
      console.log('PageTwo reaction shouldGoBack');
      const currentScene = store.currentScene;
      if (currentScene.shouldGoBack && this.webview) {
        console.log('webview goBack');
        this.webview.goBack();
        currentScene.shouldGoBack = false;
      }
    });
  }

  @autobind
  onNavigationStateChange(navState) {
    console.log('webview navState', navState);
    const store = this.props.store;
    store.updateScene({ url: navState.url, canGoBack: navState.canGoBack });
  }

  @autobind
  onShouldStartLoadWithRequest(event) {
    // Implement any custom loading logic here, don't forget to return!
    console.log('webview event', event);
    const store = this.props.store;
    const currentScene = store.currentScene;
    if (currentScene.canGoBack !== event.canGoBack) {
      console.log('webview event canGoBack');
      store.updateScene({ canGoBack: event.canGoBack });
    }

    return true;
  }

  render() {
    const store = this.props.store;
    this.lastUrl = normalizeUrl(store.currentScene.webviewUrl);
    const goToPageCounter = () => store.navigate({ name: 'counter' });
    const goToPageTwo = (url) => store.navigate({ name: 'pageTwo', url });
    const goToWebview = (url) => () => goToPageTwo(url);
    console.log('PageTwo render', store.currentScene.webviewUrl);
    return (<View style={styles.container}>
      <WebView
        ref={(webview) => { this.webview = webview; }}
        style={styles.webView}
        source={{ uri: store.currentScene.webviewUrl }}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        scalesPageToFit
        automaticallyAdjustContentInsets={false}
        decelerationRate="normal"
        onNavigationStateChange={this.onNavigationStateChange}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
      />
      <View style={styles.addressBarRow}>
        <Button onPress={goToPageCounter} style={styles.button}> Go to counter</Button>
        <Button onPress={goToWebview('http://famosos.globo.com')} style={styles.button}> Go to webview famosos</Button>
        <Button onPress={goToWebview('http://techtudo.com.br')} style={styles.button}> Go to webview tt</Button>
        <Button onPress={goToWebview('http://www.globo.com')} style={styles.button}> Go to webview home</Button>
      </View>
    </View>);
  }
}

PageTwo.propTypes = {
  store: PropTypes.object,
};

module.exports = PageTwo;
