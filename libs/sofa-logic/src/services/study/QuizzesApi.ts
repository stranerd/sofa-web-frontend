import { AxiosResponse } from 'axios'
import { Paginated, QueryParams } from '../../logic/types'
import { Question, Quiz } from '../../logic/types/domains/study'
import { CreateQuestionInput, ReorderQuizInput } from '../../logic/types/forms/study'
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

	public async tutorQuizzes(filters: QueryParams) {
		try {
			const response: AxiosResponse<Paginated<Quiz>> = await this.axiosInstance.get(this.getUrl() + '/tutors', {
				params: filters,
			})

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getQuestions(quizId: string, filters: QueryParams) {
		try {
			const response: AxiosResponse<Paginated<Question>> = await this.axiosInstance.get(this.getUrl() + `/${quizId}/questions`, {
				params: filters,
			})

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async getQuestion(quizId: string, questionId: string) {
		try {
			const response: AxiosResponse<Question> = await this.axiosInstance.get(this.getUrl() + `/${quizId}/questions/${questionId}`)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async createQuestion(quizId: string, data: CreateQuestionInput) {
		try {
			const response: AxiosResponse<Question> = await this.axiosInstance.post(this.getUrl() + `/${quizId}/questions`, data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async publishQuiz(quizId: string) {
		try {
			const response: AxiosResponse<Quiz> = await this.axiosInstance.post(this.getUrl() + `/${quizId}/publish`)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async reorderQuiz(quizId: string, data: ReorderQuizInput) {
		try {
			const response: AxiosResponse<Quiz> = await this.axiosInstance.post(this.getUrl() + `/${quizId}/reorder`, data)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async updateQuestion(quizId: string, questionId, data: CreateQuestionInput) {
		try {
			const response: AxiosResponse<Question> = await this.axiosInstance.put(
				this.getUrl() + `/${quizId}/questions/${questionId}`,
				data,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async deleteQuestion(quizId: string, questionId: string) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.delete(this.getUrl() + `/${quizId}/questions/${questionId}`)

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async requestAccess(quizId, add: boolean) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.post(this.getUrl(quizId) + '/access/request', { add })

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async grantAccess(quizId, userId: string, grant: boolean) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.post(this.getUrl(quizId) + '/access/grant', { userId, grant })

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}

	public async manageMembers(quizId, userIds: string[], grant: boolean) {
		try {
			const response: AxiosResponse<boolean> = await this.axiosInstance.post(this.getUrl(quizId) + '/access/members/manage', {
				userIds,
				grant,
			})

			return response
		} catch (err) {
			this.handleErrors(err)
			if (err.response) {
			}
		}
	}
}
