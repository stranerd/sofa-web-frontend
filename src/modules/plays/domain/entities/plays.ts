import { EmbeddedUser, PlayData, PlayScore, PlayStatus, PlayTypes } from '../types'
import { BaseEntity } from '@modules/core'
import { ordinalSuffixOf } from '@utils/commons'

export class PlayEntity extends BaseEntity<PlaysConstructorArgs> {
	constructor(data: PlaysConstructorArgs) {
		super(data)
	}

	get isOngoing() {
		return [PlayStatus.created, PlayStatus.started].includes(this.status)
	}

	get isEnded() {
		return [PlayStatus.ended, PlayStatus.scored].includes(this.status)
	}

	get shareLink() {
		return `${window.location.origin}${this.lobbyPage}`
	}

	get lobbyPage() {
		return `/${this.data.type}/${this.id}/lobby`
	}

	get runPage() {
		return `/${this.data.type}/${this.id}/run`
	}

	get resultsPage() {
		return `/${this.data.type}/${this.id}/results`
	}

	get singularizedType() {
		return (
			{
				[PlayTypes.games]: 'game',
				[PlayTypes.tests]: 'test',
				[PlayTypes.flashcards]: 'flash card',
				[PlayTypes.practice]: 'practice',
				[PlayTypes.assessments]: 'assessment',
			}[this.data.type] ?? ''
		)
	}

	get canStart() {
		return this.status === PlayStatus.created
	}

	get canEnd() {
		return this.status === PlayStatus.started
	}

	get participants() {
		if (this.data.type === PlayTypes.games) return this.data.participants
		if (this.data.type === PlayTypes.assessments) return this.data.participants
		return [this.user.id]
	}

	isGame() {
		return this.data.type === PlayTypes.games
	}

	isTest() {
		return this.data.type === PlayTypes.tests
	}

	getPercentage(userId: string) {
		const score = this.scores.find((s) => s.userId === userId)
		return Number((((score?.value ?? 0) / 10) * 100).toFixed(2))
	}

	getPosition(userId: string) {
		const position = this.scores.findIndex((s) => s.userId === userId)
		return ordinalSuffixOf(position !== -1 ? position + 1 : this.participants.length)
	}

	getLabel(userId: string) {
		if (this.status !== PlayStatus.scored) return ''
		if (this.isGame()) return this.getPosition(userId)
		if (this.isTest()) return `${this.getPercentage(userId).toFixed()}%`
		return ''
	}

	getLabelColor(userId: string) {
		if (this.status === PlayStatus.scored) {
			const percentage = this.getPercentage(userId)
			if (percentage >= 80) return 'text-[#4BAF7D]'
			if (percentage >= 70) return 'text-[#ADAF4B]'
			if (percentage >= 50) return 'text-[#3296C8]'
			return 'text-primaryRed'
		}
		return 'text-[#3296C8]'
	}

	getResultLabel(userId: string) {
		if (this.status !== PlayStatus.scored) return ''
		const percentage = this.getPercentage(userId)
		if (percentage === 100) return 'Perfect!'
		if (percentage >= 90) return 'Outstanding!'
		if (percentage >= 80) return 'Excellent Work!'
		if (percentage >= 70) return 'Good job!'
		if (percentage >= 60) return 'Nice effort!'
		return 'Study harder!'
	}
}

type PlaysConstructorArgs = {
	id: string
	quizId: string
	status: PlayStatus
	questions: string[]
	user: EmbeddedUser
	data: PlayData
	totalTimeInSec: number
	scores: PlayScore
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
