import { ClassPropertiesWrapper, getRandomValue } from 'valleyed'

export class BaseEntity<Keys extends Record<string, any>> extends ClassPropertiesWrapper<Keys> {
	public hash = getRandomValue()
	public __type = this.constructor.name

	constructor(data: Keys) {
		super(data)
		this.hash = getRandomValue()
	}
}
