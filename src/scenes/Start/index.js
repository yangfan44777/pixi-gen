import * as PIXI from 'pixi.js';
import Scene from '../Scene.js';
import Typing from '../../lib/Typing';

const textStyle = {
    fontFamily : 'Arial',
    fontSize: 50,
    fill : 0x000000,
    align : 'left'
};

const conversition = [
    {
        text: new PIXI.Text('去年是漫威，\n今年老板们要怎么亮相啊？', textStyle),
        y: 104,
        dy: 150,
        position: 'left',
        delay: 1000
    },
    {
        text: new PIXI.Text('维密秀？', textStyle),
        y: 254,
        dy: 100,
        position: 'left',
        delay: 1000
    },
    {
        text: new PIXI.Text('群口相声？', textStyle),
        y: 354,
        dy: 100,
        position: 'left',
        delay: 400
    },
    {
        text: new PIXI.Text('葫芦娃？', textStyle),
        y: 454,
        dy: 100,
        position: 'right',
        delay: 450
    },
    {
        text: new PIXI.Text('不如由大家来定义BOSS团，\n送BOSS团年会出道吧！', textStyle),
        y: 554,
        dy: 150,
        position: 'left',
        delay: 1000
    },

    {
        text: new PIXI.Text('搞啊！', textStyle),
        y: 704,
        dy: 0,
        position: 'right',
        delay: 0
    },
];

export default class Start extends Scene {


    constructor() {
        super();

        this.interactive = true;

        this.renderConversition();
        this.renderGroupTitle();

        const typing = this.typing = new Typing({
            inputs: ['g', 'ga', 'gao', '搞', '搞a', '搞啊', '搞啊!']
        });

        this.addChild(typing.container);
        typing.container.y = app.screen.height - this.keyboard.height + 25;
        typing.container.x = 50;

    }

    renderConversition() {

        const screenHeight = window.app.screen.height - 100;

        this.conversitionContainer = new PIXI.Container();

        const keyboard = this.keyboard = new PIXI.Sprite(window.resources['resources'].textures['keyboard.png']);

        keyboard.width = window.app.screen.width + 8;
        keyboard.x = -4;
        keyboard.height = window.app.screen.width * 28 / 44;
        keyboard.y = window.app.screen.height - keyboard.height + 4;

        conversition.forEach((speak, idx) => {
            speak.text.x = speak.position === 'left' ? 50 : app.screen.width - speak.text.width - 50;
            speak.text.y = screenHeight + speak.y;
            this.conversitionContainer.addChild(speak.text);
        });

        let emptyTween = this.createEmptyTween();

        conversition.reduce((memo, speak) => {
            const tween = PIXI.tweenManager.createTween(this.conversitionContainer);
            tween.time = 500;
            tween.easing = PIXI.tween.Easing.inOutCubic();
            tween.delay = speak.delay;
            tween.from({
                y: memo.from
            });
            tween.to({
                y: memo.from - speak.dy
            });
            memo.tween.on('end', () => {
                tween.start();
            });
            
            return {
                from: memo.from - speak.dy,
                delay: tween.delay,
                tween
            };
        }, {
            from: -keyboard.height,
            tween: emptyTween,
            dy: 0,
            delay: 0
        }).tween.on('end', () => {

            setTimeout(() => {
                this.playTyping();
            }, 1000);
            
        });
        emptyTween.start();
        
        this.addChild(this.conversitionContainer);
        this.addChild(keyboard);
    }

    playTyping() {
        this.typing.play();
        const send = new PIXI.Text('发 送', {...textStyle, fill: 0xffffff});
        send.y = app.screen.height - 90;
        send.x = app.screen.width - 180;
        send.interactive = true;
        send.on('tap', () => {
            send.interactive = false;
            const tweenConversition = PIXI.tweenManager.createTween(this.conversitionContainer);
            tweenConversition.time = 500;
            tweenConversition.easing = PIXI.tween.Easing.inOutCubic();
            tweenConversition.delay = 0;
            tweenConversition.from({
                y: this.conversitionContainer.y
            });
            tweenConversition.to({
                y: this.conversitionContainer.y - 100
            });
            tweenConversition.start();
            this.typing.container.visible = false;
            tweenConversition.on('end', () => {
                PIXI.SceneManager.change('selectStyle');
            });
        });
        this.addChild(send);
    }

    renderGroupTitle() {
        const bg = new PIXI.Graphics().beginFill(0xf5f5f5, 1).lineStyle(1, 0xFFFFFF, 0).drawRect(0, 0, app.screen.width, 100);
        const groupTitle = new PIXI.Text('旷厂年会の不正经筹备组', textStyle);
        groupTitle.y = 23;
        groupTitle.x = (app.screen.width - groupTitle.width) / 2;

        this.addChild(bg, groupTitle);
    }

    renderCursor() {
        
        const length = 25;
        const cursor = this.cursor = new PIXI.Graphics();
        
        cursor.lineStyle(5, 0x000000, 1);

        cursor.moveTo(0, -length);
        cursor.lineTo(0, length);
        cursor.y = app.screen.height - this.keyboard.height + 48;
        cursor.x = 50;

        this.addChild(cursor);

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

    createEmptyTween() {
        const tween = PIXI.tweenManager.createTween(this.conversitionContainer);
        tween.time = 1;
        tween.from({
            y: 0
        });
        tween.to({
            y: 0
        });
        return tween;
    }
}