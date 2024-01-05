import { FileData } from '../domains'

export interface CreateFolderInput {
	title: string
}

export interface SaveItemToFolderInput {
	type: string
	propIds: string[]
	add: boolean
	id: string
}

export interface CreateQuizInput {
	title: string
	description: string
	photo: FileData | null
	isForTutors: boolean
	topic: string
	tags: string[]
	courseId: string | null
}

export interface ReorderQuizInput {
	questions: string[]
}

export interface CreateQuestionInput {
	question: string
	questionMedia: FileData | null
	timeLimit: number
	data: {
		type: 'multipleChoice' | 'writeAnswer' | 'trueOrFalse' | 'fillInBlanks' | 'dragAnswers' | 'sequence' | 'match'
		options?: string[]
		answers?: any[]
		indicator?: string
		answer?: boolean
		set?: {
			q: string
			a: string
		}[]
	}
	explanation: string
}

export interface CreateCourseInput {
	title: string
	description: string
	photo?: Blob
	topic: string
	tags: string[]
	price: {
		amount: number
		currency: string
	}
}

export interface AddItemToCourseInput {
	type: string
	coursableId: string
	add: boolean
	id: string
}

export interface CourseSectionInput {
	label: string
	items: {
		id: string
		type: string
	}[]
}

export interface UpdateCourseSectionsInput {
	sections: CourseSectionInput[]
	id: string
}

export interface CreateDocumentInput {
	type: string
	title: string
	description: string
	tagIds: string[]
	media?: Blob
	topicId: string
	id: string
}
