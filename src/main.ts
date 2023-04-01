import * as LOADER from './loader';
import { Application, Container, Filter, Graphics, Sprite, TextStyle, Texture, TextureUvs, TEXT_GRADIENT } from 'pixi.js';
import { SliceableSprite , Slice, range} from './slice'


/**
 * pixi application 생성
 */
export const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: global.DESIGN_WIDTH,
	height: global.DESIGN_HEIGHT,
	antialias: false,
});
global.app = app;

global.DESIGN_WIDTH = 1280;
global.DESIGN_HEIGHT = 720;

global.LETTER_WIDTH = 0;
global.LETTER_HEIGHT = 0;

global.root = new Container();
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
        let root = global.root as Container;
        
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

    let background = Sprite.from('background.png');
    let box = Sprite.from('box.png')

    global.root.addChild(background);
    global.root.addChild(box);

    window.onresize = resize;
    resize();
}