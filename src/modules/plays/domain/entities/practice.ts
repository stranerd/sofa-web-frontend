import { PlayTypes } from '../types'
import { PlayEntity } from './plays'
import { PracticeFromModel } from '@modules/plays/data/models/practice'

export class PracticeEntity extends PlayEntity {
	public readonly userId: string

	constructor(data: PracticeFromModel) {
		super(PlayTypes.practice, data)
		this.userId = data.userId
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.userId === userId
	}
}
