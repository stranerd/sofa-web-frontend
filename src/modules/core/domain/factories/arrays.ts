import { reactive } from 'vue'
import { BaseFactory } from './base'

interface FactoryConstructor<E, T, K extends Record<string, any>> {
	new (): BaseFactory<E, T, K>
}

export function asArray<E, T, K extends Record<string, any>>(factory: FactoryConstructor<E, T, K>) {
	return class FactoryArray {
		#factories: BaseFactory<E, T, K>[] = reactive([])

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
