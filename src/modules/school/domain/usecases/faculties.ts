import { QueryParams } from '@modules/core'
import { FacultyFactory } from '../factories/faculties'
import { IFacultyRepository } from '../irepositories/ifaculties'

export class FacultiesUseCase {
	private repository: IFacultyRepository

	constructor(repository: () => IFacultyRepository) {
		this.repository = repository()
	}

	async add(factory: FacultyFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async update(id: string, factory: FacultyFactory) {
		return await this.repository.update(id, await factory.toModel())
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async getInstitutionFaculties(institutionId: string) {
		const conditions: QueryParams = {
			where: [{ field: 'institutionId', value: institutionId }],
			sort: [{ field: 'createdAt', desc: true }],
			all: true,
		}

		return await this.repository.get(conditions)
	}
}
