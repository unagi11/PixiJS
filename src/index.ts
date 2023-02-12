// import frag from 'fragment.frag';
// import vert from 'vertex.vert';

import frag from './shaders/fragment.frag';
import vert from './shaders/vertex.vert';
import { Hello } from './hello';
import { Application, Sprite, Container, Filter } from 'pixi.js';
export const global : any = window as any;

export const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	// backgroundAlpha: 0.001,
	width: 1920,
	height: 1080,
}); global.app = app;

const conty1: Container = new Container();
conty1.x = 150;
conty1.y = 150;
app.stage.addChild(conty1);

const conty2: Container = new Container();
conty2.x = 400;
conty2.y = 400;
app.stage.addChild(conty2);

// Load the shader program
const vertexShader = vert;
const fragmentShader = frag;
// const myShader = Shader.from(vertexShader, fragmentShader);

// Create a custom filter
const myFilter = new Filter(vertexShader, fragmentShader, {
	uTintColor: [1, 0, 0, 1],
	utime: 0,
});

// Apply the filter to the sprite
const sprite_1: Sprite = Sprite.from('hos.png');
sprite_1.anchor.set(0.5);
conty1.addChild(sprite_1);
sprite_1.filters = [myFilter];

const sprite_2: Sprite = Sprite.from('hos.png');
sprite_2.anchor.set(0);
conty2.addChild(sprite_2);

let time = 0;
app.ticker.add((delta) => {
	time += delta;
	let slow_time = time * 0.01;
	// rotate the container!
	// use delta to create frame-independent transform
	// conty.rotation -= 0 * delta;
	conty2.rotation -= 0.01 * delta;
	// conty2.x = Math.abs(Math.sin(slow_time)) * 400;
	myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1];
	// myFilter.uniforms.utime = Math.sin(slow_time) * 400
});
