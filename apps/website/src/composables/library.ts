import {
  Course,
  Logic, Quiz,
  ResourceType
} from 'sofa-logic'
import { capitalize, computed, reactive, ref } from 'vue'
import { selectedQuizId, selectedQuizMode } from './quiz'

const AllQuzzies = ref(Logic.Study.AllQuzzies)
const TutorQuizzes = ref(Logic.Study.TutorQuizzes)
const AllCourses = ref(Logic.Study.AllCourses)
const PurchasedCourses = ref(Logic.Study.PurchasedCourses)
const AllFolders = ref(Logic.Study.AllFolders)
const AllFoldersCourses = ref(Logic.Study.AllFoldersCourses)
const AllFoldersQuizzes = ref(Logic.Study.AllFoldersQuizzes)
const GameAndTestQuizzes = ref(Logic.Plays.GameAndTestQuizzes)

const AllTests = ref(Logic.Plays.AllTests)
const AllGames = ref(Logic.Plays.AllGames)

const SingleFolder = ref(Logic.Study.SingleFolder)
const RecentMaterials = ref(Logic.Study.RecentMaterials)

const showStudyMode = ref(false)

const showDeleteFolder = ref(false)

const showAddItemToFolder = ref(false)

const reportMaterialSetup = reactive<{
  show: boolean
  type: 'course' | 'quiz'
  id: string
}>({
  show: false,
  type: 'course',
  id: '',
})

const showSaveToFolder = ref(false)

const addFolderIsActive = ref(false)

const selectedFolderMaterailToAdd = ref<{ id: string, type: string }>()

const currentFolder = reactive({
  id: '',
  name: '',
})

const folders = reactive<
  {
    name: string
    selected: boolean
    edit: boolean
    hover: boolean
    id: string
    items: string[]
  }[]
>([])

const createQuizData = (quiz: Quiz): ResourceType => {
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

const createCourseData = (course: Course): ResourceType => {
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

export const plays = computed(() => [
  AllGames.value?.results.map((p) => {
    const currentQuiz = GameAndTestQuizzes.value?.results.find((i) => i.id == p.quizId)
    const ended = ["scored", "ended"].includes(p.status)
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
        ended ? Logic.Common.showLoader({
          loading: false,
          show: true,
          type: 'warning',
          message: 'Game already ended',
        }) : Logic.Common.GoToRoute(`/quiz/${p.quizId}?mode=game&gameId=${p.id}`)
      },
    }
  }) ?? [],
  AllTests.value?.results.map((p) => {
    const currentQuiz = GameAndTestQuizzes.value?.results.find((i) => i.id == p.quizId)
    const ended = ["scored", "ended"].includes(p.status)
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
        ended ? Logic.Common.showLoader({
          loading: false,
          show: true,
          type: 'warning',
          message: 'Test already ended',
        }) : Logic.Common.GoToRoute(`/quiz/${p.quizId}?mode=tutor_test&testId=${p.id}&is_student=yes`)
      },
    }
  }) ?? [],
].flat().sort((a, b) => b.createdAt - a.createdAt))

export const recentEntities = computed(() => RecentMaterials.value?.map((m) => m.__type === "CourseEntity" ? createCourseData(m) : createQuizData(m)) ?? [])

const setFolders = () => {
  if (!AllFolders.value) return
  folders.length = 0
  AllFolders.value?.results.forEach((folder) => {
    folders.push({
      name: folder.title,
      edit: false,
      hover: false,
      id: folder.id,
      selected: false,
      items: [
        ...(folder.saved.courses?.map((item) => item) || []),
        ...(folder.saved.quizzes?.map((item) => item) || []),
      ],
    })
  })
}

const selectedFolderItems = ref<ResourceType[]>([])

const addFolder = async () => {
  addFolderIsActive.value = true

  const title = `New folder (${Logic.Common.makeid(4)})`

  await Logic.Study.CreateFolder({ title })
  await Logic.Study.GetFolders({ all: true }, true)
  setFolders()
  const folder = folders.find((f) => f.name === title)
  if (folder) folder.edit = true
}

