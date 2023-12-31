import { UserAiFactory } from '../factories/userAi'
import { UserLocationFactory } from '../factories/userLocation'
import { UserSocialsFactory } from '../factories/userSocials'
import { UserTypeFactory } from '../factories/userType'
import { IUserRepository } from '../irepositories/iusers'
import { UserAccount } from '../types'

export class UsersUseCase {
	private repository: () => IUserRepository

	constructor (repository: () => IUserRepository) {
		this.repository = repository
	}

	async find (id: string) {
		return await this.repository().find(id)
	}

	async updateType (factory: UserTypeFactory) {
		return await this.repository().updateType(await factory.toModel())
	}

	async updateAi (factory: UserAiFactory) {
		return await this.repository().updateAi(await factory.toModel())
	}

	async updateOrgCode (value: { code: string }) {
		return await this.repository().updateOrgCode(value)
	}

	async updateLocation (factory: UserLocationFactory) {
		return await this.repository().updateLocation(await factory.toModel())
	}

	async updateSocials (factory: UserSocialsFactory) {
		return await this.repository().updateSocials(await factory.toModel())
	}

	async updateEditingQuizzes (quizzes: UserAccount['editing']['quizzes']) {
		return await this.repository().updateEditingQuizzes(quizzes)
	}
}
