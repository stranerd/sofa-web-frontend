import { v } from 'valleyed'
import { AnnouncementEntity } from '../entities/announcements'
import { MemberTypes } from '../types'
import { AnnouncementToModel } from '@modules/organizations/data/models/announcements'
import { BaseFactory } from '@modules/core'

type Keys = Omit<AnnouncementToModel, 'filter'> & AnnouncementToModel['filter']

export class AnnouncementFactory extends BaseFactory<AnnouncementEntity, AnnouncementToModel, Keys> {
	readonly rules = {
		body: v.string().min(1),
		lessonId: v.string().min(1).nullable(),
		userType: v.in(Object.values(MemberTypes)).nullable(),
	}

	constructor() {
		super({
			body: '',
			lessonId: null,
			userType: null,
		})
	}

	get body() {
		return this.values.body
	}

	set body(value: string) {
		this.set('body', value)
	}

	get lessonId() {
		return this.values.lessonId
	}

	set lessonId(value: string | null) {
		this.set('lessonId', value)
	}

	get userType() {
		return this.values.userType
	}

	set userType(value: MemberTypes | null) {
		this.set('userType', value)
	}

	model = async () => {
		const { body, lessonId, userType } = this.validValues
		return {
			body,
			filter: { lessonId, userType },
		}
	}

	loadEntity = (entity: AnnouncementEntity) => {
		this.body = entity.body
		this.lessonId = entity.filter.lessonId
		this.userType = entity.filter.userType
	}
}
