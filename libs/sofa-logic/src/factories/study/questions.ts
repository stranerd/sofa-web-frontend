import { FileData, Question } from '../../logic'
import { v, Differ } from 'valleyed'
import { BaseFactory } from '../base'

type Content = FileData | null
type QuestionToModel = Pick<Question, 'question' | 'questionMedia' | 'data' | 'explanation' | 'timeLimit'>

export enum QuestionTypes {
	multipleChoice = 'multipleChoice',
	trueOrFalse = 'trueOrFalse',
	writeAnswer = 'writeAnswer',
	fillInBlanks = 'fillInBlanks',
	dragAnswers = 'dragAnswers',
	sequence = 'sequence',
	match = 'match',
}

export class QuestionFactory extends BaseFactory<Question, QuestionToModel, QuestionToModel> {
	readonly rules = {
		question: v.string().min(1, true),
		questionMedia: v.file().image().nullable(),
		explanation: v.string(),
		timeLimit: v.number().gt(0).lte(300).round(),
		data: v.discriminate((d) => d.type, {
			[QuestionTypes.multipleChoice]: v.object({
				type: v.is(QuestionTypes.multipleChoice as const),
				options: v.array(v.string().min(1, true)).min(2).max(6),
				answers: v.array(v.number().gte(0).round()).min(1).set()
			}).custom((value) => {
				const length = value?.options?.length ?? 1
				return v.array(v.number().lt(length)).max(length).parse(value.answers).valid
			}),
			[QuestionTypes.trueOrFalse]: v.object({
				type: v.is(QuestionTypes.trueOrFalse as const),
				answer: v.boolean()
			}),
			[QuestionTypes.writeAnswer]: v.object({
				type: v.is(QuestionTypes.writeAnswer as const),
				answers: v.array(v.string().min(1, true)).min(1).max(6)
			}),
			[QuestionTypes.fillInBlanks]: v.object({
				type: v.is(QuestionTypes.fillInBlanks as const),
				indicator: v.string().min(1),
				answers: v.array(v.string().min(1, true)).min(1)
			}).custom((value) => {
				const length = this.question?.split(value.indicator).length ?? 1
				return v.array(v.any()).has(length - 1).parse(value.answers).valid
			}),
			[QuestionTypes.dragAnswers]: v.object({
				type: v.is(QuestionTypes.dragAnswers as const),
				indicator: v.string().min(1),
				answers: v.array(v.string().min(1, true)).min(1)
			}).custom((value) => {
				const length = this.question?.split(value.indicator).length ?? 1
				return v.array(v.any()).has(length - 1).parse(value.answers).valid
			}),
			[QuestionTypes.sequence]: v.object({
				type: v.is(QuestionTypes.sequence as const),
				answers: v.array(v.string().min(1, true)).min(2).max(6)
			}),
			[QuestionTypes.match]: v.object({
				type: v.is(QuestionTypes.match as const),
				set: v.array(v.object({
					q: v.string().min(1, true),
					a: v.string().min(1, true)
				})).min(2).max(10)
			})
		})
	}

	reserved = []

	constructor () {
		super({
			question: '', explanation: '', questionMedia: null, timeLimit: 30,
			data: {
				type: QuestionTypes.multipleChoice,
				options: [],
				answers: []
			}
		})
	}

	get question () {
		return this.values.question
	}

	set question (value: string) {
		this.set('question', value)
	}

	get questionMedia () {
		return this.values.questionMedia
	}

	set questionMedia (value: Content) {
		this.set('questionMedia', value)
	}

	get timeLimit () {
		return this.values.timeLimit
	}

	set timeLimit (value: number) {
		this.set('timeLimit', value)
	}

	get explanation () {
		return this.values.explanation
	}

	set explanation (value: string) {
		this.set('explanation', value)
	}

	get data () {
		return this.values.data
	}

	set data (value: Question['data']) {
		this.set('data', value)
	}

	get type () {
		return this.values.data.type
	}

	set type (value: Question['data']['type']) {
		this.data = {
			type: value
		}
	}

	hasNoChanges (entity: Question) {
		if (!entity) return true
		return Differ.equal(this.question, entity.question)
			&& Differ.equal(this.questionMedia, entity.questionMedia)
			&& Differ.equal(this.explanation, entity.explanation)
			&& Differ.equal(this.timeLimit, entity.timeLimit)
			&& Differ.equal(this.data, entity.data)
	}

	loadEntity = (entity: Question) => {
		this.question = entity.question
		this.questionMedia = entity.questionMedia
		this.data = entity.data
		this.explanation = entity.explanation
		this.timeLimit = entity.timeLimit
	}

	toModel = async () => {
		if (this.valid) {
			const { question, questionMedia, data, explanation, timeLimit } = this.validValues
			return { question, questionMedia, data, explanation, timeLimit }
		} else {
			throw new Error('Validation errors')
		}
	}
}
