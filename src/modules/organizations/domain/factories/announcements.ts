import { BaseFactory } from '@modules/core'
import { v } from 'valleyed'
import { AnnouncementToModel } from '@modules/organizations/data/models/announcements'
import { AnnouncementEntity } from '../entities/announcements'
import { MemberTypes } from '../types'

export class AnnouncementFactory extends BaseFactory<AnnouncementEntity, AnnouncementToModel, AnnouncementToModel> {
	readonly rules = {
		body: v.string().min(1),
		filter: v.object({
			lessonId: v.string().min(1).nullable(),
			userType: v.in(Object.values(MemberTypes)).nullable(),
		}),
	}

	constructor() {
		super({
			body: '',
			filter: {
				lessonId: null,
				userType: null,
			},
		})
	}

	get body() {
		return this.values.body
	}

	set body(value: string) {
		this.set('body', value)
	}

	get filter() {
		return this.values.filter
	}

	set filter(value) {
		this.set('filter', value)
	}

	model = async () => {
		const { body, filter } = this.validValues
		return {
			body,
			filter,
		}
	}

	loadEntity = (entity: AnnouncementEntity) => {
		this.body = entity.body
		this.filter = entity.filter
	}
}
