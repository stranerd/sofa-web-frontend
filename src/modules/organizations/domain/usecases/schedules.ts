import { ScheduleEntity } from '../entities/schedules'
import { ScheduleFactory } from '../factories/schedules'
import { IScheduleRepository } from '../irepositories/schedules'
import { Conditions, Listeners } from '@modules/core'

export class SchedulesUseCase {
	private repository: (organizationId: string, classId: string) => IScheduleRepository

	constructor(repository: (organizationId: string, classId: string) => IScheduleRepository) {
		this.repository = repository
	}

	async create(organizationId: string, classId: string, factory: ScheduleFactory) {
		return await this.repository(organizationId, classId).add(await factory.toModel())
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

	async getAll(organizationId: string, classId: string) {
		return await this.repository(organizationId, classId).get({ all: true })
	}

	async listenToAll(organizationId: string, classId: string, listener: Listeners<ScheduleEntity>) {
		return await this.repository(organizationId, classId).listenToMany({ all: true }, listener, () => true)
	}

	async getInList(organizationId: string, classId: string, ids: string[]) {
		const schedules = await this.repository(organizationId, classId).get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return schedules.results
	}

	async listenToInList(organizationId: string, classId: string, ids: () => string[], listener: Listeners<ScheduleEntity>) {
		return await this.repository(organizationId, classId).listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}
}
