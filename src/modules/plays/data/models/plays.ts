import { EmbeddedUser, PlayData, PlayScore, PlayStatus, PlayTypes } from '../../domain/types'

export interface PlayFromModel {
	id: string
	quizId: string
	status: PlayStatus
	questions: string[]
	totalTimeInSec: number
	scores: PlayScore
	startedAt: number | null
	user: EmbeddedUser
	data: PlayData
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface PlayToModel {
	quizId: string
	data:
		| {
				type: Exclude<PlayTypes, PlayTypes.games | PlayTypes.assessments>
		  }
		| {
				type: PlayTypes.assessments
				endedAt: number
		  }
		| {
				type: PlayTypes.games
				join: boolean
		  }
}
