import { v } from 'valleyed'
import { AiGenRequest, QuestionTypes } from '../types'
import { BaseFactory } from '@modules/core'

type ExtraKeys = {
	type: 'document' | 'topic' | undefined
	topic: string
}

export class AiGenFactory extends BaseFactory<unknown, AiGenRequest, AiGenRequest & ExtraKeys> {
	readonly rules = {
		content: v.string().trim().min(1),
		amount: v.number().int().gt(0).lte(5, 'cannot generate more than 5 questions at once'),
		questionType: v.in(Object.values(QuestionTypes)),
		type: v.in(['document' as const, 'topic' as const, undefined]),
		topic: v
			.string()
			.trim()
			.min(1)
			.requiredIf(() => this.type === 'topic'),
	}

	constructor(type?: ExtraKeys['type']) {
		super({
			content: '',
			amount: 1,
			questionType: <any>null,
			type,
			topic: '',
		})
	}

	get title() {
		const def = this.content || 'Untitled'
		if (this.type === 'topic') return this.topic || def
		return def
	}

	load = () => {
		throw new Error('load not supported')
	}

	model = () => this.validValues
}
