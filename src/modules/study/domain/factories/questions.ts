import { v } from 'valleyed'
import { QuestionToModel } from '../../data/models/questions'
import { QuestionEntity } from '../entities/questions'
import { AiGenResult, QuestionTypes } from '../types'
import { indicator } from '../entities/questions-extras'
import { BaseFactory } from '@modules/core'

type FillOrDragOption = { type: 'q' | 'a'; value: string }

type Keys = Omit<QuestionToModel, 'data'> & {
	type: QuestionTypes
	multipleOptions: string[]
	multipleAnswers: number[]
	trueOrFalseAnswer: boolean
	writeAnswerAnswers: string[]
	sequenceAnswers: string[]
	matchSet: { q: string; a: string }[]
	indicator: string
	fillInBlanksAnswers: FillOrDragOption[]
	dragAnswersAnswers: FillOrDragOption[]
}

export class QuestionFactory extends BaseFactory<QuestionEntity | AiGenResult['questions'][number], QuestionToModel, Keys> {
	readonly rules = {
		question: v
			.string()
			.min(1, true)
			.requiredIf(() => !this.isFillInBlanks && !this.isDragAnswers),
		questionMedia: v.file().image().nullable(),
		explanation: v.string(),
		timeLimit: v.number().gt(0).lte(300).round(),
		type: v.in(Object.values(QuestionTypes)),
		multipleOptions: v
			.array(v.string().min(1, true))
			.min(2)
			.max(6)
			.requiredIf(() => this.isMultipleChoice),
		multipleAnswers: v
			.array(v.number().gte(0).round())
			.min(1)
			.set()
			.requiredIf(() => this.isMultipleChoice)
			.custom((value) => {
				const length = this.multipleOptions.length ?? 1
				return v.array(v.number().lt(length)).max(length).parse(value).valid
			}),
		trueOrFalseAnswer: v.boolean().requiredIf(() => this.isTrueOrFalse),
		writeAnswerAnswers: v
			.array(v.string().min(1, true))
			.min(1)
			.max(6)
			.requiredIf(() => this.isWriteAnswer),
		sequenceAnswers: v
			.array(v.string().min(1, true))
			.min(2)
			.max(6)
			.requiredIf(() => this.isSequence),
		indicator: v
			.string()
			.min(1)
			.requiredIf(() => this.isFillInBlanks || this.isDragAnswers),
		fillInBlanksAnswers: v
			.array(
				v.object({
					type: v.in(['q', 'a'] as const),
					value: v.string().min(1, true),
				}),
			)
			.min(1)
			.requiredIf(() => this.isFillInBlanks),
		dragAnswersAnswers: v
			.array(
				v.object({
					type: v.in(['q', 'a'] as const),
					value: v.string().min(1, true),
				}),
			)
			.min(1)
			.requiredIf(() => this.isDragAnswers),
		matchSet: v
			.array(
				v.object({
					q: v.string().min(1, true),
					a: v.string().min(1, true),
				}),
			)
			.min(2)
			.max(10)
			.requiredIf(() => this.isMatch),
	}

	constructor() {
		super({
			question: '',
			explanation: '',
			questionMedia: null,
			timeLimit: 30,
			type: QuestionTypes.multipleChoice,
			multipleAnswers: [],
			multipleOptions: [],
			trueOrFalseAnswer: true,
			writeAnswerAnswers: [],
			sequenceAnswers: [],
			indicator,
			fillInBlanksAnswers: [],
			dragAnswersAnswers: [],
			matchSet: [],
		})
	}

	get questionPlaceholder() {
		if (this.isMatch) return 'Enter instruction/questions here (e.g. match the vegetables with their colors)'
		if (this.isSequence) return 'Enter instruction/question here (e.g. arrange these sentences in alphabetical order)'
		return 'Enter question'
	}

	get isMultipleChoice() {
		return this.type === QuestionTypes.multipleChoice
	}

	get isTrueOrFalse() {
		return this.type === QuestionTypes.trueOrFalse
	}

	get isWriteAnswer() {
		return this.type === QuestionTypes.writeAnswer
	}

	get isMatch() {
		return this.type === QuestionTypes.match
	}

	get isSequence() {
		return this.type === QuestionTypes.sequence
	}

	get isFillInBlanks() {
		return this.type === QuestionTypes.fillInBlanks
	}

	get isDragAnswers() {
		return this.type === QuestionTypes.dragAnswers
	}

	private buildOptions(question: string, indicator: string, answers: string[]): FillOrDragOption[] {
		const questions = question.split(indicator)
		const leftovers = answers.slice(questions.length).map((a) => ({ value: a, type: 'a' as const }))
		return questions
			.map((q, i) => {
				const res: FillOrDragOption[] = [{ value: q, type: 'q' }]
				const a = answers.at(i)
				if (a) res.push({ value: a, type: 'a' })
				return res
			})
			.flat()
			.concat(leftovers)
	}

