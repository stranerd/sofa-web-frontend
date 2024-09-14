import { v } from 'valleyed'
import { ref } from 'vue'
import { CourseToModel } from '../../data/models/courses'
import { CourseEntity } from '../entities/courses'
import { Currencies } from '@modules/payment'
import { BaseFactory } from '@modules/core'

type Keys = Omit<CourseToModel, 'price'> & CourseToModel['price']

export class CourseFactory extends BaseFactory<CourseEntity, CourseToModel, Keys> {
	public topicId = ''
	public tagIds: string[] = []
	#tagString = ref('')

	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		photo: v.file().image().nullable(),
		topic: v.string().min(1),
		tags: v.array(v.string().min(1)).set(),
		amount: v.number().gte(0),
		currency: v.in(Object.values(Currencies)),
	}

	constructor(isVerified: boolean) {
		super({
			title: '',
			description: '',
			photo: null,
			topic: '',
			tags: [],
			amount: isVerified ? 5000 : 0,
			currency: Currencies.NGN,
		})
		if (isVerified) this.rules.amount.gte(5000, 'minimum amount is ₦5000')
	}

	get tagString() {
		return this.#tagString.value
	}

	set tagString(value: string) {
		const sep = ','
		if (!value.includes(sep)) this.#tagString.value = value
		else {
			const tags = value
				.toLowerCase()
				.split(sep)
				.map((t) => t.trim())
				.filter((t) => !!t && !this.tags.includes(t))
			this.tags = this.tags.concat(...tags)
			this.#tagString.value = ''
		}
	}

	removeTag(index: number) {
		this.tags = this.tags.filter((_, i) => i !== index)
	}

	load = (entity: CourseEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.topicId = entity.topicId
		this.tagIds = entity.tagIds
		this.amount = entity.price.amount
		this.currency = entity.price.currency
	}

	model = () => {
		const { title, description, photo, topic, tags, amount, currency } = this.validValues
		return {
			title,
			description,
			photo,
			topic,
			tags,
			price: { amount, currency },
		}
	}
}
