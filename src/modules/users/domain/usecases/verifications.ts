import { VerificationEntity } from '../entities/verifications'
import { VerificationFactory } from '../factories/verifications'
import { IVerificationRepository } from '../irepositories/iverifications'
import { Listeners } from '@modules/core'

export class VerificationsUseCase {
	private repository: IVerificationRepository

	constructor(repository: () => IVerificationRepository) {
		this.repository = repository()
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listeners: Listeners<VerificationEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async create(factory: VerificationFactory) {
		return await this.repository.create(await factory.toModel())
	}
}
