export type { EmbeddedUser } from '@modules/users'

export type { QuestionAnswer as PlayAnswer } from '@modules/study'
export type PlayScore = { userId: string; value: number }[]

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}

export enum PlayTypes {
	practice = 'practice',
	tests = 'tests',
	games = 'games',
	flashcards = 'flashcards',
	assessments = 'assessments',
}

export type PlayData =
	| {
			type: PlayTypes.games | PlayTypes.assessments
			participants: string[]
	  }
	| {
			type: PlayTypes.tests
			forTutors: boolean
	  }
	| {
			type: PlayTypes.practice | PlayTypes.flashcards
	  }
