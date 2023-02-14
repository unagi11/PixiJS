import { Assets } from 'pixi.js';
import asset_option from './json/asset.json';

/**
 * 에셋을 로드 하는 함수.
 */
export async function load_all() {
	await Assets.init({ manifest: asset_option });
	await Assets.loadBundle('test-screen');
	// let loadScreenAssets = await Assets.loadBundle('load-screen');
	// let gameScreenAssets = await Assets.loadBundle('game-screen')

}
