import { Differ, VCore } from 'valleyed'
import { isProxy, isReactive, isRef, reactive, ref, toRaw } from 'vue'

export function deepToRaw(input: any) {
	if (Array.isArray(input)) return input.map(deepToRaw)
	if (isRef(input) || isReactive(input) || isProxy(input)) return deepToRaw(toRaw(input))
	if (input && typeof input === 'object')
		return Object.keys(input).reduce((acc, key) => {
			acc[key as keyof typeof acc] = deepToRaw(input[key])
			return acc
		}, {} as any)
	return input
}

export abstract class BaseFactory<E, T, K extends Record<string, any>> {
	#entity = ref<string | null>(null)
	errors: Record<keyof K, string>
	abstract toModel: () => Promise<T>
	abstract loadEntity: (entity: E) => void
	reserved: string[]
	protected abstract readonly rules: { [Key in keyof K]: VCore<K[Key] | undefined | null> }
	protected readonly defaults: K
	public readonly values: K
	protected readonly validValues: K

	protected constructor(keys: K) {
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

	isValid = (property: keyof K) => this.checkValidity(property, this.values[property]).valid

	validateAll() {
		Object.keys(this.defaults).forEach((key) => this.set(key, this.values[key]))
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
}
