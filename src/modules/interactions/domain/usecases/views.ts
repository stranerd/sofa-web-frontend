import { ViewEntity } from '../entities/views'
import { IViewRepository } from '../irepositories/views'
import { Interaction } from '../types'
import { Listeners } from '@modules/core'

export class ViewsUseCase {
	private repository: IViewRepository

	constructor(repository: () => IViewRepository) {
		this.repository = repository()
	}

	async add(entity: Interaction) {
		return await this.repository.add({ entity })
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listener: Listeners<ViewEntity>) {
		return await this.repository.listenToOne(id, listener)
	}
}
