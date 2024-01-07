import { Listeners, QueryParams } from '@modules/core'
import { FolderFromModel } from '../../data/models/folders'
import { FolderEntity } from '../entities/folders'
import { FolderFactory } from '../factories/folders'
import { IFolderRepository } from '../irepositories/ifolders'

export class FoldersUseCase {
	private repository: IFolderRepository

	constructor(repository: () => IFolderRepository) {
		this.repository = repository()
	}

	async add(factory: FolderFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async updateProp(folderId: string, type: keyof FolderFromModel['saved'], values: string[], add: boolean) {
		return await this.repository.updateProp(folderId, { type, values, add })
	}

	async update(id: string, factory: FolderFactory) {
		return await this.repository.update(id, await factory.toModel())
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async getUserFolders(userId: string) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
		}

		return await this.repository.get(conditions)
	}

	async listenToOne(id: string, listener: Listeners<FolderEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async listenToUserFolders(userId: string, listener: Listeners<FolderEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			return entity.user.id === userId
		})
	}
}
