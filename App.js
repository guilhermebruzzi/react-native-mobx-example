import React, { Component } from 'react';
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

  @autobind
  onBack() {
    console.log('onBack');
    const wentBack = store.goBack();
    console.log('onBack wentBack', wentBack);
    if (!wentBack) {
      store.pop();
    }
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
