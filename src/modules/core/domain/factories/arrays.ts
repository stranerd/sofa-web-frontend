import { reactive } from 'vue'
import { BaseFactory } from './base'

export function asArray<T extends BaseFactory<any, any, any>>(factory: { new (): T }) {
	type E = T extends BaseFactory<infer E, any, any> ? E : never

	return class FactoryArray {
		#factories: T[] = reactive([])

		add() {
			const instance = new factory()
			this.#factories.push(instance)
			return instance
		}

		loadEntity(entities: E[]) {
			const factories = entities.map((entity) => {
				const instance = new factory()
				instance.loadEntity(entity)
				return instance
			})
			this.#factories.splice(0, this.#factories.length, ...factories)
		}

		reset() {
			this.#factories.forEach((instance) => instance.reset())
		}

		delete(index: number) {
			this.#factories.splice(index, 1)
		}

		async toModel() {
			return await Promise.all(this.#factories.map((instance) => instance.toModel()))
		}

		get factories() {
			return this.#factories
		}

		get valid() {
			return this.#factories.every((instance) => instance.valid)
		}

		get hasChanges() {
			return this.#factories.some((instance) => instance.hasChanges)
		}
	}
}
