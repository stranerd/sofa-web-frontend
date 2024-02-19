import { PlayTypes } from '../types'
import { PlayEntity } from './plays'
import { FlashCardFromModel } from '@modules/plays/data/models/flashcards'

export class FlashCardEntity extends PlayEntity {
	public readonly userId: string

	constructor(data: FlashCardFromModel) {
		super(PlayTypes.flashCards, data)
		this.userId = data.userId
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.userId === userId
	}
}
