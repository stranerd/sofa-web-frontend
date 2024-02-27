import { EmbeddedUser, PlayData, PlayStatus, PlayTypes } from '../types'
import { ordinalSuffixOf } from '@utils/commons'
import { BaseEntity } from '@modules/core'

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
		const correctAnswers = (this.scores[userId] ?? 0) / 10
		return (correctAnswers / this.questions.length) * 100
	}

	getPosition(userId: string) {
		const scores = Object.values(this.scores).sort((a, b) => b - a)
		const position = scores.indexOf(this.scores[userId])
		return ordinalSuffixOf(position !== -1 ? position + 1 : this.participants.length)
	}

	getLabel(userId: string) {
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
	data: PlayData
	totalTimeInSec: number
	scores: Record<string, number>
	startedAt: number | null
	endedAt: number | null
	createdAt: number
	updatedAt: number
}
