import { PlayTypes } from '../types'
import { PlayEntity } from './plays'
import { TestFromModel } from '@modules/plays/data/models/tests'

export class TestEntity extends PlayEntity {
	public readonly userId: string

	constructor(data: TestFromModel) {
		super(PlayTypes.tests, data)
		this.userId = data.userId
	}

	getEndsAt() {
		return (this.startedAt ?? 0) + this.totalTimeInSec * 1000
	}

	canUserAccess(userId: string) {
		return this.userId === userId
	}
}
