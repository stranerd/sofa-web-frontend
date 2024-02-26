import { PlayTypes } from '../../domain/types'

export interface AnswerFromModel {
	id: string
	type: PlayTypes
	typeId: string
	userId: string
	data: Record<string, any>
	createdAt: number
	updatedAt: number
}

export interface AnswerToModel {
	questionId: string
	answer: any
}
