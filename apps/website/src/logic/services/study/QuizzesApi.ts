import { AxiosResponse } from 'axios'
import { Quiz } from '../../logic/types/domains/study'
import { ModelApiService } from '../common/ModelService'

export default class QuizzesApi extends ModelApiService {
	constructor() {
		super('study/quizzes')
	}

	public async similarQuizzes(quizId: string) {
		try {
			const response: AxiosResponse<Quiz[]> = await this.axiosInstance.get(this.getUrl() + `/${quizId}/similar`)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
