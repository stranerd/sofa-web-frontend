import { UserEntity } from '../entities/users'
import { UserAiFactory } from '../factories/userAi'
import { UserLocationFactory } from '../factories/userLocation'
import { UserSocialsFactory } from '../factories/userSocials'
import { UserTypeFactory } from '../factories/userType'
import { IUserRepository } from '../irepositories/iusers'
import { UserAccount, UserType } from '../types'
import { Conditions, HttpClient, Listeners, QueryParams } from '@modules/core'

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

	async updateSavedClasses(data: { classes: string[]; add: boolean }) {
		return await this.repository.updateSavedClasses(data)
	}

	async getCountries() {
		const url = 'https://countriesnow.space/api/v0.1/countries/states'
		const res = await new HttpClient().get<object, { data: Country[] }>(url, {})
		return res.data
	}

	async getType(type: UserType, date?: number) {
		const query: QueryParams = {
			where: [{ field: 'type.type', value: type }],
			sort: [{ field: 'dates.createdAt', desc: true }],
			limit: $utils.constants.DEFAULT_PAGINATION_LIMIT,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.lt })
		return await this.repository.get(query)
	}

	async listenToType(listeners: Listeners<UserEntity>, type: UserType, date?: number) {
		const query: QueryParams = {
			where: [{ field: 'type.type', value: type }],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}
		if (date) query.where!.push({ field: 'createdAt', value: date, condition: Conditions.gte })
		return await this.repository.listenToMany(query, listeners, (entity) =>
			[entity.type?.type === type, date ? entity.dates.createdAt >= date : true].every(Boolean),
		)
	}

	async getAdmins() {
		const query: QueryParams = {
			where: [{ field: 'roles.isAdmin', value: true }],
			sort: [{ field: 'dates.createdAt', desc: true }],
			all: true,
		}
		return await this.repository.get(query)
	}

	async listenToAdmins(listeners: Listeners<UserEntity>) {
		const query: QueryParams = {
			where: [{ field: 'roles.isAdmin', value: true }],
			sort: [{ field: 'dates.createdAt', desc: true }],
			all: true,
		}
		return await this.repository.listenToMany(query, listeners, (entity) => entity.roles.isAdmin)
	}
}
