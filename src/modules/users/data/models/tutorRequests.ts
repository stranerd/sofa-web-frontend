import { Media } from '@modules/core'

export interface TutorRequestFromModel extends TutorRequestToModel {
	id: string
	userId: string
	pending: boolean
	accepted: boolean
	testId: string
	testFinished: boolean
	createdAt: number
	updatedAt: number
}

export interface TutorRequestToModel {
	topicId: string
	verification: Media
	qualification: Media[]
}
