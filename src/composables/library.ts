import { Logic } from 'sofa-logic'
import {
  ResourceType,
  Quiz,
  Course,
  Folder,
} from 'sofa-logic/src/logic/types/domains/study'
import { ref, reactive, capitalize } from 'vue'
import { selectedQuizId, selectedQuizMode } from './quiz'
import { ContentDetails } from './marketplace'

const AllQuzzies = ref(Logic.Study.AllQuzzies)
const AllCourses = ref(Logic.Study.AllCourses)
const PurchasedCourses = ref(Logic.Study.PurchasedCourses)
const AllFolders = ref(Logic.Study.AllFolders)
const SingleFolder = ref(Logic.Study.SingleFolder)
const RecentMaterials = ref(Logic.Study.RecentMaterials)

const FolderOptions = ref<ResourceType[]>([])

const selectedFilter = ref('quizzes')

const showStudyMode = ref(false)

const showDeleteFolder = ref(false)

const showAddItemToFolder = ref(false)

const selectedItemId = ref('quiz-recent')

const selectedFolderFilter = ref('all')

const selectedQuizFilter = ref('recent')

const selectedCourseFilter = ref('recent')

const allContentCategories = ['quizzes', 'courses', 'purchased']

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
  // {
  //   title: "In progress",
  //   selected: true,
  //   icon: "in-progress",
  //  id: 'in-progress',
  //   routePath: "/library/type",
  //   options: [
  //     {
  //       name: "All",
  //       active: true,
  //     },
  //     {
  //       name: "Quizzes",
  //       active: false,
  //     },
  //     {
  //       name: "Courses",
  //       active: false,
  //     },
  //   ],
  // },
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

