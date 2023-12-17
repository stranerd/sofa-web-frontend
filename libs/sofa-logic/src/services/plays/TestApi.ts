import { AxiosResponse } from 'axios'
import { ModelApiService } from '../common/ModelService'
import { Question } from '../../logic/types/domains/study'
import { GameParticipantAnswer, Test } from '../../logic/types/domains/plays'
import { AddQuestionAnswer } from '../../logic/types/forms/plays'
import { Paginated, QueryParams } from '../../logic'

export default class TestApi extends ModelApiService {
	constructor() {
		super('plays/tests')
	}

	public async getTestQuestions(testId: string) {
		try {
			const response: AxiosResponse<Question[]> = await this.axiosInstance.get(
				this.getUrl() + `/${testId}/questions`,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getTestAnswers(testId: string, filters: QueryParams) {
		try {
			const response: AxiosResponse<Paginated<GameParticipantAnswer>> = await this.axiosInstance.get(this.getUrl() + `/${testId}/answers`, {
				params: filters,
			})

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async startTest(testId: string) {
		try {
			const response: AxiosResponse<Test> = await this.axiosInstance.post(
				this.getUrl() + `/${testId}/start`,
			)
			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async endTest(testId: string) {
		try {
			const response: AxiosResponse<Test> = await this.axiosInstance.post(
				this.getUrl() + `/${testId}/end`,
			)
			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async answerTestQuestion(testId: string, data: AddQuestionAnswer) {
		try {
			const response: AxiosResponse<GameParticipantAnswer> = await this.axiosInstance.post(
				this.getUrl() + `/${testId}/answers`,
				data,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
