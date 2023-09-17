import { $api } from '../../services'
import Common from './Common'
import { Logic } from '..'
import {
  ContentDetails,
  FileData,
  Paginated,
  Tags,
} from '../types/domains/common'
import { Conditions, QueryParams } from '../types/common'
import { AddTagInput } from '../types/forms/common'
import {
  Course,
  Folder,
  Question,
  Quiz,
  SofaFile,
} from '../types/domains/study'
import {
  AddItemToCourseInput,
  CreateCourseInput,
  CreateDocumentInput,
  CreateFolderInput,
  CreateQuestionInput,
  CreateQuizInput,
  ReorderQuizInput,
  SaveItemToFolderInput,
  UpdateCourseSectionsInput,
} from '../types/forms/study'
import { reactive } from 'vue'

export default class Study extends Common {
  constructor() {
    super()
  }

  public Tags: Paginated<Tags> | undefined
  public AllTopics: Paginated<Tags> | undefined
  public AllOtherTags: Paginated<Tags> | undefined
  public SingleTag: Tags | undefined
  public AllFolders: Paginated<Folder> | undefined
  public SingleFolder: Folder | undefined
  public AllQuzzies: Paginated<Quiz> | undefined
  public SingleQuiz: Quiz | undefined
  public AllQuestions: Paginated<Question> | undefined
  public SingleQuestion: Question | undefined
  public AllCourses: Paginated<Course> | undefined
  public PurchasedCourses: Paginated<Course> | undefined
  public SingleCourse: Course | undefined
  public AllFiles: Paginated<SofaFile> | undefined
  public SingleFile: SofaFile | undefined
  public SaveItemToFolderForm: SaveItemToFolderInput | undefined
  public SingleMediaFile: FileData | undefined
  public NewCoursableItem: any
  public UpdatedQuestion: Question | undefined
  public SingleCourseFiles: SofaFile[] | undefined
  public SingleCourseQuizzes: Quiz[] | undefined
  public SelectedMaterialDetails = reactive({
    title: '',
    descriptions: '',
  })
  public UpdatedFile: SofaFile | undefined

  // Form input
  public CreateTagForm: AddTagInput | undefined
  public UpdateTagForm: AddTagInput | undefined
  public CreateFolderForm: CreateFolderInput | undefined
  public UpdateFolderForm: CreateFolderInput | undefined
  public CreateQuizForm: CreateQuizInput | undefined
  public UpdateQuizForm: CreateQuizInput | undefined
  public CreateQuestionForm: CreateQuestionInput | undefined
  public UpdateQuestionForm: CreateQuestionInput | undefined
  public CreateCourseForm: CreateCourseInput | undefined
  public UpdateCourseForm: CreateCourseInput | undefined
  public CreateFileForm: CreateDocumentInput | undefined
  public UpdateFileForm: CreateDocumentInput | undefined
  public ReorderQuizQuestionsForm: ReorderQuizInput | undefined
  public MoveItemToCourseForm: AddItemToCourseInput | undefined
  public UpdateCourseSectionForm: UpdateCourseSectionsInput | undefined

  public questionSettings = reactive([])
  public contentDetails = reactive<ContentDetails>({
    type: 'course',
    price: 0,
    image: '/images/default.png',
    title: '',
    status: '',
    id: '',
    info: '',
    labels: {
      color: 'pink',
      main: 'Course',
      sub: '',
    },
    ratings: {
      total: 4,
      label: '24 ratings',
      totalCount: 24,
      stats: {
        '5': 3,
        '4': 21,
        '3': 0,
        '2': 0,
        '1': 0,
      },
      reviews: [
        {
          user: {
            name: 'Blessing J.',
            photoUrl: '/images/desdemona.png',
          },
          rating: 4,
          review:
            'This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing',
        },
        {
          user: {
            name: 'Blessing J.',
            photoUrl: '/images/desdemona.png',
          },
          rating: 4,
          review:
            'This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing',
        },
      ],
    },
    user: {
      name: '',
      photoUrl: '',
      role: 'Teacher',
      stats: {
        quizzes: 34,
        courses: 18,
        followers: '1.1k',
      },
    },
    lastUpdated: '',
    tags: [],
    content: {
      materialsCount: 11,
      sections: [],
    },
    questions: [],
  })

