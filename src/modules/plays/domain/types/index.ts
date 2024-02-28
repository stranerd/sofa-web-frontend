export type { EmbeddedUser } from '@modules/users'
export type { QuestionAnswer as PlayAnswer } from '@modules/study'
export { QuizModes as PlayTypes } from '@modules/study'
export type PlayScore = { userId: string; value: number }[]

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}
