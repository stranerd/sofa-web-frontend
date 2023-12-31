export interface CreateGameInput {
	quizId: string
	join: boolean
}

export interface JoinGame {
	join: boolean
}

export interface AddQuestionAnswer {
	questionId: string
	answer: number[] | string[] | string | boolean
}
