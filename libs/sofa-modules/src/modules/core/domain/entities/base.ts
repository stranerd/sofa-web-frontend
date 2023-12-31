import { getRandomValue } from 'valleyed'

export class BaseEntity {
	public hash: string
	public __type = this.constructor.name

	constructor() {
		this.hash = getRandomValue()
	}

	toJSON() {
		const json = Object.assign({}, this) as Record<string, any>
		const proto = Object.getPrototypeOf(this)
		Object.getOwnPropertyNames(proto)
			.filter((k) => k !== 'constructor')
			.forEach((key) => {
				const value = this[key as keyof BaseEntity]
				json[key] = (value as any)?.toJSON?.() ?? value
			})
		return json
	}
}
