import { IAnnouncementRepository } from '../irepositories/announcements'
import { AnnouncementFactory } from '../factories/announcements'
import { AnnouncementEntity } from '../entities/announcements'
import { QueryParams, Conditions, Listeners } from '@modules/core'

export class AnnouncementsUseCase {
	private repository: (organizationId: string, classId: string) => IAnnouncementRepository

	constructor(repository: (organizationId: string, classId: string) => IAnnouncementRepository) {
		this.repository = repository
	}

	async add(organizationId: string, classId: string, data: AnnouncementFactory) {
		return await this.repository(organizationId, classId).add(await data.toModel())
	}

	async find(organizationId: string, classId: string, id: string) {
		return await this.repository(organizationId, classId).find(id)
	}

	async get(organizationId: string, classId: string, date?: number) {
		const conditions: QueryParams = {
			where: [],
			sort: [{ field: 'createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) conditions.where!.push({ field: 'createdAt', condition: Conditions.lt, value: date })
		return await this.repository(organizationId, classId).get(conditions)
	}

	async markRead(input: { organizationId: string; classId: string; userId: string }) {
		return await this.repository(input.organizationId, input.classId).markRead(input.userId)
	}

	async listen(organizationId: string, classId: string, listener: Listeners<AnnouncementEntity>, date?: number) {
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
}
