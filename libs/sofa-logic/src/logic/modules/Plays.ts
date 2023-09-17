import { $api } from '../../services'
import Common from './Common'
import { Logic } from '..'
import { Paginated } from '../types/domains/common'
import { Game, GameParticipantAnswer, Test } from '../types/domains/plays'
import { Conditions, QueryParams } from '../types/common'
import { Question } from '../types/domains/study'
import { AddQuestionAnswer, CreateGameInput } from '../types/forms/plays'
import { SingleUser } from '../types/domains/users'

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

  // Form input
  public CreateGameForm: CreateGameInput | undefined
  public AnswerGameQuestionForm: AddQuestionAnswer | undefined

  public GetTests = (filters: QueryParams) => {
    return $api.plays.test.fetch(filters).then((response) => {
      this.AllTests = response.data
    })
  }

  public GetTest = (id: string | undefined) => {
    if (!id) {
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
            if (this.SingleTest.status == 'started') {
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
    })
  }

  public GetGame = (id: string | undefined) => {
    if (!id) {
      return new Promise((resolve) => {
        resolve('')
      })
    } else {
      return new Promise((resolve) => {
        $api.plays.game
          .get(id)
          .then((response) => {
            this.SingleGame = response.data

            const getParticipants = (resolve: any) => {
              if (Logic.Auth.AuthUser?.id != this.SingleGame.user.id) {
                // join game
                if (
                  !this.GameParticipants.filter(
                    (item) => item.id == Logic.Auth.AuthUser?.id,
                  ).length
                ) {
                  Logic.Plays.JoinGame(this.SingleGame.id, true).then(
                    (data) => {
                      if (data) {
                        Logic.Plays.GetGame(this.SingleGame.id)
                        resolve('')
                      }
                    },
                  )
                } else {
                  resolve('')
                }
              } else {
                resolve('')
              }
            }
            // get participants
            Logic.Users.GetUsers({
              where: [
                {
                  field: 'id',
                  value: this.SingleGame.participants,
                  condition: Conditions.in,
                },
              ],
            }).then((data) => {
              this.GameParticipants = data
              this.GetQuizQuestions(this.SingleGame.id)
                .then(() => {
                  getParticipants(resolve)
                })
                .catch(() => {
                  getParticipants(resolve)
                })
            })
          })
          .catch((error) => {
            throw error
          })
      })
    }
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
    })
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
          throw error
        })
    }
  }

  public JoinGame = (gameId: string, join: boolean) => {
    return $api.plays.game
      .joinGame(gameId, { join })
      .then((response) => {
        this.SingleGame = response.data
        return response.data
      })
      .catch((error) => {
        //
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

  public AnswerGameQuestion = (gameId: string) => {
    if (this.AnswerGameQuestionForm) {
      return $api.plays.game
        .answerGameQuestion(gameId, this.AnswerGameQuestionForm)
        .then((response) => {
          this.ParticipantAnswer = response.data
        })
        .catch((error) => {
          //
        })
    }
  }

  public AnswerTestQuestion = (testId: string) => {
    if (this.AnswerGameQuestionForm) {
      return $api.plays.test
        .answerTestQuestion(testId, this.AnswerGameQuestionForm)
        .then((response) => {
          this.ParticipantAnswer = response.data
        })
        .catch((error) => {
          //
        })
    }
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
