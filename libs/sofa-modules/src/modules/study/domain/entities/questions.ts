import { BaseEntity, Media } from '@modules/core'
import stringSimilarity from 'string-similarity'
import { Differ, capitalize, stripHTML } from 'valleyed'
import { QuestionData, QuestionTypes, StrippedQuestionData } from '../types'
import { questionTypes } from './questions-extras'

const compare = (a: string, b: string, quality = 0.95) => {
	return (
		stringSimilarity.compareTwoStrings(
			stripHTML(a).toLowerCase().replaceAll(' ', '').trim(),
			stripHTML(b).toLowerCase().replaceAll(' ', '').trim(),
		) >= quality
	)
}

export class QuestionEntity extends BaseEntity {
	public readonly id: string
	public readonly userId: string
	public readonly quizId: string
	public readonly question: string
	public readonly explanation: string
	public readonly questionMedia: Media | null
	public readonly timeLimit: number
	public readonly data: QuestionData
	public readonly strippedData: StrippedQuestionData
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		userId,
		quizId,
		question,
		explanation,
		questionMedia,
		timeLimit,
		data,
		strippedData,
		createdAt,
		updatedAt,
	}: QuestionConstructorArgs) {
		super()
		this.id = id
		this.userId = userId
		this.quizId = quizId
		this.question = question
		this.explanation = explanation
		this.questionMedia = questionMedia
		this.timeLimit = timeLimit
		this.data = data
		this.strippedData = strippedData
		this.createdAt = createdAt
		this.updatedAt = updatedAt
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
			return Array.isArray(answer) && answer.length === answers.length && answer.every((a, i) => compare(a, answers[i]))
		} else if (this.data.type === QuestionTypes.dragAnswers) {
			const answers = this.data.answers
			return Array.isArray(answer) && answer.length === answers.length && answer.every((a, i) => compare(a, answers[i], 1))
		} else if (this.data.type === QuestionTypes.sequence) {
			const answers = this.data.answers
			return Array.isArray(answer) && answer.length === answers.length && answer.every((a, i) => compare(a, answers[i], 1))
		} else if (this.data.type === QuestionTypes.match) {
			const questions = this.data.set
			return Array.isArray(answer) && answer.length === questions.length && answer.every((a, i) => compare(a, questions[i].a, 1))
		}
		return false
	}

	get type() {
		return this.strippedData.type
	}

	get instruction() {
		if (this.strippedData.type === QuestionTypes.multipleChoice) return 'Choose the right answer(s)'
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

	get answer() {
		if (!this.data) return ''
		if (this.data.type === QuestionTypes.multipleChoice) {
			const options = this.data.options
			return this.data.answers.map((idx) => options[idx]).join('<br>')
		}
		if (this.data.type === QuestionTypes.writeAnswer) return this.data.answers.join('<br>-- or --<br>')
		if (this.data.type === QuestionTypes.trueOrFalse) return capitalize(this.data.answer.toString())
		if (
			this.data.type === QuestionTypes.fillInBlanks ||
			this.data.type === QuestionTypes.dragAnswers ||
			this.data.type === QuestionTypes.sequence
		)
			return this.data.answers.join('<br>')
		if (this.data.type === QuestionTypes.match) return this.data.set.map((s) => s.a).join('<br>')
		return ''
	}

	static getLabel(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.extras.label
	}

	static getIcon(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.extras.icon
	}

	static getImage(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.extras.image
	}

	static getTemplate(type: QuestionTypes) {
		const data = questionTypes[type] ?? questionTypes[QuestionTypes.multipleChoice]
		return data.template
	}

	static getAllTypes() {
		return Object.entries(questionTypes).map(([key, t]) => ({
			label: t.extras.label,
			value: key as QuestionTypes,
			icon: t.extras.icon,
			image: t.extras.image,
		}))
	}
}

type QuestionConstructorArgs = {
	id: string
	userId: string
	quizId: string
	question: string
	explanation: string
	questionMedia: Media | null
	timeLimit: number
	data: QuestionData
	strippedData: StrippedQuestionData
	createdAt: number
	updatedAt: number
}