  public convertQuestionToInput = (questions: any, type: any) => {
    let timeLimit = 0

    let questionContent = questions.content

    questions.settings.forEach((setting) => {
      if (setting.type == 'time-limit') {
        timeLimit = Logic.Common.timeEquivalentsInSeconds[`${setting.value}`]
      }
    })

    let set = []

    if (type == 'match') {
      questions.options.forEach((questionOptions, index) => {
        set.push({
          q: questionOptions.value,
          // @ts-ignore
          a: questions.match[index].value,
        })
      })
    }

    if (set.length == 0) {
      set = undefined
    }

    let options = questions.options.map((option) => {
      return option.value
    })

    let answers = []

    if (type == 'multipleChoice') {
      answers = questions.options
        .map((option, index) => {
          if (option.answer) {
            return index
          }
        })
        .filter((item) => {
          return item != undefined
        })
    } else {
      answers = questions.options
        .map((option) => {
          if (option.answer) {
            return option.answer
          }
        })
        .filter((item) => {
          return item != undefined
        })
    }

    if (type == 'trueOrFalse') {
      answers = undefined
      options = undefined
    }

    if (type == 'sequence') {
      options = undefined
    }

    if (type == 'match') {
      options = undefined
      answers = undefined
    }

    if (type == 'dragAnswers' || type == 'fillInBlanks') {
      options = undefined
      // @ts-ignore
      answers = questions.data
        .map((item) => {
          if (item.type == 'answer') {
            return item.value
          }
        })
        .filter((item) => {
          return item != undefined
        })

      questionContent = questions.data
        .map((item) => {
          if (item.type == 'text') {
            return item.value.trim()
          } else {
            return '__________'
          }
        })
        .join('')
    }

    return {
      id: Logic.Study.SingleQuiz.id,
      question: questionContent,
      timeLimit: timeLimit,
      data: {
        type,
        options,
        answers,
        answer:
          type == 'trueOrFalse'
            ? questions.options[0].answer == 'True'
            : undefined,
        indicator:
          type == 'dragAnswers' || type == 'fillInBlanks'
            ? '__________'
            : undefined,
        set,
      },
    }
  }

