import { Conditions, Course, Logic, QueryParams, Quiz, SingleUser } from 'sofa-logic'
import { reactive, ref } from 'vue'

export interface ContentDetails {
  id: string
  subject?: string
  title?: string
  image?: string
  labels?: {
    main: string
    sub: string
    color: string
  }
  user: SingleUser
  authUserId: string | undefined
  price?: number
  ratings: {
    avg: number
    count: number
    total: number
  }
  type?: 'quiz' | 'course'
}

const AllCourses = ref(Logic.Study.AllCourses)
const HomeMaterials = ref(Logic.Study.HomeMaterials)
const MarketplaceMaterials = ref(Logic.Study.MarketplaceMaterials)
const notesContents = ref<ContentDetails[]>([])

const homeContents = reactive<{
  recent: ContentDetails[]
  my_org: ContentDetails[]
  suggested: ContentDetails[]
}>({
  recent: [],
  my_org: [],
  suggested: [],
})

const marketplaceContents = reactive<{
  lastest: ContentDetails[]
  rated: ContentDetails[]
  popular: ContentDetails[]
}>({
  lastest: [],
  rated: [],
  popular: [],
})

const pastQuestionContents = ref<ContentDetails[]>([])

const textbookContents = ref<ContentDetails[]>([])

const mainCards = reactive([
  {
    image: '/images/past-question-explore.png',
    text: 'Past questions',
    routePath: '',
  },
  {
    image: '/images/note-explore.png',
    text: 'Notes',
    routePath: '',
  },
  {
    image: '/images/textbook-explore.png',
    text: 'Textbook solutions',
    routePath: '',
  },
])

const sectionTags = reactive({
  note: '',
  past_question: '',
  textbook: '',
})

const search = (query: QueryParams = {}, returnCoursables = false) => {
  Logic.Common.showLoader({
    loading: true,
    show: false,
  })

  query.sort = [
    {
      field: 'createdAt',
      desc: true,
    },
  ]

  query.where.push({
    field: 'status',
    value: 'published',
    condition: Conditions.eq,
  })
  query.limit = 20

  const allRequests: Promise<any>[] = []

  // course search request
  allRequests.push(
    new Promise((resolve) => {
      Logic.Study.GetCourses(query)
        .then(() => {
          resolve('')
        })
        .catch(() => {
          resolve('')
        })
    }),
  )

  // quiz search request
  allRequests.push(
    new Promise((resolve) => {
      if (returnCoursables) {
        query.where.push({
          field: 'courseId',
          value: 'null',
          condition: Conditions.eq,
        })
      }
      Logic.Study.GetQuizzes(query)
        .then(() => {
          resolve('')
        })
        .catch(() => {
          resolve('')
        })
    }),
  )

  Promise.all(allRequests)
    .then(() => {
      Logic.Common.hideLoader()
    })
    .catch((error) => {
      console.log(error)
    })
}

const setCourses = (count = 5) => {
  if (!AllCourses.value) return
  const noteTag = Logic.Study.AllOtherTags.results.filter(
    (item) => item.title == 'Note',
  )
  const pastQuestionTag = Logic.Study.AllOtherTags.results.filter(
    (item) => item.title == 'Past question',
  )
  const textbookTag = Logic.Study.AllOtherTags.results.filter(
    (item) => item.title == 'Textbook solutions',
  )

  sectionTags.note = noteTag.length ? noteTag[0].id : ''

  sectionTags.past_question = pastQuestionTag.length
    ? pastQuestionTag[0].id
    : ''
  sectionTags.textbook = textbookTag.length ? textbookTag[0].id : ''

  mainCards[0].routePath = `/marketplace/search?tagId=${sectionTags.past_question}&q=nill`
  mainCards[1].routePath = `/marketplace/search?tagId=${sectionTags.note}&q=nill`
  mainCards[2].routePath = `/marketplace/search?tagId=${sectionTags.textbook}&q=nill`

  const noteCourseArray: any[] = []
  const pastQuestionArray: any[] = []
  const textbookArray: any[] = []
  AllCourses.value.results.forEach((course) => {
    if (noteTag.length && course.tagIds.includes(noteTag[0].id)) {
      noteCourseArray.push({
        id: course.id,
        subject: Logic.Study.GetTagName(course.topicId),
        title: course.title,
        image: course.photo ? course.photo.link : '/images/default.png',
        labels: {
          main: 'Course',
          sub: `${course.coursables.length} materials`,
          color: 'orange',
        },
        username: course.user.bio.name.full,
        price: course.price.amount,
        ratings: course.ratings,
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
        type: 'course',
      })
    } else if (
      pastQuestionTag.length &&
      course.tagIds.includes(pastQuestionTag[0].id)
    ) {
      pastQuestionArray.push({
        id: course.id,
        subject: Logic.Study.GetTagName(course.topicId),
        title: course.title,
        image: course.photo ? course.photo.link : '/images/default.png',
        labels: {
          main: 'Course',
          sub: `${course.coursables.length} materials`,
          color: 'orange',
        },
        username: course.user.bio.name.full,
        price: course.price.amount,
        ratings: course.ratings,
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
        type: 'course',
      })
    } else {
      textbookArray.push({
        id: course.id,
        subject: Logic.Study.GetTagName(course.topicId),
        title: course.title,
        image: course.photo ? course.photo.link : '/images/default.png',
        labels: {
          main: 'Course',
          sub: `${course.coursables.length} materials`,
          color: 'orange',
        },
        username: course.user.bio.name.full,
        price: course.price.amount,
        ratings: course.ratings,
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
        type: 'course',
      })
    }
  })

  if (noteCourseArray.length) {
    notesContents.value = noteCourseArray
  }

  if (pastQuestionArray.length) {
    pastQuestionContents.value = pastQuestionArray
  }

  if (textbookArray.length) {
    textbookContents.value = textbookArray
  }

  if (notesContents.value.length > count) {
    notesContents.value = notesContents.value.slice(0, count)
  }
  if (pastQuestionContents.value.length > count) {
    pastQuestionContents.value = pastQuestionContents.value.slice(0, count)
  }
  if (textbookContents.value.length > count) {
    textbookContents.value = textbookContents.value.slice(0, count)
  }
}