const organisations = reactive([
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

const createQuizData = (quiz: Quiz) => {
  const data = {
    title: quiz.title,
    image: quiz.photo ? quiz.photo.link : '/images/default.png',
    labels: {
      color: 'pink',
      main: 'Quiz - Learn',
      sub: `${quiz.questions.length} questions`,
    },
    progress: 0,
    subject: Logic.Study.GetTagName(quiz.topicId),
    username:
      quiz.user?.id == Logic.Users.UserProfile?.id
        ? 'You'
        : quiz.user.bio.name.full,

    routePath: '/quiz/create?id=' + quiz.id,
    id: quiz.id,
    status: quiz.status,
    userPhoto: quiz.user.bio.photo ? quiz.user.bio.photo.link : '',
    createdAt: quiz.createdAt,
    showMore: false,
    userId: quiz.user.id,
    type: 'quiz',
  }
  return data
}

const createCourseData = (course: Course) => {
  const data = {
    title: course.title,
    image: course.photo ? course.photo.link : '/images/default.png',
    labels: {
      color: 'orange',
      main: 'Course',
      sub: `${course.sections.length} topics`,
    },
    progress: 0,
    subject: Logic.Study.GetTagName(course.topicId),
    username:
      course.user?.id == Logic.Users.UserProfile?.id
        ? 'You'
        : course.user.bio.name.full,

    routePath: '/course/create?id=' + course.id,
    id: course.id,
    status: course.status,
    userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
    createdAt: course.createdAt,
    showMore: false,
    userId: course.user.id,
    type: 'course',
  }

  return data
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
    })

    folderCourses.push(
      ...(folder.courses?.map((course) => createCourseData(course)) || []),
    )
    folderQuizzes.concat(
      ...(folder.quizzes?.map((quiz) => createQuizData(quiz)) || []),
    )
  })
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
) => {
  const selectedFolder = AllFolders.value.results.filter((item) => {
    return item.id == folderId
  })

  if (selectedFolder.length) {
    const folder = selectedFolder[0]
    const courses = folder.courses?.map((item) => item.id) || []
    const quizzes = folder.quizzes?.map((item) => item.id) || []

    if (type == 'course') {
      courses.push(itemId)

      saveItemsToFolder(folderId, 'courses', courses)
    }

    if (type == 'quiz') {
      quizzes.push(itemId)
      saveItemsToFolder(folderId, 'quizzes', quizzes)
    }
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

const showQuizOptions = (id: string) => {
  selectedQuizId.value = id
  showStudyMode.value = true
  selectedQuizMode.value = ''
}

const saveItemsToFolder = (
  folderId: string,
  type: 'courses' | 'quizzes',
  items: string[],
) => {
  Logic.Study.SaveItemToFolderForm = {
    add: true,
    id: folderId,
    propIds: items,
    type,
  }

  Logic.Study.SaveItemToFolder(true).then((data) => {
    if (data) {
      Logic.Study.GetFolder(folderId)
    }
  })
}

const deleteFolder = (id: string) => {
  Logic.Study.DeleteFolder(id).then(() => {
    showDeleteFolder.value = false
  })
}

const showMoreOptionHandler = (data: ResourceType, type: 'quiz' | 'course') => {
  showMoreOptions.value = true
  selectedItem.id = data.id
  selectedItem.type = type
  selectedItem.name = data.title
  data.showMore = true
}

const reportMaterial = (type: string, name: string, id: string) => {
  const queryMsg = `I have a feedback on the ${type} ${name} with ID - ${id}.`
  if (Logic.Common.mediaQuery() == 'sm' || Logic.Common.mediaQuery() == 'md') {
    Logic.Common.GoToRoute(`/settings/contact_us?query=${queryMsg}`)
  } else {
    Logic.Common.GoToRoute(`/settings?tab=contact_us&query=${queryMsg}`)
  }
}

const selectedItem = reactive<{
  id: string
  type: 'quiz' | 'course'
  name: string
}>({
  id: '',
  type: 'course',
  name: '',
})

const showMoreOptions = ref(false)

const shareMaterialLink = async (
  type: 'quiz' | 'course',
  link: string,
  title: string,
) => {
  // for web
  const shareData = {
    title: `${capitalize(type)} on SOFA`,
    text: `View ${title} on SOFA`,
    url: link,
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

const moreOptions = reactive([
  {
    icon: 'edit-option',
    title: 'Edit',
    action: () => {
      showMoreOptions.value = false
      if (selectedItem.type == 'course') {
        Logic.Common.GoToRoute(`/course/create?id=${selectedItem.id}`)
      }

      if (selectedItem.type == 'quiz') {
        Logic.Common.GoToRoute(`/quiz/create?id=${selectedItem.id}`)
      }
    },
  },
  {
    icon: 'share-option',
    title: 'Share',
    action: () => {
      showMoreOptions.value = false
      shareMaterialLink(
        selectedItem.type,
        `/${selectedItem.type}/create?id=${selectedItem.id}`,
        selectedItem.name,
      )
    },
  },
  {
    icon: 'report-option',
    title: 'Report',
    action: () => {
      showMoreOptions.value = false
      reportMaterial(selectedItem.type, selectedItem.name, selectedItem.id)
    },
  },
  {
    icon: 'remove-option',
    title: 'Remove from library',
    action: () => {
      //
    },
  },
])

export {
  AllQuzzies,
  AllCourses,
  PurchasedCourses,
  AllFolders,
  SingleFolder,
  FolderOptions,
  selectedFilter,
  showStudyMode,
  showAddItemToFolder,
  selectedItemId,
  selectedFolderFilter,
  selectedQuizFilter,
  selectedCourseFilter,
  allContentCategories,
  libraryTypeList,
  folderFilterOption,
  folders,
  currentQuizData,
  currentCourseData,
  currentPurchasedData,
  selectedFolderItems,
  currentFolderItems,
  showDeleteFolder,
  organizationFilterOption,
  organisations,
  selectedItem,
  showMoreOptions,
  moreOptions,
  RecentMaterials,
  currentRecentData,
  showSaveToFolder,
  currentFolder,
  addFolderIsActive,
  selectedFolderMaterailToAdd,
  setRecentItems,
  handleFolderNameBlur,
  showMoreOptionHandler,
  saveItemsToFolder,
  createQuizData,
  setQuizzes,
  setCourses,
  setPurchasedData,
  setFolders,
  setFolderItems,
  filterItem,
  addFolder,
  updateFolder,
  deleteFolder,
  showQuizOptions,
  createCourseData,
  reportMaterial,
  saveFolder,
  addMaterialToFolder,
}
