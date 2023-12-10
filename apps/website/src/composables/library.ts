import {
  Course,
  Game,
  Logic, PlayStatus, Quiz,
  ResourceType,
  Test
} from 'sofa-logic'
import { capitalize, reactive, ref } from 'vue'
import { selectedQuizId, selectedQuizMode } from './quiz'

const AllQuzzies = ref(Logic.Study.AllQuzzies)

const showStudyMode = ref(false)

const reportMaterialSetup = reactive<{
  show: boolean
  type: 'course' | 'quiz'
  id: string
}>({
  show: false,
  type: 'course',
  id: '',
})

export const selectedFolderMaterailToAdd = ref<{ id: string, type: string }>()

export const saveToFolder = (activity: { id: string, type: string }) => {
  selectedFolderMaterailToAdd.value = activity
}

export const createQuizData = (quiz: Quiz): ResourceType => {
  return {
    title: quiz.title,
    image: quiz.photo ? quiz.photo.link : '/images/default.png',
    labels: {
      color: 'pink',
      main: 'Quiz - Learn',
      sub: `${quiz.questions.length} questions`,
    },
    progress: 0,
    subject: Logic.Study.GetTagName(quiz.topicId),
    routePath: '/quiz/create?id=' + quiz.id,
    id: quiz.id,
    status: quiz.status,
    showMore: false,
    userId: quiz.user.id,
    type: 'quiz',
    authUserId: Logic.Auth.AuthUser.id,
    user: quiz.user,
    ratings: quiz.ratings,
    createdAt: quiz.createdAt,
  }
}

export const createCourseData = (course: Course): ResourceType => {
  return {
    title: course.title,
    image: course.photo ? course.photo.link : '/images/default.png',
    labels: {
      color: 'orange',
      main: 'Course',
      sub: `${course.sections.length} topics`,
    },
    progress: 0,
    subject: Logic.Study.GetTagName(course.topicId),
    user: course.user,
    authUserId: Logic.Auth.AuthUser?.id,
    routePath: '/course/create?id=' + course.id,
    id: course.id,
    status: course.status,
    showMore: false,
    userId: course.user.id,
    type: 'course',
    ratings: course.ratings,
    createdAt: course.createdAt,
  }
}

export const createGameData = (p: Game, quizzes: Quiz[]) => {
  const currentQuiz = quizzes.find((i) => i.id == p.quizId)
  const ended = [PlayStatus.scored, PlayStatus.ended].includes(p.status)
  const allScores = ended ? Object.values(p.scores).sort((a, b) => b - a) : []
  const userPosition = allScores.indexOf(p.scores[Logic.Auth.AuthUser.id])

  return {
    id: p.id,
    inProgress: !ended,
    createdAt: p.createdAt,
    image: currentQuiz?.photo?.link || '/images/default.png',
    label: Logic.Common.ordinal_suffix_of(userPosition !== -1 ? userPosition + 1 : p.participants.length),
    label_color: 'text-[#3296C8]',
    title: currentQuiz?.title || 'Unknown quiz',
    type: 'game',
    participants: p.participants.length,
    action: () => {
      Logic.Common.GoToRoute(`/games/${p.id}/${ended ? 'results' : 'lobby'}`)
    },
  }
}

export const createTestData = (p: Test, quizzes: Quiz[]) => {
  const currentQuiz = quizzes.find((i) => i.id == p.quizId)
  const ended = [PlayStatus.scored, PlayStatus.ended].includes(p.status)
  const userCorrectAnswers = (p.scores[Logic.Auth.AuthUser.id] ?? 0) / 10
  const percentage = (userCorrectAnswers / p.questions.length) * 100
  const textColor = percentage >= 90 ? 'text-[#4BAF7D]' :
    percentage >= 70 ? 'text-[#ADAF4B]' : percentage >= 50 ? 'text-[#3296C8]' : 'text-primaryRed'
  return {
    id: p.id,
    inProgress: !ended,
    createdAt: p.createdAt,
    image: currentQuiz?.photo?.link || '/images/default.png',
    label: `${percentage ? percentage.toFixed() : '0'}%`,
    label_color: textColor,
    title: currentQuiz?.title || 'Unknown quiz',
    type: 'test',
    action: () => {
      Logic.Common.GoToRoute(`/tests/${p.id}/${ended ? 'results' : 'lobby'}`)
    },
  }
}

