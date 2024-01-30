import { ScheduleEntity } from '../entities/schedules'
import { ScheduleFactory } from '../factories/schedules'
import { IScheduleRepository } from '../irepositories/schedules'
import { QueryParams, Conditions, Listeners } from '@modules/core'
import { CHAT_PAGINATION_LIMIT } from '@utils/constants'

export class SchedulesUseCase {
	private repository: (organizationId: string, classId: string) => IScheduleRepository

	constructor(repository: (organizationId: string, classId: string) => IScheduleRepository) {
		this.repository = repository
	}

	async create(organizationId: string, classId: string, lessonId: string, factory: ScheduleFactory) {
		return await this.repository(organizationId, classId).add({ ...(await factory.toModel()), lessonId })
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

	async get(organizationId: string, classId: string, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			limit: CHAT_PAGINATION_LIMIT,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.lt, value: date })
		return await this.repository(organizationId, classId).get(conditions)
	}

	async listen(organizationId: string, classId: string, listener: Listeners<ScheduleEntity>, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.gt, value: date })

		return await this.repository(organizationId, classId).listenToMany(conditions, listener, (entity) => {
			if (date) return entity.createdAt >= date
			else return true
		})
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