	private deconstructOptions(options: FillOrDragOption[], indicator: string) {
		return options.reduce(
			(acc, cur) => {
				if (cur.type === 'q') acc.question = acc.question + cur.value
				if (cur.type === 'a') {
					acc.question = acc.question + indicator
					acc.answers.push(cur.value)
				}
				return acc
			},
			{ question: '', answers: [] as string[] },
		)
	}

	get canAddOption() {
		if (this.isMultipleChoice) return this.multipleOptions.length < 6
		if (this.isSequence) return this.sequenceAnswers.length < 6
		if (this.isMatch) return this.matchSet.length < 10
		if (this.isWriteAnswer) return this.writeAnswerAnswers.length < 6
		return false
	}

	get canRemoveOption() {
		if (this.isMultipleChoice) return this.multipleOptions.length > 2
		if (this.isSequence) return this.sequenceAnswers.length > 2
		if (this.isMatch) return this.matchSet.length > 2
		if (this.isWriteAnswer) return this.writeAnswerAnswers.length > 1
		return false
	}

	addOption() {
		if (this.isMultipleChoice) this.multipleOptions.push('')
		if (this.isSequence) this.sequenceAnswers.push('')
		if (this.isMatch) this.matchSet.push({ q: '', a: '' })
		if (this.isWriteAnswer) this.writeAnswerAnswers.push('')
	}

	removeOption(index: number) {
		if (this.isMultipleChoice) {
			this.multipleOptions.splice(index, 1)
			this.multipleAnswers = this.multipleAnswers.filter((a) => a !== index)
		}
		if (this.isSequence) this.sequenceAnswers.splice(index, 1)
		if (this.isMatch) this.matchSet.splice(index, 1)
		if (this.isWriteAnswer) this.writeAnswerAnswers.splice(index, 1)
	}

	toggleMultipleChoicAnswer(index: number) {
		if (this.multipleAnswers.includes(index)) this.multipleAnswers = this.multipleAnswers.filter((a) => a !== index)
		else this.multipleAnswers.push(index)
	}

	load = (entity: QuestionEntity | AiGenResult['questions'][number]) => {
		if ('id' in entity) {
			this.question = entity.question
			this.questionMedia = entity.questionMedia
			this.timeLimit = entity.timeLimit
		}
		this.explanation = entity.explanation
		this.type = entity.data.type
		if (entity.data.type === QuestionTypes.multipleChoice) {
			this.multipleOptions = entity.data.options
			this.multipleAnswers = entity.data.answers
		}
		if (entity.data.type === QuestionTypes.trueOrFalse) this.trueOrFalseAnswer = entity.data.answer
		if (entity.data.type === QuestionTypes.writeAnswer) this.writeAnswerAnswers = entity.data.answers
		if (entity.data.type === QuestionTypes.sequence) this.sequenceAnswers = entity.data.answers
		if (entity.data.type === QuestionTypes.fillInBlanks) {
			this.set('indicator', entity.data.indicator)
			this.fillInBlanksAnswers = this.buildOptions(entity.question, entity.data.indicator, entity.data.answers)
		}
		if (entity.data.type === QuestionTypes.dragAnswers) {
			this.set('indicator', entity.data.indicator)
			this.dragAnswersAnswers = this.buildOptions(entity.question, entity.data.indicator, entity.data.answers)
		}
		if (entity.data.type === QuestionTypes.match) this.matchSet = entity.data.set
	}

	private get constructedData() {
		const v = this.values
		if (this.isMultipleChoice)
			return { type: QuestionTypes.multipleChoice as const, options: v.multipleOptions, answers: v.multipleAnswers }
		if (this.isTrueOrFalse) return { type: QuestionTypes.trueOrFalse as const, answer: v.trueOrFalseAnswer }
		if (this.isWriteAnswer) return { type: QuestionTypes.writeAnswer as const, answers: v.writeAnswerAnswers }
		if (this.isSequence) return { type: QuestionTypes.sequence as const, answers: v.sequenceAnswers }
		if (this.isMatch) return { type: QuestionTypes.match as const, set: v.matchSet }
		if (this.isFillInBlanks)
			return {
				type: QuestionTypes.fillInBlanks as const,
				indicator: v.indicator,
				answers: this.deconstructOptions(this.fillInBlanksAnswers, v.indicator).answers,
			}
		if (this.isDragAnswers)
			return {
				type: QuestionTypes.dragAnswers as const,
				indicator: v.indicator,
				answers: this.deconstructOptions(this.dragAnswersAnswers, v.indicator).answers,
			}
		return {} as never
	}

	model = () => {
		const { questionMedia, explanation, timeLimit, indicator } = this.validValues

		const question = this.isFillInBlanks
			? this.deconstructOptions(this.fillInBlanksAnswers, indicator).question
			: this.isDragAnswers
				? this.deconstructOptions(this.dragAnswersAnswers, indicator).question
				: this.validValues.question

		return { question, questionMedia, explanation, timeLimit, data: this.constructedData }
	}
}