const addMaterialToFolder = (
  folderId: string,
  type: 'quizzes' | 'courses',
  itemId: string,
  add: boolean,
) => {
   Logic.Study.SaveItemToFolderForm = {
    add,
    id: folderId,
    propIds: [itemId],
    type,
  }

  Logic.Study.SaveItemToFolder(true)
}

const openQuiz = <T extends Pick<ResourceType, 'status' | 'user' | 'id'>>(activity: T) => {
  if (
    activity.status == 'draft' &&
    activity.user.id === Logic.Users.UserProfile?.id
  )
    return Logic.Common.GoToRoute(`/quiz/create?id=${activity.id}`)
  selectedQuizId.value = activity.id
  showStudyMode.value = true
  selectedQuizMode.value = ''
}

const openCourse = (activity: ResourceType) => {
  if (
    activity.status == 'draft' &&
    activity.user.id === Logic.Users.UserProfile?.id
  )
    return Logic.Common.GoToRoute(`/course/create?id=${activity.id}`)
  Logic.Common.GoToRoute(`/course/${activity.id}`)
}

const showMoreOptionHandler = (data: ResourceType) => {
  showMoreOptions.value = true
  selectedItem.value = data
  data.showMore = true
}

const reportMaterial = (type: any, name: string, id: string) => {
  reportMaterialSetup.type = type
  reportMaterialSetup.id = id
  reportMaterialSetup.show = true
}

const sendReportMaterial = (data: any) => {
  Logic.Interactions.CreateReportForm = {
    entity: {
      id: reportMaterialSetup.id,
      type: reportMaterialSetup.type == 'course' ? 'courses' : 'quizzes',
    },
    message: data.review,
  }

  Logic.Interactions.CreateReport(true)
}

const selectedItem = ref<ResourceType | undefined>(undefined)

const showMoreOptions = ref(false)

const shareMaterialLink = async (
  type: 'quiz' | 'course',
  link: string,
  title: string,
) => {
  const baseUrl = window.location.origin
  Logic.Common.share(`${capitalize(type)} on SOFA`, `View ${title} on SOFA`, `${baseUrl}${link}`)
}

const moreOptions = reactive([
  {
    icon: 'edit-option',
    title: 'Edit',
    show: () => selectedItem.value?.user.id === Logic.Users.UserProfile?.id,
    action: () => {
      showMoreOptions.value = false
      if (selectedItem.value?.type == 'course') {
        Logic.Common.GoToRoute(`/course/create?id=${selectedItem.value?.id}`)
      }

      if (selectedItem.value?.type == 'quiz') {
        Logic.Common.GoToRoute(`/quiz/create?id=${selectedItem.value?.id}`)
      }
    },
  },
  {
    icon: 'share-option',
    title: 'Share',
    show: () => selectedItem.value?.status == 'published',
    action: () => {
      showMoreOptions.value = false
      shareMaterialLink(
        selectedItem.value?.type ?? ('' as any),
        `/marketplace/${selectedItem.value?.id}?type=${selectedItem.value?.id}`,
        selectedItem.value?.title ?? '',
      )
    },
  },
  {
    icon: 'report-option',
    title: 'Report',
    show: () => selectedItem.value?.user.id != Logic.Users.UserProfile?.id,
    action: () => {
      showMoreOptions.value = false
      reportMaterial(
        selectedItem.value?.type,
        selectedItem.value?.title,
        selectedItem.value?.id,
      )
    },
  },
  {
    icon: 'save',
    title: 'Save/unsave to folder',
    show: () => selectedItem.value?.status == 'published',
    action: () => {
      showMoreOptions.value = false
      saveToFolder(selectedItem.value)
    },
  },
])

export {
  AllQuzzies, addMaterialToFolder, moreOptions, openCourse, openQuiz,
  reportMaterial, reportMaterialSetup, selectedItem, sendReportMaterial,
  shareMaterialLink, showMoreOptionHandler, showMoreOptions, showStudyMode
}
