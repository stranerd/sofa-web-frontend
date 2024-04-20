import { ClassPropertiesWrapper, Differ, VCore } from 'valleyed'
import { isProxy, isReactive, isRef, reactive, ref, toRaw } from 'vue'

export function deepToRaw<T>(input: T): T {
	if (Array.isArray(input)) return input.map(deepToRaw) as T
	if (isRef(input) || isReactive(input) || isProxy(input)) return toRaw(input)
	if (input?.constructor?.name === 'Object')
		return Object.entries(input).reduce((acc, [key, val]) => {
			acc[key as keyof typeof acc] = deepToRaw(val as T[keyof T])
			return acc
		}, {} as T)
	return input
}

function copy<T>(input: T): T {
	return structuredClone(deepToRaw(input))
}

export abstract class BaseFactory<E, T, K extends Record<string, any>> extends ClassPropertiesWrapper<K> {
	#entity = ref<string | null>(null)
	errors: Record<keyof K, string>
	abstract model: () => T
	abstract load: (entity: E) => void
	reserved: string[] = []
	protected abstract readonly rules: { [Key in keyof K]: VCore<K[Key] | undefined | null> }
	protected readonly defaults: K
	public readonly values: K
	protected readonly validValues: K
	readonly #cloneValues: K
	protected readonly onSet: Partial<Record<keyof K, (value: any) => void>> = {} as any

	constructor(keys: K) {
		super(keys, {
			get: (key: keyof K) => this.values[key] as any,
			set: (key: keyof K, value: any) => {
				this.set(key, value)
				this.onSet[key]?.(value)
			},
		})
		this.defaults = reactive(copy(keys)) as K
		this.values = reactive(copy(keys)) as K
		this.validValues = reactive(copy(keys)) as K
		this.#cloneValues = reactive(copy(keys)) as K
		this.errors = Object.keys(keys).reduce(
			(acc, value: keyof K) => {
				acc[value] = ''
				return acc
			},
			reactive({}) as Record<keyof K, string>,
		)
	}

	get valid() {
		return this.#keys.map((key) => this.isValid(key)).every(Boolean)
	}

	get hasChanges() {
		return this.#keys.some((key) => !Differ.equal(this.#cloneValues[key], this.values[key]))
	}

	get entityId() {
		return this.#entity.value
	}

	protected set entityId(v: string | null) {
		this.#entity.value = v
	}

	set(key: keyof K, value: any, ignoreRules = false) {
		const check = this.checkValidity(key, value)

		this.values[key] = check.value as any
		this.validValues[key] = check.valid || ignoreRules ? (check.value as any) : this.defaults[key]
		this.errors[key] = /* Differ.equal(this.defaults[property], value) ? '' : */ check.errors.at(0) ?? ''

		return check.valid
	}

	isValid(property: keyof K) {
		return this.checkValidity(property, this.values[property]).valid
	}

	checkValidity(property: keyof K, value: any) {
		return this.rules[property].parse(deepToRaw(value), true)
	}

	reset() {
		this.entityId = null
		const reserved: (keyof K)[] = (this.reserved ?? []).concat(['userId', 'user', 'userBio'])
		this.#keys.filter((key) => !reserved.includes(key)).forEach((key) => this.resetProp(key))
	}

	get #keys() {
		return Object.keys(this.defaults) as (keyof K)[]
	}

	resetProp(property: keyof K) {
		this.values[property] = this.defaults[property]
		this.validValues[property] = this.defaults[property]
		this.errors[property] = ''
	}

	loadEntity(entity: E) {
		this.load(entity)
		this.#keys.forEach((key) => {
			this.#cloneValues[key] = copy(this.values[key])
		})
	}

	async toModel() {
		if (!this.valid) {
			this.#keys.forEach((key) => this.set(key, this.values[key]))
			throw new Error('Validation errors')
		}
		return deepToRaw(this.model())
	}
}
