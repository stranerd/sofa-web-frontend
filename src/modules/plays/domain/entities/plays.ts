import { EmbeddedUser, PlayStatus, PlayTypes } from '../types'
import { BaseEntity } from '@modules/core'

export class PlayEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly status: PlayStatus
	public readonly questions: string[]
	public readonly totalTimeInSec: number
	public readonly user: EmbeddedUser
	public readonly scores: Record<string, number>
	public readonly startedAt: number | null
	public readonly endedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor(
		readonly type: PlayTypes,
		{ id, quizId, status, questions, user, totalTimeInSec, scores, startedAt, endedAt, createdAt, updatedAt }: PlaysConstructorArgs,
	) {
		super()
		this.id = id
		this.quizId = quizId
		this.status = status
		this.questions = questions
		this.user = user
		this.totalTimeInSec = totalTimeInSec
		this.scores = scores
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	get isOngoing() {
		return [PlayStatus.created, PlayStatus.started].includes(this.status)
	}

	get isEnded() {
		return [PlayStatus.ended, PlayStatus.scored].includes(this.status)
	}
}

type PlaysConstructorArgs = {
	id: string
	quizId: string
	status: PlayStatus
	questions: string[]
	user: EmbeddedUser
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
