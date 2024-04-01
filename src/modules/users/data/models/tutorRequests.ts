import { VerificationAccepted } from '../../domain/types'
import { Media } from '@modules/core'

export interface TutorRequestFromModel extends TutorRequestToModel {
	id: string
	userId: string
	pending: boolean
	accepted: VerificationAccepted
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
