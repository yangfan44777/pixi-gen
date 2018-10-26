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
 
    

    // Rotate around the center
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
// 


    const resizer = new Resizer(bunny, {
        x: app.screen.width / 2,
        y: app.screen.height / 2
    });
    // resizer.scale.x *= 4.25;
    // resizer.scale.y *= 4.25;
    

    app.stage.addChild(resizer);
    
    
    // // Add the bunny to the scene we are building
    // app.stage.addChild(bunny);
 
    // Listen for frame updates
    // app.ticker.add(() => {
    //      // each frame we spin the bunny around a bit
    //     resizer.rotation += 0.01;
    // });
});