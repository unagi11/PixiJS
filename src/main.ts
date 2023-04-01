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
    let scene1 = Scene1_json
    makeScene(scene1);
}

function makeScene(data : SceneData) {
	let scene1_frames = data.frames;
    let scene1_meta = data.meta;
    let names : string[] = scene1_meta.layers.map(layer => layer.name as string);
    let frames : SceneFrame[] = scene1_frames;

    frames.map((frame, index) => {
        let texture = PIXI.BaseTexture.from(`ase/${data.meta.image}`);
        let rect =  new PIXI.Rectangle(frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);
        let trimmed_texture = new PIXI.Texture(texture, rect);

        // 이미지의 일부분을 잘라내어 Sprite 생성
        const sprite = new PIXI.Sprite(trimmed_texture);
        sprite.transform.position.set(frame.spriteSourceSize.x, frame.spriteSourceSize.y);
        sprite.name = names[index];
        
        // add touch button on sprite
        sprite.interactive = true;
        sprite.on('pointerdown', (a) => {

            // rotate 360 animate
            
            let rotate = (delta) => {
                sprite.rotation += 0.1 * delta;

                if (sprite.angle >= 360){
                    app.ticker.remove(rotate);
                    sprite.angle = 0;
                }
            }

            app.ticker.add(rotate);

            console.log('clicked !! ' + sprite.name);
        });

        // 스테이지에 Sprite 추가
        global.root.addChild(sprite);
    });
}

interface SceneFrame {
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
	sourceSize: {
		w: number;
		h: number;
	};
}

interface SceneMeta{
    app: string;
    version: string;
    image: string;
    format: string;
    size: {
        w: number;
        h: number;
    };
    scale: string;
    layers: {
        name: string;
        opacity: number;
        blendMode: string;
        data?: string;
    }[]
};

interface SceneData {
    frames: SceneFrame[];
    meta: SceneMeta;
}
