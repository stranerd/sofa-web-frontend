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

	async find (organizationId: string, classId: string, id: string) {
		return await this.repository.find(organizationId, classId, id)
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		return await this.repository.get(organizationId, classId, query)
	}
}
