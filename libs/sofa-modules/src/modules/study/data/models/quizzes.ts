import { CoursableData, QuizAccess, QuizMeta } from '../../domain/types'

export interface QuizFromModel extends QuizToModel {
	id: string
	questions: string[]
	access: QuizAccess
	ratings: CoursableData['ratings']
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Omit<CoursableData, 'ratings'> {
	isForTutors: boolean
}
