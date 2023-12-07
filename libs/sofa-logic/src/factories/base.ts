import { Differ, VCore } from 'valleyed'
import { reactive } from 'vue'

import { isRef, unref } from 'vue'

const isObject = (val: any) => val !== null && typeof val === 'object'
const smartUnref = (val: any) => {
	if (val !== null && !isRef(val) && typeof val === 'object') return deepUnref(val)
	return unref(val)
}

const deepUnref = (val: any): any => {
	const checkedVal = isRef(val) ? unref(val) : val

	if (!isObject(checkedVal)) return checkedVal

	if (Array.isArray(checkedVal)) return checkedVal.map(smartUnref)

	const unreffed: Record<string, any> = {}

	Object.keys(checkedVal).forEach((key) => {
		unreffed[key] = smartUnref(checkedVal[key])
	})

	return unreffed
}

export abstract class BaseFactory<E, T, K extends Record<string, any>> {
	errors: Record<keyof K, string>
	abstract toModel: () => Promise<T>
	abstract loadEntity: (entity: E) => void
	abstract reserved: string[]
	protected abstract readonly rules: { [Key in keyof K]: VCore<K[Key] | undefined | null> }
	protected readonly defaults: K
	protected values: K
	protected validValues: K

	protected constructor (keys: K) {
		this.defaults = reactive({ ...keys })
		this.values = reactive({ ...keys })
		this.validValues = reactive({ ...keys })
		this.errors = Object.keys(keys)
			.reduce((acc, value: keyof K) => {
				acc[value] = ''
				return acc
			}, reactive({}) as Record<keyof K, string>)
	}

	get valid () {
		return Object.keys(this.defaults)
			.map((key) => this.isValid(key))
			.every((valid) => valid)
	}

	get hasChanges () {
		return Object.keys(this.defaults)
			.some((key) => !Differ.equal(this.defaults[key], this.values[key]))
	}

	set (property: keyof K, value: any, ignoreRules = false) {
		const check = this.checkValidity(property, value)

		this.values[property] = check.value as any
		this.validValues[property] = check.valid || ignoreRules ? check.value as any : this.defaults[property]
		this.errors[property] = /* Differ.equal(this.defaults[property], value) ? '' : */ check.errors.at(0) ?? ''

		return check.valid
	}

	isValid = (property: keyof K) => this.checkValidity(property, this.validValues[property]).valid

	validateAll () {
		Object.keys(this.defaults)
			.forEach((key) => this.set(key, this.values[key]))
	}

	checkValidity (property: keyof K, value: any) {
		return this.rules[property].parse(deepUnref(value), true)
	}

	reset () {
		const reserved = (this.reserved ?? []).concat(['userId', 'user', 'userBio'])
		Object.keys(this.defaults)
			.filter((key) => !reserved.includes(key))
			.forEach((key) => this.resetProp(key))
	}

	resetProp (property: keyof K) {
		this.values[property] = this.defaults[property]
		this.validValues[property] = this.defaults[property]
		this.errors[property] = ''
	}
}
