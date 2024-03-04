import { EmbeddedUser, PlayData, PlayScore, PlayStatus, PlayTypes } from '../../domain/types'
import { QuestionEntity } from '@modules/study'

export interface PlayFromModel {
	id: string
	title: string
	quizId: string
	status: PlayStatus
	questions: string[]
	totalTimeInSec: number
	scores: PlayScore
	sources: QuestionEntity[]
	startedAt: number | null
	user: EmbeddedUser
	data: PlayData
	endedAt: number | null
	createdAt: number
	updatedAt: number
}

export interface PlayToModel {
	title: string
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
