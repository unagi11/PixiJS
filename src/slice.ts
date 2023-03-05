import { Container, Graphics, Rectangle, Sprite, Texture } from 'pixi.js';
import { app } from './main';

interface Point {
	x: number;
	y: number;
}

/**
 * 폴리곤 == 점들의 집합
 */
type Polygon = Point[];

/**
 * 직선 방정식
 * y = ax + b
 */
interface Line {
	a: number; // 기울기
	b: number; // y 절편
	p?: Point; // 지나는 점
}

/**
 * 선분
 */
interface Segment {
	p1: Point;
	p2: Point;
}

const error = 0.001;

/**
 * 자를 수 있는 스프라이트
 */
export class SliceableSprite {
	root: Container;
	polygons: Polygon[];
	peices: {container : Container, sprite : Sprite, graphics : Graphics }[];

	/**
	 * @param parent 붙힐 부모
	 * @param texture 사용할 그림 텍스쳐
	 * @param rect 최초 polygon
	 */
	constructor(public parent: Container, public texture: Texture, public rect: Rectangle = texture.frame) {
		this.root = new Container();
		this.root.name = 'sliceable_sprite';
		parent.addChild(this.root);

		// 초기 폴리곤은 rect로 시작하게 해둠.
		this.polygons = [
			[
				{ x: rect.x - rect.width / 2, y: rect.y - rect.height / 2 },
				{ x: rect.x + rect.width / 2, y: rect.y - rect.height / 2 },
				{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
				{ x: rect.x - rect.width / 2, y: rect.y + rect.height / 2 },
			],
		];

		this.texture = texture;

		this.draw();
	}

	/**
	 * 폴리곤 데이터를 이용해서 조각난 스프라이트를 그립니다.
	 */
	draw(debug: boolean = false) {
		this.root.removeChildren(); 

        let masks: { container: Container; graphics: Graphics }[] = this.polygons.map((polygon) => {
			let container = new Container();
			this.root.addChild(container);

			let graphics = new Graphics();
			graphics.beginFill();
			graphics.drawPolygon(polygon);
			graphics.endFill();
			container.addChild(graphics);

			return { container, graphics };
		});

		this.peices = masks
			.map(mask => {
				let sprite = new Sprite(this.texture);
				sprite.anchor.set(0.5, 0.5);
				mask.container.addChild(sprite);
				sprite.mask = mask.graphics;

				return {container: mask.container, sprite, graphics : mask.graphics};
			});

		// ! Debug
		if (debug) {

            let color = [0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff];
            let index = 0;

			this.polygons.map((polygon) => {
				let mask = new Graphics();
				mask.lineStyle(2, color[index++ % color.length]);
				mask.beginFill(0, 0);
				mask.drawPolygon(polygon);
				mask.endFill();
				this.root.addChild(mask);
				return mask;
			});

			this.peices.forEach(peice => {
				peice.container.interactive = true;
				peice.container.onmousedown = e => {
					peice.container.removeFromParent();
				};
			});
		}
	}

	/**
	 * 직선으로 자릅니다.
	 * @returns 자르고난 뒤 폴리곤들을 리턴합니다. 잘리지 않았으면 input 그대로 리턴합니다.
	 */
	sliceByLine(polygons: Polygon[], line: Line): Polygon[] {
		let results: Polygon[] = [];

		polygons.forEach((polygon) => {
			if (polygon.length < 3) results.push(polygon);

			let intersection_points: Point[] = [];

			for (let i = 0; i < polygon.length; i++) {
				const start = polygon[i];
				const end = polygon[(i + 1) % polygon.length];

				let intersection = Slice.getIntersection(line, { p1: start, p2: end });
				if (intersection) intersection_points.push(intersection);
			}

			if (intersection_points.length > 0) { 
				let polygon1: Point[] = [...intersection_points];
				let polygon2: Point[] = [...intersection_points];

				for (let i = 0; i < polygon.length; i++) {
					const p = polygon[i];
					if (line.a === Infinity || line.a === -Infinity) {
                        if (Math.abs(line.p!.x - p.x) < error) {
							polygon1.push(p);
							polygon2.push(p);
						} else if (line.p!.x < p.x) {
							polygon1.push(p);
						} else {
							polygon2.push(p);
						}
					}
                    // 직선 위에 있
                    else if (Math.abs(line.a * p.x + line.b - p.y) < error) {
                        polygon1.push(p);
                        polygon2.push(p);
                    }   
                    // 직선 위에 있
                    else if (line.a * p.x + line.b > p.y) polygon1.push(p);
                    // 밑에 있냐..
					else polygon2.push(p);
				}

				results.push(polygon1);
				results.push(polygon2);
			} else {
				results.push(polygon);
			}
		});

		function polyIndexOf(arr: Point[], item: Point, startIndex = 0) {
			for (let i = startIndex; i < arr.length; i++) {
				if (Math.abs(arr[i].x - item.x) < error  && Math.abs(arr[i].y - item.y) < error) {
					return i;
				}
			}
			return -1;
		}

		// 소팅
		results = results
			.map((polygon) =>
				polygon
					.map((vertex) => {
						vertex.x = vertex.x == -0 ? 0 : vertex.x;
						vertex.y = vertex.y == -0 ? 0 : vertex.y;
						return vertex;
					})
					.filter(
                        (item, index) => 
                        polyIndexOf(polygon, item) === index)
			)
			.filter((polygon) => polygon.length > 2)
			.map((polygon) => Slice.getConvexHull(polygon));

		return results;
	}
}
global.SliceableSprite = SliceableSprite;

export namespace Slice {
	/**
	 * 외곽 껍질 찾기
	 * @param points
	 * @returns
	 */
	export function getConvexHull(points: Point[]): Point[] {
		if (points.length < 3) {
			return points;
		}

		// 가장 좌측에 있는 점을 찾습니다.
		let startIndex = 0;
		for (let i = 1; i < points.length; i++) {
			if (points[i].x < points[startIndex].x) {
				startIndex = i;
			}
		}

		let startPoint = points.splice(startIndex, 1)[0];

		// y좌표 값이 증가하는 순서로 점들을 정렬합니다.
		points = points.sort((a, b) => {
			let slopeA: number = (a.y - startPoint.y) / (a.x - startPoint.x);
			let slopeB: number = (b.y - startPoint.y) / (b.x - startPoint.x);

			if (slopeA != slopeB) return slopeA - slopeB;
			else return a.x - b.y;
		});

		// 스택을 초기화합니다.
		const stack: Point[] = [startPoint, points[0]];

		// 점들을 순회하면서 Convex Hull을 구성하는 점들을 찾아갑니다.
		for (let i = 1; i < points.length; i++) {
			let top = stack.length - 1;
			while (top >= 1 && getOrientation(stack[top - 1], stack[top], points[i]) !== 2) {
				stack.pop();
				top--;
			}
			stack.push(points[i]);
		}

		return stack;
	}

