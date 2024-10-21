import { v } from 'valleyed'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'
import { Currencies } from '@modules/payment'
import { BaseFactory } from '@modules/core'

type Keys = Omit<ClassToModel, 'price'> & ClassToModel['price']

export class ClassFactory extends BaseFactory<ClassEntity, ClassToModel, Keys> {
	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		photo: v.file().image().nullable(),
		amount: v.number().gte(0),
		currency: v.in(Object.values(Currencies)),
	}

	constructor() {
		super({
			title: '',
			description: '',
			photo: null,
			amount: 0,
			currency: Currencies.NGN,
		})
	}

	model = () => {
		const { title, description, photo, amount, currency } = this.validValues
		return {
			title,
			description,
			photo,
			price: { amount, currency },
		}
	}

	load = (entity: ClassEntity) => {
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.amount = entity.price.amount
		this.currency = entity.price.currency
	}
}
