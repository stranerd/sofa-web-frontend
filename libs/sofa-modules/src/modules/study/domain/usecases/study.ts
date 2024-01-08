import { IStudyRepository } from '../irepositories/istudy'
import { StudyKeys } from '../types'

export class StudyUseCase {
	private repository: IStudyRepository

	constructor(repository: () => IStudyRepository) {
		this.repository = repository()
	}

	async get(key: StudyKeys) {
		return await this.repository.get(key)
	}
}
