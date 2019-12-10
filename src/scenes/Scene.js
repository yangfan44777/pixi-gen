import * as PIXI from 'pixi.js';
// import utils from '../lib/utils';
// import Resizer from '../lib/Resizer';

export default class Scene extends PIXI.Container {

    constructor(options = {}) {
        super();
        const bg = new PIXI.Graphics().beginFill(options.bgColor === undefined ? 0xffffff : options.bgColor, 1).lineStyle(1, 0xFFFFFF, 0).drawRect(0, 0, app.screen.width, app.screen.height);
        this.addChild(bg);
        // bg.interactive = this.trackedPointers
        // utils.realTap(bg);
        // this.resizer = new Resizer(null, {
        //     borderSize: 5
        // }, this);
        // this.resizer.unbind();
        // bg.on('realTap', (e) => {

        //     this.resizer.unbind();
        //     window.currentHead = null;
        //     window.currentBody = null;
            
        // });

    }

    in(noAnimate) {
        this.visible = true;
        if (noAnimate) {
            return Promise.resolve();
        }
        const tween = PIXI.tweenManager.createTween(this);
        tween.time = 500;
        tween.delay = 300;
        tween.easing = PIXI.tween.Easing.inOutCubic();
        tween.from({
            x: -app.screen.width
        });
        tween.to({
            x: 0
        });
        tween.start();

        return Promise.resolve();
    }

    out() {
        console.log('out', this);
        const tween = PIXI.tweenManager.createTween(this);
        tween.time = 500;
        tween.delay = 300;
        tween.easing = PIXI.tween.Easing.inOutCubic();
        tween.from({
            x: 0
        });
        tween.to({
            x: -app.screen.width
        });
        tween.start();
        tween.on('end', () => {
            this.visible = false;
        });
        return Promise.resolve();
    }
}
let currentScene = null;
const scenes = {

};

export const SceneManager = {

    getCurrentScene() {
        return currentScene;
    },

    change(name) {
        const scene = scenes[name];
        if (currentScene) {
            if (currentScene === scene) {
                return;
            }
            currentScene.parentGroup = window.frontGroup;
            scene.parentGroup = window.backGroup;
            currentScene.out().then(() => {
                scene.in(true);
                currentScene = scene;
            });
        } else {
            scene.in(true);
            currentScene = scene;
        }
    },

    add(name, scene) {
        scene.visible = false;
        app.stage.addChild(scene);
        scenes[name] = scene;
    }
};