	/**
	 * 세 점의 위치 관계를 판단합니다.
	 * @returns 0: colinear, 1: clockwise, 2: counterclockwise
	 */
	export function getOrientation(p1: Point, p2: Point, p3: Point): number {
		const val = (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);
		if (val === 0) {
			return 0;
		} else if (val > 0) {
			return 1;
		} else {
			return 2;
		}
	}

	/**
	 * 직선이 선분과 교차하는가?
	 * @param line 직선
	 * @param segment 선분
	 * @returns 교차하는 point 리턴, 없다면 null
	 */
	export function getIntersection(line: Line, segment: Segment): Point | null {
		let segment_line = get2DotLine(segment.p1, segment.p2);

		if ((segment.p1.y - line.a * segment.p1.x - line.b) * (segment.p2.y - line.a * segment.p2.x - line.b) > 0) {
			return null;
		}

		// 평행한 경우 제외
		if (segment_line.a == line.a) return null;

		// 선분의 시작점과 끝점이 각각 직선의 한쪽에 위치하면서, 서로 다른 위치에 있는 경우
		// const orientation1 = line.a * segment.p1.x + line.b - segment.p1.y;
		// const orientation2 = line.a * segment.p2.x + line.b - segment.p2.y;
        // if (orientation1 * orientation2 == 0) {
        //     console.log()
        // }
		// if (orientation1 * orientation2 > 0) {
		// 	return null;
		// }

		let x: number, y: number;
		if (segment.p1.x === segment.p2.x) {
			if (line.a === Infinity || line.a === -Infinity) {
				// 선분의 방정식이 정의되지 않는 경우
				return null;
			} else if ((line.a * segment.p1.x + line.b - segment.p1.y) * (line.a * segment.p1.x + line.b - segment.p2.y) < 0) {
				// 기준 직선의 방정식이 x = b 형태인 경우
				x = segment.p1.x;
				y = line.a * x + line.b;
			} else {
				return null;
			}
		} else {
			if (Math.abs(line.a) === Infinity) {
				if ((segment.p1.x - line.p!.x) * (segment.p2.x - line.p!.x) < 0) {
					x = line.p!.x;
					y = segment_line.a * x + segment_line.b;
				} else return null;
			} else if (Math.abs(segment_line.a) === Infinity) {
				if ((segment.p1.y - line.p!.y) * (segment.p2.y - line.p!.y) < 0) {
					x = segment.p1.x;
					y = line.a * x + line.b;
				} else return null;
			} else {
				// 일반적인 경우
				x = (line.b - segment_line.b) / (segment_line.a - line.a);
				y = segment_line.a * x + segment_line.b;
			}
		}

		// 교차점의 좌표를 객체 형태로 반환합니다.
		return { x, y };
	}

	/**
	 * p1과 p2를 지나는 직선을 구한다.
	 */
	export function get2DotLine(p1: Point, p2: Point): Line {
		let a = (p2.y - p1.y) / (p2.x - p1.x);
		// if (Math.abs(a) > 1000000) a = Math.sign(a) * Infinity;
		const b = p1.y - a * p1.x;
		const p = p1;
		return { a, b, p };
	}

	/**
	 * degree 기울기와 p점을 지나는 직선을 구한다.
	 */
	export function getDegreeLine(degree: number, p: Point): Line {
		const radian = (degree / 180) * Math.PI;
		let a = -Math.tan(radian);
		if (Math.abs(a) > 1000000) a = Infinity;
		const b = p.y - a * p.x;
	    return { a, b, p }; 
	} 
}
global.Slice = Slice;

export function range(start: number, end: number, step: number = 1): number[] {
	const result = [];
	for (let i = start; i <= end; i += step) {
		result.push(i);
	}
	return result;
}
global.range = range;
