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

	async find (id: string) {
		return await this.repository.find(id)
	}

	async get (query: QueryParams) {
		return await this.repository.get(query)
	}

	async markRead (input: { organizationId: string, classId: string, userId: string }) {
		return await this.repository.markRead(input.organizationId, input.classId, input.userId)
	}
}
