import { isLaterThan, v, capitalize } from 'valleyed'
import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { PlayTypes } from '../types'
import { getDateTimeString } from '@utils/dates'
import { BaseFactory } from '@modules/core'
import { QuizEntity } from '@modules/study'

const minGracePeriod = 1000 * 60 * 5

type Keys = Omit<PlayToModel, 'data'> & {
	type: PlayTypes
	gamesJoin: boolean
	assessmentsEndedAt: number
}

export class PlayFactory extends BaseFactory<PlayEntity, PlayToModel, Keys> {
	readonly rules = {
		title: v.string().min(1),
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
		super({ title: '', quizId: '', type: null as unknown as PlayTypes, gamesJoin: false, assessmentsEndedAt })
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
		return getDateTimeString(new Date(this.assessmentsEndedAt))
	}

	set assessmentsEndedAtDate(date: string) {
		this.assessmentsEndedAt = new Date(date).getTime()
	}

	get minAssessmentsEndedAt() {
		return getDateTimeString(new Date(Date.now() + minGracePeriod))
	}

	load(type: PlayTypes, quiz: QuizEntity) {
		this.quizId = quiz.id
		this.type = type
		this.title = capitalize(quiz.title)
	}

	loadEntity = (entity: PlayEntity) => {
		this.quizId = entity.quizId
		this.type = entity.data.type
	}

	model = async () => {
		const { title, quizId, type, gamesJoin, assessmentsEndedAt } = this.validValues
		return {
			title,
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
