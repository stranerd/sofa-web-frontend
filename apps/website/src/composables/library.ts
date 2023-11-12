import { Logic } from 'sofa-logic'
import {
    Course,
    Folder,
    Quiz,
    ResourceType,
} from 'sofa-logic/src/logic/types/domains/study'
import { capitalize, reactive, ref } from 'vue'
import { ContentDetails } from './marketplace'
import { selectedQuizId, selectedQuizMode } from './quiz'

interface PlayResource {
  image: string
  title: string
  type: string
  label_color: string
  label: string
  id: string
  entity_type: 'game' | 'test'
  participants?: number
  // eslint-disable-next-line @typescript-eslint/ban-types
  action: Function
}

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

const FolderOptions = ref<ResourceType[]>([])

const selectedFilter = ref('in-progress')

const showStudyMode = ref(false)

const showDeleteFolder = ref(false)

const showAddItemToFolder = ref(false)

const selectedItemId = ref('in_progress-all')

const selectedFolderFilter = ref('all')

const selectedQuizFilter = ref('recent')

const selectedCourseFilter = ref('recent')

const selectedInProgressFilter = ref('all')

const selectedResultFilter = ref('all')

const reportMaterialSetup = reactive<{
  show: boolean
  type: 'course' | 'quiz'
  id: string
}>({
  show: false,
  type: 'course',
  id: '',
})

const allContentCategories = [
  'quizzes',
  'courses',
  'purchased',
  'in-progress',
  'results',
]

const showSaveToFolder = ref(false)

const addFolderIsActive = ref(false)

const selectedFolderMaterailToAdd = ref<ResourceType | ContentDetails>()

const currentFolder = reactive({
  id: '',
  name: '',
})

const currentFolderItems = ref<{
  quiz: string[]
  course: string[]
}>({
  quiz: [],
  course: [],
})

const libraryTypeList = reactive([
  {
    title: 'In progress',
    selected: true,
    icon: 'in-progress',
    id: 'in-progress',
    routePath: '/library/in-progress',
    options: [
      {
        name: 'All',
        active: true,
        id: 'in_progress-all',
      },
      {
        name: 'Tests',
        active: false,
        id: 'in_progress-tests',
      },
      {
        name: 'Games',
        active: false,
        id: 'in_progress-games',
      },
    ],
  },
  {
    title: 'Quizzes',
    selected: false,
    id: 'quizzes',
    icon: 'quiz',
    routePath: '/library/quizzes',
    options: [
      {
        name: 'Recent',
        active: true,
        id: 'quiz-recent',
      },
      {
        name: 'Saved',
        active: false,
        id: 'quiz-saved',
      },
      {
        name: 'Published',
        active: false,
        id: 'quiz-published',
      },
      {
        name: 'Draft',
        active: false,
        id: 'quiz-draft',
      },
    ],
  },
  {
    title: 'Courses',
    selected: false,
    icon: 'course-list',
    id: 'courses',
    routePath: '/library/courses',
    options: [
      {
        name: 'Recent',
        active: true,
        id: 'course-recent',
      },
      {
        name: 'Saved',
        active: false,
        id: 'course-saved',
      },
      {
        name: 'Published',
        active: false,
        id: 'course-published',
      },
      {
        name: 'Draft',
        active: false,
        id: 'course-draft',
      },
    ],
  },
  {
    title: 'Purchased',
    selected: false,
    icon: 'purchased',
    id: 'purchased',
    routePath: '/library/purchased',
    options: [],
  },
  {
    title: 'Results',
    selected: true,
    icon: 'results',
    id: 'results',
    routePath: '/library/results',
    options: [
      {
        name: 'All',
        active: true,
        id: 'results-all',
      },
      {
        name: 'Tests',
        active: false,
        id: 'results-tests',
      },
      {
        name: 'Games',
        active: false,
        id: 'results-games',
      },
    ],
  },
])

const folderFilterOption = reactive([
  {
    name: 'All',
    active: true,
    id: 'all',
  },
  {
    name: 'Courses',
    active: false,
    id: 'courses',
  },
  {
    name: 'Quizzes',
    active: false,
    id: 'quizzes',
  },
])

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

const organizationFilterOption = reactive([
  {
    name: 'All',
    active: true,
    id: 'all',
  },
  {
    name: 'Courses',
    active: false,
    id: 'courses',
  },
  {
    name: 'Quizzes',
    active: false,
    id: 'quizzes',
  },
])

