import { ScheduleToModel } from '../../data/models/schedules'
import { IScheduleRepository } from '../irepositories/schedules'

export class SchedulesUseCase {
	private repository: (organizationId: string, classId: string) => IScheduleRepository

	constructor(repository: (organizationId: string, classId: string) => IScheduleRepository) {
		this.repository = repository
	}

	async add(data: ScheduleToModel) {
		return await this.repository(data.organizationId, data.classId).add(data)
	}

	async delete(data: { organizationId: string; classId: string; id: string }) {
		return await this.repository(data.organizationId, data.classId).delete(data.id)
	}

	async start(data: { organizationId: string; classId: string; id: string }) {
		return await this.repository(data.organizationId, data.classId).start(data.id)
	}

	async end(data: { organizationId: string; classId: string; id: string }) {
		return await this.repository(data.organizationId, data.classId).end(data.id)
	}

	async find(organizationId: string, classId: string, id: string) {
		return await this.repository(organizationId, classId).find(id)
	}
}
