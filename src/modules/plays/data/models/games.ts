import { EmbeddedUser, PlayStatus } from '../../domain/types'

export interface GameFromModel {
	id: string
	quizId: string
	user: EmbeddedUser
	status: PlayStatus
	participants: string[]
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface GameToModel {
	quizId: string
	join: boolean
}
