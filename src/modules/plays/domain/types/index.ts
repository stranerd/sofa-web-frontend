export type { EmbeddedUser } from '@modules/users'

export { QuizModes as PlayTypes } from '@modules/study'

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}
