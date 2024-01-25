import { FileEntity } from '../entities/files'
import { IFileRepository } from '../irepositories/ifiles'
import { Conditions, Listeners } from '@modules/core'

export class FilesUseCase {
	private repository: IFileRepository

	constructor(repository: () => IFileRepository) {
		this.repository = repository()
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listener: Listeners<FileEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async getInList(ids: string[]) {
		const files = await this.repository.get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return files.results
	}

	async listenToInList(ids: () => string[], listener: Listeners<FileEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}
}
