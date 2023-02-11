import { Application, Sprite, Container } from 'pixi.js';

const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
    // backgroundAlpha: 0.001,
	width: 1920,
	height: 1080,
});

const conty: Container = new Container();
conty.x = 150;
conty.y = 150;
app.stage.addChild(conty);

const conty2: Container = new Container();
conty2.x = 400;
conty2.y = 400;
app.stage.addChild(conty2);

const clampy: Sprite = Sprite.from('hos.png');
clampy.anchor.set(0.5);
conty.addChild(clampy);

const clampy2: Sprite = Sprite.from('hos.png');
clampy2.anchor.set(0.5);
conty2.addChild(clampy2);

app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    conty.rotation -= 2 * delta;
    conty2.rotation -= 0.4 * delta;
});