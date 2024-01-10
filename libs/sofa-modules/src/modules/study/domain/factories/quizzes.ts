import { BaseFactory, Media } from '@modules/core'
import { v } from 'valleyed'
import { ref } from 'vue'
import { QuizToModel } from '../../data/models/quizzes'
import { QuizEntity } from '../entities/quizzes'

export class QuizFactory extends BaseFactory<QuizEntity, QuizToModel, QuizToModel & { localPhotoLink: string | undefined }> {
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
		localPhotoLink: v.string().nullish(),
	}

	constructor() {
		super({
			title: 'Untitle Quiz',
			description: 'Here is the quiz description',
			photo: null,
			topic: 'Physics',
			tags: [],
			isForTutors: false,
			courseId: null,
			localPhotoLink: '/images/default.png',
		})
	}

	get title() {
		return this.values.title
	}

	set title(value: string) {
		this.set('title', value)
	}

	get photo() {
		return this.values.photo
	}

	set photo(value: Media) {
		console.log(value, v.file().parse(value))
		this.set('photo', value)
		if (value?.link) this.localPhotoLink = value.link
	}

	get localPhotoLink() {
		return this.values.localPhotoLink
	}

	set localPhotoLink(value: string | undefined) {
		this.set('localPhotoLink', value)
	}

	get description() {
		return this.values.description
	}

	set description(value: string) {
		this.set('description', value)
	}

	get topic() {
		return this.values.topic
	}

	set topic(value: string) {
		this.set('topic', value)
	}

	get isForTutors() {
		return this.values.isForTutors
	}

	set isForTutors(value: boolean) {
		this.set('isForTutors', value)
	}

	get courseId() {
		return this.values.courseId
	}

	set courseId(value: string | null) {
		this.set('courseId', value)
	}

	get tags() {
		return this.values.tags
	}

	set tags(value: string[]) {
		this.set('tags', value)
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

	toModel = async () => {
		if (this.valid) {
			const { title, description, photo, topic, tags, isForTutors, courseId } = this.validValues
			return { title, description, photo, topic, tags, isForTutors, courseId }
		} else {
			throw new Error('Validation errors')
		}
	}
}
