import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { Game, GameParticipantAnswer, Test } from '../types/domains/plays'
import { AddQuestionAnswer, CreateGameInput } from '../types/forms/plays'
import Common from './Common'
import { CoursableAccess, QuestionEntity } from '@modules/study'

export default class Plays extends Common {
	constructor() {
		super()
	}

	// Form input
	public AnswerGameQuestionForm: AddQuestionAnswer | undefined

	public GetTests = (filters: QueryParams) => $api.plays.test.fetch(filters).then((response) => response.data as Paginated<Test>)

	public GetTest = async (id: string) => {
		const response = await $api.plays.test.get(id)
		return response.data as Test | null
	}

	public GetGames = (filters: QueryParams) => $api.plays.game.fetch(filters).then((response) => response.data as Paginated<Game>)

	public GetGameAnswers = (gameId: string, filters: QueryParams) =>
		$api.plays.game.getGameAnswers(gameId, filters).then((response) => response.data as Paginated<GameParticipantAnswer>)

	public GetTestAnswers = (testId: string, filters: QueryParams) =>
		$api.plays.test.getTestAnswers(testId, filters).then((response) => response.data as Paginated<GameParticipantAnswer>)

	public GetGame = async (id: string) => {
		const response = await $api.plays.game.get(id)
		return response.data as Game | null
	}

	public GetParticipantAnswer = (gameId: string, participantId: string) =>
		$api.plays.game.getParticipantAnswer(gameId, participantId).then((response) => response.data as GameParticipantAnswer)

	public GetGameQuestions = (gameId: string) =>
		$api.plays.game.getGameQuestions(gameId).then((response) => response.data.map((i: any) => new QuestionEntity(i)))

	public GetTestQuestions = (testId: string) =>
		$api.plays.test.getTestQuestions(testId).then((response) => response.data.map((i: any) => new QuestionEntity(i)))

	public CreateGame = (CreateGameForm: CreateGameInput, access: CoursableAccess['access']) =>
		$api.plays.game
			.post(null, CreateGameForm, { access })
			.then((response) => response.data as Game)
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
				throw error
			})

	public CreateTest = (quizId: string, access: CoursableAccess['access']) =>
		$api.plays.test
			.post(null, { quizId }, { access })
			.then((response) => response.data as Test)
			.catch((error) => {
				Logic.Common.showError(capitalize(error.response.data[0]?.message))
				throw error
			})

	public JoinGame = (gameId: string, join: boolean) =>
		$api.plays.game
			.joinGame(gameId, { join })
			.then((response) => response.data as Game)
			.catch(() => null)

	public StartGame = (gameId: string) =>
		$api.plays.game
			.startGame(gameId)
			.then((response) => response.data as Game)
			.catch()

	public StartTest = (testId: string) => $api.plays.test.startTest(testId).then((response) => response.data as Test)

	public EndGame = (gameId: string) =>
		$api.plays.game
			.endGame(gameId)
			.then((response) => response.data as Game)
			.catch()

	public EndTest = (testId: string) =>
		$api.plays.test
			.endTest(testId)
			.then((response) => response.data as Test)
			.catch()

	public AnswerGameQuestion = (gameId: string, AnswerGameQuestionForm: AddQuestionAnswer) =>
		$api.plays.game.answerGameQuestion(gameId, AnswerGameQuestionForm).then((response) => response.data as GameParticipantAnswer)

	public AnswerTestQuestion = (testId: string, AnswerGameQuestionForm: AddQuestionAnswer) =>
		$api.plays.test.answerTestQuestion(testId, AnswerGameQuestionForm).then((response) => response.data as GameParticipantAnswer)

	public DeleteGame = (id: string) => $api.plays.game.delete(id).then().catch()
}
