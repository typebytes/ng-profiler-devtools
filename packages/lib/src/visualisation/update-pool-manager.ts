import { scheduleOutsideOfZone } from '../zone-handler';

export interface PoolData<T> {
	hit: number;
	tagName: string;
	expiration: number;
	data: T;
}

// Duration of the rect being added
const DURATION = 250;
declare const Zone;

export abstract class UpdatePoolManager<T> {
	pool = new Map<string, PoolData<T>>();
	drawing = false;
	clearTimer;

	addAll(items: Map<string, any> | any) {
		for (const [uuid, dataToAdd] of items.entries
			? items.entries()
			: Object.entries(items)) {
			console.log('pool length', this.pool.size);
			let data;
			if (this.pool.has(uuid)) {
				data = this.pool.get(uuid);
			} else {
				data = {
					hit: 0,
					tagName: dataToAdd.tagName,
					data: dataToAdd
				};
			}

			console.log(data);
			data = {
				...data,
				expiration: Date.now() + DURATION,
				hit: data.hit + 1
			};
			console.log(data);

			this.pool.set(uuid, data);
		}

		this.scheduleDraw();
	}

	add(uuid: string, tagName: string, dataToAdd: T) {
		let data;
		if (this.pool.has(uuid)) {
			data = this.pool.get(uuid);
		} else {
			data = {
				hit: 0,
				tagName,
				data: dataToAdd
			};
		}

		data = {
			...data,
			expiration: Date.now() + DURATION,
			hit: data.hit + 1
		};

		this.pool = this.pool.set(uuid, data);

		this.scheduleDraw();
	}

	firstExpirationDate() {
		const now = Date.now();
		let minExpiration = Number.MAX_VALUE;

		// Calculate the 'nearest' expiration date
		// Remove all the ones that already expired
		const temp = new Map<string, PoolData<T>>();
		for (const [uuid, data] of this.pool.entries()) {
			if (data.expiration > now) {
				minExpiration = Math.min(data.expiration, minExpiration);
				temp.set(uuid, data);
			}
		}
		this.pool = temp;
		return minExpiration;
	}

	draw() {
		const now = Date.now();
		const minExpiration = this.firstExpirationDate();

		this.drawImpl(this.pool);

		if (this.pool.size > 0) {
			if (this.clearTimer != null) {
				clearTimeout(this.clearTimer);
			}
			// FIXME: clean this up
			this.clearTimer = setTimeout(this.redraw.bind(this), minExpiration - now);
		}

		this.drawing = false;
	}

	private redraw() {
		this.clearTimer = null;
		if (!this.drawing && this.pool.size > 0) {
			this.drawing = true;
			this.draw();
		}
	}

	private scheduleDraw() {
		// If we're already drawing, no use in setting a new event
		if (this.drawing) {
			return;
		}

		// FIXME fix this tshit
		this.drawing = true;
		// Draw on the next animationFrame, use Zone to make sure it doesn't trigger a CD cycle in Angular
		// if (Zone) {
		//   Zone.root.run(() => {
		//     requestAnimationFrame(this.draw.bind(this));
		//   });
		// } else {
		requestAnimationFrame(this.draw.bind(this));
		// }
	}

	abstract drawImpl(pool: Map<string, PoolData<T>>);
}
