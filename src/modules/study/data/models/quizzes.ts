import { CoursableData, Publishable, QuizAccess, QuizMeta, QuizModes } from '../../domain/types'

export interface QuizFromModel extends QuizToModel, Publishable {
	id: string
	__type: 'QuizEntity'
	questions: string[]
	access: QuizAccess
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Omit<CoursableData, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status'> {
	topic: string
	tags: string[]
	isForTutors: boolean
	modes: Record<QuizModes, boolean>
	timeLimit: number | null
}
