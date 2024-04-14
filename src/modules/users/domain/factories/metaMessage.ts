import { v } from 'valleyed'
import { MetaMessageData } from '../types'
import { AuthDetails, isValidPhone } from '@modules/auth'
import { BaseFactory } from '@modules/core'

export class MetaMessageFactory extends BaseFactory<AuthDetails, MetaMessageData, MetaMessageData> {
	readonly rules = {
		name: v.string().min(1),
		email: v.string().min(1),
		phone: v.any().addRule(isValidPhone()).nullable(),
		message: v.string().min(1),
	}

	constructor() {
		super({
			name: '',
			email: '',
			phone: null,
			message: '',
		})
	}

	model = async () => {
		const { name, email, phone, message } = this.validValues
		return { name, email, phone, message }
	}

	load = (entity: AuthDetails) => {
		this.name = entity.allNames.full
		this.email = entity.email
		if (entity.phone) this.phone = entity.phone
	}
}
