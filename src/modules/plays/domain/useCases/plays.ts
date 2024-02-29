import { PlayEntity } from '../entities/plays'
import { PlayFactory } from '../factories/plays'
import { IPlayRepository } from '../irepositories/plays'
import { PlayTypes } from '../types'
import { CoursableAccess } from '@modules/study'
import { Conditions, Listeners, QueryKeys } from '@modules/core'

export class PlaysUseCase {
	protected repository: IPlayRepository

	constructor(repository: IPlayRepository) {
		this.repository = repository
	}

	async create(factory: PlayFactory, access: CoursableAccess['access']) {
		return await this.repository.create(await factory.toModel(), access)
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async start(id: string) {
		return await this.repository.start(id)
	}

	async end(id: string) {
		return await this.repository.end(id)
	}

	async listenToOne(playId: string, listeners: Listeners<PlayEntity>) {
		return await this.repository.listenToOne(playId, listeners)
	}

	async getMine(userId: string) {
		// TODO: implement pagination
		return await this.repository.get({
			whereType: QueryKeys.or,
			where: [
				{
					condition: QueryKeys.and,
					value: [
						{ field: 'user.id', value: userId },
						{ field: 'data.type', value: PlayTypes.tests },
					],
				},
				{ field: 'data.type', condition: Conditions.in, value: [PlayTypes.games, PlayTypes.assessments] },
			],
			all: true,
		})
	}

	async listenToMine(userId: string, listeners: Listeners<PlayEntity>) {
		return await this.repository.listenToMany(
			{
				whereType: QueryKeys.or,
				where: [
					{
						condition: QueryKeys.and,
						value: [
							{ field: 'user.id', value: userId },
							{ field: 'data.type', value: PlayTypes.tests },
						],
					},
					{ field: 'data.type', condition: Conditions.in, value: [PlayTypes.games, PlayTypes.assessments] },
				],
				all: true,
			},
			listeners,
			(e) => e.isGames() || e.isAssessments() || e.user.id === userId,
		)
	}

	async getQuestions(id: string) {
		return await this.repository.getQuestions(id)
	}

	async join(id: string, data: { join: boolean }) {
		return await this.repository.join(id, data)
	}
}
