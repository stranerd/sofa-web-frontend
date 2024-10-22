import { Differ } from 'valleyed'
import { computed, ref } from 'vue'
import { BaseFactory, deepToRaw } from './base'

export function asArray<T extends BaseFactory<any, any, any>>(factory: { new (): T }) {
	type E = T extends BaseFactory<infer E, any, any> ? E : never
	type To = T extends BaseFactory<any, infer To, any> ? To : never

	return class FactoryArray {
		#factories: T[] = []
		#count = ref(0)
		#lastLoadedEntities: E[] = []
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
			this.#lastLoadedEntities = entities
			this.#markStateChange()
		}

		reset() {
			this.#factories.forEach((instance) => instance.reset())
			this.#lastLoadedEntities = []
		}

		delete(index: number) {
			this.#factories.splice(index, 1)
			this.#markStateChange()
		}

		#markStateChange() {
			this.#count.value = -1
			this.#count.value = this.#factories.length
		}

		async toModel(): Promise<To[]> {
			return await Promise.all(this.#factories.map((instance) => instance.toModel()))
		}

		get factories() {
			return this.reactiveFactories.value
		}

		set factories(factories: T[]) {
			this.reactiveFactories.value = factories
		}

		get valid() {
			return this.factories.every((instance) => instance.valid)
		}

		get hasChanges() {
			const hasInsideChanges = this.factories.some((instance) => instance.hasChanges)
			if (hasInsideChanges) return true
			// @ts-expect-error - .model() is protected
			const models = this.factories.map((instance) => instance.model())
			return !Differ.equal(deepToRaw(this.#lastLoadedEntities), models)
		}
	}
}
