import * as PIXI from 'pixi.js';
import Scene from '../Scene.js';
import spritesheet from '../../spritesheet.json';

const textStyle = {
    fontFamily : 'Arial',
    fontSize: 30,
    fill : 0x000000,
    align : 'left'
};
export default class Loading extends Scene {

    constructor() {

        super();

        const title = new PIXI.Text('资源加载中...', textStyle);
        title.y = (app.screen.height - title.height) / 2;;
        title.x = (app.screen.width - title.width) / 2;
        this.addChild(title);

        PIXI.loader.add('resources', spritesheet.url).load((loader, resources) => {
            console.log(resources['resources']);
        });
    }
}