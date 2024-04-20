import { makeRule, v } from 'valleyed'
import { AuthDetails, Phone } from '../entities/auth'
import { BaseFactory } from '@modules/core'

export class PhoneUpdateFactory extends BaseFactory<AuthDetails, Phone, { phone: Phone | null }> {
	readonly rules = {
		phone: v.any().addRule(isValidPhone()),
	}

	reserved = []

	constructor() {
		super({ phone: null })
	}

	get phoneStr() {
		return this.phone?.code ?? '' + this.phone?.number ?? ''
	}

	model = () => {
		const { phone } = this.validValues
		return phone!
	}

	load = (entity: AuthDetails) => {
		this.phone = entity.phone
	}
}

export const isValidPhone = (error?: string) =>
	makeRule<Phone>((value) =>
		v
			.object({
				code: v
					.string()
					.custom((val) => val.startsWith('+') && v.force.number(val.slice(1)).parse(val).valid, error ?? 'invalid phone code'),
				number: v.force.number(error ?? 'invalid phone number').transform((val) => val.toString()),
			})
			.parse(value),
	)
