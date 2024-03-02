import { v } from 'valleyed'
import { MetaMessageData } from '../types'
import { BaseFactory } from '@modules/core'

export class MetaMessageFactory extends BaseFactory<null, MetaMessageData, MetaMessageData> {
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
				code: '',
				number: '',
			},
			message: '',
		})
	}

	model = async () => {
		const { name, email, phone, message } = this.validValues
		return { name, email, phone, message }
	}

	loadEntity = (entity: null) => {
		throw new Error(`Cannot load an entity into this factory, ${entity}`)
	}
}
