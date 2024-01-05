export interface AddTagInput {
	title: string
	type: string
}

export interface AddViewInput {
	entity: {
		id: string
		type: 'quizzes' | 'courses'
	}
}

export interface AddReviewInput {
	entity: {
		id: string
		type: 'quizzes' | 'courses'
	}
	rating: number
	message: string
}

export interface AddReportInput {
	entity: {
		id: string
		type: 'quizzes' | 'courses'
	}
	message: string
}
