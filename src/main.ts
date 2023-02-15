import frag from './shader/fragment.frag';
import vert from './shader/vertex.vert';
import emitter_setting from './json/emitter.json';
import * as PIXI from 'pixi.js';
import * as LOADER from './loader';

/**
 * pixi application 생성
 */
export const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	width: window.innerWidth,
	height: window.innerHeight,
    antialias: false
});
global.app = app;

global.DESIGN_WIDTH  = 1280;
global.DESIGN_HEIGHT = 720;

// main 함수 실행
main();


/**
 * 메인 함수 실행
 */
async function main() {
	await LOADER.load_all();

    window.addEventListener('resize', resize);

    function resize()
    {
        let width = window.innerWidth;
        let height = window.innerHeight;

        // let screenRatio = height / width;
        // let screenRatio_bef = container_1.height / container_1.width;
        
        //세로가 더 긴 상황. 가로에 포커스.
        // if(screenRatio > screenRatio_bef)
        // {
        //     container_1.width = width;
        //     container_1.height = width * screenRatio_bef;
        // }
        // else
        // {
        //     container_1.height = height;
        //     container_1.width = height / screenRatio_bef;
        // }
        
        app.renderer.resize(width, height);
        // container_1.position.set(app.screen.width / 2, app.screen.height / 2);
    }

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

    container_1.filters = [myFilter];

	// Apply the filter to the sprite
	const sprite_1: PIXI.Sprite = PIXI.Sprite.from('mollu');
	sprite_1.anchor.set(0.5, 0.5);
	container_1.addChild(sprite_1);
	// sprite_1.filters = [myFilter];

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

	// const t = new TaggedText('aaa <big>Big text</big> aaa', {
	// 	default: {
	// 		fontFamily: 'DungGeunMo',
	// 	},
	// 	big: {
	// 		fontSize: 40,
	// 		color: '#ff0000',
	// 		fontFamily: 'PF스타더스트',
	// 	},
	// }); // renders "Big text" at 25px

	// app.stage.addChild(t);

	let text_size = 50;
	let is_ascending = true;

	app.ticker.add((delta) => {
		text_size = is_ascending ? text_size + delta : text_size - delta;
		if (text_size > 100) is_ascending = false;
		if (text_size < 50) is_ascending = true;
		// The change to the style wasn't detected. It still renders "Big text" at 25px
		// t.tagStyles.big.fontSize = text_size;
		// now it renders correctly.
		// t.update();
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

	// let emitter = new Emitter(particleContainer, emitter_setting);

	// emitter.autoUpdate = true;
	// emitter.updateSpawnPos(100, 200);
	// emitter.emit = true;

	app.ticker.add((delta) => {
		// emitter.update(delta * 0.001);
	});

    const fps_text = new PIXI.Text(undefined, {
        fill : '#ff0000'
    });
    app.stage.addChild(fps_text);

    
    let oldTime = 0;
    app.ticker.add((delta) => {

        let newTime = new Date().getTime();
        let deltaTime = newTime - oldTime;

        fps_text.text = Math.floor(1000/deltaTime)

        fps_text.position.set(0, window.innerHeight);
        fps_text.anchor.set(0, 1)

        oldTime = newTime;
    })

}