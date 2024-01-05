import { Conditions, HttpClient, Listeners, QueryParams } from '@modules/core'
import { UserEntity } from '../entities/users'
import { UserAiFactory } from '../factories/userAi'
import { UserLocationFactory } from '../factories/userLocation'
import { UserSocialsFactory } from '../factories/userSocials'
import { UserTypeFactory } from '../factories/userType'
import { IUserRepository } from '../irepositories/iusers'
import { UserAccount, UserType } from '../types'

interface Country {
	name: string
	iso2: string
	states: {
		name: string
		state_code: string
	}[]
}

export class UsersUseCase {
	private repository: IUserRepository

	constructor(repository: () => IUserRepository) {
		this.repository = repository()
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async getInEmails(emails: string[]) {
		const query: QueryParams = {
			where: [{ field: 'bio.email', condition: Conditions.in, value: emails }],
			all: true,
		}
		return (await this.repository.get(query)).results
	}

	async getAllTeachers() {
		return await this.repository.get({
			where: [{ field: 'type.type', value: UserType.teacher }],
			all: true,
		})
	}

	async listenToAllTeachers(listener: Listeners<UserEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'type.type', value: UserType.teacher }],
				all: true,
			},
			listener,
			(entity) => entity.userType.isTeacher,
		)
	}

	async getInList(ids: string[]) {
		const users = await this.repository.get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return users.results
	}

	async listenToOne(id: string, listeners: Listeners<UserEntity>) {
		return await this.repository.listenToOne(id, listeners)
	}

	async listenToInList(ids: () => string[], listener: Listeners<UserEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}

	async updateType(factory: UserTypeFactory) {
		return await this.repository.updateType(await factory.toModel())
	}

	async updateAi(factory: UserAiFactory) {
		return await this.repository.updateAi(await factory.toModel())
	}

	async updateOrgCode(value: { code: string }) {
		return await this.repository.updateOrgCode(value)
	}

	async updateLocation(factory: UserLocationFactory) {
		return await this.repository.updateLocation(await factory.toModel())
	}

	async updateSocials(factory: UserSocialsFactory) {
		return await this.repository.updateSocials(await factory.toModel())
	}

	async updateEditingQuizzes(quizzes: UserAccount['editing']['quizzes']) {
		return await this.repository.updateEditingQuizzes(quizzes)
	}

	async getCountries() {
		const url = 'https://countriesnow.space/api/v0.1/countries/states'
		const res = await new HttpClient().get<object, { data: Country[] }>(url, {})
		return res.data
	}
}
