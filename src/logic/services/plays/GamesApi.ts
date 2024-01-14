import { AxiosResponse } from 'axios'
import { QueryParams } from '../../logic/types/common'
import { Paginated } from '../../logic/types/domains/common'
import { Game, GameParticipantAnswer } from '../../logic/types/domains/plays'
import { AddQuestionAnswer } from '../../logic/types/forms/plays'
import { ModelApiService } from '../common/ModelService'

export default class GamesApi extends ModelApiService {
	constructor() {
		super('plays/games')
	}

	public async getParticipantAnswer(gameId: string, participantId: string) {
		try {
			const response: AxiosResponse<GameParticipantAnswer> = await this.axiosInstance.get(
				this.getUrl() + `/${gameId}/answers/${participantId}`,
			)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async getGameAnswers(gameId: string, filters: QueryParams) {
		try {
			const response: AxiosResponse<Paginated<GameParticipantAnswer>> = await this.axiosInstance.get(
				this.getUrl() + `/${gameId}/answers`,
				{
					params: filters,
				},
			)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async getGameQuestions(gameId: string) {
		try {
			const response = await this.axiosInstance.get(this.getUrl() + `/${gameId}/questions`)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async joinGame(
		gameId: string,
		data: {
			join: boolean
		},
	) {
		try {
			const response: AxiosResponse<Game> = await this.axiosInstance.post(this.getUrl() + `/${gameId}/join`, data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async startGame(gameId: string) {
		try {
			const response: AxiosResponse<Game> = await this.axiosInstance.post(this.getUrl() + `/${gameId}/start`)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async endGame(gameId: string) {
		try {
			const response: AxiosResponse<Game> = await this.axiosInstance.post(this.getUrl() + `/${gameId}/end`)
			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}

	public async answerGameQuestion(gameId: string, data: AddQuestionAnswer) {
		try {
			const response: AxiosResponse<GameParticipantAnswer> = await this.axiosInstance.post(this.getUrl() + `/${gameId}/answers`, data)

			return response
		} catch (err) {
			this.handleErrors(err)
		}
	}
}
