import { QueryParams } from '@modules/core'
import { AnnouncementToModel } from '../../data/models/announcements'
import { IAnnouncementRepository } from '../irepositories/announcements'

export class AnnouncementsUseCase {
	private repository: (organizationId: string, classId: string) => IAnnouncementRepository

	constructor(repository: (organizationId: string, classId: string) => IAnnouncementRepository) {
		this.repository = repository
	}

	async add(data: AnnouncementToModel) {
		return await this.repository(data.organizationId, data.classId).add(data)
	}

	async find(organizationId: string, classId: string, id: string) {
		return await this.repository(organizationId, classId).find(id)
	}

	async get(organizationId: string, classId: string, query: QueryParams) {
		return await this.repository(organizationId, classId).get(query)
	}

	async markRead(input: { organizationId: string; classId: string; userId: string }) {
		return await this.repository(input.organizationId, input.classId).markRead(input.userId)
	}
}
