import { QuizFromModel } from '../../data/models/quizzes'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity<QuizFromModel> {
	constructor(data: QuizFromModel) {
		super(data)
	}

	get shareLink() {
		return `${window.location.origin}/marketplace/${this.id}?type=quiz`
	}

	search(value: string) {
		if (!value) return true
		return [this.title, this.description].some((v) => v.toLowerCase().includes(value.toLowerCase()))
	}
}
