import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'
import { QuizEntity } from '@modules/study'
import { QuizFromModel } from '@modules/study/data/models/quizzes'

export default class QuizzesApi extends ModelApiService<QuizFromModel, QuizEntity> {
	constructor() {
		super('study/quizzes')
	}

	mapper = (data: QuizFromModel) => new QuizEntity(data)

	public async similarQuizzes(quizId: string) {
		try {
			const response: AxiosResponse<QuizFromModel[]> = await this.axiosInstance.get(this.getUrl() + `/${quizId}/similar`)

			return {
				...response,
				data: response.data.map(this.mapper),
			}
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
