import { TestFromModel, TestToModel } from '../models/tests'
import { PlayRepository } from './plays'
import { PlayTypes } from '@modules/plays/domain/types'
import { TestEntity } from '@modules/plays/domain/entities/tests'
import { ITestRepository } from '@modules/plays/domain/irepositories/tests'

export class TestRepository extends PlayRepository<TestEntity, TestFromModel, TestToModel> implements ITestRepository {
	private static instance: TestRepository

	private constructor() {
		super(PlayTypes.tests, (model: TestFromModel | null) => (model ? new TestEntity(model) : null) as TestEntity)
	}

	static getInstance() {
		if (!TestRepository.instance) TestRepository.instance = new TestRepository()
		return TestRepository.instance
	}
}
