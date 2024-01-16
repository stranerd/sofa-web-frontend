import { AnnouncementToModel } from '../../data/models/announcements'
import { IAnnouncementRepository } from '../irepositories/announcements'

export class AnnouncementsUseCase {
	private repository: (organizationId: string, classId: string) => IAnnouncementRepository

	constructor(repository: (organizationId: string, classId: string) => IAnnouncementRepository) {
		this.repository = repository
	}

	async add(organizationId: string, classId: string, data: AnnouncementToModel) {
		return await this.repository(organizationId, classId).add(data)
	}

	async find(organizationId: string, classId: string, id: string) {
		return await this.repository(organizationId, classId).find(id)
	}

	async markRead(input: { organizationId: string; classId: string; userId: string }) {
		return await this.repository(input.organizationId, input.classId).markRead(input.userId)
	}
}
