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
