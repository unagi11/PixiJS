import F_hologram from './shader/hologram.frag';
import * as LOADER from './loader';
import { Application, Container, Filter, Graphics, Point, Sprite, TextStyle, Texture, TEXT_GRADIENT } from 'pixi.js';
import { SliceableSprite , Slice, range} from './slice'


/**
 * pixi application 생성
 */
export const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	width: global.DESIGN_WIDTH,
	height: global.DESIGN_HEIGHT,
	antialias: false,
});
global.app = app;

global.DESIGN_WIDTH = 1280;
global.DESIGN_HEIGHT = 720;

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

        if (inner_ratio > design_ratio) { // 윈도우 width가 더 긴경우.
            app.renderer.resize(window.innerHeight / 9 * 16, window.innerHeight);
        } 
        else { // 윈도우 height가 더 긴경우
            app.renderer.resize(window.innerWidth, window.innerWidth / 16 * 9);
        }
    }

    window.onresize = resize;
    resize();
    

}
