import * as PIXI from 'pixi.js'
import './index.css';
import spritesheet from './spritesheet.json';
import Resizer from './lib/Resizer';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor : 0x1099bb
});
 
// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

PIXI.loader.add('resources', spritesheet.url).load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    const bunny = new PIXI.Sprite(resources['resources'].textures['bunny.png']);
 
    const container = new PIXI.Container();    

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.4;

    container.x = 300;
    container.y = 600;

    container.addChild(bunny);


    const bunny2 = new PIXI.Sprite(resources['resources'].textures['bunny.png']);
 
    bunny2.anchor.x = -0.2;
    bunny2.anchor.y = -0.5;

    bunny2.scale.x = 2.5;
    bunny2.scale.y = 5;
    bunny2.x = 200;
    bunny2.y = 800;

// 

    bunny.interactive = true;
    bunny2.interactive = true;
    bunny.on('pointerdown', () => {
        resizer.bind(bunny);
    });
    bunny2.on('tap', () => {
        resizer.bind(bunny2);
    })

    bunny.scale.x = 5;
    bunny.scale.y = 5;
    bunny.x = 300;
    bunny.y = 500;
    container.rotation = 0.3;
    const resizer = new Resizer(bunny, {
        borderSize: 10
    }, app);
    // resizer.scale.x *= 4.25;
    // resizer.scale.y *= 4.25;
    
    // resizer.hide();
    window.resize = resizer;
    window.bunny = bunny;
    window.bunny2 = bunny2;
    app.stage.addChild(container, bunny2);
    app.stage.addChild(resizer);
    
    
    
    // // Add the bunny to the scene we are building
    // app.stage.addChild(bunny);
 
    // Listen for frame updates
    // app.ticker.add(() => {
    //      // each frame we spin the bunny around a bit
    //     resizer.rotation += 0.01;
    // });
});