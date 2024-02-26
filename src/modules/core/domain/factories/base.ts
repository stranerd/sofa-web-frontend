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

export abstract class BaseFactory<E, T, K extends Record<string, any>> extends ClassPropertiesWrapper<K> {
	#entity = ref<string | null>(null)
	errors: Record<keyof K, string>
	abstract model: () => T | Promise<T>
	abstract loadEntity: (entity: E) => void
	reserved: string[] = []
	protected abstract readonly rules: { [Key in keyof K]: VCore<K[Key] | undefined | null> }
	protected readonly defaults: K
	public readonly values: K
	protected readonly validValues: K
	protected readonly onSet: Partial<Record<keyof K, (value: any) => void>> = {} as any

	constructor(keys: K) {
		super(keys, {
			get: (key: keyof K) => this.values[key] as any,
			set: (key: keyof K, value: any) => {
				this.set(key, value)
				this.onSet[key]?.(value)
			},
		})
		this.defaults = reactive({ ...keys }) as K
		this.values = reactive({ ...keys }) as K
		this.validValues = reactive({ ...keys }) as K
		this.errors = Object.keys(keys).reduce(
			(acc, value: keyof K) => {
				acc[value] = ''
				return acc
			},
			reactive({}) as Record<keyof K, string>,
		)
		Object.keys(keys).forEach((key) => {
			Object.defineProperty(this, key, {
				get: this.values[key],
				set: (value: any) => this.set(key, value),
			})
		})
	}

	get valid() {
		return Object.keys(this.defaults)
			.map((key) => this.isValid(key))
			.every((valid) => valid)
	}

	get hasChanges() {
		return Object.keys(this.defaults).some((key) => !Differ.equal(this.defaults[key], this.values[key]))
	}

	get entityId() {
		return this.#entity.value
	}

	protected set entityId(v: string | null) {
		this.#entity.value = v
	}

	set(property: keyof K, value: any, ignoreRules = false) {
		const check = this.checkValidity(property, value)

		this.values[property] = check.value as any
		this.validValues[property] = check.valid || ignoreRules ? (check.value as any) : this.defaults[property]
		this.errors[property] = /* Differ.equal(this.defaults[property], value) ? '' : */ check.errors.at(0) ?? ''

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
		const reserved = (this.reserved ?? []).concat(['userId', 'user', 'userBio'])
		Object.keys(this.defaults)
			.filter((key) => !reserved.includes(key))
			.forEach((key) => this.resetProp(key))
	}

	resetProp(property: keyof K) {
		this.values[property] = this.defaults[property]
		this.validValues[property] = this.defaults[property]
		this.errors[property] = ''
	}

	async toModel() {
		if (!this.valid) {
			Object.keys(this.defaults).forEach((key) => this.set(key, this.values[key]))
			throw new Error('Validation errors')
		}
		return deepToRaw(await this.model())
	}
}
