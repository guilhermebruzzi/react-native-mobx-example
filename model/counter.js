import {
  reaction,
  observable,
  computed,
} from 'mobx';

import autobind from 'autobind-decorator';

const defaultScene = {
  shouldGoBack: false,
  canGoBack: false,
};

@autobind
class CounterStore {
  @observable counter = 0;
  @observable scenes = [];
  back = false;
  total = 0;

  constructor() {
    this.navigate({ name: 'counter' });
    reaction(() => this.counter, () => this.total++);
  }

  @computed get currentScene() {
    return this.scenes[this.scenes.length - 1];
  }

  updateScene(scene) {
    if (this.currentScene.name === 'pageTwo') {
      console.log('update scene', scene);
      if (scene.url) {
        this.currentScene.url = scene.url;
      }
      if (scene.canGoBack) {
        this.currentScene.canGoBack = scene.canGoBack;
      }
    }
  }

  navigate(scene) {
    this.back = false;
    console.log('navigate', scene);
    if (this.currentScene && this.currentScene.name === scene.name) {
      this.updateScene(scene);
      return;
    }
    console.log('new scene', scene);
    this.scenes.push({
      ...defaultScene,
      ...scene,
    });
  }

  goBack() {
    if (this.currentScene.canGoBack) {
      this.currentScene.shouldGoBack = true;
      return true;
    }
    return false;
  }

  pop() {
    this.back = true;
    this.scenes.pop();
  }

  increase() {
    this.counter++;
  }

  decrease() {
    this.counter--;
  }
}

export default new CounterStore();
