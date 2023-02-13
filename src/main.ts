import frag from './shader/fragment.frag';
import vert from './shader/vertex.vert';
import * as PIXI from 'pixi.js';
import TaggedText from 'pixi-tagged-text';
import { Emitter } from '@pixi/particle-emitter';
import emitter_setting from './json/emitter.json';
import { load_all } from './loader';

/**
 * window 를 global로 접근 가능
 */
export const global: any = window as any;

/**
 * pixi application 생성
 */
export const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	width: 480,
	height: 640,
}); 
global.app = app;

// main 함수 실행
main();

async function main() {

    await load_all();

	const container_1: PIXI.Container = new PIXI.Container();
	container_1.scale.set(0.5);
	container_1.position.set(app.screen.width / 2, app.screen.height / 2);
	app.stage.addChild(container_1);

	const container_2: PIXI.Container = new PIXI.Container();
	container_2.position.set(500, 250);
	app.stage.addChild(container_2);

	// Load the shader program
	const vertexShader = vert;
	const fragmentShader = frag;
	// const myShader = Shader.from(vertexShader, fragmentShader);

	// Create a custom filter
	const myFilter = new PIXI.Filter(vertexShader, fragmentShader, {
		uTintColor: [1, 0, 0, 1],
		utime: 0,
	});

	// Apply the filter to the sprite
	const sprite_1: PIXI.Sprite = PIXI.Sprite.from('mollu');
	sprite_1.anchor.set(0.5);
	container_1.addChild(sprite_1);
	sprite_1.filters = [myFilter];

	const sprite_2: PIXI.Sprite = PIXI.Sprite.from('hos');
	sprite_2.anchor.set(0.5);
	container_2.addChild(sprite_2);

	const graphics: PIXI.Graphics = new PIXI.Graphics();

	graphics.beginFill(0xff00ff);
	graphics.lineStyle(10, 0x00ff00);
	graphics.drawCircle(0, 0, 25);
	graphics.endFill();

	app.stage.addChild(graphics);

	graphics.position.set(100, 100);

	const style = new PIXI.TextStyle({
		fontFamily: 'DungGeunMo',
		fontSize: 36,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fillGradientType: PIXI.TEXT_GRADIENT.LINEAR_HORIZONTAL,
		fillGradientStops: [0, 0.4],
		fill: ['#ffffff', '#00ff99'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 100,
		lineJoin: 'round',
	});

	let str = '';
	const texty: PIXI.Text = new PIXI.Text(str, style);
	texty.position.set(100, 0);

	app.stage.addChildAt(texty, 0);

	const t = new TaggedText('aaa <big>Big text</big> aaa', {
		default: {
			fontFamily: 'DungGeunMo',
		},
		big: {
			fontSize: 40,
			color: '#ff0000',
			fontFamily: 'DungGeunMo',
		},
	}); // renders "Big text" at 25px

	app.stage.addChild(t);

	let text_size = 50;
	let is_ascending = true;

	app.ticker.add((delta) => {
		text_size = is_ascending ? text_size + delta : text_size - delta;
		if (text_size > 100) is_ascending = false;
		if (text_size < 50) is_ascending = true;
		// The change to the style wasn't detected. It still renders "Big text" at 25px
		t.tagStyles.big.fontSize = text_size;
		// now it renders correctly.
		t.update();
	});

	// t.getStyleForTag('big').fo

	// t.textFields[0].visible = false; // Makes the word "Big" disappear.

	// t.draw(); // recreates the text fields restoring "Big"

	let time = 0;
	let updated = 0;
	app.ticker.add((delta) => {
		time += delta;
		let slow_time = time * 0.01;
		// rotate the container!
		// use delta to create frame-independent transform
		// conty.rotation -= 0 * delta;
		container_2.rotation -= 0.01 * delta;

		if (updated != Math.floor(time)) {
			texty.text = [...`${updated * updated}`].join(' ');
			updated = Math.floor(time);
		}

		// conty2.x = Math.abs(Math.sin(slow_time)) * 400;
		myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1];
		// myFilter.uniforms.utime = Math.sin(slow_time) * 400
	});

	const particleContainer = new PIXI.ParticleContainer(100);
	container_1.addChild(particleContainer);

	let emitter = new Emitter(particleContainer, emitter_setting);

	// emitter.autoUpdate = true;
	// emitter.updateSpawnPos(100, 200);
	emitter.emit = true;

	app.ticker.add((delta) => {
		emitter.update(delta * 0.001);
	});
}
