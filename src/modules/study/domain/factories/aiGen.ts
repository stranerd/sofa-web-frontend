import { v } from 'valleyed'
import { AiGenRequest, QuestionTypes } from '../types'
import { BaseFactory } from '@modules/core'

export class AiGenFactory extends BaseFactory<AiGenRequest, AiGenRequest, AiGenRequest> {
	readonly rules = {
		content: v.string().trim().min(1),
		amount: v.number().int().gt(0).lte(5, 'cannot generate more than 5 questions at once'),
		questionType: v.in(Object.values(QuestionTypes)),
	}

	constructor() {
		super({
			content: '',
			amount: 1,
			questionType: <any>null,
		})
	}

	load = (entity: AiGenRequest) => {
		this.content = entity.content
		this.amount = entity.amount
		this.questionType = entity.questionType
	}

	model = () => this.validValues
}
