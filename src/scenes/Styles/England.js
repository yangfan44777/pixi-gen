import * as PIXI from 'pixi.js';
import Scene from './Base.js';
import Person from '../../components/Person';
import ScrollTabPanel from '../../components/ScrollTabPanel';
import Resizer from '../../lib/Resizer';

const textStyle = {
    fontFamily : 'Arial',
    fontSize: 50,
    fill : 0x000000,
    align : 'left'
};
export default class England extends Scene {
    constructor() {

        super({
            bgColor: 0xffffff
        });

        
        const bg = new PIXI.Sprite(window.resources['resources'].textures['school_bg.png']);
        const radio = 1024 / 768;
        bg.height = app.screen.height + 20;
        bg.width = app.screen.height * radio;
        
        bg.x = -(bg.width - app.screen.width) / 2;
        bg.y = -10;

        this.addChild(bg);
        // const style1 = new PIXI.Text('英伦校园', textStyle);
        // this.addChild(style1);
        // style1.interactive = true;
        // style1.on('tap', () => {
        //     PIXI.SceneManager.change('selectStyle');
        // });


        const person = new Person();
        person.x = app.screen.width / 2;
        person.y = 200;
        person.rotation = 0;
        person.interactive = true;
        this.addChild(person);
        person.zOrder = 1;
        
        

        const person2 = new Person();
        person2.x = 2 * app.screen.width / 3;
        person2.y = 200;
        person2.rotation = 0;
        person2.interactive = true;
        this.addChild(person2);
        this.addChild(this.resizer);
        const scrollTabPanel = new ScrollTabPanel();
        scrollTabPanel.y = app.screen.height - 500;
        this.addChild(scrollTabPanel);
        scrollTabPanel.on('beforeCameraLight', () => {
            this.resizer.unbind();
        });
        scrollTabPanel.on('camera', () => {
            
            const qr = new PIXI.Sprite(window.resources['resources'].textures['qr.png']);
            app.stage.addChild(qr);
            qr.x = 30;
            qr.y = app.screen.height - qr.height - 30;

            var shotArea = app.renderer.screen;
            var tempTexture = app.renderer.generateTexture(app.stage, undefined, undefined, shotArea);

            setTimeout(() => {
                const image = app.renderer.plugins.extract.image(tempTexture);
                image.style.position = 'fixed';
                image.style.top = 0;
                image.style.left = 0;
                image.style.zIndex = 100;
                image.style.border = 'none';
                image.style.margin = 0;
                image.style.padding = 0;
                
                document.body.appendChild(image);
                this.showSaveTip();
            }, 1000);
        });
        
        person.on('pointerdown', (e) => {
            e.stopPropagation();
            console.log('tap person');
            this.resizer.bind(person);
        });

        person2.on('pointerdown', (e) => {
            e.stopPropagation();
            console.log('tap person2');
            this.resizer.bind(person2);
        });
    }

    showSaveTip() {
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '200px';
        div.style.position = 'fixed';
        div.style.backgroundColor = 'white';
        div.style.bottom = 0;
        div.style.transition = '.5s all';
        div.style.transform = 'translateY(100%)';
        div.style.textAlign = 'center';
        div.style.lineHeight = '200px';
        div.style.zIndex = 101;
        div.style.fontSize = '37px';
        div.style.fontFamily = '"Helvetica Neue For Number", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif';
        div.innerHTML = '长按保存图片';
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transform = 'none';
            setTimeout(() => {
                div.style.transform = 'translateY(100%)';
            }, 3000);
        }, 100);
    }
}