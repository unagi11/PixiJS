import frag from './shaders/fragment.frag'
import vert from './shaders/vertex.vert'
import { Application, Sprite, Container, Filter, Assets, Point, Graphics, Text, TextStyle, BitmapText, Loader, TEXT_GRADIENT } from 'pixi.js'
import TaggedText from 'pixi-tagged-text'

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
container_1.position.set(app.screen.width / 2, app.screen.height / 2)
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

const graphics: Graphics = new Graphics()

graphics.beginFill(0xff00ff)
graphics.lineStyle(10, 0x00ff00)
graphics.drawCircle(0, 0, 25)
graphics.endFill()

app.stage.addChild(graphics)

graphics.position.set(100, 100)

const style = new TextStyle({
	fontFamily: 'DungGeunMo',
	fontSize: 36,
	fontStyle: 'italic',
	fontWeight: 'bold',
	fillGradientType: TEXT_GRADIENT.LINEAR_HORIZONTAL,
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
})

let str = ''
const texty: Text = new Text(str, style)
texty.position.set(100, 0)

app.stage.addChildAt(texty, 0)

Assets.load('PF스타더스트.ttf')
Assets.load('DungGeunMo.ttf')

const t = new TaggedText('aaa <big>Big text</big> aaa', {
	default: {
		fontFamily: 'DungGeunMo',
	},
	big: {
		fontSize: 40,
		color: '#ff0000',
		fontFamily: 'DungGeunMo',
	},
}) // renders "Big text" at 25px

app.stage.addChild(t)

let text_size = 50
let is_ascending = true

app.ticker.add((delta) => {
	text_size = is_ascending ? text_size + delta : text_size - delta
	if (text_size > 100) is_ascending = false
	if (text_size < 50) is_ascending = true
	// The change to the style wasn't detected. It still renders "Big text" at 25px
	t.tagStyles.big.fontSize = text_size
	// now it renders correctly.
	t.update()
})

// t.getStyleForTag('big').fo

// t.textFields[0].visible = false; // Makes the word "Big" disappear.

// t.draw(); // recreates the text fields restoring "Big"

let time = 0
let updated = 0
app.ticker.add((delta) => {
	time += delta
	let slow_time = time * 0.01
	// rotate the container!
	// use delta to create frame-independent transform
	// conty.rotation -= 0 * delta;
	container_2.rotation -= 0.01 * delta

	if (updated != Math.floor(time)) {
		texty.text = [...`${updated * updated}`].join(' ')
		updated = Math.floor(time)
	}

	// conty2.x = Math.abs(Math.sin(slow_time)) * 400;
	myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1]
	// myFilter.uniforms.utime = Math.sin(slow_time) * 400
})
