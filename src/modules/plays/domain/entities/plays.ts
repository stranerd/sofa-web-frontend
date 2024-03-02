import { PlayFromModel } from '../../data/models/plays'
import { PlayAssessmentsData, PlayGamesData, PlayGenericData, PlayStatus, PlayTestsData, PlayTypes } from '../types'
import { BaseEntity } from '@modules/core'
import { QuestionEntity } from '@modules/study'
import { ordinalSuffixOf } from '@utils/commons'

export class PlayEntity extends BaseEntity<PlayFromModel> {
	constructor(data: PlayFromModel) {
		data.sources = data.sources?.map((source) => new QuestionEntity(source)) ?? []
		super(data)
	}

	static isDark(type: PlayTypes) {
		return [PlayTypes.games, PlayTypes.assessments].includes(type)
	}

	get hasLobby() {
		return ![PlayTypes.practice, PlayTypes.flashcards].includes(this.data.type)
	}

	get isTimed() {
		return ![PlayTypes.practice, PlayTypes.flashcards].includes(this.data.type)
	}

	get isOngoing() {
		return this.isCreated || this.isStarted
	}

	get isClosed() {
		return this.isEnded || this.isScored
	}

	get isCreated() {
		return this.status === PlayStatus.created
	}

	get isStarted() {
		return this.status === PlayStatus.started
	}

	get isEnded() {
		return this.status === PlayStatus.ended
	}

	get isScored() {
		return this.status === PlayStatus.scored
	}

	get shareLink() {
		return `${window.location.origin}${this.lobbyPage}`
	}

	get lobbyPage() {
		if (!this.hasLobby) return this.runPage
		return `/plays/${this.data.type}/${this.id}/lobby`
	}

	get runPage() {
		return `/plays/${this.data.type}/${this.id}/run`
	}

	get resultsPage() {
		return `/plays/${this.data.type}/${this.id}/results`
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

	get participants() {
		if (this.data.type === PlayTypes.games) return this.data.participants
		if (this.data.type === PlayTypes.assessments) return this.data.participants
		return [this.user.id]
	}

	get isDark() {
		return PlayEntity.isDark(this.data.type)
	}

	get canJoinAfterStart() {
		return this.isAssessments()
	}

	isGames(): this is Omit<PlayEntity, 'data'> & { data: PlayGamesData } {
		return this.data.type === PlayTypes.games
	}

	isTests(): this is Omit<PlayEntity, 'data'> & { data: PlayTestsData } {
		return this.data.type === PlayTypes.tests
	}

	isAssessments(): this is Omit<PlayEntity, 'data'> & { data: PlayAssessmentsData } {
		return this.data.type === PlayTypes.assessments
	}

	isPractice(): this is Omit<PlayEntity, 'data'> & { data: PlayGenericData } {
		return this.data.type === PlayTypes.practice
	}

	isFlashcards(): this is Omit<PlayEntity, 'data'> & { data: PlayGenericData } {
		return this.data.type === PlayTypes.flashcards
	}

	getPercentage(userId: string) {
		const score = this.scores.find((s) => s.userId === userId)
		return Number(((score?.value ?? 0) * 100).toFixed(2))
	}

	getPosition(userId: string) {
		const position = this.scores.findIndex((s) => s.userId === userId)
		return ordinalSuffixOf(position !== -1 ? position + 1 : this.participants.length)
	}

	getCardLabel(userId: string): string {
		if (this.status !== PlayStatus.scored) return ''
		if (this.isGames()) return this.getPosition(userId)
		if (this.isTests()) return `${this.getPercentage(userId).toFixed()}%`
		return ''
	}

	getResultColor(userId: string) {
		if (this.status !== PlayStatus.scored) return 'text-[#3296C8]'
		const percentage = this.getPercentage(userId)
		if (percentage >= 80) return 'text-[#4BAF7D]'
		if (percentage >= 70) return 'text-[#ADAF4B]'
		if (percentage >= 50) return 'text-[#3296C8]'
		return 'text-primaryRed'
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
