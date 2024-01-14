import { Listeners } from '@modules/core'
import { ReportEntity } from '../entities/reports'
import { ReportFactory } from '../factories/reports'
import { IReportRepository } from '../irepositories/reports'
import { Interaction } from '../types'

export class ReportsUseCase {
	private repository: IReportRepository

	constructor(repository: () => IReportRepository) {
		this.repository = repository()
	}

	async add(entity: Interaction, factory: ReportFactory) {
		const data = await factory.toModel()
		return await this.repository.add({ ...data, entity })
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async listenToOne(id: string, listener: Listeners<ReportEntity>) {
		return await this.repository.listenToOne(id, listener)
	}
}
