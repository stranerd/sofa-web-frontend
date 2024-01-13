export interface CreateTutorRequestForm {
	topicId: string
	verification: Blob
	qualification: Blob[]
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
