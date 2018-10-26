/**
 * @file pixi 精灵的放大缩小旋转控件
 */
import * as PIXI from 'pixi.js'

const defaultOptions = {
    x: 0,
    y: 0
};

export default class Resizer extends PIXI.Container {

    
    constructor(resizeElement, options) {
        super();
        this.resizeElement = resizeElement;
        options = {
            ...defaultOptions,
            ...options
        };
        const rectGraphic = this.rectGraphic = new PIXI.Graphics();
        rectGraphic.beginFill(0xFFFFFF, 0);
        rectGraphic.lineStyle(4, 0xffffff, 1);
        
        const {
            x, y, width, height
        } = options;

        rectGraphic.drawRect(0, 0, resizeElement.width, resizeElement.height);
        rectGraphic.pivot.x = rectGraphic.width / 2;
        rectGraphic.pivot.y = rectGraphic.height / 2;

        this.x = x;
        this.y = y;

        this.addChild(resizeElement, rectGraphic);
        this.interactive = true;
        
        /**
         * 声明handlers
         */
        this.resizeHandler = new PIXI.Graphics().beginFill(0xFFFFFF, 1).lineStyle(1, 0xffffff, 1).drawRect(0, 0, 20, 20);
        this.resizeHandler.pivot.x = this.resizeHandler.width / 2 - 2;
        this.resizeHandler.pivot.y = this.resizeHandler.height / 2 - 2;
        this.resizeHandler.interactive = true;
        this.resizeHandler.x = -rectGraphic.width / 2;
        this.resizeHandler.y = -rectGraphic.height / 2;
        this.addChild(this.resizeHandler);
        this.initEvents();
    }

    // 重置宽度
    setWidth() {
        
    }

    // 重置高度
    setHeight() {

    }

    drawRect() {
        this.rectGraphic.clear();
        this.rectGraphic.beginFill(0xFFFFFF, 0);
        this.rectGraphic.lineStyle(4, 0xffffff, 1);
        this.rectGraphic.drawRect(0, 0, this.resizeElement.width, this.resizeElement.height);
        this.rectGraphic.pivot.x = this.rectGraphic.width / 2;
        this.rectGraphic.pivot.y = this.rectGraphic.height / 2;
    }

    dragable(item, options) {
        item
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        function onDragStart(event) {

            event.stopPropagation();
            this.data = event.data;
            this.dragging = true;
            this.startPosition = this.data.getLocalPosition(this.parent);
            options && options.onDragStart && options.onDragStart(this.startPosition);
        }

        function onDragEnd(event) {
            event.stopPropagation();
            this.dragging = false;
            this.data = null;
        }

        function onDragMove(event) {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                options && options.onDragMove && options.onDragMove(newPosition, this.startPosition);

            }
        }
    }

    initEvents() {
        this.dragable(this.resizeHandler, {
            onDragStart: () => {
                this.resizeElement.startSize = {
                    width: this.resizeElement.width,
                    height: this.resizeElement.height,
                };
            },
            onDragMove: (newPosition, startPosition) => {
                const newWidth = this.resizeElement.startSize.width + (-newPosition.x + startPosition.x) * 2;
                const newHeight = this.resizeElement.startSize.height + (-newPosition.y + startPosition.y) * 2;
                this.resizeElement.width = newWidth <= 0 ? 1 : newWidth;
                this.resizeElement.height = newHeight <= 0 ? 1 : newHeight;
                this.drawRect();
                this.resizeHandler.x = -this.rectGraphic.width / 2;
                this.resizeHandler.y = -this.rectGraphic.height / 2;
            }
        })
        this.dragable(this);
    }
}