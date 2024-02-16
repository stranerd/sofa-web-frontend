import { EmbeddedUser, PlayStatus } from '../types'
import { GameFromModel } from '@modules/plays/data/models/games'
import { BaseEntity } from '@modules/core'

export class GameEntity extends BaseEntity {
	public readonly id: string
	public readonly quizId: string
	public readonly user: EmbeddedUser
	public readonly status: PlayStatus
	public readonly participants: string[]
	public readonly questions: string[]
	public readonly totalTimeInSec: number
	public readonly scores: Record<string, number>
	public readonly startedAt: number | null
	public readonly endedAt: number | null
	public readonly createdAt: number
	public readonly updatedAt: number

	constructor({
		id,
		quizId,
		user,
		status,
		participants,
		questions,
		totalTimeInSec,
		scores,
		startedAt,
		endedAt,
		createdAt,
		updatedAt,
	}: GameFromModel) {
		super()
		this.id = id
		this.quizId = quizId
		this.user = user
		this.status = status
		this.participants = participants
		this.questions = questions
		this.totalTimeInSec = totalTimeInSec
		this.scores = scores
		this.startedAt = startedAt
		this.endedAt = endedAt
		this.createdAt = createdAt
		this.updatedAt = updatedAt
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.user.id === userId || this.participants.includes(userId)
	}
}
