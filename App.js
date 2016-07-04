import React, { Component } from 'react';
import {
  BackAndroid,
} from 'react-native';
import {
  Router,
  Scene,
  Actions,
} from 'react-native-mobx';
import {
  reaction,
} from 'mobx';

// view and model for Counter scene
import Counter from './components/Counter';
import PageTwo from './components/PageTwo';
import store from './model/counter';
import autobind from 'autobind-decorator';

class App extends Component {
  constructor(props) {
    super(props);
    reaction(() => store.currentScene.name, () => {
      const currentScene = store.currentScene;
      console.log('reaction navigation', currentScene, store.back);
      if (store.back) {
        Actions.pop();
        return;
      }
      if (currentScene.name === 'counter') {
        Actions.counter(currentScene);
      } else if (currentScene.name === 'pageTwo') {
        Actions.pageTwo(currentScene);
      }
    });
  }

  componentDidMount() {
    BackAndroid.addEventListener(
      'hardwareBackPress',
      this.onHardwareBackPress
    );
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener(
      'hardwareBackPress',
      this.onHardwareBackPress
    );
  }

  @autobind
  onHardwareBackPress() {
    return this.onBack();
  }

  @autobind
  onBack() {
    let wentBack = store.goBack();
    if (!wentBack) {
      wentBack = store.pop();
    }
    console.log('onBack wentBack', wentBack);
    return wentBack;
  }

  render() {
    const defaultProps = {
      onBack: this.onBack,
      panHandlers: null,
    };
    return (<Router store={store}>
      <Scene key="root">
        <Scene key="counter" {...defaultProps} component={Counter} title="counter" initial />
        <Scene key="pageTwo" {...defaultProps} component={PageTwo} title="PageTwo" />
      </Scene>
    </Router>);
  }
}

module.exports = App;
