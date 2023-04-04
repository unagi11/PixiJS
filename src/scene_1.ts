import { Container, Sprite } from 'pixi.js';
import { SceneBase, SceneData } from './scene';

export class Scene1 extends SceneBase {
    drawer: Sprite;
    background: Sprite;
    desk: Sprite;
    
    constructor(data: SceneData, root: Container) {
        super(data, root);

        this.drawer = this.objects['drawer'] as Sprite;
        this.background = this.objects['background'] as Sprite;
        this.desk = this.objects['desk'] as Sprite;

        this.drawer.interactive = true;
        this.drawer.on('pointerdown', (a) => {

            let angle = 0;

            let handler = (delta) => {
                this.drawer.angle = angle;
                angle += delta * 3;

                if (angle > 360) {
                    angle = 0;
                    global.app.ticker.remove(handler);
                }
            }

            global.app.ticker.add(handler);

        });

    }
}