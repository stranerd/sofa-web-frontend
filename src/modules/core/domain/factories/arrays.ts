import { computed, ref } from 'vue'
import { BaseFactory } from './base'

export function asArray<T extends BaseFactory<any, any, any>>(factory: { new (): T }) {
	type E = T extends BaseFactory<infer E, any, any> ? E : never

	return class FactoryArray {
		#factories: T[] = []
		#count = ref(0)
		private readonly reactiveFactories = computed({
			get: () => Array.from({ length: this.#count.value }, (_, index) => this.#factories[index]),
			set: (factories: T[]) => {
				this.#factories.splice(0, this.#factories.length, ...factories)
				this.#markStateChange()
			},
		})

		add() {
			const instance = new factory()
			this.#factories.push(instance)
			this.#markStateChange()
			return instance
		}

		loadEntity(entities: E[]) {
			const factories = entities.map((entity) => {
				const instance = new factory()
				instance.loadEntity(entity)
				return instance
			})
			this.#factories.splice(0, this.#factories.length, ...factories)
			this.#markStateChange()
		}

		reset() {
			this.#factories.forEach((instance) => instance.reset())
		}

		delete(index: number) {
			this.#factories.splice(index, 1)
			this.#markStateChange()
		}

		#markStateChange() {
			this.#count.value = 0
			this.#count.value = this.#factories.length
		}

		async toModel() {
			return await Promise.all(this.#factories.map((instance) => instance.toModel()))
		}

		get factories() {
			return this.reactiveFactories.value
		}

		set factories(factories: T[]) {
			console.log('factories', factories)
			this.reactiveFactories.value = factories
		}

		get valid() {
			return this.factories.every((instance) => instance.valid)
		}

		get hasChanges() {
			return this.factories.some((instance) => instance.hasChanges)
		}
	}
}
