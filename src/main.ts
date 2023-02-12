import frag from './shaders/fragment.frag'
import vert from './shaders/vertex.vert'
import { Application, Sprite, Container, Filter, Point, Graphics, Text, TextStyle } from 'pixi.js'

export const global: any = window as any

export const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
	// backgroundAlpha: 0.001,
	width: 640,
	height: 360,
})
global.app = app

const container_1: Container = new Container()
container_1.scale.set(0.5)
container_1.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(container_1)

const container_2: Container = new Container()
container_2.position.set(500, 250)
app.stage.addChild(container_2)

// Load the shader program
const vertexShader = vert
const fragmentShader = frag
// const myShader = Shader.from(vertexShader, fragmentShader);

// Create a custom filter
const myFilter = new Filter(vertexShader, fragmentShader, {
	uTintColor: [1, 0, 0, 1],
	utime: 0,
})

// Apply the filter to the sprite
const sprite_1: Sprite = Sprite.from('mollu.gif')
sprite_1.anchor.set(0.5)
container_1.addChild(sprite_1)
sprite_1.filters = [myFilter]

const sprite_2: Sprite = Sprite.from('hos.png')
sprite_2.anchor.set(0.5)
container_2.addChild(sprite_2)

let time = 0
app.ticker.add((delta) => {
	time += delta
	let slow_time = time * 0.01
	// rotate the container!
	// use delta to create frame-independent transform
	// conty.rotation -= 0 * delta;
	container_2.rotation -= 0.01 * delta
	// conty2.x = Math.abs(Math.sin(slow_time)) * 400;
	myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1]
	// myFilter.uniforms.utime = Math.sin(slow_time) * 400
})

const graphics: Graphics = new Graphics();

graphics.beginFill(0xFF00FF);
graphics.lineStyle(10, 0x00FF00);
graphics.drawCircle(0, 0, 25);
graphics.endFill()

app.stage.addChild(graphics);

graphics.position.set(100, 100);


const styly: TextStyle = new TextStyle({
    align: 'left',
    fill: "#00CCFF",
    fontSize: 42
});

// Text supports unicode!

let a = Array(10).map(_ => '몰?루').join()
const texty: Text = new Text(a);  
texty.position.set(100, 0)

// texty.text = "This is expensive to change, please do not abuse";
app.stage.addChildAt(texty, 0);