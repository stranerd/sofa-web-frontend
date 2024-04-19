import { QuizFromModel } from '../../data/models/quizzes'
import { CoursableEntity } from './coursables'

export class QuizEntity extends CoursableEntity<QuizFromModel> {
	constructor(data: QuizFromModel) {
		super(data)
	}

	get pageLink() {
		return `/marketplace/quizzes/${this.id}`
	}

	get shareLink() {
		return `${window.location.origin}${this.pageLink}`
	}

	get accessShareLink() {
		return `${window.location.origin}/study/quizzes/${this.id}/edit`
	}

	get noAccessPage() {
		if (this.courseId) return `/marketplace/courses/${this.courseId}`
		return `/marketplace/quizzes/${this.id}`
	}

	search(value: string) {
		if (!value) return true
		return [this.title, this.description].some((v) => v.toLowerCase().includes(value.toLowerCase()))
	}
}