const organizations = reactive([
  {
    name: '',
    selected: false,
    edit: false,
    hover: false,
    id: '',
  },
])

const quizzes = ref<ResourceType[]>([])

const currentQuizData = ref<ResourceType[]>([])

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
  }
}

const setQuizzes = () => {
  if (!AllQuzzies.value) return
  quizzes.value.length = 0

  AllQuzzies.value.results.forEach((quiz) => {
    const data = createQuizData(quiz)
    quizzes.value.push(data)

    // add to options
    if (FolderOptions.value.filter((item) => item.id == data.id).length == 0) {
      FolderOptions.value.push(data)
    }
  })
}

const currentCourseData = ref<ResourceType[]>([])

const courses = ref<ResourceType[]>([])

const setCourses = () => {
  if (!AllCourses.value) return
  courses.value.length = 0

  AllCourses.value?.results.forEach((course) => {
    const data = createCourseData(course)
    courses.value.push(data)

    // add to options
    if (FolderOptions.value.filter((item) => item.id == data.id).length == 0) {
      FolderOptions.value.push(data)
    }
  })
}

const inProgressItems = ref<PlayResource[]>([])

const resultItems = ref<PlayResource[]>([])

const currentInProgressItem = ref<PlayResource[]>([])

const currentResultItems = ref<PlayResource[]>([])

const setInProgressItems = () => {
  inProgressItems.value.length = 0

  AllGames.value?.results.forEach((game) => {
    if (game.status != 'ended' && game.status != 'scored') {
      const currentQuiz = GameAndTestQuizzes.value?.results.filter(
        (item) => item.id == game.quizId,
      )[0]

      inProgressItems.value.push({
        entity_type: 'game',
        id: game.id,
        image: currentQuiz?.photo?.link || '/images/default.png',
        label: game.status,
        label_color: 'text-[#3296C8]',
        title: currentQuiz?.title || 'Unknown quiz',
        type: 'Game',
        participants: game.participants.length,
        action: () => {
          Logic.Common.GoToRoute(
            `/quiz/${game.quizId}?mode=game&gameId=${game.id}`,
          )
        },
      })
    }
  })

  AllTests.value?.results.forEach((test) => {
    if (test.status != 'ended' && test.status != 'scored') {
      const currentQuiz = GameAndTestQuizzes.value?.results.filter(
        (item) => item.id == test.quizId,
      )[0]

      inProgressItems.value.push({
        entity_type: 'test',
        id: test.id,
        image: currentQuiz?.photo?.link || '/images/default.png',
        label: test.status,
        label_color: 'text-[#3296C8]',
        title: currentQuiz?.title || 'Unknown quiz',
        type: 'Test',
        action: () => {
          Logic.Common.GoToRoute(
            `/quiz/empty?mode=tutor_test&testId=${test.id}&is_student=yes`,
          )
        },
      })
    }
  })
}

const setResultItems = async () => {
  resultItems.value.length = 0

  AllGames.value?.results.forEach((game) => {
    if (game.status == 'ended' || game.status == 'scored') {
      const currentQuiz = GameAndTestQuizzes.value?.results.filter(
        (item) => item.id == game.quizId,
      )[0]

      const allScores = Object.values(game.scores).sort(function (
        a: number,
        b: number,
      ) {
        return b - a
      })

      const userPosition = allScores.indexOf(
        game.scores[Logic.Auth.AuthUser.id],
      )
      resultItems.value.push({
        entity_type: 'game',
        id: game.id,
        image: currentQuiz?.photo?.link || '/images/default.png',
        label: Logic.Common.ordinal_suffix_of(userPosition + 1),
        label_color: 'text-[#3296C8]',
        title: currentQuiz?.title || 'Unknown quiz',
        type: 'Game',
        participants: game.participants.length,
        action: () => {
          Logic.Common.showLoader({
            loading: false,
            show: true,
            type: 'warning',
            message: 'Game already ended',
          })
        },
      })
    }
  })

  AllTests.value?.results.forEach((test) => {
    if (test.status == 'ended' || test.status == 'scored') {
      const currentQuiz = GameAndTestQuizzes.value?.results.filter(
        (item) => item.id == test.quizId,
      )[0]

      const userCorrectAnswers = test.scores[Logic.Auth.AuthUser.id] / 10

      const percentage = (userCorrectAnswers / test.questions.length) * 100

      let textColor = 'text-[#ADAF4B]'

      if (percentage >= 90) {
        textColor = 'text-[#4BAF7D]'
      } else if (percentage >= 70) {
        textColor = 'text-[#ADAF4B]'
      } else if (percentage >= 50) {
        textColor = 'text-[#3296C8]'
      } else {
        textColor = 'text-primaryRed'
      }

      resultItems.value.push({
        entity_type: 'test',
        id: test.id,
        image: currentQuiz?.photo?.link || '/images/default.png',
        label: `${percentage ? percentage.toFixed() : '0'}%`,
        label_color: textColor,
        title: currentQuiz?.title || 'Unknown quiz',
        type: 'Test',
        action: () => {
          Logic.Common.showLoader({
            loading: false,
            show: true,
            type: 'warning',
            message: 'Test already ended',
          })
        },
      })
    }
  })
}

