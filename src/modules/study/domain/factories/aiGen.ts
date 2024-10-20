import { v } from 'valleyed'
import { ref } from 'vue'
import { AiGenRequest, QuestionTypes } from '../types'
import { BaseFactory, UploadedFile } from '@modules/core'

type ExtraKeys = {
	type: 'document' | 'topic' | undefined
	topic: string
	document: UploadedFile | null
}

export class AiGenFactory extends BaseFactory<unknown, AiGenRequest, AiGenRequest & ExtraKeys> {
	previews = ref<{ text: string; image: string }[]>([])

	readonly rules = {
		content: v.string().min(1),
		amount: v.number().int().gt(0).lte(5, 'cannot generate more than 5 questions at once'),
		questionType: v.in(Object.values(QuestionTypes)),
		type: v.in(['document' as const, 'topic' as const, undefined]),
		topic: v
			.string()
			.min(1)
			.requiredIf(() => this.type === 'topic'),
		document: v
			.file()
			.custom((value) => ['application/pdf', 'text/plain'].includes(value?.type), 'only pdf and txt files are supported')
			.requiredIf(() => this.type === 'document'),
	}

	constructor(type?: ExtraKeys['type']) {
		super({
			content: '',
			amount: 1,
			questionType: <any>null,
			type,
			topic: '',
			document: null,
		})
	}

	get title() {
		const def = this.content || 'Untitled'
		if (this.type === 'topic') return this.topic || def
		if (this.type === 'document') return this.document?.name || def
		return def
	}

	load = () => {
		throw new Error('load not supported')
	}

	model = () => this.validValues
}
