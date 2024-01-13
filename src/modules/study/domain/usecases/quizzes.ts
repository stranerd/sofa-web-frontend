import { Conditions, Listeners, QueryParams } from '@modules/core'
import { QuizEntity } from '../entities/quizzes'
import { QuizFactory } from '../factories/quizzes'
import { IQuizRepository } from '../irepositories/iquizzes'

export class QuizzesUseCase {
	private repository: IQuizRepository

	constructor(repository: () => IQuizRepository) {
		this.repository = repository()
	}

	async add(factory: QuizFactory) {
		return await this.repository.add(await factory.toModel())
	}

	async delete(id: string) {
		return await this.repository.delete(id)
	}

	async update(id: string, factory: QuizFactory) {
		return await this.repository.update(id, await factory.toModel())
	}

	async find(id: string) {
		return await this.repository.find(id)
	}

	async reorder(id: string, questions: string[]) {
		return await this.repository.reorder(id, questions)
	}

	async publish(id: string) {
		return await this.repository.publish(id)
	}

	async getUserQuizzes(userId: string) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
		}

		return await this.repository.get(conditions)
	}

	async listenToOne(id: string, listener: Listeners<QuizEntity>) {
		return await this.repository.listenToOne(id, listener)
	}

	async listenToUserQuizzes(userId: string, listener: Listeners<QuizEntity>) {
		const conditions: QueryParams = {
			where: [{ field: 'user.id', value: userId }],
			all: true,
		}

		return await this.repository.listenToMany(conditions, listener, (entity) => {
			return entity.user.id === userId
		})
	}

	async getInList(ids: string[]) {
		const quizzes = await this.repository.get({
			where: [{ field: 'id', value: ids, condition: Conditions.in }],
			all: true,
		})
		return quizzes.results
	}

	async listenToInList(ids: () => string[], listener: Listeners<QuizEntity>) {
		return await this.repository.listenToMany(
			{
				where: [{ field: 'id', value: ids(), condition: Conditions.in }],
				all: true,
			},
			listener,
			(entity) => ids().includes(entity.id),
		)
	}

	async getTutorQuizzes(userId: string) {
		return await this.repository.getTutors({
			where: [{ field: 'user.id', value: userId }],
			all: true,
		})
	}

	async listenToTutorQuizzes(userId: string, listener: Listeners<QuizEntity>) {
		return await this.repository.listenToManyTutors(
			{
				where: [{ field: 'user.id', value: userId }],
				all: true,
			},
			listener,
			(quiz) => quiz.user.id === userId,
		)
	}

	async requestAccess(id: string, add: boolean) {
		return await this.repository.requestAccess(id, { add })
	}

	public async grantAccess(id: string, userId: string, grant: boolean) {
		return await this.repository.grantAccess(id, { userId, grant })
	}

	public async addMembers(id: string, userIds: string[], grant: boolean) {
		return await this.repository.addMembers(id, { userIds, grant })
	}
}