const recentMaterials = ref<ResourceType[]>([])

const currentRecentData = ref<ResourceType[]>([])

const setRecentItems = () => {
  if (!RecentMaterials.value) return

  recentMaterials.value.length = 0

  RecentMaterials.value?.forEach((material) => {
    const data =
      material.__type == 'CourseEntity'
        ? createCourseData(material)
        : createQuizData(material)
    recentMaterials.value.push(data)
  })
}

const currentPurchasedData = ref<ResourceType[]>([])

const PurchasedData = ref<ResourceType[]>([])

const setPurchasedData = () => {
  if (!PurchasedCourses.value) return
  PurchasedData.value.length = 0

  PurchasedCourses.value?.results.forEach((course) => {
    const data = createCourseData(course)
    PurchasedData.value.push(data)

    // add to options
    if (FolderOptions.value.filter((item) => item.id == data.id).length == 0) {
      FolderOptions.value.push(data)
    }
  })
}

const folderQuizzes = reactive<ResourceType[]>([])
const folderCourses = reactive<ResourceType[]>([])

const setFolders = () => {
  if (!AllFolders.value) return
  folders.length = 0
  folderCourses.length = 0
  folderQuizzes.length = 0
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

  folderCourses.push(
    ...(AllFoldersCourses.value?.map((course) => createCourseData(course)) ||
      []),
  )
  folderQuizzes.push(
    ...(AllFoldersQuizzes.value?.map((quiz) => createQuizData(quiz)) || []),
  )
}

const FolderItems = ref<ResourceType[]>([])

const setFolderItems = () => {
  if (
    !allContentCategories.includes(selectedFilter.value) &&
    SingleFolder.value
  ) {
    selectedItemId.value = ''
    FolderItems.value.length = 0
    currentFolderItems.value.course.length = 0
    currentFolderItems.value.quiz.length = 0
    SingleFolder.value?.courses?.forEach((course) => {
      const data = createCourseData(course)
      FolderItems.value.push(data)
      currentFolderItems.value.course.push(course.id)
    })

    SingleFolder.value?.quizzes?.forEach((quiz) => {
      const data = createQuizData(quiz)
      FolderItems.value.push(data)
      currentFolderItems.value.quiz.push(quiz.id)
    })
  }
}

const selectedFolderItems = ref<ResourceType[]>([])

