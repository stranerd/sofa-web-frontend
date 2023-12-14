import { QueryParams } from '@modules/core'
import { ScheduleToModel } from '../../data/models/schedules'
import { IScheduleRepository } from '../irepositories/schedules'

export class SchedulesUseCase {
	private repository: IScheduleRepository

	constructor (repository: IScheduleRepository) {
		this.repository = repository
	}

	async add (data: ScheduleToModel) {
		return await this.repository.add(data)
	}

	async delete (data: { organizationId: string, classId: string, id: string }) {
		return await this.repository.delete(data.organizationId, data.classId, data.id)
	}

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async update (input: { organizationId: string, classId: string, id: string, data: Partial<ScheduleToModel> }) {
		return await this.repository.update(input.organizationId, input.classId, input.id, input.data)
	}
}
