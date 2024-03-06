import { v } from 'valleyed'
import { MetaMessageData } from '../types'
import { BaseFactory } from '@modules/core'
import { AuthDetails } from '@modules/auth'

export class MetaMessageFactory extends BaseFactory<AuthDetails, MetaMessageData, MetaMessageData> {
	readonly rules = {
		name: v.string().min(1),
		email: v.string().min(1),
		phone: v.object({
			code: v.string().min(1),
			number: v.string().min(1),
		}),
		message: v.string().min(1),
	}

	constructor() {
		super({
			name: '',
			email: '',
			phone: {
				code: '+234',
				number: '',
			},
			message: '',
		})
	}

	model = async () => {
		const { name, email, phone, message } = this.validValues
		return { name, email, phone, message }
	}

	loadEntity = (entity: AuthDetails) => {
		this.name = entity.allNames.full
		this.email = entity.email
		if (entity.phone) this.phone = entity.phone
	}
}
