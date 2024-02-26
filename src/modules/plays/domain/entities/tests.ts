import { TestFromModel } from '../../data/models/tests'
import { PlayTypes } from '../types'
import { PlayEntity } from './plays'

export class TestEntity extends PlayEntity<TestFromModel> {
	constructor(data: TestFromModel) {
		super(PlayTypes.tests, data)
	}
}
