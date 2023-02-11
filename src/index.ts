import { Application, Sprite, Container, Filter } from 'pixi.js';

const app = new Application({
	view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x666666,
    // backgroundAlpha: 0.001,
	width: 1920,
	height: 1080,
});

// throw Error('hello');

const conty: Container = new Container();
conty.x = 150;
conty.y = 150;
app.stage.addChild(conty);

const conty2: Container = new Container();
conty2.x = 400;
conty2.y = 400;
app.stage.addChild(conty2);

// Load the shader program
const vertexShader = `
    attribute vec2 aVertexPosition;
    uniform mat3 projectionMatrix;
    varying vec2 vTextureCoord;

    uniform vec4 inputSize;
    uniform vec4 outputFrame;
    uniform float utime;

    vec4 filterVertexPosition( void )
    {
        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

        return vec4((projectionMatrix * vec3(position + utime, 1.0)).xy, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void )
    {
        return aVertexPosition * (outputFrame.zw * inputSize.zw);
    }

    void main(void)
    {
        gl_Position = filterVertexPosition();
        vTextureCoord = filterTextureCoord();
    }
`;
const fragmentShader = `
    precision mediump float;
    uniform sampler2D uSampler;
    uniform vec4 uTintColor;
    varying vec2 vTextureCoord;
    void main() {
        gl_FragColor = texture2D(uSampler, vTextureCoord) * uTintColor;
    }
`;
// const myShader = Shader.from(vertexShader, fragmentShader);

// Create a custom filter
const myFilter = new Filter(vertexShader, fragmentShader, 
    {
        uTintColor: [1, 0, 0, 1],
        utime: 0,
    }
);

// Apply the filter to the sprite
const sprite_1: Sprite = Sprite.from('hos.png');
sprite_1.anchor.set(0.5);
conty.addChild(sprite_1);
sprite_1.filters = [myFilter];

const sprite_2: Sprite = Sprite.from('hos.png');
sprite_2.anchor.set(0.5);
conty2.addChild(sprite_2);

let time = 0;
app.ticker.add((delta) => {
    time += delta;
    let slow_time = time * 0.01

    // rotate the container!
    // use delta to create frame-independent transform
    // conty.rotation -= 0 * delta;
    conty2.rotation -= 0.4 * delta;
    conty2.x = Math.abs(Math.sin(slow_time)) * 400;
    myFilter.uniforms.uTintColor = [Math.sin(slow_time), 1 - Math.sin(slow_time), Math.sin(slow_time + 2), 1];
    myFilter.uniforms.utime = Math.sin(slow_time) * 400
});