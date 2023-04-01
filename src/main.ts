import * as LOADER from './loader';
import * as PIXI from 'pixi.js';
import Scene1_json from '../static/ase/Scene1.json';

/**
 * pixi application 생성
 */
export const app = new PIXI.Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	autoDensity: true,
	backgroundColor: 0x111111,
	width: global.DESIGN_WIDTH,
	height: global.DESIGN_HEIGHT,
	antialias: false,
});
global.app = app;

global.DESIGN_WIDTH = 1280;
global.DESIGN_HEIGHT = 720;

global.LETTER_WIDTH = 0;
global.LETTER_HEIGHT = 0;

global.root = new PIXI.Container();
app.stage.addChild(global.root);

// main 함수 실행
main();

/**
 * 메인 함수 실행
 */
async function main() {
	await LOADER.load_all();

    function resize () {
        let inner_ratio = window.innerWidth / window.innerHeight;
        let design_ratio = global.DESIGN_WIDTH / global.DESIGN_HEIGHT;
        let root = global.root as PIXI.Container;
        
        // 윈도우 width가 더 긴경우
        if (inner_ratio > design_ratio) {
            let scale = window.innerHeight / global.DESIGN_HEIGHT;
            global.LETTER_WIDTH = window.innerWidth / 2 - (window.innerHeight / 9) * 16 / 2;
            global.LETTER_HEIGHT = 0; 

            root.transform.scale.set(scale);
            root.transform.position.set(global.LETTER_WIDTH, global.LETTER_HEIGHT);
            app.renderer.resize(window.innerWidth, window.innerHeight);
        } 
        // 윈도우 height가 더 긴경우
        else {
            let scale = window.innerWidth / global.DESIGN_WIDTH;
            global.LETTER_WIDTH = 0;
            global.LETTER_HEIGHT = window.innerHeight / 2 - (window.innerWidth / 16) * 9/ 2;

            root.transform.scale.set(scale);
            root.transform.position.set(global.LETTER_WIDTH, global.LETTER_HEIGHT);
            app.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }

    window.onresize = resize;
    resize();

    MakeScene(Scene1_json);
}

function MakeScene(scene_data : any) {
	let scene1_frames = scene_data.frames;
    let keys : string[] = Object.keys(scene1_frames);
    let values : Frame[] = Object.values(scene1_frames);

    values.map((value : Frame, index : number) : [string, Frame] => {
        return [keys[index], value];
    }).forEach((value : [string, Frame]) => {
        let name : string = value[0];
        let frame : Frame = value[1];

        let texture = PIXI.BaseTexture.from('ase/Scene1.png');
        let rect =  new PIXI.Rectangle(frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);
        let trimmed_texture = new PIXI.Texture(texture, rect);

        // 이미지의 일부분을 잘라내어 Sprite 생성
        const sprite = new PIXI.Sprite(trimmed_texture);
        sprite.transform.position.set(frame.spriteSourceSize.x, frame.spriteSourceSize.y);
        sprite.name = name;
        
        // add touch button on sprite
        sprite.interactive = true;
        sprite.on('pointerdown', (a) => {
            console.log('clicked !! ' + sprite.name);
        });

        // 스테이지에 Sprite 추가
        global.root.addChild(sprite);
    });
}

interface Frame {
	frame: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	spriteSourceSize: {
		x: number;
		y: number;
		w: number;
		h: number;
	};
	soruceSize: {
		w: number;
		h: number;
	};
}