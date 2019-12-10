import * as PIXI from 'pixi.js'
const textStyle = {
    fontFamily : 'Arial',
    fontSize: 50,
    fill : 0x000000,
    align : 'left'
};
export default class Typing {

    constructor(options) {
        const {
            inputs
        } = options;

        this.container = new PIXI.Container();

        this._inputs = inputs.map((text, idx) => {
            const t = new PIXI.Text(text, textStyle);
            t.visible = false;
            this.container.addChild(t);
            return t;
        });
        this.renderCursor();
    }

    play() {

        let prev;

        this._inputs.forEach((text, idx) => {
            setTimeout(() => {
                if (prev) {
                    prev.visible = false;
                }
                text.visible = true;
                this.cursor.x = text.width + 20;
                prev = text;
            }, 150 * idx);
        });
    }

    renderCursor() {
        
        const length = 25;
        const cursor = this.cursor = new PIXI.Graphics();
        
        cursor.lineStyle(5, 0x000000, 1);

        cursor.moveTo(0, -length);
        cursor.lineTo(0, length);
        cursor.y = 30;
        this.container.addChild(cursor);

        const breath = PIXI.tweenManager.createTween(cursor);
        breath.time = 1000;
        breath.easing = PIXI.tween.Easing.inOutCubic();
        breath.delay = 0;
        breath.from({
            alpha: 1
        });
        breath.to({
            alpha: 0
        });
        breath.start();
        breath.loop = true;
        breath.pingPong = true
    }
}