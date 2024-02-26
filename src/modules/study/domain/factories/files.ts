import { v } from 'valleyed'
import { ref } from 'vue'
import { FileToModel } from '../../data/models/files'
import { FileEntity } from '../entities/files'
import { BaseFactory, Media } from '@modules/core'

export class FileFactory extends BaseFactory<FileEntity, FileToModel, FileToModel> {
	public topicId = ''
	public tagIds: string[] = []
	#tagString = ref('')

	readonly rules = {
		title: v.string().min(1),
		description: v.string().min(1),
		photo: v.file().image().nullable(),
		media: v.file(),
		topic: v.string().min(1),
		tags: v.array(v.string().min(1)).set(),
		courseId: v.string().min(1).nullable(),
	}

	constructor() {
		super({
			title: 'Untitled File',
			description: 'Here is the file description',
			photo: null,
			media: null as any,
			topic: 'Physics',
			tags: [],
			courseId: null,
		})
	}

	set media(value: Media) {
		this.set('media', value)
		if (!this.title && value) this.title = value.name
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

	loadEntity = (entity: FileEntity) => {
		this.reset()
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.media = entity.media
		this.topicId = entity.topicId
		this.tagIds = entity.tagIds
		this.courseId = entity.courseId
	}

	model = async () => {
		const { title, description, photo, topic, tags, media, courseId } = this.validValues
		return { title, description, photo, topic, tags, media, courseId }
	}
}
