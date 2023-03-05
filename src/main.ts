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
	width: window.innerWidth,
	height: window.innerHeight,
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

	window.addEventListener('resize', () => {
		let width = window.innerWidth;
		let height = window.innerHeight;
		app.renderer.resize(width, height);
	});

    let texture = Texture.from('susino');
    let ss = new SliceableSprite(app.stage , texture);

    range(0, 180, 30).forEach(degree => {
        ss.polygons = ss.sliceByLine(ss.polygons, Slice.getDegreeLine(degree, {x : 0, y : 0}));
    })
    ss.draw(true);
    ss.root.position.set(400, 550);
}
