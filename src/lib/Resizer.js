/**
 * @file pixi 精灵的放大缩小旋转控件
 */
import * as PIXI from 'pixi.js'
import vec3 from 'gl-vec3';

export default class Resizer extends PIXI.Sprite {
    
    constructor(resizeElement, options, app) {
        super();
        this.app = app;
        this.options = {
            borderSize: 4,
            ...options
        };

        this.interactive = true;
        this.rectGraphic = new PIXI.Graphics();

        this.initHandlers();
        this.initEvents();
        this.addChild(this.rectGraphic);

        
        this.bind(resizeElement);
        this.drawAnchor();
    }

    bind(resizeElement) {
        
        if (!resizeElement) {
            return;
        }

        this.resizeElement = resizeElement;

        // 强制更新worldTransform
        resizeElement.toGlobal(new PIXI.Point(0, 0));

        const worldTransform = this.resizeElement.worldTransform.clone()
        const transform = new PIXI.Transform();
        worldTransform.decompose(transform);

        this.x = transform.position.x;
        this.y = transform.position.y;
        this.anchor.x = this.resizeElement.anchor.x;
        this.anchor.y = this.resizeElement.anchor.y;
        this.rotation = transform.rotation;
        this.rectWidth = resizeElement.width;
        this.rectHeight = resizeElement.height;
        this.relativeRotation = resizeElement.rotation - this.rotation;
    
        this.updateRect();
        this.show();
        
    }

    unbind() {
        if (this.resizeElement) {
            this.resizeElement = null;
        }
        this.updateRect();
        this.hide();
    }

    initHandlers() {
        this.resizeHandler = new PIXI.Graphics().beginFill(0xFFFFFF, 1).lineStyle(1, 0xFFFFFF, 1).drawRect(0, 0, 30, 30);
        this.resizeHandler.pivot.x = this.resizeHandler.width / 2 - 1;
        this.resizeHandler.pivot.y = this.resizeHandler.height / 2 - 1;
        this.resizeHandler.interactive = true;

        this.rotateHandler = new PIXI.Graphics().beginFill(0xFFFFFF, 1).lineStyle(1, 0xFFFFFF, 1).drawCircle(0, 0, 15);
        this.rotateHandler.interactive = true;
        
        this.addChild(this.resizeHandler, this.rotateHandler);
    }

    hide() {
        this.visible = false;
    }

    show() {
        this.visible = true;
    }

    drawAnchor() {

        const length = 15;
        const crossGraphic = new PIXI.Graphics();
        
        crossGraphic.lineStyle(5, 0xFFFFFF, 1);

        crossGraphic.moveTo(-length, 0);
        crossGraphic.lineTo(length, 0);

        crossGraphic.moveTo(0, -length);
        crossGraphic.lineTo(0, length);

        this.addChild(crossGraphic);
    }

    updateRect() {

        const {
            borderSize,
        } = this.options;
        let width;
        let height;

        if (this.resizeElement) {
            width = this.resizeElement.width;
            height = this.resizeElement.height;
        } else {
            width = 0;
            height = 0;
        }
        this.rectGraphic.clear();
        this.rectGraphic.beginFill(0xFFFFFF, 0);
        this.rectGraphic.lineStyle(borderSize, 0xFFFFFF, 1);

        
        this.rectGraphic.drawRect(-width * this.anchor.x, -height * this.anchor.y, width, height);

        // 重置resizeHandler位置
        this.resizeHandler.x = -width * this.anchor.x;
        this.resizeHandler.y = -height * this.anchor.y;
        
        // 重置rotateHandler位置
        this.rotateHandler.x = width * (1 - this.anchor.x);
        this.rotateHandler.y = height * (1 - this.anchor.y);
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
            this.relativePosition = {
                x: this.startPosition.x - this.x,
                y: this.startPosition.y - this.y
            }
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
                this.x = newPosition.x - this.relativePosition.x;
                this.y = newPosition.y - this.relativePosition.y;
                options && options.onDragMove && options.onDragMove(newPosition, this.startPosition, event.data.global);
            }
        }
    }

    initEvents() {

        this.dragable(this.resizeHandler, {
            onDragStart: () => {
                if (!this.resizeElement) {
                    return;
                }
                this.startSize = {
                    width: this.resizeElement.width,
                    height: this.resizeElement.height,
                };
            },
            onDragMove: (newPosition, startPosition) => {
                if (!this.resizeElement) {
                    return;
                }

                let newWidth;
                let newHeight;

                if (this.anchor.x === 0) {
                    newWidth = this.startSize.width;
                } else {
                    newWidth = this.startSize.width + (-newPosition.x + startPosition.x) / this.anchor.x;
                }
                if (this.anchor.y === 0) {
                    newHeight = this.startSize.height;
                } else {
                    newHeight = this.startSize.height + (-newPosition.y + startPosition.y) / this.anchor.y;
                }
                this.resizeElement.width = newWidth <= 0 ? 1 : newWidth;
                this.resizeElement.height = newHeight <= 0 ? 1 : newHeight;

                this.updateRect();
            }
        });
        
        this.dragable(this.rotateHandler, {
            onDragStart: () => {
                this.selfGlobalPositionCache = this.getGlobalPosition();
                
                if (this.anchor.x === 0) {
                    this.a = this.resizeElement.height / this.resizeElement.width;
                } else {
                    this.a = (this.resizeElement.height * (1 - this.anchor.y)) / (this.resizeElement.width * (1 - this.anchor.x));
                }
            },
            onDragMove: (newPosition, startPosition, globalPosition) => {
                
                const y = this.a * (globalPosition.x - this.selfGlobalPositionCache.x);
                const direct = (globalPosition.y - this.selfGlobalPositionCache.y - y) > 0 ? 1 : -1;
                this.rotation = direct * vec3.angle([globalPosition.x - this.selfGlobalPositionCache.x, globalPosition.y - this.selfGlobalPositionCache.y, 1], [this.resizeElement.width * (1 - this.anchor.x), this.resizeElement.height * (1 - this.anchor.y), 1]);

                this.resizeElement.rotation = this.relativeRotation + this.rotation;

                this.updateRect();
            }
        });
        this.dragable(this, {
            onDragMove: () => {
                const localPoint = this.resizeElement.parent.toLocal(new PIXI.Point(this.parent.x, this.parent.y), this);

                this.resizeElement.x = localPoint.x;
                this.resizeElement.y = localPoint.y;
            }
        });
    }
}