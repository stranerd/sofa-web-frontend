import { v } from 'valleyed'
import { ref } from 'vue'
import { QuizToModel } from '../../data/models/quizzes'
import { QuizEntity } from '../entities/quizzes'
import { QuizModes } from '../types'
import { BaseFactory } from '@modules/core'

type Keys = Omit<QuizToModel, 'modes'> & Record<`mode${Capitalize<QuizModes>}`, boolean>

export class QuizFactory extends BaseFactory<QuizEntity, QuizToModel, Keys> {
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
		timeLimit: v.number().gt(0).round().nullable(),
		modeGames: v.boolean(),
		modeTests: v.boolean(),
		modePractice: v.boolean(),
		modeFlashcards: v.boolean(),
		modeAssessments: v.boolean(),
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
			timeLimit: null,
			modeGames: true,
			modeTests: true,
			modePractice: true,
			modeFlashcards: true,
			modeAssessments: true,
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

	load = (entity: QuizEntity) => {
		this.entityId = entity.id
		this.title = entity.title
		this.description = entity.description
		this.photo = entity.photo
		this.topicId = entity.topicId
		this.tagIds = entity.tagIds
		this.isForTutors = entity.isForTutors
		this.courseId = entity.courseId
		this.timeLimit = entity.timeLimit
		this.modeGames = entity.modes.games
		this.modeTests = entity.modes.tests
		this.modeFlashcards = entity.modes.flashcards
		this.modePractice = entity.modes.practice
		this.modeAssessments = entity.modes.assessments
	}

	model = async () => {
		const {
			title,
			description,
			photo,
			topic,
			tags,
			isForTutors,
			courseId,
			timeLimit,
			modeGames,
			modeFlashcards,
			modePractice,
			modeTests,
			modeAssessments,
		} = this.validValues
		return {
			title,
			description,
			photo,
			topic,
			tags,
			isForTutors,
			courseId,
			timeLimit,
			modes: {
				games: modeGames,
				flashcards: modeFlashcards,
				practice: modePractice,
				tests: modeTests,
				assessments: modeAssessments,
			},
		}
	}
}
