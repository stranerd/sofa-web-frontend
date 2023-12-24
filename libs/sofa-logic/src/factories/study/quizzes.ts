import { valleyed } from '@utils/commons'
import { CreateQuizInput, Quiz } from '../../logic'
import { BaseFactory } from '@modules/core'
import { ref } from 'vue'

const v = valleyed.v
export class QuizFactory extends BaseFactory<Quiz, CreateQuizInput, CreateQuizInput> {
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
		courseId: v.string().min(1).nullable()
	}

	constructor () {
		super({
			title: '', description: '', photo: null, topic: '',
			tags: [], isForTutors: false, courseId: null
		})
	}

	get title () {
		return this.values.title
	}

	set title (value: string) {
		this.set('title', value)
	}

	get photo () {
		return this.values.photo
	}

	set photo (value: CreateQuizInput['photo']) {
		this.set('photo', value)
	}

	get description () {
		return this.values.description
	}

	set description (value: string) {
		this.set('description', value)
	}

	get topic () {
		return this.values.topic
	}

	set topic (value: string) {
		this.set('topic', value)
	}

	get isForTutors () {
		return this.values.isForTutors
	}

	set isForTutors (value: boolean) {
		this.set('isForTutors', value)
	}

	get courseId () {
		return this.values.courseId
	}

	set courseId (value: string | null) {
		this.set('courseId', value)
	}

	get tags () {
		return this.values.tags
	}

	set tags (value: string[]) {
		this.set('tags', value)
	}

	get tagString () {
		return this.#tagString.value
	}

	set tagString (value: string) {
		const sep = ','
		if (!value.includes(sep)) this.#tagString.value = value
		else {
			const tags = value.toLowerCase()
				.split(sep).map((t) => t.trim())
				.filter((t) => !!t && !this.tags.includes(t))
			this.tags = this.tags.concat(...tags)
			this.#tagString.value = ''
		}
	}

	removeTag (index: number) {
		this.tags = this.tags.filter((_, i) => i !== index)
	}

	loadEntity = (entity: Quiz) => {
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

	toModel = async () => {
		if (this.valid) {
			const { title, description, photo, topic, tags, isForTutors, courseId } = this.validValues
			return { title, description, photo, topic, tags, isForTutors, courseId }
		} else {
			throw new Error('Validation errors')
		}
	}
}