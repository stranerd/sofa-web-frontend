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
    })
  }

  public GetTest = (id: string | undefined) => {
    if (!id || id == 'nill') {
      return new Promise((resolve) => {
        resolve('')
      })
    } else {
      return new Promise((resolve) => {
        $api.plays.test
          .get(id)
          .then((response) => {
            this.SingleTest = response.data
            // get questions
            if (this.SingleTest?.status == 'started') {
              this.GetTestQuizQuestions(this.SingleTest.id).then(() => {
                resolve('')
              })
            } else {
              resolve('')
            }
          })
          .catch((error) => {
            throw error
          })
      })
    }
  }

  public GetGames = (filters: QueryParams) => {
    return $api.plays.game.fetch(filters).then((response) => {
      this.AllGames = response.data
    })
  }

  public GetGameAnswers = (gameId: string, filters: QueryParams) => {
    return $api.plays.game.getGameAnswers(gameId, filters).then((response) => {
      this.AllParticipantAnswers = response.data
      return this.AllParticipantAnswers
    })
  }

  public GetGame = async (id: string | undefined, skipExtras = false) => {
    if (!id || id == 'nill') return null

    const response = await $api.plays.game.get(id)
    this.SingleGame = response.data
    if (!this.SingleGame || skipExtras) return this.SingleGame

    this.GameParticipants = await Logic.Users.GetUsers({
      where: [
        {
          field: 'id',
          value: this.SingleGame.participants,
          condition: Conditions.in,
        },
      ],
    })

    await this.GetQuizQuestions(this.SingleGame.id)
    if (![...this.GameParticipants, this.SingleGame.user.id].includes(Logic.Auth.AuthUser?.id))
      await Logic.Plays.JoinGame(this.SingleGame.id, true)
        .then((data) => {
          this.SingleGame = data
        })

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

  public GetQuizQuestions = (gameId: string) => {
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
