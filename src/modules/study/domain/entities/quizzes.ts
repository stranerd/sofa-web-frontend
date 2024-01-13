import { QuizFromModel } from '../../data/models/quizzes'
import { CoursableData, QuizAccess, QuizMeta } from '../types'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity implements CoursableData {
	public readonly questions: string[]
	public readonly meta: Record<QuizMeta, number>
	public readonly access: QuizAccess
	public readonly isForTutors: boolean

	constructor(data: QuizFromModel) {
		super(data)
		this.questions = data.questions
		this.meta = data.meta
		this.access = data.access
		this.isForTutors = data.isForTutors
	}
}
