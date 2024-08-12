import { ClassPropertiesWrapper, getRandomValue } from 'valleyed'

export class BaseEntity<Keys extends Record<string, any>> extends ClassPropertiesWrapper<Keys> {
	public hash = getRandomValue()

	constructor(data: Keys) {
		super(data)
		this.hash = getRandomValue()
	}
}
