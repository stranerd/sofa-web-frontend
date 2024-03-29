export interface CreateCourseInput {
	title: string
	description: string
	photo?: File
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
	tags: string[]
	media?: File
	topic: string
	id: string
}
