import { Listeners } from '@modules/core'
import { FileEntity } from '../entities/files'
import { IFileRepository } from '../irepositories/ifiles'

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
}
