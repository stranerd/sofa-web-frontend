import { v } from 'valleyed'
import { TutorRequestToModel } from '../../data/models/tutorRequests'
import { TutorRequestEntity } from '../entities/tutorRequests'
import { BaseFactory } from '@modules/core'

export class TutorRequestFactory extends BaseFactory<TutorRequestEntity, TutorRequestToModel, TutorRequestToModel> {
	readonly rules = {
		topicId: v.string().min(1),
		verification: v.file().image(),
		qualification: v.array(
			v.or([v.file().image(), v.file().custom((file) => file?.type === 'application/pdf')]),
			'should be image or pdf',
		),
	}
	reserved = []

	constructor() {
		super({ topicId: '', verification: undefined as any, qualification: [] })
	}

	load = (entity: TutorRequestEntity) => {
		this.entityId = entity.id
		this.topicId = entity.topicId
		this.verification = entity.verification
		this.qualification = entity.qualification
	}

	model = async () => {
		const { topicId, verification, qualification } = this.validValues
		return { topicId, verification, qualification }
	}
}
