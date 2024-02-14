import { v } from 'valleyed'
import { ref } from 'vue'
import { QuizToModel } from '../../data/models/quizzes'
import { QuizEntity } from '../entities/quizzes'
import { BaseFactory } from '@modules/core'

export class QuizFactory extends BaseFactory<QuizEntity, QuizToModel, QuizToModel> {
	public topicId = ''
	public tagIds: string[] = []
	#tagString = ref('')

	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		photo: v.file().image().nullable(),
		topic: v.string().min(1),
		tags: v.array(v.string().min(1)).set(),
		isForTutors: v.boolean(),
		courseId: v.string().min(1).nullable(),
	}

	constructor() {
		super({
			title: 'Untitled Quiz',
			description: 'Here is the quiz description',
			photo: null,
			topic: 'Physics',
			tags: [],
			isForTutors: false,
			courseId: null,
		})
	}

	get tagString() {
		return this.#tagString.value
	}

	set tagString(value: string) {
		const sep = ','
		if (!value.includes(sep)) this.#tagString.value = value
		else {
			const tags = value
				.toLowerCase()
				.split(sep)
				.map((t) => t.trim())
				.filter((t) => !!t && !this.tags.includes(t))
			this.tags = this.tags.concat(...tags)
			this.#tagString.value = ''
		}
	}

	removeTag(index: number) {
		this.tags = this.tags.filter((_, i) => i !== index)
	}

	loadEntity = (entity: QuizEntity) => {
		this.reset()
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.topicId = entity.topicId
		this.tagIds = entity.tagIds
		this.isForTutors = entity.isForTutors
		this.courseId = entity.courseId
	}

	model = async () => {
		const { title, description, photo, topic, tags, isForTutors, courseId } = this.validValues
		return { title, description, photo, topic, tags, isForTutors, courseId }
	}
}
