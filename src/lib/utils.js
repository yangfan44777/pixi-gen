import * as PIXI from 'pixi.js'

export default {
    realTap(item) {
        let moved = false;
        let beginTime;
        item.on('pointerdown', () => {
            moved = false;
            beginTime = Date.now();
        });
        item.on('pointerup', (event) => {
            if (!moved && (Date.now() - beginTime < 500)) {
                item.emit('realTap', event);
            }
        });
        item.on('pointermove', () => {
            moved = true;
        });
    },

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
                // x: this.startPosition.x - this.x,
                // y: this.startPosition.y - this.y
            }
            if (options.vertical) {
                this.relativePosition.y = this.startPosition.y - this.y;
            } else if (options.horizontal) {
                this.relativePosition.x = this.startPosition.x - this.x;
            } else {
                this.relativePosition.y = this.startPosition.y - this.y;
                this.relativePosition.x = this.startPosition.x - this.x;
            }

            options && options.onDragStart && options.onDragStart(this.startPosition);
        }

        function onDragEnd(event) {
            event.stopPropagation();
            this.dragging = false;
            this.data = null;
            options && options.onDragEnd && options.onDragEnd(this.x, this.y);
        }

        function onDragMove(event) {
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                // this.x = newPosition.x - this.relativePosition.x;
                // this.y = newPosition.y - this.relativePosition.y;
                if (options.vertical) {
                    this.y = newPosition.y - this.relativePosition.y;
                } else if (options.horizontal) {
                    this.x = newPosition.x - this.relativePosition.x;
                } else {
                    this.x = newPosition.x - this.relativePosition.x;
                    this.y = newPosition.y - this.relativePosition.y;
                }
                options && options.onDragMove && options.onDragMove(newPosition, this.startPosition, event.data.global);
            }
        }
    },

    scrollable(item, options) {
        const direction = options.direction;
        const parentWidth = options.parentWidth || app.screen.width;

        const dragableOptions = {};
        if (direction === 'vertical') {
            dragableOptions.vertical = true;
        }
        if (direction === 'horizontal') {
            dragableOptions.horizontal = true;
        }

        let dx = 0;
        let dy = 0;
        let prevPosition;
        let tweenMove;

        this.dragable(item, {
            ...dragableOptions,
            onDragStart: () => {
                tweenMove && tweenMove.stop();
                dx = 0;
            },
            onDragEnd: () => {
                tweenMove = PIXI.tweenManager.createTween(item);
                tweenMove.time = 500;
                const ddx = dx * 0.8 * Math.log2(Math.abs(dx) + 1);
                tweenMove.easing = PIXI.tween.Easing.outCubic();
                tweenMove.from({
                    x: item.x
                });
                tweenMove.to({
                    x: item.x + ddx
                });

                tweenMove.on('end', () => {
                    if (item.x + ddx > 0) {
                        tweenMove = PIXI.tweenManager.createTween(item);
                        tweenMove.time = 500;
    
                        tweenMove.easing = PIXI.tween.Easing.inOutCubic();
                        tweenMove.from({
                            x: item.x
                        });
                        tweenMove.to({
                            x: 0
                        });
                        tweenMove.start();
                    } else if (item.x + ddx + item.width < parentWidth) {
                        console.log(parentWidth);
                        tweenMove = PIXI.tweenManager.createTween(item);
                        tweenMove.time = 500;
    
                        tweenMove.easing = PIXI.tween.Easing.inOutCubic();
                        tweenMove.from({
                            x: item.x
                        });
                        tweenMove.to({
                            x: -(item.width - parentWidth)
                        });
                        tweenMove.start();
                    }
                });
                tweenMove.start();
            },
            onDragMove: (newPosition) => {
                if (prevPosition) {
                    dx =  newPosition.x - prevPosition.x;
                    dy = newPosition.y - prevPosition.y;
                }
                prevPosition = newPosition;
            }
        });

    }
}