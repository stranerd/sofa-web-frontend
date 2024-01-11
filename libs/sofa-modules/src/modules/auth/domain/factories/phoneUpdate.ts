import { BaseFactory } from '@modules/core'
import { makeRule, v } from 'valleyed'
import { AuthDetails, Phone } from '../entities/auth'

export class PhoneUpdateFactory extends BaseFactory<AuthDetails, Phone, { phone: Phone | null }> {
	readonly rules = {
		phone: v.any().addRule(isValidPhone()),
	}

	reserved = []

	constructor() {
		super({ phone: null })
	}

	get phone() {
		return this.values.phone
	}

	set phone(phone: Phone | null) {
		this.set('phone', phone)
	}

	model = async () => {
		const { phone } = this.validValues
		return phone!
	}

	loadEntity = (entity: AuthDetails) => {
		this.phone = entity.phone
	}
}

const isValidPhone = (error?: string) =>
	makeRule<Phone>((value) => {
		return v
			.object({
				code: v.string().custom((val) => {
					return val.startsWith('+') && v.force.number(val.slice(1)).parse(val).valid
				}, error ?? 'invalid phone code'),
				number: v.force.number(error ?? 'invalid phone number').transform((val) => val.toString()),
			})
			.parse(value)
	})
