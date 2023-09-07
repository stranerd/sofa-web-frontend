import { Logic } from 'sofa-logic'
import {
  ResourceType,
  Quiz,
  Course,
  Folder,
} from 'sofa-logic/src/logic/types/domains/study'
import { ref, reactive } from 'vue'
import { selectedQuizId, selectedQuizMode } from './quiz'

const AllQuzzies = ref(Logic.Study.AllQuzzies)
const AllCourses = ref(Logic.Study.AllCourses)
const PurchasedCourses = ref(Logic.Study.PurchasedCourses)
const AllFolders = ref(Logic.Study.AllFolders)
const SingleFolder = ref(Logic.Study.SingleFolder)

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
    options: [
      {
        name: 'All',
        active: true,
        id: 'purchased-all',
      },
      {
        name: 'Courses',
        active: false,
        id: 'purchased-courses',
      },
      {
        name: 'Quizzes',
        active: false,
        id: 'purchased-quizzes',
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

const folders = reactive([
  {
    name: '400L Exam',
    selected: false,
    edit: false,
    hover: false,
    id: '',
  },
])

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
    })
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
      currentQuizData.value = quizzes.value
    } else {
      currentQuizData.value = quizzes.value.filter(
        (quiz) => quiz.status == status,
      )
    }
  } else if (type == 'course') {
    if (status == 'recent') {
      currentCourseData.value = courses.value
    } else {
      currentCourseData.value = courses.value.filter(
        (course) => course.status == status,
      )
    }
  } else if (type == 'purchased') {
    if (status == 'all') {
      currentPurchasedData.value = PurchasedData.value
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
  const tempId = Logic.Common.makeid(12)
  folders.push({
    name: '',
    edit: true,
    hover: false,
    selected: false,
    id: tempId,
  })

  Logic.Study.CreateFolderForm = {
    title: 'New folder',
  }

  Logic.Study.CreateFolder(true).then((data: Folder) => {
    if (data) {
      folders.forEach((folder) => {
        if (folder.id == tempId) {
          folder.id = data?.id
        }
      })
    }
  })
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
}
