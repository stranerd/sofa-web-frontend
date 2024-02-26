import { QuizFromModel } from '../../data/models/quizzes'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity<QuizFromModel> {
	constructor(data: QuizFromModel) {
		super(data)
	}

	get shareLink() {
		return `${window.location.origin}/marketplace/${this.id}?type=quiz`
	}
}
