import { PlayStatus } from '../../domain/types'

export interface TestFromModel extends TestToModel {
	id: string
	status: PlayStatus
	userId: string
	questions: string[]
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface TestToModel {
	quizId: string
}