const filterItem = () => {
  const type = selectedItemId.value.split('-')[0]
  const status = selectedItemId.value.split('-')[1]

  if (type == 'quiz') {
    if (status == 'recent') {
      currentQuizData.value = recentMaterials.value.filter(
        (item) => item.type == 'quiz',
      )
    } else if (status == 'saved') {
      currentQuizData.value = folderQuizzes
    } else {
      currentQuizData.value = quizzes.value.filter(
        (quiz) => quiz.status == status,
      )
    }
  } else if (type == 'course') {
    if (status == 'recent') {
      currentCourseData.value = recentMaterials.value.filter(
        (item) => item.type == 'course',
      )
    } else {
      currentCourseData.value = courses.value.filter(
        (course) => course.status == status,
      )
    }
  } else if (type == 'purchased') {
    if (status == 'all') {
      currentPurchasedData.value = PurchasedData.value
    } else if (status == 'saved') {
      currentQuizData.value = folderCourses
    } else {
      if (status == 'courses') {
        currentPurchasedData.value = PurchasedData.value
      } else {
        currentPurchasedData.value = []
      }
    }
  } else if (type == 'in_progress') {
    if (status == 'all') {
      currentInProgressItem.value = inProgressItems.value
    } else if (status == 'tests') {
      currentInProgressItem.value = inProgressItems.value.filter(
        (item) => item.entity_type == 'test',
      )
    } else if (status == 'games') {
      currentInProgressItem.value = inProgressItems.value.filter(
        (item) => item.entity_type == 'game',
      )
    }
  } else if (type == 'results') {
    if (status == 'all') {
      currentResultItems.value = resultItems.value
    } else if (status == 'tests') {
      currentResultItems.value = resultItems.value.filter(
        (item) => item.entity_type == 'test',
      )
    } else if (status == 'games') {
      currentResultItems.value = resultItems.value.filter(
        (item) => item.entity_type == 'game',
      )
    }
  } else {
    if (selectedFolderFilter.value == 'all') {
      selectedFolderItems.value = FolderItems.value
    } else if (selectedFolderFilter.value == 'courses') {
      selectedFolderItems.value = FolderItems.value.filter((item) => {
        return item.labels.main.toLocaleLowerCase().includes('course')
      })
    } else if (selectedFolderFilter.value == 'quizzes') {
      selectedFolderItems.value = FolderItems.value.filter((item) => {
        return item.labels.main.toLocaleLowerCase().includes('quiz')
      })
    }
  }
}

const addFolder = () => {
  addFolderIsActive.value = true
  const tempId = Logic.Common.makeid(12)
  folders.push({
    name: '',
    edit: true,
    hover: false,
    selected: false,
    id: tempId,
    items: [],
  })
}

const saveFolder = (name: string, tempId: string) => {
  if (addFolderIsActive.value == false) return
  Logic.Study.CreateFolderForm = {
    title: name,
  }

  Logic.Study.CreateFolder(true).then((data: Folder) => {
    if (data) {
      folders.forEach((folder) => {
        if (folder.id == tempId) {
          folder.id = data?.id
        }
      })
      addFolderIsActive.value = false
      selectedFilter.value == data.id
    }
  })
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

const handleFolderNameBlur = () => {
  if (currentFolder.name) {
    if (addFolderIsActive.value) {
      saveFolder(currentFolder.name, currentFolder.id)
    } else {
      updateFolder(currentFolder.name, currentFolder.id)
    }

    currentFolder.id = ''
    currentFolder.name = ''
  } else {
    addFolderIsActive.value = false
    folders.pop()
  }
}

const updateFolder = (title: string, id: string) => {
  Logic.Common.debounce(() => {
    Logic.Study.UpdateFolderForm = {
      title,
    }
    Logic.Study.UpdateFolder(true, id).then(() => {
      //
    })
  }, 500)
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
      selectedFolderMaterailToAdd.value = selectedItem.value
      showSaveToFolder.value = true
    },
  },
])

export {
    AllCourses, AllFolders, AllFoldersCourses, TutorQuizzes,
    AllFoldersQuizzes, AllGames, AllQuzzies, AllTests, FolderOptions, GameAndTestQuizzes, PurchasedCourses, RecentMaterials, SingleFolder, addFolder, addFolderIsActive, addMaterialToFolder, allContentCategories, createCourseData, createQuizData, currentCourseData, currentFolder, currentFolderItems, currentInProgressItem, currentPurchasedData, currentQuizData, currentRecentData, currentResultItems, deleteFolder, filterItem, folderFilterOption,
    folders, handleFolderNameBlur, inProgressItems, libraryTypeList, moreOptions, openCourse, openQuiz, organizationFilterOption,
    organizations, reportMaterial, reportMaterialSetup, resultItems, saveFolder, saveItemsToFolder, selectedCourseFilter, selectedFilter, selectedFolderFilter, selectedFolderItems, selectedFolderMaterailToAdd, selectedInProgressFilter, selectedItem, selectedItemId, selectedQuizFilter, selectedResultFilter, sendReportMaterial, setCourses, setFolderItems, setFolders, setInProgressItems, setPurchasedData, setQuizzes, setRecentItems, setResultItems, shareMaterialLink, showAddItemToFolder, showDeleteFolder, showMoreOptionHandler, showMoreOptions, showSaveToFolder, showStudyMode, updateFolder
}
