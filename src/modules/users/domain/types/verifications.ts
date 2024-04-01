export type VerificationContent = {
	courses: string[]
	quizzes: string[]
}

export type VerificationAccepted = {
	is: boolean
	message: string
	at: number
} | null

export type AcceptVerificationInput = {
	accept: boolean
	message: string
}

export type AcceptTutorRequestInput = {
	accept: boolean
	message: string
}
