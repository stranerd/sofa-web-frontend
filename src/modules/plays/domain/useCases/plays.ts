import { PlayToModel } from '../../data/models/plays'
import { PlayEntity } from '../entities/plays'
import { IPlayRepository } from '../irepositories/plays'
import { PlayTypes } from '../types'
import { CoursableAccess } from '@modules/study'
import { Conditions, Listeners, QueryKeys } from '@modules/core'

export class PlaysUseCase {
	protected repository: IPlayRepository

	constructor(repository: IPlayRepository) {
		this.repository = repository
	}

	async create(data: PlayToModel, access: CoursableAccess['access']) {
		return await this.repository.create(data, access)
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
		return await this.repository.get({
			whereType: QueryKeys.or,
			where: [
				{
					condition: QueryKeys.and,
					value: [
						{ field: 'user.id', value: userId },
						{ field: 'data.type', condition: Conditions.ne, value: PlayTypes.tests },
					],
				},
				{ field: 'data.type', condition: Conditions.eq, value: PlayTypes.games },
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
							{ field: 'data.type', condition: Conditions.ne, value: PlayTypes.tests },
						],
					},
					{ field: 'data.type', condition: Conditions.eq, value: PlayTypes.games },
				],
				all: true,
			},
			listeners,
			(e) => !e.isTests() || e.user.id === userId,
		)
	}

	async getQuestions(id: string) {
		return await this.repository.getQuestions(id)
	}

	async join(id: string, data: { join: boolean }) {
		return await this.repository.join(id, data)
	}
}
