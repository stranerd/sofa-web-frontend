import { Media } from '@modules/core'
import { QuestionData, StrippedQuestionData } from '../../domain/types'

export interface QuestionFromModel extends QuestionToModel {
	id: string
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	userId: string
	quizId: string
	question: string
	explanation: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
	strippedData: StrippedQuestionData
}
