import { TutorRequestEntity } from '../entities/tutorRequests'
import { TutorRequestFactory } from '../factories/tutorRequests'
import { ITutorRequestRepository } from '../irepositories/itutorRequests'
import { Listeners } from '@modules/core'

export class TutorRequestsUseCase {
	private repository: ITutorRequestRepository

	constructor(repository: () => ITutorRequestRepository) {
		this.repository = repository()
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listeners: Listeners<TutorRequestEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async create(factory: TutorRequestFactory) {
		return await this.repository.create(await factory.toModel())
	}
}
