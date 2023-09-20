import { trim } from 'lodash'
import { Logic } from 'sofa-logic'
import { QuizQuestion } from 'sofa-logic/src/logic/types/domains/study'
import { SingleUser } from 'sofa-logic/src/logic/types/domains/users'
import { reactive, ref } from 'vue'

const questions = reactive<QuizQuestion[]>([])

const selectedQuizId = ref('')

const specialQuestionTypes = ['match', 'sequence', 'drag']

const selectedQuizMode = ref('')

const userIsParticipating = ref(true)

const currentPrepareCount = ref(0)

const isRestart = ref(false)

const scoreBoardParticipants = reactive<
  {
    score: number
    user: SingleUser
  }[]
>([])

const quizSettingsForm = reactive({
  description: '',
  tags: [],
  title: '',
  topic: '',
  photo: undefined,
  visibility: '',
  tagString: '',
})

const allQuestionAnswers = reactive<
  {
    index: number
    value: string
  }[]
>([])

const mode = ref('preview')

const state = ref('preview')

const buttonLabels = reactive({
  left: {
    label: 'Skip',
    bgColor: 'bg-white border-[1px] border-gray-100',
    textColor: 'text-grayColor',
  },
  right: {
    label: 'Skip',
    bgColor: 'bg-primaryBlue',
    textColor: 'text-white',
  },
  smIsDoubled: false,
})

const infoModalData = reactive({
  title: '',
  sub: '',
})

const showInfoModal = ref(false)

const answerState = ref('')

const enabledSwiper = ref(true)

const swiperInstance = ref<any>()

const swiperKey = ref(Math.random() * 100000)

const currentQuestionIndex = ref(0)

const questionIndex = ref(0)

const SingleQuiz = ref(Logic.Study.SingleQuiz)
const AllQuestions = ref(Logic.Study.AllQuestions)
const SingleGame = ref(Logic.Plays.SingleGame)
const SingleTest = ref(Logic.Plays.SingleTest)
const GameParticipants = ref(Logic.Plays.GameParticipants)

const mobileTitle = ref('')

const counterInterval = ref()

const otherTasks = [
  {
    title: 'Practice',
    subTitle: 'Interactive and comfortable learning',
    icon: 'learn-quiz',
    iconSize: 'h-[46px]',
    key: 'practice',
  },
  {
    title: 'Test',
    subTitle: 'Evaluate your level of knowledge',
    icon: 'test',
    iconSize: 'h-[46px]',
    key: 'test',
  },
  {
    title: 'Flashcards',
    subTitle: 'Digital cards to memorize answers',
    icon: 'study-flashcard',
    iconSize: 'h-[46px]',
    key: 'flashcard',
  },
  {
    title: 'Game',
    subTitle: 'Battle friends for the highest score',
    icon: 'play-quiz',
    iconSize: 'h-[46px]',
    action: () => {
      //
    },
    key: 'game',
  },
  // {
  //   title: 'Assignment',
  //   subTitle: 'Share as homework with a deadline',
  //   icon: 'assignment',
  //   iconSize: 'h-[46px]',
  //   action: () => {
  //     //
  //   },
  //   key: 'assignment',
  // },
]

const quizSettingSaved = ref(false)

