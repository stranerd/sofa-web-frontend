import { TestFromModel, TestToModel } from '../models/tests'
import { ITestRepository } from '@modules/plays/domain/irepositories/tests'
import { HttpClient, QueryParams, QueryResults } from '@modules/core'
import { TestEntity } from '@modules/plays/domain/entities/tests'

export class TestRepository implements ITestRepository {
	private static instance: TestRepository
	private client: HttpClient
	private mapper = (model: TestFromModel | null) => (model ? new TestEntity(model) : null) as TestEntity

	private constructor() {
		this.client = new HttpClient('/plays/tests')
	}

	static getInstance() {
		if (!TestRepository.instance) TestRepository.instance = new TestRepository()
		return TestRepository.instance
	}

	async get(query: QueryParams) {
		const d = await this.client.get<QueryParams, QueryResults<TestFromModel>>('/', query)

		return {
			...d,
			results: d.results.map((r) => this.mapper(r)),
		}
	}

	async find(id: string) {
		const data = await this.client.get<QueryParams, TestFromModel | null>(`/${id}`, {})
		return this.mapper(data)
	}

	async create(data: TestToModel) {
		const d = await this.client.post<TestToModel, TestFromModel>('/', data)
		return this.mapper(d)
	}

	async start(id: string) {
		const d = await this.client.post<QueryParams, TestFromModel>(`/${id}/start`, {})
		return this.mapper(d)
	}

	async end(id: string) {
		const d = await this.client.post<QueryParams, TestFromModel>(`/${id}/end`, {})
		return this.mapper(d)
	}
}
