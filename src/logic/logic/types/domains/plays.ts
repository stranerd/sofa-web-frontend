import { SingleUser } from './users'

export enum PlayStatus {
	created = 'created',
	started = 'started',
	ended = 'ended',
	scored = 'scored',
}

export interface Game {
	hash: string
	id: string
	quizId: string
	user: SingleUser
	status: PlayStatus
	participants: string[]
	questions: string[]
	scores: Record<string, number>
	startedAt?: number
	endedAt?: number
	createdAt: number
	updatedAt: number
}

export interface Test {
	hash: string
	id: string
	quizId: string
	status: PlayStatus
	userId: string
	questions: string[]
	scores: Record<string, number>
	startedAt: number
	endedAt?: number
	createdAt: number
	updatedAt: number
}

export interface GameParticipantAnswer {
	hash: string
	id: string
	gameId: string
	userId: string
	data: Record<string, string[] | number[] | string | boolean>
	createdAt: number
	updatedAt: number
}
