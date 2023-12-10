import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { Conditions, QueryParams } from '../types/common'
import { Paginated } from '../types/domains/common'
import { Game, GameParticipantAnswer, Test } from '../types/domains/plays'
import { Question, Quiz } from '../types/domains/study'
import { SingleUser } from '../types/domains/users'
import { AddQuestionAnswer, CreateGameInput } from '../types/forms/plays'
import Common from './Common'

export default class Plays extends Common {
  constructor() {
    super()
  }

  public AllGames: Paginated<Game> | undefined
  public SingleGame: Game | undefined
  public AllParticipantAnswers: Paginated<GameParticipantAnswer> | undefined
  public ParticipantAnswer: GameParticipantAnswer | undefined
  public GameQuestions: Question[] | undefined
  public GameParticipants: SingleUser[] | undefined
  public AllTests: Paginated<Test> | undefined
  public SingleTest: Test | undefined
  public GameAndTestQuizzes: Paginated<Quiz> | undefined

  // Form input
  public CreateGameForm: CreateGameInput | undefined
  public AnswerGameQuestionForm: AddQuestionAnswer | undefined

  public GetTests = (filters: QueryParams) => {
    return $api.plays.test.fetch(filters).then((response) => {
      this.AllTests = response.data
      return this.AllTests
    })
  }

  public GetTest = async (id: string | undefined, skipExtras = false) => {
    if (!id || id == 'nill') return null
    const response = await $api.plays.test.get(id)
    this.SingleTest = response.data
    if (!this.SingleTest || skipExtras) return this.SingleTest

    if (this.SingleTest?.status == 'started') await this.GetTestQuizQuestions(this.SingleTest.id)

    return this.SingleTest
  }

  public GetGames = (filters: QueryParams) => {
    return $api.plays.game.fetch(filters).then((response) => {
      this.AllGames = response.data
      return this.AllGames
    })
  }

  public GetGameAnswers = (gameId: string, filters: QueryParams) => {
    return $api.plays.game.getGameAnswers(gameId, filters).then((response) => {
      this.AllParticipantAnswers = response.data
      return this.AllParticipantAnswers
    })
  }

  public GetTestAnswers = (testId: string, filters: QueryParams) => {
    return $api.plays.test.getTestAnswers(testId, filters).then((response) => {
      this.AllParticipantAnswers = response.data
      return this.AllParticipantAnswers
    })
  }

  public GetGame = async (id: string | undefined) => {
    const response = await $api.plays.game.get(id)
    this.SingleGame = response.data
    return this.SingleGame
  }

  public GetParticipantAnswer = (gameId: string, participantId: string) => {
    return $api.plays.game
      .getParticipantAnswer(gameId, participantId)
      .then((response) => {
        this.ParticipantAnswer = response.data
      })
  }

  public GetTestQuizQuestions = (testId: string) => {
    return $api.plays.test.getTestQuestions(testId).then((response) => {
      Logic.Study.AllQuestions = {
        results: response.data,
        docs: {
          count: response.data.length,
          limit: 0,
          total: response.data.length,
        },
        pages: {
          current: 1,
          last: 1,
          start: 1,
        },
      }
    })
  }

  public GetGameQuestions = (gameId: string) => {
    return $api.plays.game.getGameQuestions(gameId).then((response) => {
      Logic.Study.AllQuestions = {
        results: response.data,
        docs: {
          count: response.data.length,
          limit: 0,
          total: response.data.length,
        },
        pages: {
          current: 1,
          last: 1,
          start: 1,
        },
      }
      return response.data
    })
  }

  public GetTestQuestions = (testId: string) => {
    return $api.plays.test.getTestQuestions(testId).then((response) => {
      Logic.Study.AllQuestions = {
        results: response.data,
        docs: {
          count: response.data.length,
          limit: 0,
          total: response.data.length,
        },
        pages: {
          current: 1,
          last: 1,
          start: 1,
        },
      }
      return response.data
    })
  }

  public GetGameAndTestQuizzes = async () => {
    if (this.GameAndTestQuizzes == undefined) {
      const allQuizIds = []

      allQuizIds.push(...this.AllGames.results.map((item) => item.quizId))
      allQuizIds.push(...this.AllTests.results.map((item) => item.quizId))

      const uniqueItems = [...new Set(allQuizIds)]

      const response = await $api.study.quiz.fetch({
        where: [
          {
            field: 'id',
            condition: Conditions.in,
            value: uniqueItems,
          },
        ],
      })

      this.GameAndTestQuizzes = response.data
    }
  }

  public CreateGame = (formIsValid: boolean) => {
    if (formIsValid && this.CreateGameForm) {
      return $api.plays.game
        .post(null, this.CreateGameForm)
        .then((response) => {
          this.SingleGame = response.data
          return response.data
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
        this.SingleTest = response.data
        return response.data
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
        this.SingleGame = response.data
        return response.data
      })
      .catch((error) => {
        return null
      })
  }

  public StartGame = (gameId: string) => {
    return $api.plays.game
      .startGame(gameId)
      .then((response) => {
        this.SingleGame = response.data
        return response.data
      })
      .catch((error) => {
        //
      })
  }

  public StartTest = (testId: string) => {
    return $api.plays.test
      .startTest(testId)
      .then((response) => {
        this.SingleTest = response.data
        return response.data
      })
  }

  public EndGame = (gameId: string) => {
    return $api.plays.game
      .endGame(gameId)
      .then((response) => {
        this.SingleGame = response.data
        return response.data
      })
      .catch((error) => {
        //
      })
  }

  public EndTest = (testId: string) => {
    return $api.plays.test
      .endTest(testId)
      .then((response) => {
        this.SingleTest = response.data
        return response.data
      })
      .catch((error) => {
        //
      })
  }

  public AnswerGameQuestion = (gameId: string, AnswerGameQuestionForm: AddQuestionAnswer) => {
    return $api.plays.game
      .answerGameQuestion(gameId, AnswerGameQuestionForm)
      .then((response) => {
        this.ParticipantAnswer = response.data
        return this.ParticipantAnswer
      })
  }

  public AnswerTestQuestion = (testId: string, AnswerGameQuestionForm: AddQuestionAnswer) => {
    return $api.plays.test
      .answerTestQuestion(testId, AnswerGameQuestionForm)
      .then((response) => {
        this.ParticipantAnswer = response.data
        return this.ParticipantAnswer
      })
  }

  public DeleteGame = (id: string) => {
    return $api.plays.game
      .delete(id)
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }
}
