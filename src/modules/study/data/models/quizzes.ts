import { CoursableData, QuizAccess, QuizMeta, QuizModes } from '../../domain/types'

export interface QuizFromModel extends QuizToModel, CoursableData {
	id: string
	__type: 'QuizEntity'
	questions: string[]
	access: QuizAccess
	meta: Record<QuizMeta, number>
	createdAt: number
	updatedAt: number
}

export interface QuizToModel extends Omit<CoursableData, 'ratings' | 'topicId' | 'tagIds' | 'user' | 'status' | 'courseIds'> {
	topic: string
	tags: string[]
	isForTutors: boolean
	modes: Record<QuizModes, boolean>
	timeLimit: number | null
}