  public questionTypes = {
    multipleChoice: {
      id: '',
      key: 'multipleChoice',
      type: 'Multiple choice',
      image: 'multiple_choice',
      icon: 'multiple-choice-type',
      active: true,
      placeholder: 'Enter question',
      content: 'Enter question',
      timeLimit: 0,
      questionMedia: '',
      questionMediaBlob: null,
      explanation: '',
      options: [
        {
          shape: 'circle',
          text: 'Enter answer',
          shapeSize: 'h-[23px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'a',
          answer: 'a',
        },
        {
          shape: 'triangle',
          text: 'Enter answer',
          shapeSize: 'h-[20px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'b',
          answer: '',
        },
        {
          shape: 'square',
          text: 'Enter answer',
          shapeSize: 'h-[20px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'c',
          answer: '',
        },
        {
          shape: 'kite',
          text: 'Enter answer',
          shapeSize: 'h-[24px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'd',
          answer: '',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Multiple choice',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
        {
          type: 'total-options',
          value: '4',
        },
        {
          type: 'correct-anwsers',
          value: '1',
        },
      ],
    },
    writeAnswer: {
      id: '',
      key: 'writeAnswer',
      type: 'Write answer',
      image: 'write_answer',
      content: 'Enter question',
      active: false,
      placeholder: 'Enter question',
      icon: 'write-answer-type',
      timeLimit: 0,
      questionMedia: '',
      questionMediaBlob: null,
      explanation: '',
      options: [
        {
          shape: 'circle',
          text: 'Enter correct answer',
          shapeSize: 'h-[23px]',
          isRadio: false,
          id: '',
          value: 'a',
          answer: 'a',
        },
        {
          shape: 'triangle',
          text: 'Enter another accepted answer (optional)',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '',
          answer: '',
        },
        {
          shape: 'square',
          text: 'Enter another accepted answer (optional)',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '',
          answer: '',
        },
        {
          shape: 'kite',
          text: 'Enter another accepted answer (optional)',
          shapeSize: 'h-[24px]',
          isRadio: false,
          id: '',
          value: '',
          answer: '',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Write answer',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
      ],
    },
    trueOrFalse: {
      id: '',
      key: 'trueOrFalse',
      type: 'True/False',
      image: 'true_false',
      content: 'Enter question',
      active: false,
      placeholder: 'Enter question',
      icon: 'true-false-type',
      timeLimit: 0,
      questionMedia: '',
      questionMediaBlob: null,
      explanation: '',
      options: [
        {
          shape: 'circle',
          text: 'True',
          shapeSize: 'h-[23px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'True',
          answer: 'true',
        },
        {
          shape: 'triangle',
          text: 'False',
          shapeSize: 'h-[20px]',
          isRadio: true,
          id: this.makeid(8),
          value: 'False',
          answer: '',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'True/False',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
      ],
    },
    fillInBlanks: {
      id: '',
      key: 'fillInBlanks',
      type: 'Fill in blank(s)',
      image: 'fill_in_blank',
      content: '__________ Enter text',
      options: [],
      icon: 'fill-in-blanks-type',
      active: false,
      timeLimit: 0,
      questionMedia: '',
      questionMediaBlob: null,
      explanation: '',
      data: [
        {
          content: '',
          type: 'text',
          value: '',
        },
        {
          content: '',
          type: 'answer',
          value: 'answer here',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Fill in blank(s)',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
      ],
    },
    dragAnswers: {
      id: '',
      key: 'dragAnswers',
      type: 'Drag answers',
      image: 'drag_answer',
      content: '__________ Enter text',
      active: false,
      icon: 'drag-answers-type',
      options: [],
      questionMedia: '',
      questionMediaBlob: null,
      timeLimit: 0,
      explanation: '',
      data: [
        {
          content: '',
          type: 'text',
          value: '',
        },
        {
          content: '',
          type: 'answer',
          value: 'answer here',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Drag answers',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
      ],
    },
    sequence: {
      id: '',
      key: 'sequence',
      type: 'Sequence',
      image: 'sequence',
      content: 'Enter question',
      icon: 'sequence-type',
      active: false,
      timeLimit: 0,
      explanation: '',
      questionMedia: '',
      questionMediaBlob: null,
      placeholder:
        'Enter instruction/question here (e.g. arrange these sentences in alphabetical order)',
      options: [
        {
          shape: 'circle',
          text: 'Enter 1st word/sentence',
          shapeSize: 'h-[23px]',
          isRadio: false,
          id: '',
          value: '',
          answer: 'a',
        },
        {
          shape: 'triangle',
          text: 'Enter 2nd word/sentence',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '',
          answer: 'b',
        },
        {
          shape: 'square',
          text: 'Enter 3rd word/sentence',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '',
          answer: 'c',
        },
        {
          shape: 'kite',
          text: 'Enter 4th word/sentence',
          shapeSize: 'h-[24px]',
          isRadio: false,
          id: '',
          value: '',
          answer: 'd',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Sequence',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
        {
          type: 'sequence-total',
          value: '',
        },
      ],
    },
    match: {
      id: '',
      key: 'match',
      type: 'Match',
      image: 'match',
      content: 'Enter question',
      active: false,
      icon: 'match-type',
      timeLimit: 0,
      questionMedia: '',
      explanation: '',
      questionMediaBlob: null,
      placeholder:
        'Enter instruction/questions here (e.g. match the vegetables with their colors)',
      options: [
        {
          shape: 'circle',
          text: 'Enter 1st word/sentence',
          shapeSize: 'h-[23px]',
          isRadio: false,
          id: '',
          value: 'a',
          answer: 'a',
        },
        {
          shape: 'triangle',
          text: 'Enter 2nd word/sentence',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: 'b',
          answer: 'b',
        },
        {
          shape: 'square',
          text: 'Enter 3rd word/sentence',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: 'c',
          answer: 'c',
        },
        {
          shape: 'kite',
          text: 'Enter 4th word/sentence',
          shapeSize: 'h-[24px]',
          isRadio: false,
          id: '',
          value: 'd',
          answer: 'd',
        },
      ],
      match: [
        {
          shape: 'circle',
          text: 'Enter match',
          shapeSize: 'h-[23px]',
          isRadio: false,
          id: '',
          value: '1',
          answer: '1',
        },
        {
          shape: 'triangle',
          text: 'Enter match',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '2',
          answer: '2',
        },
        {
          shape: 'square',
          text: 'Enter match',
          shapeSize: 'h-[20px]',
          isRadio: false,
          id: '',
          value: '3',
          answer: '3',
        },
        {
          shape: 'kite',
          text: 'Enter match',
          shapeSize: 'h-[24px]',
          isRadio: false,
          id: '',
          value: '4',
          answer: '4',
        },
      ],
      settings: [
        {
          type: 'question-type',
          value: 'Match',
        },
        {
          type: 'time-limit',
          value: '30s',
        },
        {
          type: 'match-total',
          value: '',
        },
      ],
    },
  }

  public getQuestionTemplate = (
    type:
      | 'sequence'
      | 'match'
      | 'multipleChoice'
      | 'writeAnswer'
      | 'trueOrFalse'
      | 'fillInBlanks'
      | 'dragAnswers',
  ) => {
    return this.questionTypes[type]
  }

  public questionInfo = {
    multipleChoice: 'Choose the correct answer',
    writeAnswer: 'Type in your answer in the given box',
    trueOrFalse: 'Choose if this statement is true or false',
    fillInBlanks: 'Type your answers in the boxes given',
    dragAnswers:
      'Answers are given for you to drag and drop in the blank boxes',
    sequence: 'Drag boxes or use arrows to arrange sequence correctly',
    match: 'Click a box on the left and then one the right to match',
  }

  public CovertQuestionToQuizData = (AllQuestions: Question[]) => {
    const questions = []
    AllQuestions?.forEach((question) => {
      const questionData = this.ProcessQuestionData(question)

      let options = {
        type: 'radio',
        data: [],
      }

      let answer = ''

      const answerOption = questionData.options.filter(
        (item) => item.answer != '',
      )

      if (answerOption.length) {
        answer = answerOption.map((item) => item.value).join(', ')
      }

      if (questionData.itemType == 'multipleChoice') {
        options.data.push(
          {
            content: [
              {
                label: questionData.options[0].value,
                type: 'text',
              },
            ],
            shape: 'circle',
          },
          {
            content: [
              {
                label: questionData.options[1].value,
                type: 'text',
              },
            ],
            shape: 'triangle',
          },
          {
            content: [
              {
                label: questionData.options[2].value,
                type: 'text',
              },
            ],
            shape: 'square',
          },
          {
            content: [
              {
                label: questionData.options[3].value,
                type: 'text',
              },
            ],
            shape: 'kite',
          },
        )

        if (questionData.options[4]) {
          options.data.push({
            content: [
              {
                label: questionData.options[4].value,
                type: 'text',
              },
            ],
            shape: 'circle',
          })
        }

        if (questionData.options[5]) {
          options.data.push({
            content: [
              {
                label: questionData.options[5].value,
                type: 'text',
              },
            ],
            shape: 'triangle',
          })
        }
      }

      if (questionData.itemType == 'writeAnswer') {
        options.type = 'textField'
        options.data = [
          {
            content: [
              {
                label: 'Write your answer here',
                type: 'text',
              },
            ],
            shape: 'circle',
          },
        ]
      }

      if (questionData.itemType == 'trueOrFalse') {
        options.type = 'radio'
        options.data = [
          {
            content: [
              {
                label: 'True',
                type: 'text',
              },
            ],
            shape: 'circle',
          },
          {
            content: [
              {
                label: 'False',
                type: 'text',
              },
            ],
            shape: 'triangle',
          },
        ]
      }

      if (questionData.itemType == 'fillInBlanks') {
        options.type = 'blanks'

        const allAnswers = []

        options.data = [
          {
            content: [],
            shape: '',
          },
        ]

        questionData.data.forEach((item) => {
          if (item.type == 'text') {
            options.data[0].content.push({
              label: item.value,
              type: 'text',
            })
          } else if (item.type == 'answer') {
            options.data[0].content.push({
              label: 'answer here',
              value: '',
              type: 'textField',
            })
            allAnswers.push(item.value)
          }
        })

        answer = allAnswers.join(', ')
      }

      if (questionData.itemType == 'dragAnswers') {
        options.type = 'drag'

        options.data = [
          {
            content: [],
            shape: '',
          },
          {
            content: [],
          },
        ]

        const allAnswers = []

        questionData.data.forEach((item) => {
          if (item.type == 'text') {
            options.data[0].content.push({
              label: item.value,
              type: 'text',
            })
          } else if (item.type == 'answer') {
            options.data[0].content.push({
              label: 'drop here',
              value: '',
              type: 'drop',
              extraClass: `dragDrop${Logic.Common.makeid(6)}`,
            })

            options.data[1].content.push({
              label: item.value,
              type: 'answer-box',
              extraClass: `drag${Logic.Common.makeid(6)}`,
            })

            allAnswers.push(item.value)
          }
        })

        answer = allAnswers.join(', ')
      }

      if (questionData.itemType == 'sequence') {
        options.type = 'sequence'

        options.data.push({
          content: [],
          shape: '',
        })

        questionData.options.forEach((option) => {
          options.data[0].content.push({
            label: option.value,
            type: 'text',
          })
        })
      }

      if (questionData.itemType == 'match') {
        options.type = 'match'

        options.data.push(
          {
            content: [],
            shape: '',
          },
          {
            content: [],
            shape: '',
          },
        )

        questionData.options.forEach((option) => {
          options.data[0].content.push({
            label: option.value,
            type: 'text',
            shape: option.shape,
          })
        })

        questionData.match.forEach((option) => {
          options.data[1].content.push({
            label: option.value,
            type: 'text',
            shape: option.shape,
          })
        })

        if (questionData.match.length) {
          answer = questionData.match.map((item) => item.value).join(', ')
        }
      }
      questions.push({
        title: questionData.type,
        duration: '5',
        info: this.questionInfo[questionData.itemType],
        options,
        answer,
        question: questionData.content,
        timeLimit: questionData.timeLimit,
        currentTime: questionData.timeLimit,
        id: questionData.id,
      })
    })

    return questions
  }

  public ProcessQuestionData = (question: any) => {
    const questionData = JSON.parse(
      JSON.stringify(this.getQuestionTemplate(question.data.type)),
    )

    questionData.id = question.id
    questionData.itemType = question.data.type
    questionData.explanation = question.explanation ? question.explanation : ''
    questionData.questionMedia = question.questionMedia
      ? question.questionMedia?.link
      : ''

    question.data.options?.forEach((option, index) => {
      if (questionData.options[index]) {
        questionData.options[index].value = option
      } else {
        const availableShapes = ['circle', 'triangle', 'square', 'kite']

        questionData.options[index] = {
          shape:
            availableShapes[Math.floor(Math.random() * availableShapes.length)],
          text: 'Enter answer',
          shapeSize: 'h-[23px]',
          isRadio: true,
          id: this.makeid(8),
          value: option,
          answer: '',
        }
      }

      // clear answers
      questionData.options[index].answer = ''
    })

    question.data.questions?.forEach((option, index) => {
      questionData.options[index].value = option
    })

    questionData.timeLimit = question.timeLimit

    if (question.data.type == 'multipleChoice') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
        if (setting.type == 'total-options') {
          setting.value = `${question.data.options.length}`
        }
        if (setting.type == 'correct-anwsers') {
          setting.value = `${question.data.answers?.length}`
        }
      })

      question.data.answers?.forEach((index) => {
        questionData.options[index].answer = questionData.options[index].value
      })

      questionData.content = question.question
    }

    if (question.data.type == 'writeAnswer') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })

      question.data.answers?.forEach((item, index) => {
        questionData.options[index].value = item
        questionData.options[index].answer = item
      })

      questionData.content = question.question
    }

    if (question.data.type == 'trueOrFalse') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })

      questionData.content = question.question
    }

    if (question.data.type == 'fillInBlanks') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })
    }

    if (question.data.type == 'dragAnswers') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })
    }

    if (question.data.type == 'sequence') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })

      question.data.answers.forEach((item, index) => {
        questionData.options[index].value = item
        questionData.options[index].answer = item
      })

      questionData.content = question.question
    }

    if (question.data.type == 'match') {
      questionData.settings.forEach((setting) => {
        if (setting.type == 'time-limit') {
          setting.value =
            Logic.Common.EquivalentsSecondsInString[`${question.timeLimit}`]
        }
      })

      question.data.set?.forEach((item, index) => {
        questionData.options[index].value = item.q
        questionData.options[index].answer = item.q

        questionData.match[index].value = item.a
        questionData.match[index].answer = item.a
      })

      question.data.answers?.forEach((item, index) => {
        questionData.match[index].value = item
        questionData.match[index].answer = item
      })
      questionData.content = question.question
    }

    if (
      question.data.type == 'dragAnswers' ||
      question.data.type == 'fillInBlanks'
    ) {
      const questionContent = question.question
        .trim()
        .replaceAll(`${question.data.indicator}`, '{}')
        .split('}')

      const answers = question.data.answers
        ? JSON.parse(JSON.stringify(question.data.answers))
        : []

      questionData.content = question.question

      questionData.data.length = 0

      questionContent.forEach((item) => {
        if (item.trim()) {
          const itemStrings = item.split('')

          let textHasAnswer = false

          let finalString = ''

          if (itemStrings[itemStrings.length - 1] == '{') {
            itemStrings.pop()
            finalString = itemStrings.join('')
            textHasAnswer = true
          } else {
            finalString = itemStrings.join('')
          }

          questionData.data.push({
            content: '',
            type: 'text',
            value: finalString,
          })

          if (textHasAnswer) {
            questionData.data.push({
              content: '',
              type: 'answer',
              value: answers.shift(),
            })
          }
        }
      })
    }

    return questionData
  }

  public GetTagName = (id: string) => {
    const Tag = [
      ...(this.Tags?.results || []),
      ...(this.AllTopics?.results || []),
      ...(this.AllOtherTags?.results || []),
    ].filter((tag) => {
      return tag.id == id
    })

    if (Tag.length) {
      return Tag[0].title
    } else {
      return 'Not set'
    }
  }

  public GetTags = (filters: QueryParams) => {
    return $api.interactions.tag.fetch(filters).then((response) => {
      this.Tags = response.data
      return response.data
    })
  }

  public GetTopics = () => {
    return $api.interactions.tag
      .fetch({
        where: [
          {
            field: 'type',
            value: 'topics',
            condition: Conditions.eq,
          },
        ],
      })
      .then((response) => {
        this.AllTopics = response.data
        return response.data
      })
  }

  public GetOtherTags = () => {
    return $api.interactions.tag
      .fetch({
        where: [
          {
            field: 'type',
            value: 'generic',
            condition: Conditions.eq,
          },
        ],
      })
      .then((response) => {
        this.AllOtherTags = response.data
        return response.data
      })
  }

  public GetTag = (id: string) => {
    return $api.interactions.tag.get(id).then((response) => {
      this.SingleTag = response.data
    })
  }

  public GetFolders = (filters: QueryParams) => {
    return $api.study.folder.fetch(filters).then((response) => {
      this.AllFolders = response.data
    })
  }

  public GetFolder = (id: string) => {
    const allContentCategories = ['quizzes', 'courses', 'purchased']

    if (allContentCategories.includes(id)) {
      return new Promise((resolve) => {
        resolve('')
      })
    }
    return new Promise((resolve) => {
      $api.study.folder.get(id).then((response) => {
        const folder = response.data

        if (folder) {
          const fetchStatus = reactive({
            quizzes: false,
            courses: false,
          })

          $api.study.course
            .fetch({
              where: [
                {
                  field: 'id',
                  value: folder.saved.courses,
                  condition: Conditions.in,
                },
              ],
            })
            .then((response) => {
              folder.courses = response.data.results
              fetchStatus.courses = true
              if (fetchStatus.quizzes) {
                this.SingleFolder = folder
                resolve('')
              }
            })

          $api.study.quiz
            .fetch({
              where: [
                {
                  field: 'id',
                  value: folder.saved.quizzes,
                  condition: Conditions.in,
                },
              ],
            })
            .then((response) => {
              folder.quizzes = response.data.results
              fetchStatus.quizzes = true
              if (fetchStatus.courses) {
                this.SingleFolder = folder
                resolve('')
              }
            })
        } else {
          resolve('')
        }
      })
    })
  }

  public GetQuizzes = (filters: QueryParams) => {
    return $api.study.quiz.fetch(filters).then((response) => {
      this.AllQuzzies = response.data
    })
  }

  public GetQuiz = (id: string) => {
    return $api.study.quiz.get(id).then((response) => {
      this.SingleQuiz = response.data
    })
  }

  public GetQuestions = (quizId: string) => {
    if (!quizId) {
      return new Promise((resolve) => {
        resolve('')
      })
    }
    return $api.study.quiz.getQuestions(quizId).then((response) => {
      this.AllQuestions = response.data
      return response.data
    })
  }

  public GetQuestion = (quidId: string, questionId: string) => {
    return $api.study.quiz.getQuestion(quidId, questionId).then((response) => {
      this.SingleQuestion = response.data
    })
  }

  public GetCourses = (filters: QueryParams) => {
    return $api.study.course.fetch(filters).then((response) => {
      this.AllCourses = response.data
    })
  }

  public GetCoursesWithQuery = (query: string, tagId = '') => {
    return $api.study.course
      .fetch({
        search: {
          fields: ['title'],
          value: query == 'nill' ? '' : query,
        },
        where: tagId
          ? [
              {
                field: 'tagIds',
                value: tagId,
                condition: Conditions.in,
              },
            ]
          : [],
      })
      .then((response) => {
        this.AllCourses = response.data
      })
  }

  public GetCourse = (id: string) => {
    return new Promise((resolve) => {
      $api.study.course.get(id).then((response) => {
        this.SingleCourse = response.data
        const allCourseableFiles = this.SingleCourse.coursables
          ?.filter((item) => item.type == 'file')
          .map((item) => item.id)
        const allCourseableQuizzes = this.SingleCourse.coursables
          ?.filter((item) => item.type == 'quiz')
          .map((item) => item.id)

        const allCoursableDataRequests: Promise<any>[] = []

        // files
        allCoursableDataRequests.push(
          $api.study.file
            .fetch({
              where: [
                {
                  field: 'id',
                  value: allCourseableFiles,
                  condition: Conditions.in,
                },
              ],
            })
            .then((response) => {
              this.SingleCourseFiles = response.data.results
            }),
        )

        // quizzes

        allCoursableDataRequests.push(
          $api.study.quiz
            .fetch({
              where: [
                {
                  field: 'id',
                  value: allCourseableQuizzes,
                  condition: Conditions.in,
                },
              ],
            })
            .then((response) => {
              this.SingleCourseQuizzes = response.data.results
            }),
        )

        Promise.all(allCoursableDataRequests)
          .then(() => {
            resolve('')
          })
          .catch((error) => {
            console.log(error)
          })
      })
    })
  }

  public GetFiles = (filters: QueryParams) => {
    return $api.study.file.fetch(filters).then((response) => {
      this.AllFiles = response.data
    })
  }

  public GetFileMedia = (fileId: string) => {
    return $api.study.file.getFileMedia(fileId).then((response) => {
      this.SingleMediaFile = response.data
      return response.data
    })
  }

  public CreateTag = (formIsValid: boolean) => {
    if (formIsValid && this.CreateTagForm) {
      return $api.interactions.tag
        .post(null, this.CreateTagForm)
        .then((response) => {
          this.SingleTag = response.data
        })
        .catch((errro) => {
          //
        })
    }
  }

  public UpdateTag = (formIsValid: boolean, id: string) => {
    if (formIsValid && this.UpdateTagForm) {
      return $api.interactions.tag
        .put(null, id, this.CreateTagForm)
        .then((response) => {
          this.SingleTag = response.data
        })
        .catch((error) => {
          //
        })
    }
  }

  public CreateFolder = (formIsValid: boolean) => {
    if (formIsValid && this.CreateFolderForm) {
      return $api.study.folder
        .post(null, this.CreateFolderForm)
        .then((response) => {
          this.SingleFolder = response.data
          return this.SingleFolder
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public UpdateFolder = (formIsValid: boolean, id: string) => {
    if (formIsValid && this.UpdateFolderForm) {
      return $api.study.folder
        .put(null, id, this.UpdateFolderForm)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public SaveItemToFolder = (formIsValid: boolean) => {
    if (formIsValid && this.SaveItemToFolderForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.folder
        .saveItemToFolder(this.SaveItemToFolderForm)
        .then((response) => {
          this.SingleFolder = response.data
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          //
          Logic.Common.hideLoader()
        })
    }
  }

  public CreateQuiz = (formIsValid: boolean) => {
    if (formIsValid && this.CreateQuizForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.quiz
        .post(null, this.CreateQuizForm)
        .then((response) => {
          this.SingleQuiz = response.data
          this.GetQuestions(this.SingleQuiz.id)
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public UpdateQuiz = (formIsValid: boolean, id: string) => {
    if (formIsValid && this.UpdateQuizForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.quiz
        .put(null, id, this.UpdateQuizForm)
        .then((response) => {
          this.SingleQuiz = response.data
          this.GetQuestions(this.SingleQuiz.id)
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          throw error
          //
        })
    }
  }

  public PublishQuiz = (id: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.study.quiz
      .publishQuiz(id)
      .then((response) => {
        this.SingleQuiz = response.data
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        //
        Logic.Common.hideLoader()
      })
  }

  public ReorderQuizQuestions = (id: string) => {
    return $api.study.quiz
      .reorderQuiz(id, this.ReorderQuizQuestionsForm)
      .then((response) => {
        this.SingleQuiz = response.data
      })
  }

  public CreateQuestion = (formIsValid: boolean, quizId: string) => {
    if (formIsValid && this.CreateQuestionForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.quiz
        .createQuestion(quizId, this.CreateQuestionForm)
        .then((response) => {
          this.SingleQuestion = response.data
          this.GetQuestions(quizId)
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          //
          Logic.Common.hideLoader()
        })
    }
  }

  public UpdateQuestion = (formIsValid: boolean, quizId: string) => {
    if (formIsValid && this.UpdateQuestionForm) {
      this.UpdatedQuestion = undefined
      return $api.study.quiz
        .updateQuestion(quizId, this.UpdateQuestionForm)
        .then((response) => {
          this.UpdatedQuestion = response.data
          this.GetQuestions(quizId)
        })
        .catch((errro) => {
          //
        })
    }
  }

  public CreateCourse = (formIsValid: boolean) => {
    if (formIsValid && this.CreateCourseForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.course
        .post(null, this.CreateCourseForm)
        .then((response) => {
          this.SingleCourse = response.data
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public UpdateCourse = (formIsValid: boolean, id: string) => {
    if (formIsValid && this.UpdateCourseForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.course
        .put(null, id, this.UpdateCourseForm)
        .then((response) => {
          this.SingleCourse = response.data
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {})
    }
  }

  public MoveItemToCourse = (formIsValid: boolean) => {
    if (formIsValid && this.MoveItemToCourseForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.course
        .moveItemIntoCourse(this.MoveItemToCourseForm)
        .then((response) => {
          this.SingleCourse = response.data
          this.NewCoursableItem = Logic.Common.makeid(16)
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          //
        })
    }
  }

  public UpdateCourseSection = () => {
    if (this.UpdateCourseSectionForm) {
      return $api.study.course
        .updateCourseSections(this.UpdateCourseSectionForm)
        .then((response) => {
          this.SingleCourse = response.data
        })
        .catch((error) => {
          //
        })
    }
  }

  public PublishCourse = (id: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.study.course
      .publishCourse(id)
      .then((response) => {
        this.SingleCourse = response.data
        Logic.Common.hideLoader()
      })
      .catch((error) => {
        //
        Logic.Common.hideLoader()
      })
  }

  public FreezeCourse = (id: string) => {
    return $api.study.course
      .freezeCourse(id)
      .then((response) => {
        this.SingleCourse = response.data
      })
      .catch((error) => {
        //
      })
  }

  public CreateFile = (formIsValid: boolean) => {
    if (formIsValid && this.CreateFileForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.study.file
        .post(null, this.CreateFileForm)
        .then((response) => {
          this.SingleFile = response.data
          Logic.Common.hideLoader()
          return this.SingleFile
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  public UpdateFile = (formIsValid: boolean, id: string) => {
    if (formIsValid && this.UpdateFileForm) {
      return $api.study.file
        .put(null, id, this.UpdateFileForm)
        .then((response) => {
          this.UpdatedFile = response.data
        })
        .catch((errro) => {
          //
        })
    }
  }
  public DeleteTag = (id: string) => {
    return $api.interactions.tag
      .delete(id)
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public DeleteFolder = (id: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.study.folder
      .delete(id)
      .then(() => {
        Logic.Common.hideLoader()
        Logic.Study.GetFolders({
          where: [
            {
              field: 'user.id',
              value: Logic.Auth.AuthUser?.id,
              condition: Conditions.eq,
            },
          ],
        })
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public DeleteQuiz = (id: string) => {
    return $api.study.quiz
      .delete(id)
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public DeleteQuestion = (id: string, quizId: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.study.quiz
      .deleteQuestion(quizId, id)
      .then((response) => {
        Logic.Study.GetQuestions(quizId)
        Logic.Common.hideLoader()
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  public DeleteCourse = (id: string) => {
    return $api.study.course
      .delete(id)
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public DeleteFile = (id: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.study.file
      .delete(id)
      .then((response) => {
        Logic.Common.hideLoader()
        return response.data
      })
      .catch((error) => {
        //
      })
  }
}
