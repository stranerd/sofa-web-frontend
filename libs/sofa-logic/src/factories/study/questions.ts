import { Differ, v } from 'valleyed'
import { FileData, Question } from '../../logic'
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

type QTypes = Question['data']['type'] | QuestionTypes

type Keys = Omit<QuestionToModel, 'data'> & {
	type: QTypes, multipleOptions: string[], multipleAnswers: number[]
	trueOrFalseAnswer: boolean, writeAnswerAnswers: string[]
	sequenceAnswers: string[], matchSet: { q: string, a: string }[]
	indicator: string, fillInBlanksAnswers: string[], dragAnswersAnswers: string[]
}

export class QuestionFactory extends BaseFactory<Question, QuestionToModel, Keys> {
	private data: Question['data']
	readonly rules = {
		question: v.string().min(1, true),
		questionMedia: v.file().image().nullable(),
		explanation: v.string(),
		timeLimit: v.number().gt(0).lte(300).round(),
		type: v.in(Object.values(QuestionTypes)),
		multipleOptions: v.array(v.string().min(1, true)).min(2).max(6).requiredIf(() => this.isMultipleChoice),
		multipleAnswers: v.array(v.number().gte(0).round()).min(1).set().requiredIf(() => this.isMultipleChoice)
			.custom((value) => {
				const length = this.multipleOptions.length ?? 1
				return v.array(v.number().lt(length)).max(length).parse(value).valid
			}),
		trueOrFalseAnswer: v.boolean().requiredIf(() => this.isTrueOrFalse),
		writeAnswerAnswers: v.array(v.string().min(1, true)).min(1).max(6).requiredIf(() => this.isWriteAnswer),
		sequenceAnswers: v.array(v.string().min(1, true)).min(2).max(6).requiredIf(() => this.isSequence),
		indicator: v.string().min(1).requiredIf(() => this.isFillInBlanks || this.isDragAnswers),
		fillInBlanksAnswers: v.array(v.string().min(1, true)).min(1).requiredIf(() => this.isFillInBlanks)
			.custom((value) => {
				const length = this.question?.split(this.values.indicator).length ?? 1
				return v.array(v.any()).has(length - 1).parse(value).valid
			}),
		dragAnswersAnswers: v.array(v.string().min(1, true)).min(1).requiredIf(() => this.isDragAnswers)
			.custom((value) => {
				const length = this.question?.split(this.values.indicator).length ?? 1
				return v.array(v.any()).has(length - 1).parse(value).valid
			}),
		matchSet: v.array(v.object({
			q: v.string().min(1, true),
			a: v.string().min(1, true)
		})).min(2).max(10).requiredIf(() => this.isMatch)
	}

	reserved = []