const createQuiz = (formComp: any) => {
  Logic.Study.CreateQuizForm = {
    description: quizSettingsForm.description,
    tags: quizSettingsForm.tags,
    title: quizSettingsForm.title,
    topic: quizSettingsForm.topic,
    photo: quizSettingsForm.photo,
  }

  const formState: boolean = formComp.validate()
  quizSettingSaved.value = false
  Logic.Study.CreateQuiz(formState)
    ?.then((data) => {
      if (data) {
        quizSettingSaved.value = true
        Logic.Common.hideLoader()
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const updateQuiz = (formComp: any) => {
  Logic.Study.UpdateQuizForm = {
    description: quizSettingsForm.description,
    tags: quizSettingsForm.tags
      .filter((item) => item != '')
      .concat(
        ...quizSettingsForm.tagString
          .split(',')
          .map((item) => trim(item))
          .filter((item) => item != ''),
      ),
    title: quizSettingsForm.title,
    topic: quizSettingsForm.topic,
    photo: quizSettingsForm.photo,
  }

  const formState: boolean = formComp.validate()
  quizSettingSaved.value = false
  Logic.Study.UpdateQuiz(formState, Logic.Study.SingleQuiz.id)
    ?.then((data) => {
      if (data) {
        quizSettingSaved.value = true
        Logic.Common.showLoader({
          show: true,
          loading: false,
          message: 'Quiz updated',
          type: 'success',
        })
        // update tags
        Logic.Study.GetTags({
          all: true,
        })
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const quizResult = () => {
  let correctAnswers = 0
  let percentagePass = 0
  if (questions.length) {
    const allQuestionAnswers = questions.map((item) => item.answer?.trim())
    const allUserAnswers = questions.map((item) => item.userAnswer?.trim())

    correctAnswers = Logic.Common.intersectArray(
      allQuestionAnswers,
      allUserAnswers,
    ).length

    percentagePass = parseFloat(
      ((correctAnswers / questions.length) * 100).toFixed(2),
    )
  }

  return {
    correctAnswers,
    percentagePass,
  }
}

const goToStudyMode = (type: string) => {
  selectedQuizMode.value = type
  if (type != 'assignment' && type != 'game') {
    Logic.Common.GoToRoute(`/quiz/${selectedQuizId.value}?mode=${type}`)
  }
}

const listenToGame = () => {
  // connect to websocket
  Logic.Common.setupWebsocket()

  Logic.Common.listenOnSocket(
    `plays/games/${Logic.Plays.SingleGame.id}`,
    (data) => {
      Logic.Plays.SingleGame = data.data
      Logic.Plays.GetGame(Logic.Plays.SingleGame.id).then(() => {
        if (data.data.status == 'started' && state.value != 'question') {
          Logic.Common.debounce(() => {
            preStartGame()
          })
        }
      })
    },
    (data) => {
      console.log(data)
    },
  )
}

const listenToTest = () => {
  // connect to websocket
  Logic.Common.setupWebsocket()

  Logic.Common.listenOnSocket(
    `plays/tests/${Logic.Plays.SingleTest.id}`,
    (data) => {
      Logic.Plays.SingleTest = data.data
      Logic.Plays.GetTest(Logic.Plays.SingleTest.id).then(() => {
        if (data.data.status == 'started' && state.value != 'question') {
          Logic.Common.debounce(() => {
            preStartTest()
          })
        }
      })
    },
    (data) => {
      console.log(data)
    },
  )
}

const preStartTest = () => {
  currentPrepareCount.value = 0
  if (mode.value == 'tutor_test') {
    if (SingleTest.value.status != 'started') {
      if (
        SingleTest.value.status == 'ended' ||
        SingleTest.value.status == 'scored'
      ) {
        state.value = 'leaderboard'
        return
      }
      state.value = 'lobby'
      enabledSwiper.value = false
      answerState.value = ''

      buttonLabels.left = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }

      buttonLabels.right = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }
      return
    }

    currentPrepareCount.value = 5
    state.value = 'prepare'

    Logic.Common.debounce(() => {
      const prepareCount = setInterval(() => {
        if (currentPrepareCount.value == 1) {
          state.value = 'question'
          setViewMode()
          setTimeout(() => {
            showQuestion(0)
          }, 500)
          clearInterval(prepareCount)
        } else {
          state.value = 'prepare'
          currentPrepareCount.value--
        }
      }, 1000)
    }, 300)
  }
}

const preStartGame = () => {
  currentPrepareCount.value = 0
  if (mode.value == 'game') {
    if (SingleGame.value.status != 'started') {
      state.value = 'lobby'
      enabledSwiper.value = false
      answerState.value = ''

      buttonLabels.left = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }

      buttonLabels.right = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }
      return
    }
    currentPrepareCount.value = 5
    state.value = 'prepare'

    Logic.Common.debounce(() => {
      const prepareCount = setInterval(() => {
        if (currentPrepareCount.value == 1) {
          state.value = 'question'
          setViewMode()
          setTimeout(() => {
            showQuestion(0)
          }, 500)
          clearInterval(prepareCount)
        } else {
          state.value = 'prepare'
          currentPrepareCount.value--
        }
      }, 1000)
    }, 300)
  }
}

const showQuestion = (index: number) => {
  answerState.value = ''
  if (mode.value == 'game' || mode.value == 'tutor_test') {
    if (mode.value == 'game') {
      if (SingleGame.value.status == 'scored') {
        state.value = 'leaderboard'
        return
      }
    }

    if (mode.value == 'tutor_test') {
      if (SingleTest.value?.status == 'scored') {
        state.value = 'leaderboard'
        return
      }
    }

    if (
      SingleGame.value?.status == 'started' ||
      SingleTest.value?.status == 'started'
    ) {
      state.value = 'question'

      enabledSwiper.value = false
      swiperInstance.value.swiperInstance.enabled = false
      swiperInstance.value.swiperInstance.update()
      answerState.value = 'pending'

      clearInterval(counterInterval.value)

      buttonLabels.left = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }

      buttonLabels.right = {
        label: 'Continue',
        bgColor: 'bg-primaryBlue',
        textColor: 'text-white',
      }

      buttonLabels.smIsDoubled = false

      counterInterval.value = setInterval(() => {
        if (questions[index].currentTime == 1) {
          state.value = 'question'
          clearInterval(counterInterval.value)
          enabledSwiper.value = true
          answerState.value = 'time_up'

          setTimeout(() => {
            handleRightButton()
          }, 1000)
        } else {
          questions[index].currentTime = questions[index].currentTime - 1
        }
      }, 1000)
    } else {
      state.value = 'lobby'
      enabledSwiper.value = false
      swiperInstance.value.swiperInstance.enabled = false
      swiperInstance.value.swiperInstance.update()
      answerState.value = ''

      buttonLabels.left = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }

      buttonLabels.right = {
        label: '',
        bgColor: ' ',
        textColor: ' ',
      }
    }
  } else {
    state.value = 'question'
    enabledSwiper.value = false
    swiperInstance.value.swiperInstance.enabled = false
    swiperInstance.value.swiperInstance.update()
    answerState.value = ''
  }
}

const setQuestions = () => {
  questions.length = 0

  if (AllQuestions.value) {
    questions.push(
      ...Logic.Study.CovertQuestionToQuizData(AllQuestions.value.results),
    )
  }
}

const setScoreboardParticipants = () => {
  scoreBoardParticipants.length = 0
  const allParticipants = GameParticipants.value.map((participant) => {
    return {
      score: SingleGame.value.scores[participant.id]
        ? SingleGame.value.scores[participant.id]
        : 0,
      user: participant,
    }
  })

  allParticipants.sort((a, b) => {
    return b.score - a.score
  })

  scoreBoardParticipants.push(...allParticipants)
}

const userIsGameHost = (id = null) => {
  if (id) {
    return Logic.Auth.AuthUser?.id == id
  }
  if (SingleTest.value) return true
  return SingleGame.value?.user.id == Logic.Auth.AuthUser?.id
}

const setStartButtons = () => {
  if (SingleQuiz.value) {
    mobileTitle.value = SingleQuiz.value.title
  } else {
    mobileTitle.value = 'Tutor test'
  }

  if (mode.value == 'flashcard') {
    buttonLabels.left = {
      label: 'Show later',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }

    buttonLabels.right = {
      label: 'Mastered',
      bgColor: 'bg-primaryGreen',
      textColor: 'text-white',
    }
    buttonLabels.smIsDoubled = true
  } else if (mode.value == 'test') {
    buttonLabels.left = {
      label: 'Prev',
      bgColor: 'bg-white border-[1px] border-gray-100',
      textColor: 'text-grayColor',
    }

    buttonLabels.right = {
      label: 'Next',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }

    buttonLabels.smIsDoubled = true
  } else if (mode.value == 'practice') {
    buttonLabels.left = {
      label: 'Skip',
      bgColor: 'bg-white border-[1px] border-gray-100',
      textColor: 'text-grayColor',
    }

    buttonLabels.right = {
      label: 'Check',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }
    buttonLabels.smIsDoubled = false
  } else if (mode.value == 'preview') {
    buttonLabels.left = {
      label: 'Prev',
      bgColor: 'bg-white border-[1px] border-gray-100',
      textColor: 'text-grayColor',
    }

    buttonLabels.right = {
      label: 'Next',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }

    buttonLabels.smIsDoubled = true
  }
}

const setViewMode = () => {
  const route = Logic.Common.route

  if (route.query?.mode) {
    mode.value = route.query?.mode.toString()
  } else {
    mode.value = 'preview'
  }

  if (mode.value == 'flashcard') {
    if (localStorage.getItem(`flashcard-info`)) {
      showInfoModal.value = false
    } else {
      showInfoModal.value = true
    }
    infoModalData.title = 'Flashcards'
    infoModalData.sub = 'Learning quiz questions and answers'
  } else if (mode.value == 'test') {
    if (localStorage.getItem(`test-info`)) {
      showInfoModal.value = false
    } else {
      showInfoModal.value = true
    }
    infoModalData.title = 'Test'
    infoModalData.sub = ''
  } else if (mode.value == 'practice') {
    showInfoModal.value = false
    infoModalData.title = 'Practice'
    infoModalData.sub = ''
    answerState.value = ''
  }
  setStartButtons()
}

const goToNextSlide = () => {
  if (!swiperInstance.value.swiperInstance.enabled) {
    enabledSwiper.value = true
    swiperInstance.value.swiperInstance.enabled = true
    swiperInstance.value.swiperInstance.update()
  }
  if (questionIndex.value < questions.length - 1) {
    questionIndex.value++
  }

  if (mode.value == 'practice') {
    buttonLabels.right = {
      label: 'Check',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }
  }
}

const goToPrevSlide = () => {
  if (!swiperInstance.value.swiperInstance.enabled) {
    enabledSwiper.value = true
    swiperInstance.value.swiperInstance.enabled = true
    swiperInstance.value.swiperInstance.update()
  }
  if (questionIndex.value > 0) {
    questionIndex.value--
  }
}

const handleLeftButton = () => {
  if (questionIndex.value == questions.length - 1) {
    enabledSwiper.value = true
    swiperInstance.value.swiperInstance.enabled = true
    swiperInstance.value.swiperInstance.update()
    questionIndex.value = 0
    setStartButtons()
    return
  }

  if (mode.value == 'preview') {
    goToPrevSlide()
  } else if (mode.value == 'flashcard') {
    const currentQuestion = questions[currentQuestionIndex.value]
    questions.push(currentQuestion)
    questions.splice(currentQuestionIndex.value, 1)
    swiperInstance.value.swiperInstance.update()
    goToNextSlide()
  } else if (mode.value == 'test') {
    goToPrevSlide()
  } else if (mode.value == 'practice') {
    swiperInstance.value.swiperInstance.update()
    goToNextSlide()
  }
}

const checkAnswer = () => {
  const isCorrect =
    questions[questionIndex.value].answer?.trim() ==
    questions[questionIndex.value].userAnswer?.trim()
  if (isCorrect) {
    answerState.value = 'correct'
    buttonLabels.right = {
      label: 'Continue',
      bgColor: 'bg-primaryGreen',
      textColor: 'text-white',
    }
  } else {
    answerState.value = 'wrong'
    buttonLabels.right = {
      label: 'Continue',
      bgColor: 'bg-primaryRed',
      textColor: 'text-white',
    }
  }
}

const handleRightButton = () => {
  if (questionIndex.value == questions.length - 1) {
    if (state.value == 'completed') {
      state.value = 'other_modes'
      mobileTitle.value = 'Try other modes'
      return
    }

    if (mode.value == 'flashcard') {
      state.value = 'completed'
      mobileTitle.value = 'Flashcards completed'
      buttonLabels.left = {
        label: 'Restart',
        bgColor: 'bg-white border-[1px] border-gray-100',
        textColor: 'text-grayColor',
      }

      buttonLabels.right = {
        label: 'Continue',
        bgColor: 'bg-primaryBlue',
        textColor: 'text-white',
      }
    } else if (mode.value == 'test') {
      state.value = 'completed'
      mobileTitle.value = 'Result'
      buttonLabels.left = {
        label: 'Corrections',
        bgColor: 'bg-primaryGreen',
        textColor: 'text-white',
      }

      buttonLabels.right = {
        label: 'Continue',
        bgColor: 'bg-primaryBlue',
        textColor: 'text-white',
      }
    } else if (mode.value == 'practice') {
      if (answerState.value) {
        state.value = 'completed'
        mobileTitle.value = 'Practice completed'
        buttonLabels.left = {
          label: 'Restart',
          bgColor: 'bg-white border-[1px] border-gray-100',
          textColor: 'text-grayColor',
        }

        buttonLabels.right = {
          label: 'Continue',
          bgColor: 'bg-primaryBlue',
          textColor: 'text-white',
        }
        answerState.value = ''
        buttonLabels.smIsDoubled = true
      } else {
        checkAnswer()
      }
      //
    } else if (mode.value == 'game') {
      clearInterval(counterInterval.value)
      state.value = 'leaderboard'
    } else if (mode.value == 'tutor_test') {
      clearInterval(counterInterval.value)
      state.value = 'leaderboard'
      // end test
      Logic.Plays.EndTest(SingleTest.value.id)
    }
  } else {
    if (mode.value == 'practice') {
      if (answerState.value) {
        answerState.value = ''
        buttonLabels.right = {
          label: 'Continue',
          bgColor: 'bg-primaryBlue',
          textColor: 'text-white',
        }
        goToNextSlide()
      } else {
        checkAnswer()
      }
    } else if (mode.value == 'game') {
      clearInterval(counterInterval.value)
      // checkAnswer()
      goToNextSlide()
    } else {
      goToNextSlide()
    }
  }
}

const handleAnswerSelected = () => {
  if (mode.value == 'test') {
    handleRightButton()
  } else if (mode.value == 'practice') {
    answerState.value = ''
    buttonLabels.right = {
      label: 'Check',
      bgColor: 'bg-primaryBlue',
      textColor: 'text-white',
    }
  } else if (mode.value == 'game') {
    answerState.value = 'selected'
    setTimeout(() => {
      answerState.value = ''
      handleRightButton()
    }, 1000)
  } else if (mode.value == 'tutor_test') {
    answerState.value = 'selected'
    setTimeout(() => {
      answerState.value = ''
      handleRightButton()
    }, 1000)
  }
}

const createQuizGame = (quizId: string) => {
  if (Logic.Common.loaderSetup.loading) return
  Logic.Common.showLoader({
    loading: true,
    show: false,
  })

  Logic.Plays.CreateGameForm = {
    quizId,
  }

  Logic.Plays.CreateGame(true).then((game) => {
    if (game) {
      if (userIsParticipating.value) {
        Logic.Plays.JoinGame(game.id, true).then((data) => {
          if (data) {
            Logic.Common.hideLoader()
            Logic.Common.GoToRoute(
              `/quiz/${game.quizId}?mode=game&gameId=${game.id}`,
            )
          }
        })
      } else {
        Logic.Common.hideLoader()
        Logic.Common.GoToRoute(
          `/quiz/${game.quizId}?mode=game&gameId=${game.id}`,
        )
      }
    }
  })
}

const saveParticipantAnswer = (answer: any, questionId: string) => {
  Logic.Plays.AnswerGameQuestionForm = {
    answer,
    questionId,
  }

  if (SingleGame.value) {
    Logic.Plays.AnswerGameQuestion(Logic.Plays.SingleGame.id)
  }

  if (SingleTest.value) {
    Logic.Plays.AnswerTestQuestion(Logic.Plays.SingleTest.id)
  }
}

const copyGameLink = () => {
  Logic.Common.copytext(window.location.href)
  // show alert
  Logic.Common.showLoader({
    show: true,
    loading: false,
    message: 'Game link copied!',
    type: 'success',
  })
}

const shareGameLink = async () => {
  // for web
  const shareData = {
    title: 'Join game on SOFA',
    text: `Join and play a game on ${SingleQuiz.value.title}`,
    url: window.location.href,
  }

  try {
    await navigator.share(shareData)
    Logic.Common.showLoader({
      show: true,
      loading: false,
      message: 'Game link shared.',
      type: 'success',
    })
  } catch (err) {
    console.log(err)
    Logic.Common.showLoader({
      show: true,
      loading: false,
      message: 'Unable to share link.',
      type: 'error',
    })
  }
}

const startGame = () => {
  if (Logic.Plays.SingleGame) {
    if (Logic.Common.loaderSetup.loading) {
      return
    }
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    Logic.Plays.StartGame(Logic.Plays.SingleGame.id).then(() => {
      // showQuestion(0)
      Logic.Common.hideLoader()
    })
  }
}

const startTest = () => {
  if (Logic.Plays.SingleTest) {
    if (Logic.Common.loaderSetup.loading) {
      return
    }
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    Logic.Plays.StartTest(Logic.Plays.SingleTest.id).then(() => {
      // showQuestion(0)
      Logic.Common.hideLoader()
    })
  }
}

export {
  quizSettingsForm,
  quizSettingSaved,
  selectedQuizId,
  otherTasks,
  mode,
  state,
  buttonLabels,
  infoModalData,
  showInfoModal,
  answerState,
  enabledSwiper,
  swiperInstance,
  swiperKey,
  currentQuestionIndex,
  questionIndex,
  SingleQuiz,
  AllQuestions,
  mobileTitle,
  counterInterval,
  specialQuestionTypes,
  allQuestionAnswers,
  questions,
  selectedQuizMode,
  userIsParticipating,
  SingleGame,
  GameParticipants,
  scoreBoardParticipants,
  currentPrepareCount,
  SingleTest,
  isRestart,
  saveParticipantAnswer,
  createQuiz,
  updateQuiz,
  quizResult,
  goToStudyMode,
  setQuestions,
  showQuestion,
  setStartButtons,
  setViewMode,
  goToNextSlide,
  goToPrevSlide,
  handleLeftButton,
  handleRightButton,
  handleAnswerSelected,
  createQuizGame,
  userIsGameHost,
  copyGameLink,
  shareGameLink,
  startGame,
  listenToGame,
  setScoreboardParticipants,
  preStartGame,
  listenToTest,
  preStartTest,
  startTest,
}
