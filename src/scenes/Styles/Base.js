import * as PIXI from 'pixi.js';
import utils from '../../lib/utils';
import Resizer from '../../lib/Resizer';
import Scene from '../Scene.js';

export default class BaseStyle extends Scene {

    constructor(options = {}) {
        super();
        const bg = this.bg = new PIXI.Graphics().beginFill(options.bgColor === undefined ? 0xffffff : options.bgColor, 1).lineStyle(1, 0xFF0000, 0).drawRect(0, 0, app.screen.width, app.screen.height);
        this.addChild(bg);
        bg.interactive = true;
        utils.realTap(bg);
        this.resizer = new Resizer(null, {
            borderSize: 5
        }, this);
        this.resizer.unbind();
        bg.on('realTap', (e) => {

            this.resizer.unbind();
            window.currentHead = null;
            window.currentBody = null;
            
        });


    }

    
}