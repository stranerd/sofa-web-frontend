import { QuizFromModel } from '../../data/models/quizzes'
import { QuizAccess, QuizMeta, QuizModes } from '../types'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity {
	public readonly questions: string[]
	public readonly meta: Record<QuizMeta, number>
	public readonly access: QuizAccess
	public readonly isForTutors: boolean
	public readonly modes: Record<QuizModes, boolean>

	constructor(data: QuizFromModel) {
		super(data)
		this.questions = data.questions
		this.meta = data.meta
		this.access = data.access
		this.isForTutors = data.isForTutors
		this.modes = data.modes
	}

	get shareLink() {
		return `${window.location.origin}/marketplace/${this.id}?type=quiz`
	}

	search(value: string) {
		if (!value) return true
		return [this.title, this.description].some((v) => v.toLowerCase().includes(value.toLowerCase()))
	}
}
