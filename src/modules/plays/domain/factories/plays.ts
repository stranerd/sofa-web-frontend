import { v, isLaterThan } from 'valleyed'
import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { PlayTypes } from '../types'
import { BaseFactory } from '@modules/core'

const minGracePeriod = 1000 * 60 * 5

type Keys = Omit<PlayToModel, 'data'> & {
	type: PlayTypes
	gamesJoin: boolean
	assessmentsEndedAt: number
}

export class PlayFactory extends BaseFactory<PlayEntity, PlayToModel, Keys> {
	readonly rules = {
		quizId: v.string().min(1),
		type: v.in(Object.values(PlayTypes)),
		gamesJoin: v.boolean().requiredIf(() => this.isGames),
		assessmentsEndedAt: v
			.time()
			.custom((value) => isLaterThan(Date.now() + minGracePeriod)(value).valid, 'cannot be less than current time')
			.asStamp()
			.requiredIf(() => this.isAssessments),
	}

	reserved = []

	constructor() {
		const assessmentsEndedAt = Date.now() + 1000 * 60 * 60 * 24
		super({ quizId: '', type: PlayTypes.practice, gamesJoin: false, assessmentsEndedAt })
	}

	get isGames() {
		return this.values.type === PlayTypes.games
	}

	get isTests() {
		return this.values.type === PlayTypes.tests
	}

	get isPractice() {
		return this.values.type === PlayTypes.practice
	}

	get isFlashcards() {
		return this.values.type === PlayTypes.flashcards
	}

	get isAssessments() {
		return this.values.type === PlayTypes.assessments
	}

	get assessmentsEndedAtDate() {
		return this.#formatDate(this.assessmentsEndedAt)
	}

	set assessmentsEndedAtDate(date: string) {
		this.assessmentsEndedAt = new Date(date).getTime()
	}

	get minAssessmentsEndedAt() {
		return this.#formatDate(Date.now() + minGracePeriod)
	}

	#formatDate = (timestamp: number) => {
		const date = new Date(timestamp)
		const pad2 = (n: number) => String(n).padStart(2, '0')
		return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`
	}

	loadEntity = (entity: PlayEntity) => {
		this.quizId = entity.quizId
		this.type = entity.data.type
	}

	model = async () => {
		const { quizId, type, gamesJoin, assessmentsEndedAt } = this.validValues
		return {
			quizId,
			data:
				type === PlayTypes.games
					? { type, join: gamesJoin }
					: type === PlayTypes.assessments
						? { type, endedAt: assessmentsEndedAt }
						: { type },
		}
	}
}
