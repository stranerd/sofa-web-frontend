import { v } from 'valleyed'
import { AnnouncementEntity } from '../entities/announcements'
import { MemberTypes } from '../types'
import { AnnouncementToModel } from '@modules/organizations/data/models/announcements'
import { BaseFactory } from '@modules/core'

type Keys = Omit<AnnouncementToModel, 'filter'> & {
	lessonIds: (string | null)[]
	userTypes: (MemberTypes | null)[]
}

export class AnnouncementFactory extends BaseFactory<AnnouncementEntity, AnnouncementToModel, Keys> {
	readonly rules = {
		body: v.string().min(1),
		lessonIds: v.array(v.string().min(1).nullable()).min(1),
		userTypes: v.array(v.in(Object.values(MemberTypes)).nullable()).min(1),
	}

	constructor() {
		super({
			body: '',
			lessonIds: [],
			userTypes: [],
		})
	}

	model = async () => {
		const { body, lessonIds, userTypes } = this.validValues
		return {
			body,
			filter: {
				lessonIds: lessonIds.includes(null) ? null : (lessonIds as string[]),
				userTypes: userTypes.includes(null) ? null : (userTypes as MemberTypes[]),
			},
		}
	}

	load = (entity: AnnouncementEntity) => {
		this.body = entity.body
		this.lessonIds = entity.filter.lessonIds ?? [null]
		this.userTypes = entity.filter.userTypes ?? [null]
	}
}
