import { QuizModes as PlayTypes } from '@modules/study'
export type { QuestionAnswer as PlayAnswer } from '@modules/study'
export type { EmbeddedUser } from '@modules/users'
export { PlayTypes }
export type PlayScore = { userId: string; value: number }[]

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}

export type PlayGamesData = {
	type: PlayTypes.games
	participants: string[]
}

export type PlayAssessmentsData = {
	type: PlayTypes.assessments
	participants: string[]
	endedAt: number
}

export type PlayTestsData = {
	type: PlayTypes.tests
	forTutors: boolean
}

export type PlayGenericData = {
	type: PlayTypes.practice | PlayTypes.flashcards
}

export type PlayData = PlayGamesData | PlayAssessmentsData | PlayTestsData | PlayGenericData

export enum PlayTiming {
	general = 'general',
	perQuestion = 'perQuestion',
}
