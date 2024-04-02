import { IPushRepository } from '../irepositories/push'

export class PushUseCase {
	private repository: IPushRepository

	constructor(repository: () => IPushRepository) {
		this.repository = repository()
	}
}