const extractContent = (item: Quiz | Course): ContentDetails => {
  const type: 'course' | 'quiz' =
    item.__type == 'CourseEntity' ? 'course' : 'quiz'
  return {
    id: item.id,
    subject: Logic.Study.GetTagName(item.topicId),
    title: item.title,
    image: item.photo ? item.photo.link : '/images/default.png',
    labels: {
      main: item.__type == 'CourseEntity' ? 'Course' : 'Quiz',
      sub:
        item.__type == 'CourseEntity'
          ? `${item.coursables.length} materials`
          : `${item.questions.length} questions`,
      color: item.__type == 'CourseEntity' ? 'orange' : 'pink',
    },
    price: item.__type == 'CourseEntity' ? item.price?.amount : 0,
    user: item.user,
    authUserId: Logic.Auth.AuthUser.id,
    type,
    ratings: item.ratings,
  }
}

const setHomeMaterials = (count = 5) => {
  if (!HomeMaterials.value) return
  homeContents.my_org.length = 0
  homeContents.recent.length = 0
  homeContents.suggested.length = 0
  // set recent contents
  HomeMaterials.value.recent.forEach((item) => {
    homeContents.recent.push(extractContent(item))
  })
  if (homeContents.recent.length > count) {
    homeContents.recent = homeContents.recent.slice(0, count)
  }

  // set my organization contents
  HomeMaterials.value.my_org.forEach((item) => {
    homeContents.my_org.push(extractContent(item))
  })
  if (homeContents.my_org.length > count) {
    homeContents.my_org = homeContents.my_org.slice(0, count)
  }

  // set suggested contents
  HomeMaterials.value.suggested.forEach((item) => {
    homeContents.suggested.push(extractContent(item))
  })
  if (homeContents.suggested.length > count) {
    homeContents.suggested = homeContents.suggested.slice(0, count)
  }
}

const setMarketplaceMaterials = (count = 5) => {
  if (!MarketplaceMaterials.value) return
  marketplaceContents.lastest.length = 0
  marketplaceContents.popular.length = 0
  marketplaceContents.rated.length = 0

  // set latest contents
  MarketplaceMaterials.value.lastest.forEach((item) => {
    marketplaceContents.lastest.push(extractContent(item))
  })
  if (marketplaceContents.lastest.length > count) {
    marketplaceContents.lastest = marketplaceContents.lastest.slice(0, count)
  }

  // set popular contents
  MarketplaceMaterials.value.popular.forEach((item) => {
    marketplaceContents.popular.push(extractContent(item))
  })
  if (marketplaceContents.popular.length > count) {
    marketplaceContents.popular = marketplaceContents.popular.slice(0, count)
  }

  // set rated contents
  MarketplaceMaterials.value.rated.forEach((item) => {
    marketplaceContents.rated.push(extractContent(item))
  })
  if (marketplaceContents.rated.length > count) {
    marketplaceContents.rated = marketplaceContents.rated.slice(0, count)
  }
}

export {
  AllCourses, HomeMaterials, MarketplaceMaterials, homeContents, mainCards, marketplaceContents, notesContents, pastQuestionContents, search, sectionTags, setCourses,
  setHomeMaterials, setMarketplaceMaterials, textbookContents
}
