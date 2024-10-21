import { Differ, capitalize, stripHTML, compareTwoStrings } from 'valleyed'
import { QuestionFromModel } from '../../data/models/questions'
import { QuestionTypes } from '../types'
import { BaseEntity } from '@modules/core'

const compare = (a: string, b: string, quality = 0.95) =>
	compareTwoStrings(stripHTML(a).toLowerCase().replaceAll(' ', '').trim(), stripHTML(b).toLowerCase().replaceAll(' ', '').trim()) >=
	quality

export class QuestionEntity extends BaseEntity<QuestionFromModel> {
	constructor(data: QuestionFromModel) {
		super(data)
	}

	checkAnswer(answer: any): boolean {
		if (this.data.type === QuestionTypes.multipleChoice) {
			return Array.isArray(answer) && Differ.equal(answer.sort(), this.data.answers.sort())
		} else if (this.data.type === QuestionTypes.trueOrFalse) {
			return answer === this.data.answer
		} else if (this.data.type === QuestionTypes.writeAnswer) {
			return this.data.answers.some((a) => compare(a, answer))
		} else if (this.data.type === QuestionTypes.fillInBlanks) {
			const answers = this.data.answers
			return (
				Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => typeof a === 'string' && compare(a, answers[i]))
			)
		} else if (this.data.type === QuestionTypes.dragAnswers) {
			const answers = this.data.answers
			return (
				Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => typeof a === 'string' && compare(a, answers[i], 1))
			)
		} else if (this.data.type === QuestionTypes.sequence) {
			const answers = this.data.answers
			return (
				Array.isArray(answer) &&
				answer.length === answers.length &&
				answer.every((a, i) => typeof a === 'string' && compare(a, answers[i], 1))
			)
		} else if (this.data.type === QuestionTypes.match) {
			const questions = this.data.set
			return (
				Array.isArray(answer) &&
				answer.length === questions.length &&
				answer.every((a, i) => typeof a === 'string' && compare(a, questions[i].a, 1))
			)
		}
		return false
	}

	get type() {
		return this.strippedData.type
	}

	get instruction() {
		if (this.strippedData.type === QuestionTypes.multipleChoice)
			return `Choose ${this.strippedData.noOfAnswers} right answer${this.strippedData.noOfAnswers > 1 ? 's' : ''}`
		if (this.strippedData.type === QuestionTypes.writeAnswer) return 'Type your answer'
		if (this.strippedData.type === QuestionTypes.trueOrFalse) return 'Choose an answer'
		if (this.strippedData.type === QuestionTypes.fillInBlanks) return 'Fill in the gaps'
		if (this.strippedData.type === QuestionTypes.dragAnswers) return 'Drag answers'
		if (this.strippedData.type === QuestionTypes.sequence) return 'Drag to rearrange'
		if (this.strippedData.type === QuestionTypes.match) return 'Drag items on the right side to rearrange'
		return ''
	}

	get splitQuestions() {
		if (this.strippedData.type === 'fillInBlanks' || this.strippedData.type === 'dragAnswers')
			return this.question.split(this.strippedData.indicator)
		return []
	}

	get defaultAnswer() {
		if (this.strippedData.type === QuestionTypes.multipleChoice) return []
		if (this.strippedData.type === QuestionTypes.writeAnswer) return ''
		if (this.strippedData.type === QuestionTypes.trueOrFalse) return '' as unknown as boolean
		if (this.strippedData.type === QuestionTypes.fillInBlanks) return new Array(this.splitQuestions.length - 1).fill('')
		if (this.strippedData.type === QuestionTypes.dragAnswers) return []
		if (this.strippedData.type === QuestionTypes.sequence) return this.strippedData.answers
		if (this.strippedData.type === QuestionTypes.match) return this.matchAnswers
		return undefined
	}

	get dragAnswers() {
		if (this.strippedData.type === QuestionTypes.dragAnswers) return this.strippedData.answers
		return []
	}

	get matchQuestions() {
		if (this.strippedData.type === QuestionTypes.match) return this.strippedData.questions
		return []
	}

	get matchAnswers() {
		if (this.strippedData.type === QuestionTypes.match) return this.strippedData.answers
		return []
	}

	get content() {
		return this.question
	}

	get answer() {
		if (!this.data) return ''
		if (this.data.type === QuestionTypes.multipleChoice) {
			const options = this.data.options
			return this.data.answers.map((idx) => options[idx]).join('\n')
		}
		if (this.data.type === QuestionTypes.writeAnswer) return this.data.answers.join('\n-- or --\n')
		if (this.data.type === QuestionTypes.trueOrFalse) return capitalize(this.data.answer.toString())
		if (
			this.data.type === QuestionTypes.fillInBlanks ||
			this.data.type === QuestionTypes.dragAnswers ||
			this.data.type === QuestionTypes.sequence
		)
			return this.data.answers.join('\n')
		if (this.data.type === QuestionTypes.match) return this.data.set.map((s) => s.a).join('\n')
		return ''
	}

	get label() {
		return QuestionEntity.getLabel(this.strippedData.type)
	}

	get icon() {
		return QuestionEntity.getIcon(this.strippedData.type)
	}

	get image() {
		return QuestionEntity.getImage(this.strippedData.type)
	}

	get editPage() {
		return `/study/quizzes/${this.quizId}/edit?q=${this.id}`
	}

	static getLabel(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.label
	}

	static getIcon(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.icon
	}

	static getShape(index: number) {
		const shapes: IconName[] = ['q-circle', 'q-triangle', 'q-square', 'q-kite']
		return shapes[index % shapes.length]
	}

	static getImage(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.image
	}

	static getAllTypes() {
		return Object.entries(questionTypes).map(([key, t]) => ({
			label: t.label,
			value: key as QuestionTypes,
			icon: t.icon,
			image: t.image,
		}))
	}
}

const questionTypes: Record<QuestionTypes, { label: string; image: string; icon: IconName }> = {
	[QuestionTypes.multipleChoice]: {
		label: 'Multiple choice',
		image: 'multiple-choice',
		icon: 'question-multiple-choice',
	},
	[QuestionTypes.writeAnswer]: {
		label: 'Write answer',
		image: 'write-answer',
		icon: 'question-write-answer',
	},
	[QuestionTypes.trueOrFalse]: {
		label: 'True/False',
		image: 'true-false',
		icon: 'question-true-false',
	},
	[QuestionTypes.fillInBlanks]: {
		label: 'Fill in blank(s)',
		image: 'fill-in-blanks',
		icon: 'question-fill-in-blanks',
	},
	[QuestionTypes.dragAnswers]: {
		label: 'Drag answers',
		image: 'drag-answers',
		icon: 'question-drag-answers',
	},
	[QuestionTypes.sequence]: {
		label: 'Sequence',
		image: 'sequence',
		icon: 'question-sequence',
	},
	[QuestionTypes.match]: {
		label: 'Match',
		image: 'match',
		icon: 'question-match',
	},
}