const addMaterialToFolder = (
  folderId: string,
  type: 'quiz' | 'course',
  itemId: string,
  add: boolean,
) => {
  const selectedFolder = AllFolders.value.results.filter((item) => {
    return item.id == folderId
  })

  if (selectedFolder.length) {
    if (type == 'course') {
      saveItemsToFolder(folderId, 'courses', [itemId], add)
    }

    if (type == 'quiz') {
      saveItemsToFolder(folderId, 'quizzes', [itemId], add)
    }

    AllFolders.value?.results.forEach((item) => {
      if (item.id == selectedFolder[0].id) {
        if (type == 'course') {
          if (add) {
            item.saved.courses.push(itemId)
          } else {
            item.saved.courses = item.saved.courses.filter(
              (eachId) => eachId != itemId,
            )
          }
        }

        if (type == 'quiz') {
          if (add) {
            item.saved.quizzes.push(itemId)
          } else {
            item.saved.quizzes = item.saved.quizzes.filter(
              (eachId) => eachId != itemId,
            )
          }
        }
      }
    })
  }
}

const handleFolderNameBlur = async () => {
  if (currentFolder.id && currentFolder.name) {
    Logic.Common.debounce(async () => {
      await Logic.Study.UpdateFolder(currentFolder.id, { title: currentFolder.name })
      await Logic.Study.GetFolders({ all: true }, true)
      setFolders()
    }, 500)
  } else {
    addFolderIsActive.value = false
    folders.pop()
  }
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

const saveItemsToFolder = (
  folderId: string,
  type: 'courses' | 'quizzes',
  items: string[],
  add: boolean,
) => {
  Logic.Study.SaveItemToFolderForm = {
    add,
    id: folderId,
    propIds: items,
    type,
  }

  Logic.Study.SaveItemToFolder(true).then((data) => {
    if (data) {
      Logic.Study.GetFolder(folderId)
      setFolders()
    }
  })
}

const deleteFolder = (id: string) => {
  Logic.Study.DeleteFolder(id).then(() => {
    showDeleteFolder.value = false
  })
  if (
    [`library?filter=${id}`, `/library/folders?filter=${id}`].includes(
      Logic.Common.route.fullPath,
    )
  )
    Logic.Common.GoToRoute('/library')
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

  const finalLink = `${baseUrl}${link}`
  // for web
  const shareData = {
    title: `${capitalize(type)} on SOFA`,
    text: `View ${title} on SOFA`,
    url: finalLink,
  }

  try {
    await navigator.share(shareData)
    Logic.Common.showLoader({
      show: true,
      loading: false,
      message: 'Link shared.',
      type: 'success',
    })
  } catch (err) {
    Logic.Common.copytext(finalLink)
    // show alert
    Logic.Common.showLoader({
      show: true,
      loading: false,
      message: 'Link copied to your clipboard!',
      type: 'success',
    })
  }
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
      selectedFolderMaterailToAdd.value = selectedItem.value
      showSaveToFolder.value = true
    },
  },
])

export {
  AllCourses, AllFolders, AllFoldersCourses, AllFoldersQuizzes, AllGames, AllQuzzies, AllTests, GameAndTestQuizzes, PurchasedCourses, RecentMaterials, SingleFolder, TutorQuizzes, addFolder, addFolderIsActive, addMaterialToFolder, createCourseData, createQuizData, currentFolder, deleteFolder,
  folders, handleFolderNameBlur, moreOptions, openCourse, openQuiz,
  reportMaterial, reportMaterialSetup, saveItemsToFolder, selectedFolderItems, selectedFolderMaterailToAdd, selectedItem, sendReportMaterial, setFolders, shareMaterialLink, showAddItemToFolder, showDeleteFolder, showMoreOptionHandler, showMoreOptions, showSaveToFolder, showStudyMode
}
