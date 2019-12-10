import * as PIXI from 'pixi.js';
import utils from '../../lib/utils';

export default class ScrollTabPanel extends PIXI.Sprite {

    constructor() {
        super();
        this.interactive = true;
        this.open = true;
        this.container = new PIXI.Container();
        this.panel = new PIXI.Graphics().beginFill(0xeeeeee, 1).lineStyle(1, 0xeeeeee, 1).drawRect(0, 0, window.app.screen.width , 500);
        this.container.addChild(this.panel);

        this.addChild(this.container);
        
        utils.realTap(this);
        window.app.stage.interactive = true;
        utils.realTap(window.app.stage);
        window.app.stage.on('realTap', (e) => {

            if(this.open) {

                var tweenY = PIXI.tweenManager.createTween(this.container);
                tweenY.time = 200;

                tweenY.easing = PIXI.tween.Easing.inOutCubic();
                tweenY.from({
                    y: 0
                });
                tweenY.to({
                    y: 400
                });
                
                tweenY.start();
                
                this.open = false;
            }
            
        });
        this.on('realTap', (event) => {
            event.stopPropagation();

            var tweenY = PIXI.tweenManager.createTween(this.container);
            tweenY.time = 200;

            tweenY.easing = PIXI.tween.Easing.inOutCubic();
            tweenY.from({
                y: this.open ? 0 : 400
            });
            tweenY.to({
                y: this.open ? 400 : 0
            });

            tweenY.start();
            this.open = !this.open;
        });

        this.renderTabTitle();
        this.renderTabPanel();
        this.renderCamera();
    }

    renderCamera() {
        const textStyle = {
            fontFamily : 'Arial',
            fontSize: 50,
            fill : 0xffffff,
            align : 'left'
        };
        
        const camera = new PIXI.Text('生成图片', textStyle);
        this.container.addChild(camera);
        camera.x = app.screen.width - camera.width - 20;
        camera.y = - 70;
        utils.realTap(camera);
        camera.interactive = true;

        camera.on('realTap', (e) => {

            this.emit('beforeCameraLight');
            const light = new PIXI.Graphics().beginFill(0xffffff, 1).lineStyle(1, 0xeeeeee, 1).drawRect(0, 0, window.app.screen.width , window.app.screen.height);
            light.zOrder = 9999;
            light.alpha = 0;
            app.stage.addChild(light);

            e.stopPropagation();
            console.log('camera');
            this.container.visible = false;

            var scale = PIXI.tweenManager.createTween(light);
            scale.time = 400;

            scale.easing = PIXI.tween.Easing.inOutCubic();
 
            scale.from({
                alpha: 0
            });
            scale.to({
                alpha: 1
            });
            scale.pingPong = true;
            scale.start();

            scale.on('end', () => {
                this.emit('camera');
                
            });
        });
    }

    renderTabTitle() {
        const textStyle = {
            fontFamily : 'Arial',
            fontSize: 50,
            fill : 0x000000,
            align : 'left'
        };
        const tabTitles = [
            new PIXI.Text('头部', textStyle),
            new PIXI.Text('服装', textStyle)
        ];
        
        tabTitles.reduce((memo, tabTitle, idx) => {
            tabTitle.x = memo;
            tabTitle.y = 20;
            tabTitle.interactive = true;
            tabTitle.on('tap', (e) => {
                if (this.open) {
                    e.stopPropagation();
                }
                
                this.tabPanels.forEach((tabPanel) => {
                    tabPanel.visible = false;
                });
                this.tabPanels[idx].visible = true;

            })
            this.container.addChild(tabTitle);

            return memo + tabTitle.width + 20;
        }, 20);
    }

    renderTabPanel() {
        
        const tabPanels = this.tabPanels = [
            new PIXI.Container(),
            new PIXI.Container(),
        ];
        const head = new PIXI.Sprite(window.resources['resources'].textures['man_head_1.png']);
        head.interactive = true;
        head.scale.x = 3.5;
        head.scale.y = 3.5;
        head.y = 20;
        utils.realTap(head);
        head.on('realTap', (event) => {
            console.log('real:', event);
            window.changeHead(head.texture);
        });
        const head2 = new PIXI.Sprite(window.resources['resources'].textures['man_head_2.png']);
        head2.interactive = true;
        head2.scale.x = 3.5;
        head2.scale.y = 3.5;
        head2.y = 20;
        utils.realTap(head2);
        head2.on('realTap', (event) => {
            console.log('real:', event);
            window.changeHead(head2.texture);
        });
        const body = new PIXI.Sprite(window.resources['resources'].textures['man_body_1.png']);
        body.interactive = true;
        body.scale.x = 1.5;
        body.scale.y = 1.5;
        body.y = 30;
        utils.realTap(body);
        body.on('realTap', (event) => {
            window.changeBody(body.texture);
        });

        const body2 = new PIXI.Sprite(window.resources['resources'].textures['man_body_2.png']);
        body2.interactive = true;
        body2.scale.x = 1.5;
        body2.scale.y = 1.5;
        body2.y = 30;
        utils.realTap(body2);
        body2.on('realTap', (event) => {
            window.changeBody(body2.texture);
        });
        tabPanels[0].interactive = true;
        tabPanels[0].y = 100;
        tabPanels[0].addChild(new PIXI.Graphics().beginFill(0xf5f5f5, 1).lineStyle(1, 0xFFFFFF, 1).drawRect(0, 0, window.app.screen.width , 400));
        tabPanels[0].addChild(head, head2);
        head2.x = 300;


        tabPanels[1].interactive = true;
        tabPanels[1].y = 100;
        tabPanels[1].addChild(new PIXI.Graphics().beginFill(0xf5f5f5, 1).lineStyle(1, 0xFFFFFF, 1).drawRect(0, 0, window.app.screen.width , 400));
        tabPanels[1].addChild(body, body2);
        body2.x = 300;

        tabPanels.forEach((panel, idx) => {
            utils.scrollable(panel, {
                direction: 'horizontal'
            });
            panel.visible = idx === 0 ? true : false;
            this.container.addChild(panel);
        });
    }

    dragable(item, options) {
        item
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        const self = this;

        function onDragStart(event) {

            event.stopPropagation();
            self.tweenX && self.tweenX.stop();
            this.data = event.data;
            this.dragging = true;
            this.dx = 0;
            this.startPosition = this.newPosition = this.data.getLocalPosition(this.parent);
            this.relativePosition = {
                x: this.startPosition.x - this.x,
                // y: this.startPosition.y - this.y
            };
            options && options.onDragStart && options.onDragStart(this.startPosition);
        }

        function onDragEnd(event) {
            event.stopPropagation();
            this.dragging = false;
            this.data = null;
            options && options.onDragEnd && options.onDragEnd(this.x, this.dx);
        }


        function onDragMove(event) {
            if (this.dragging) {
                this.prevPosition = this.newPosition.clone();
                var newPosition = this.newPosition = this.data.getLocalPosition(this.parent);
                this.dx =  this.newPosition.x - this.prevPosition.x;
                this.x = newPosition.x - this.relativePosition.x;
                // this.y = newPosition.y - this.relativePosition.y;
                options && options.onDragMove && options.onDragMove(newPosition, this.startPosition, event.data.global);
            }
        }
    }
}

window.changeHead = function (texture) {

    window.currentHead.texture = texture;

}

window.changeBody = function (texture) {
    window.currentBody.texture = texture;

}