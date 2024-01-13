export interface CreateTutorRequestForm {
	topicId: string
	verification: File
	qualification: File[]
}

export interface CreateVerificationInput {
	content: {
		quizzes: string[]
		courses: string[]
	}
}

export interface VerificationStatusInput {
	accept: boolean
	id: string
}

export interface PushNotificationTokenInput {
	token: string
}
