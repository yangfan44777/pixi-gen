import * as PIXI from 'pixi.js'
import 'pixi-layers';
import * as lights from 'pixi-lights';
import 'pixi-tween';
import './index.css';
import spritesheet from './spritesheet.json';
import Resizer from './lib/Resizer';
import Person from './components/Person';
import ScrollTabPanel from './components/ScrollTabPanel';
import StartScene from './scenes/Start';
import SelectStyleScene from './scenes/SelectStyle';
import LoadingScene from './scenes/Loading';
import England from './scenes/Styles/England';
import {SceneManager} from './scenes/Scene';

const {Application, Sprite, Container, display} = PIXI;
const {diffuseGroup, normalGroup, lightGroup} = PIXI.lights = lights;
const {Layer, Stage} = display;
PIXI.SceneManager = SceneManager;

const app = window.app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor : 0xffffff
});
var frontGroup = window.frontGroup = new PIXI.display.Group(2, false);
var backGroup = window.backGroup = new PIXI.display.Group(1, false);


// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

app.stage = new Stage();

app.stage.addChild(new PIXI.display.Layer(backGroup));
app.stage.addChild(new PIXI.display.Layer(frontGroup));
const loadingScene = new LoadingScene();
// loadingScene.zOrder = 9999;
SceneManager.add('loading', loadingScene);

SceneManager.change('loading');
app.ticker.add((deltaTime) => {
    // each frame we spin the bunny around a bit
   //  light.x += 1;
       // console.log(deltaTime);
    // light.position.copy(app.renderer.plugins.interaction.mouse.global);
    PIXI.tweenManager.update();
});
// setTimeout(() => {
//     // loadingScene.out();
//     PIXI.loader.add('resources', spritesheet.url).load((loader, resources) => {

//         // This creates a texture from a 'bunny.png' image
//         window.resources = resources;
//         const bunny = new PIXI.Sprite(resources['resources'].textures['bunny.png']);
//         const container = new PIXI.Container();    
        
//         // const bg = new PIXI.Graphics().beginFill(0xFFFFFF, 1).lineStyle(1, 0xFFFFFF, 1).drawRect(0, 0, window.innerWidth, window.innerHeight);
//         // app.stage.addChild(bg);
    
//         // Rotate around the center
//         bunny.anchor.x = 0.5;
//         bunny.anchor.y = 0;
    
//         container.x = 300;
//         container.y = 600;
    
//         container.addChild(bunny);
    
//         const boss = new PIXI.Sprite(resources['resources'].textures['boss.png']);
    
//         boss.anchor.x = 0.5;
//         boss.anchor.y = 0;
    
//         // boss.pivot.x = 0.5;
//         //     boss.pivot.y = 0.5;
    
//         console.log(boss.width);
    
//         // boss.scale.x = 2.5;
//         // boss.scale.y = 2.5;
//         boss.x = 200;
//         boss.y = 800;
    
//     // 
    
//         bunny.interactive = true;
//         boss.interactive = true;
//         bunny.on('pointerdown', () => {
//             resizer.bind(bunny);
//         });
//         boss.on('tap', () => {
//             resizer.bind(boss);
//         });
        
    
//         bunny.scale.x = 5;
//         bunny.scale.y = 5;
//         bunny.x = 300;
//         bunny.y = 500;
//         container.rotation = 0.3;
//         const resizer = new Resizer(bunny, {
//             borderSize: 10
//         }, app);
//         // resizer.scale.x *= 4.25;
//         // resizer.scale.y *= 4.25;
        
//         // resizer.hide();
//         window.resize = resizer;
//         window.bunny = bunny;
//         window.boss = boss;
    
//         console.log(lights);
//         const diffuse = new PIXI.Sprite(resources['resources'].textures['boss.png']);
//         diffuse.parentGroup = diffuseGroup;
//         diffuse.scale.x = 2.5;
//         diffuse.scale.y = 2.5;
    
//         const diffuse2 = new PIXI.Sprite(resources['resources'].textures['boss.png']);
//         diffuse2.parentGroup = diffuseGroup;
        
//         // boss.parentGroup = normalGroup;
//         // Add the background normal map
//         const normals = new PIXI.Sprite(resources['resources'].textures['bossNORM.png']);
//         normals.parentGroup = normalGroup;
//         normals.scale.x = 2.5;
//         normals.scale.y = 2.5;
    
//         const normals2 = new PIXI.Sprite(resources['resources'].textures['bossNORM.png']);
//         normals2.parentGroup = normalGroup;
        
//         const light = new PIXI.lights.PointLight(0xffffff, 2);
//         light.x = 0;
//         light.y = 0;
//         // // Add the bunny to the scene we are building
//         // app.stage.addChild(
    
//         //     new Layer(diffuseGroup),
    
//         //     new Layer(normalGroup),
    
//         //     new Layer(lightGroup),
    
//         //     diffuse,
//         //     normals,
//         //     diffuse2,
//         //     normals2,
//         //     light
//         // );
        
//         // app.stage.addChild(container, boss);
        
//         const person = new Person();
//         person.y = 0;
//         person.x = 0;
//         person.rotation = 0.5
//         person.interactive = true;
//         // app.stage.addChild(person);
    
//         console.log(person.width);
    
//         const scrollTabPanel = new ScrollTabPanel();
//         scrollTabPanel.y = app.screen.height - 500;
//         // app.stage.addChild(scrollTabPanel);
    
//         person.on('pointerdown', () => {
//             console.log('tap person');
//             resizer.bind(person);
    
//         });
      
//         SceneManager.add('style_england', new England());
//         SceneManager.add('selectStyle', new SelectStyleScene());
//         SceneManager.add('start', new StartScene());
        
//         SceneManager.change('start');
        
    
//         // app.stage.addChild(resizer);
//         // Listen for frame updates
        
//     });
// }, 2000);
