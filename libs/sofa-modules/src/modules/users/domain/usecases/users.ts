import { IUserRepository } from '../irepositories/iusers'

export class UsersUseCase {
	private repository: () => IUserRepository

	constructor (repository: () => IUserRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository().find(id)
	}
}
