import { EmbeddedUser, PlayStatus } from '../../domain/types'

export interface PlayFromModel {
	id: string
	quizId: string
	status: PlayStatus
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	user: EmbeddedUser
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface PlayToModel {
	quizId: string
}
