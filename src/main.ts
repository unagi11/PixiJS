import F_hologram from './shader/hologram.frag';
import * as LOADER from './loader';
import { Application, Container, Filter, Graphics, Sprite, TextStyle, Texture, TEXT_GRADIENT } from 'pixi.js';

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

    window.addEventListener('resize', () => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        app.renderer.resize(width, height);
    });

    let peroro = Sprite.from('peroro.png')
    app.stage.addChild(peroro);

    let hologram_filter = new Filter(undefined, F_hologram)
    peroro.filters = [hologram_filter];

    hologram_filter.uniforms.uTime = 10;
    hologram_filter.uniforms.uLineTexture = Texture.from('line_pattern.png')
    hologram_filter.uniforms.uLineResolution = [400, 400]

    let uTime = 0;
    app.ticker.add(delta => {
        let ms = delta / 60;
        uTime = uTime > 60 ? 0 : uTime + ms;
        hologram_filter.uniforms.uTime = uTime;
    })
}