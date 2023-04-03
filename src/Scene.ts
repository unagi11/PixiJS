import * as PIXI from 'pixi.js';
import { FederatedEventHandler } from 'pixi.js';

export class Scene {
	static create(data: SceneData, root: PIXI.Container) {

    }

	constructor(public data: SceneData, public root: PIXI.Container) {

    }
}

export class Interactor {
    sprite : PIXI.Sprite;
    rect : PIXI.Rectangle;
    name : string;
    layer : number;
    blendMode : string;
    opacity : number;
    data : string;

    constructor(data : SceneFrame, meta : SceneMeta, layer : SceneLayer, root : PIXI.Container) {
        let texture = PIXI.BaseTexture.from(`ase/${meta.image}`);
        let rect =  new PIXI.Rectangle(data.frame.x, data.frame.y, data.frame.w, data.frame.h);
        let trimmed_texture = new PIXI.Texture(texture, rect);

        // 이미지의 일부분을 잘라내어 Sprite 생성
        this.sprite = new PIXI.Sprite(trimmed_texture);
        this.sprite.transform.position.set(data.spriteSourceSize.x, data.spriteSourceSize.y);
        this.sprite.name = layer.name;
        
        // add touch button on sprite
        this.sprite.interactive = true;

        // this.sprite.onpointerup(event_handler );
            
        //     (a) => {

        //     // rotate 360 animate
            
        //     let rotate = (delta: number) => {
        //         this.sprite.rotation += 0.1 * delta;

        //         if (this.sprite.angle >= 360){
        //             app.ticker.remove(rotate);
        //             this.sprite.angle = 0;
        //         }
        //     }

        //     app.ticker.add(rotate);

        //     console.log('clicked !! ' + this.sprite.name);
        // });

        // 스테이지에 Sprite 추가
        root.addChild(this.sprite);
    }


}

export interface SceneFrame {
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

export interface SceneMeta{
    app: string;
    version: string;
    image: string;
    format: string;
    size: {
        w: number;
        h: number;
    };
    scale: string;
    layers: SceneLayer[]
};

export interface SceneLayer{
    name: string;
    opacity: number;
    blendMode: string;
    data?: string;
}

export interface SceneData {
    frames: SceneFrame[];
    meta: SceneMeta;
}
