import { TutorRequestFromModel } from '../../data/models/tutorRequests'
import { BaseEntity } from '@modules/core'

export class TutorRequestEntity extends BaseEntity<TutorRequestFromModel> {
	constructor(data: TutorRequestFromModel) {
		super(data)
	}
}
