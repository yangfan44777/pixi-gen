import * as PIXI from 'pixi.js';

export default class Person extends PIXI.Container {

    constructor() {
        super();
        this.head = new PIXI.Sprite(window.resources['resources'].textures['man_head_1.png']);
        this.body = new PIXI.Sprite(window.resources['resources'].textures['man_body_1.png']);
        
        this.head.x = -65/2;
        this.body.x = -113/2;

        this.head.y = 0;
        this.body.y = 75;
        this.head.width = 65;
        this.head.height = 82;
        this.body.width = 113;
        this.body.height = 268;
        console.log(this.body.width); 
        this.head.interactive = true;
        this.body.interactive = true;
        // this.pivot.x = 0.5;
        // this.pivot.y = 0.5;

        this.on('pointerdown', () => {
            window.currentHead = this.head;
            window.currentBody = this.body;
            console.log(this.width);
        });


        this.addChild(this.body, this.head);
        // this.dragable(this);
    }

   
    dragable(item, options) {
        item
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        function onDragStart(event) {
            console.log('dragstart');
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
            console.log('onDragEnd');
            event.stopPropagation();
            this.dragging = false;
            this.data = null;
        }

        function onDragMove(event) {
            console.log('onDragMove');
            if (this.dragging) {
                var newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x - this.relativePosition.x;
                this.y = newPosition.y - this.relativePosition.y;
                options && options.onDragMove && options.onDragMove(newPosition, this.startPosition, event.data.global);
            }
        }
    }
}

