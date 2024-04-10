import { PlayAnswer, PlayTypes } from '../../domain/types'

export interface AnswerFromModel {
	id: string
	type: PlayTypes
	typeId: string
	typeUserId: string
	userId: string
	data: Record<string, { value: PlayAnswer; at: number }>
	timedOutAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	questionId: string | null
	answer: PlayAnswer
}
