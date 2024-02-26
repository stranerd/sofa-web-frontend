import { EmbeddedUser, PlayStatus, PlayTypes } from '../types'
import type { GameEntity } from './games'
import type { TestEntity } from './tests'
import { ordinalSuffixOf } from '@utils/commons'
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

	get lobbyPage() {
		return `/${this.type}/${this.id}/lobby`
	}

	get runPage() {
		return `/${this.type}/${this.id}/run`
	}

	get resultsPage() {
		return `/${this.type}/${this.id}/results`
	}

	get singularizedType() {
		return (
			{
				[PlayTypes.games]: 'game',
				[PlayTypes.tests]: 'test',
				[PlayTypes.flashcards]: 'flash card',
				[PlayTypes.practice]: 'practice',
			}[this.type] ?? ''
		)
	}

	isGame(): this is GameEntity {
		return this.type === PlayTypes.games
	}

	isTest(): this is TestEntity {
		return this.type === PlayTypes.tests
	}

	getPercentage(userId: string) {
		const correctAnswers = (this.scores[userId] ?? 0) / 10
		return (correctAnswers / this.questions.length) * 100
	}

	getPosition(userId: string): string {
		const participants = this.isGame() ? this.participants : [userId]
		const scores = Object.values(this.scores).sort((a, b) => b - a)
		const position = scores.indexOf(this.scores[userId])
		return ordinalSuffixOf(position !== -1 ? position + 1 : participants.length)
	}

	getLabel(userId: string): string {
		if (this.isGame()) return this.getPosition(userId)
		if (this.isTest()) return `${this.getPercentage(userId).toFixed()}%`
		return ''
	}

	getLabelColor(userId: string) {
		if (this.isTest()) {
			const percentage = this.getPercentage(userId)
			if (percentage >= 80) return 'text-[#4BAF7D]'
			if (percentage >= 70) return 'text-[#ADAF4B]'
			if (percentage >= 50) return 'text-[#3296C8]'
			return 'text-primaryRed'
		}
		return 'text-[#3296C8]'
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
