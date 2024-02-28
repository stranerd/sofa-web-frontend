import { QuizModes as PlayTypes } from '@modules/study'
export type { QuestionAnswer as PlayAnswer } from '@modules/study'
export type { EmbeddedUser } from '@modules/users'
export type PlayScore = { userId: string; value: number }[]
export { PlayTypes }

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
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
