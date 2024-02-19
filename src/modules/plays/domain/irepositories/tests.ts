import { TestToModel } from '../../data/models/tests'
import { TestEntity } from '../entities/tests'
import { QueryParams, QueryResults } from '@modules/core'
import { QuestionFromModel } from '@modules/study/data/models/questions'

export interface ITestRepository {
	create: (data: TestToModel) => Promise<TestEntity>
	get: (condition: QueryParams) => Promise<QueryResults<TestEntity>>
	find: (id: string) => Promise<TestEntity | null>
	start: (id: string) => Promise<TestEntity | null>
	end: (id: string) => Promise<TestEntity | null>
	getQuestions: (id: string) => Promise<QuestionFromModel[]>
}
