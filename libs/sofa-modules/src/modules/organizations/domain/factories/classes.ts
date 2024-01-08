import { BaseFactory, Media } from '@modules/core'
import { Currencies } from '@modules/payment'
import { v } from 'valleyed'
import { ClassToModel } from '../../data/models/classes'
import { ClassEntity } from '../entities/classes'

type Keys = Omit<ClassToModel, 'price'> & ClassToModel['price']

export class ClassFactory extends BaseFactory<ClassEntity, ClassToModel, Keys> {
	readonly rules = {
		organizationId: v.string().min(1),
		title: v.string().min(1),
		description: v.string(),
		photo: v.file().nullable(),
		amount: v.number().gte(0),
		currency: v.in(Object.values(Currencies)),
	}

	reserved = ['organizationId']

	constructor() {
		super({
			organizationId: '',
			title: '',
			description: '',
			photo: null,
			amount: 0,
			currency: Currencies.NGN,
		})
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get description() {
		return this.values.description
	}

	set description(value: string) {
		this.set('description', value)
	}

	get photo() {
		return this.values.photo
	}

	set photo(value: Media | null) {
		this.set('photo', value)
	}

	get amount() {
		return this.values.amount
	}

	set amount(value: number) {
		this.set('amount', value)
	}

	get currency() {
		return this.values.currency
	}

	set currency(value: Currencies) {
		this.set('currency', value)
	}

	get organizationId() {
		return this.values.organizationId
	}

	set organizationId(value: string) {
		this.set('organizationId', value)
	}

	toModel = async () => {
		if (this.valid) {
			const { organizationId, title, description, photo, amount, currency } = this.validValues
			return {
				organizationId,
				title,
				description,
				photo,
				price: { amount, currency },
			}
		} else {
			throw new Error('Validation errors')
		}
	}

	loadEntity = (entity: ClassEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.amount = entity.price.amount
		this.currency = entity.price.currency
	}
}
