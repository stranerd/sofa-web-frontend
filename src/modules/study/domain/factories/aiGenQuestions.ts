import { v } from 'valleyed'
import { CreateAiQuestionsData, QuestionTypes } from '../types'
import { BaseFactory } from '@modules/core'

export class AiGenQuestionFactory extends BaseFactory<CreateAiQuestionsData, CreateAiQuestionsData, CreateAiQuestionsData> {
	readonly rules = {
		amount: v.number().int().gt(0).lte(5, 'cannot generate more than 5 questions at once'),
		questionType: v.in(Object.values(QuestionTypes)),
	}

	constructor() {
		super({
			amount: 1,
			questionType: <any>null,
		})
	}

	load = (entity: CreateAiQuestionsData) => {
		this.amount = entity.amount
		this.questionType = entity.questionType
	}

	model = () => {
		const { amount, questionType } = this.validValues
		return { amount, questionType }
	}
}
