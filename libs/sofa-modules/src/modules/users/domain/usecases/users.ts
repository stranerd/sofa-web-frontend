import { IUserRepository } from '../irepositories/iusers'

const searchFields = ['bio.firstName', 'bio.lastName', 'bio.fullName', 'bio.email']

export class UsersUseCase {
	private repository: () => IUserRepository

	constructor (repository: () => IUserRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository().find(id)
	}
}
