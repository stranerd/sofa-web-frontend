import { QueryParams } from '@modules/core'
import { AnnouncementToModel } from '../../data/models/announcements'
import { IAnnouncementRepository } from '../irepositories/announcements'

export class AnnouncementsUseCase {
	private repository: IAnnouncementRepository

	constructor (repository: IAnnouncementRepository) {
		this.repository = repository
	}

	async add (data: AnnouncementToModel) {
		return await this.repository.add(data)
	}

	async find (organizationId: string, classId: string, id: string) {
		return await this.repository.find(organizationId, classId, id)
	}

	async get (organizationId: string, classId: string, query: QueryParams) {
		return await this.repository.get(organizationId, classId, query)
	}

	async markRead (input: { organizationId: string, classId: string, userId: string }) {
		return await this.repository.markRead(input.organizationId, input.classId, input.userId)
	}
}
