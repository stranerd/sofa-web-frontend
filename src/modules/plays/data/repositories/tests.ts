import { TestEntity } from '../../domain/entities/tests'
import { ITestRepository } from '../../domain/irepositories/tests'
import { PlayTypes } from '../../domain/types'
import { TestFromModel, TestToModel } from '../models/tests'
import { PlayRepository } from './plays'

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
