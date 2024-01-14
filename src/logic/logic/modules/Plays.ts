import { QuestionEntity } from '@modules/study'
import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { Game, GameParticipantAnswer, Test } from '../types/domains/plays'
import { AddQuestionAnswer, CreateGameInput } from '../types/forms/plays'
import Common from './Common'

export default class Plays extends Common {
	constructor() {
		super()
	}

	// Form input
	public CreateGameForm: CreateGameInput | undefined
	public AnswerGameQuestionForm: AddQuestionAnswer | undefined

	public GetTests = (filters: QueryParams) => {
		return $api.plays.test.fetch(filters).then((response) => {
			return response.data as Paginated<Test>
		})
	}

	public GetTest = async (id: string) => {
		const response = await $api.plays.test.get(id)
		return response.data as Test | null
	}

	public GetGames = (filters: QueryParams) => {
		return $api.plays.game.fetch(filters).then((response) => {
			return response.data as Paginated<Game>
		})
	}

	public GetGameAnswers = (gameId: string, filters: QueryParams) => {
		return $api.plays.game.getGameAnswers(gameId, filters).then((response) => {
			return response.data as Paginated<GameParticipantAnswer>
		})
	}

	public GetTestAnswers = (testId: string, filters: QueryParams) => {
		return $api.plays.test.getTestAnswers(testId, filters).then((response) => {
			return response.data as Paginated<GameParticipantAnswer>
		})
	}

	public GetGame = async (id: string) => {
		const response = await $api.plays.game.get(id)
		return response.data as Game | null
	}

	public GetParticipantAnswer = (gameId: string, participantId: string) => {
		return $api.plays.game.getParticipantAnswer(gameId, participantId).then((response) => {
			return response.data as GameParticipantAnswer
		})
	}

	public GetGameQuestions = (gameId: string) => {
		return $api.plays.game.getGameQuestions(gameId).then((response) => {
			return response.data.map((i: any) => new QuestionEntity(i))
		})
	}

	public GetTestQuestions = (testId: string) => {
		return $api.plays.test.getTestQuestions(testId).then((response) => {
			return response.data.map((i: any) => new QuestionEntity(i))
		})
	}

	public CreateGame = (formIsValid: boolean) => {
		if (formIsValid && this.CreateGameForm) {
			return $api.plays.game
				.post(null, this.CreateGameForm)
				.then((response) => {
					return response.data as Game
				})
				.catch((error) => {
					Logic.Common.showError(capitalize(error.response.data[0]?.message))
					throw error
				})
		}
	}

	public CreateTest = (quizId: string) => {
		return $api.plays.test
			.post(null, { quizId })
			.then((response) => {
				return response.data as Test
			})
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
				throw error
			})
	}

	public JoinGame = (gameId: string, join: boolean) => {
		return $api.plays.game
			.joinGame(gameId, { join })
			.then((response) => {
				return response.data as Game
			})
			.catch(() => {
				return null
			})
	}

	public StartGame = (gameId: string) => {
		return $api.plays.game
			.startGame(gameId)
			.then((response) => {
				return response.data as Game
			})
			.catch()
	}

	public StartTest = (testId: string) => {
		return $api.plays.test.startTest(testId).then((response) => {
			return response.data as Test
		})
	}

	public EndGame = (gameId: string) => {
		return $api.plays.game
			.endGame(gameId)
			.then((response) => {
				return response.data as Game
			})
			.catch()
	}

	public EndTest = (testId: string) => {
		return $api.plays.test
			.endTest(testId)
			.then((response) => {
				return response.data as Test
			})
			.catch()
	}

	public AnswerGameQuestion = (gameId: string, AnswerGameQuestionForm: AddQuestionAnswer) => {
		return $api.plays.game.answerGameQuestion(gameId, AnswerGameQuestionForm).then((response) => {
			return response.data as GameParticipantAnswer
		})
	}

	public AnswerTestQuestion = (testId: string, AnswerGameQuestionForm: AddQuestionAnswer) => {
		return $api.plays.test.answerTestQuestion(testId, AnswerGameQuestionForm).then((response) => {
			return response.data as GameParticipantAnswer
		})
	}

	public DeleteGame = (id: string) => {
		return $api.plays.game.delete(id).then().catch()
	}
}
