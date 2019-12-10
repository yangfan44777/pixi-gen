import * as PIXI from 'pixi.js';
import Scene from '../Scene.js';
const textStyle = {
    fontFamily : 'Arial',
    fontSize: 50,
    fill : 0x000000,
    align : 'left'
};
export default class SelectStyle extends Scene {
    constructor() {
        super();
        this.visible = false;
        const style1 = new PIXI.Text('英伦校园', textStyle);
        const style2 = new PIXI.Text('中华校园', textStyle);
        const style3 = new PIXI.Text('程序猿标配', textStyle);
        const style4 = new PIXI.Text('未来风', textStyle);
        const style5 = new PIXI.Text('嘻哈风', textStyle);
        const style6 = new PIXI.Text('复古风', textStyle);
        const style7 = new PIXI.Text('晚宴风', textStyle);

        style1.x = app.screen.width / 6;
        style1.y = app.screen.height / 6;

        style2.x = app.screen.width / 6;
        style2.y = 2 * app.screen.height / 6;

        style3.x = app.screen.width / 6;
        style3.y = 3 * app.screen.height / 6;

        style4.x = app.screen.width / 6;
        style4.y = 4 * app.screen.height / 6;

        style5.x = app.screen.width - app.screen.width / 6 - 200;
        style5.y = app.screen.height / 6;

        style6.x = app.screen.width - app.screen.width / 6 - 200;
        style6.y = 2 * app.screen.height / 6;

        style7.x = app.screen.width - app.screen.width / 6 - 200;
        style7.y = 3 * app.screen.height / 6;
        
        this.addChild(style1, style2, style3, style4, style5, style6, style7);

        style1.interactive = true;
        style1.on('tap', () => {
            PIXI.SceneManager.change('style_england');
        });
    }
}