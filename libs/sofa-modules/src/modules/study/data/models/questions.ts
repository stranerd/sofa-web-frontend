import { Media } from '@modules/core'
import { QuestionData, StrippedQuestionData } from '../../domain/types'

export interface QuestionFromModel extends QuestionToModel {
	id: string
	userId: string
	quizId: string
	strippedData: StrippedQuestionData
	createdAt: number
	updatedAt: number
}

export interface QuestionToModel {
	question: string
	explanation: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
}
