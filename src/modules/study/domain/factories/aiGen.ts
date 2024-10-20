import { v } from 'valleyed'
import { AiGenRequest, QuestionTypes } from '../types'
import { BaseFactory, UploadedFile } from '@modules/core'

type ExtraKeys = {
	type: 'document' | 'topic' | undefined
	topic: string
	document: UploadedFile | null
	previews: { text: string; image: string }[]
	selectedPreviews: number[]
	selectAll: boolean
	selectFrom: number
	selectTo: number
}

export class AiGenFactory extends BaseFactory<unknown, AiGenRequest, AiGenRequest & ExtraKeys> {
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
		previews: v.array(
			v.object({
				text: v.string().min(1),
				image: v.string().min(1),
			}),
		),
		selectedPreviews: v
			.array(
				v
					.number()
					.int()
					.custom((value) => value < this.previews.length),
				'invalid preview selected',
			)
			.min(1)
			.requiredIf(() => this.type === 'document'),
		selectAll: v.boolean(),
		selectFrom: v
			.number()
			.int()
			.gte(1)
			.requiredIf(() => false),
		selectTo: v
			.number()
			.int()
			.custom((val) => val > this.selectFrom && val <= this.previews.length)
			.requiredIf(() => false),
	}

	protected onSet = {
		previews: () => {
			this.selectedPreviews = []
		},
		selectAll: () => {
			if (this.selectAll) this.selectedPreviews = new Array(this.previews.length).fill(0).map((_, i) => i)
		},
		selectedPreviews: () => {
			const selectedAll = this.selectedPreviews.length === this.previews.length
			if (this.selectAll !== selectedAll) this.selectAll = selectedAll
		},
		selectFrom: () => {
			if (this.isValid('selectFrom', 'selectTo')) this.select(this.selectFrom, this.selectTo)
		},
		selectTo: () => {
			if (this.isValid('selectFrom', 'selectTo')) this.select(this.selectFrom, this.selectTo)
		},
	}

	constructor(type?: ExtraKeys['type']) {
		super({
			content: '',
			amount: 1,
			questionType: <any>null,
			type,
			topic: '',
			document: null,
			previews: [],
			selectedPreviews: [],
			selectAll: false,
			selectFrom: 0,
			selectTo: 0,
		})
	}

	get title() {
		const def = this.content || 'Untitled'
		if (this.type === 'topic') return this.topic || def
		if (this.type === 'document') return this.document?.name || def
		return def
	}

	select(from: number, to: number) {
		const selected = new Array(to - from + 1).fill(0).map((_, i) => i + from - 1)
		this.selectedPreviews = selected
	}

	getPreviewFor(index: number) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const factoryState = this
		return {
			get selected() {
				return factoryState.selectedPreviews.includes(index)
			},
			set selected(value: boolean) {
				if (value) {
					factoryState.selectedPreviews = factoryState.selectedPreviews.concat(index)
				} else {
					factoryState.selectedPreviews = factoryState.selectedPreviews.filter((x) => x !== index)
				}
			},
		}
	}

	load = () => {
		throw new Error('load not supported')
	}

	model = () => this.validValues
}