	constructor () {
		super({
			question: '', explanation: '', questionMedia: null, timeLimit: 30, type: QuestionTypes.multipleChoice,
			multipleAnswers: [], multipleOptions: [], trueOrFalseAnswer: true, writeAnswerAnswers: [],
			sequenceAnswers: [], indicator: '----------', fillInBlanksAnswers: [], dragAnswersAnswers: [],
			matchSet: []
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

	get type () {
		return this.values.type
	}

	set type (value: QTypes) {
		this.set('type', value)
	}

	get multipleOptions () {
		return this.values.multipleOptions
	}

	set multipleOptions (value: string[]) {
		this.set('multipleOptions', value)
	}

	get multipleAnswers () {
		return this.values.multipleAnswers
	}

	set multipleAnswers (value: number[]) {
		this.set('multipleAnswers', value)
	}

	get trueOrFalseAnswer () {
		return this.values.trueOrFalseAnswer
	}

	set trueOrFalseAnswer (value: boolean) {
		this.set('trueOrFalseAnswer', value)
	}

	get writeAnswerAnswers () {
		return this.values.writeAnswerAnswers
	}

	set writeAnswerAnswers (value: string[]) {
		this.set('writeAnswerAnswers', value)
	}

	get sequenceAnswers () {
		return this.values.sequenceAnswers
	}

	set sequenceAnswers (value: string[]) {
		this.set('sequenceAnswers', value)
	}

	get fillInBlanksAnswers () {
		return this.values.fillInBlanksAnswers
	}

	set fillInBlanksAnswers (value: string[]) {
		this.set('fillInBlanksAnswers', value)
	}

	get dragAnswersAnswers () {
		return this.values.dragAnswersAnswers
	}

	set dragAnswersAnswers (value: string[]) {
		this.set('dragAnswersAnswers', value)
	}

	get matchSet () {
		return this.values.matchSet
	}

	set matchSet (value: { q: string, a: string }[]) {
		this.set('matchSet', value)
	}

	get isFillOrDrag () {
		return this.isDragAnswers || this.isFillInBlanks
	}

	get questionPlaceholder () {
		if (this.isMatch) return 'Enter instruction/questions here (e.g. match the vegetables with their colors)'
		if (this.isSequence) return 'Enter instruction/question here (e.g. arrange these sentences in alphabetical order)'
		return 'Enter question'
	}

	get isMultipleChoice () {
		return this.type === QuestionTypes.multipleChoice
	}

	get isTrueOrFalse () {
		return this.type === QuestionTypes.trueOrFalse
	}

	get isWriteAnswer () {
		return this.type === QuestionTypes.writeAnswer
	}

	get isMatch () {
		return this.type === QuestionTypes.match
	}

	get isSequence () {
		return this.type === QuestionTypes.sequence
	}

	get isFillInBlanks () {
		return this.type === QuestionTypes.fillInBlanks
	}

	get isDragAnswers () {
		return this.type === QuestionTypes.dragAnswers
	}

	get canAddOption () {
		if (this.isMultipleChoice) return this.multipleOptions.length < 6
		if (this.isSequence) return this.sequenceAnswers.length < 6
		if (this.isMatch) return this.matchSet.length < 10
		if (this.isWriteAnswer) return this.writeAnswerAnswers.length < 6
		return false
	}

	get canRemoveOption () {
		if (this.isMultipleChoice) return this.multipleOptions.length > 2
		if (this.isSequence) return this.sequenceAnswers.length > 2
		if (this.isMatch) return this.matchSet.length > 2
		if (this.isWriteAnswer) return this.writeAnswerAnswers.length > 2
		return false
	}

	addOption () {
		if (this.isMultipleChoice) this.multipleOptions.push('')
		if (this.isSequence) this.sequenceAnswers.push('')
		if (this.isMatch) this.matchSet.push({ q: '', a: '' })
		if (this.isWriteAnswer) this.writeAnswerAnswers.push('')
	}

	removeOption (index: number) {
		console.log(this.type, index)
		if (this.isMultipleChoice) {
			this.multipleOptions.splice(index, 1)
			this.multipleAnswers = this.multipleAnswers.filter((a) => a !== index)
		}
		if (this.isSequence) this.sequenceAnswers.splice(index, 1)
		if (this.isMatch) this.matchSet.splice(index, 1)
		if (this.isWriteAnswer) this.writeAnswerAnswers.splice(index, 1)
	}

	toggleMultipleChoicAnswer (index: number) {
		if (this.multipleAnswers.includes(index)) this.multipleAnswers = this.multipleAnswers.filter((a) => a !== index)
		else this.multipleAnswers.push(index)
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
		this.explanation = entity.explanation
		this.timeLimit = entity.timeLimit
		this.data = entity.data
		this.type = entity.data.type
		if (this.isMultipleChoice) {
			this.multipleOptions = entity.data.options
			this.multipleAnswers = entity.data.answers
		}
		if (this.isTrueOrFalse) this.trueOrFalseAnswer = entity.data.answer
		if (this.isWriteAnswer) this.writeAnswerAnswers = entity.data.answers
		if (this.isSequence) this.sequenceAnswers = entity.data.answers
		if (this.isFillInBlanks) {
			this.set('indicator', entity.data.indicator)
			this.fillInBlanksAnswers = entity.data.answers
		}
		if (this.isDragAnswers) {
			this.set('indicator', entity.data.indicator)
			this.dragAnswersAnswers = entity.data.answers
		}
		if (this.isMatch) this.matchSet = entity.data.set
	}

	private getValidData () {
		const v = this.validValues
		if (this.isMultipleChoice) return { type: QuestionTypes.multipleChoice, options: v.multipleOptions, answers: v.multipleAnswers }
		if (this.isTrueOrFalse) return { type: QuestionTypes.trueOrFalse, answer: v.trueOrFalseAnswer }
		if (this.isWriteAnswer) return { type: QuestionTypes.writeAnswer, answers: v.writeAnswerAnswers }
		if (this.isSequence) return { type: QuestionTypes.sequence, answers: v.sequenceAnswers }
		if (this.isMatch) return { type: QuestionTypes.match, set: v.matchSet }
		if (this.isFillInBlanks) return { type: QuestionTypes.fillInBlanks, indicator: v.indicator, answers: v.fillInBlanksAnswers }
		if (this.isDragAnswers) return { type: QuestionTypes.dragAnswers, indicator: v.indicator, answers: v.dragAnswersAnswers }
		return {} as never
	}

	toModel = async () => {
		if (this.valid) {
			const { question, questionMedia, explanation, timeLimit } = this.validValues
			return { question, questionMedia, explanation, timeLimit, data: this.getValidData() }
		} else {
			throw new Error('Validation errors')
		}
	}
}
