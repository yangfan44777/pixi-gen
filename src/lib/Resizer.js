/**
 * @file pixi 精灵的放大缩小旋转控件
 */
import * as PIXI from 'pixi.js'

const defaultOptions = {
    x: 0,
    y: 0
};

export default class Resizer extends PIXI.Container {

    constructor(children, options) {
        super();
        options = {
            ...defaultOptions,
            ...options
        };
        const rectGraphic = new PIXI.Graphics();
        rectGraphic.beginFill(0xFF3300, 0);
        rectGraphic.lineStyle(1, 0xffffff, 1);
        
        const {
            x, y, width, height
        } = options;

        // this.pivot.x = this.width / 2;
        // this.pivot.y = this.height / 2;

        const rect = this.rect = rectGraphic.drawRect(0, 0, children.width, children.height);
        rect.pivot.x = rect.width / 2;
        rect.pivot.y = rect.height / 2;

        this.x = x;
        this.y = y;

        this.addChild(children).addChild(rect);
        this.interactive = true;

        /**
         * 声明handlers
         */
        this.handlers = [];
        for (let i = 0; i < 4; i++) {
            this.handlers[i] = new PIXI.Graphics().beginFill(0xFF3300, 1).lineStyle(1, 0xffffff, 1).drawRect(0, 0, 10, 10)
            this.handlers[i].pivot.x = this.handlers[i].width / 2;
            this.handlers[i].pivot.y = this.handlers[i].height / 2;
            this.handlers[i].interactive = true;
            this.handlers[i].x = i % 2 === 0 ? -rect.width/2 : rect.width/2;
            this.handlers[i].y = i < 2 ? -rect.height/2 : rect.height/2;
            this.addChild(this.handlers[i]);
        }
        this.initEvents();
    }

    dragable(item) {
        item
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            event.stopPropagation();
            this.data = event.data;
            // this.scale.x *= 1.2;
            // this.scale.y *= 1.2;
            this.dragging = true;
        }

        function onDragEnd(event) {
            event.stopPropagation();
            // this.scale.x /= 1.2;
            // this.scale.y /= 1.2;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        }

        function onDragMove(event) {

            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
            }
        }
    }

    initEvents() {

        // this.handlerLT.on('pointerdown', (e) => {
        //     e.stopPropagation();
        // })
        // this.handlerLT.on('pointerup', (e) => {
        //     e.stopPropagation();
        // })
        // this.handlerLT.on('pointerupoutside', (e) => {
        //     e.stopPropagation();
        // })
        this.handlers.forEach(this.dragable);
        this.dragable(this);
    }
}