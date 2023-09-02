import { Logic } from 'sofa-logic'
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
  username?: string
  userPhoto: string
  price?: number
}

const AllCourses = ref(Logic.Study.AllCourses)
const notesContents = ref<ContentDetails[]>([])

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

const search = (query = {}) => {
  Logic.Common.showLoader({
    loading: true,
    show: false,
  })
  Logic.Study.GetCourses(query)
    .then(() => {
      Logic.Common.hideLoader()
    })
    .catch(() => {
      Logic.Common.hideLoader()
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
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
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
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
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
        userPhoto: course.user.bio.photo ? course.user.bio.photo.link : '',
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

export {
  notesContents,
  textbookContents,
  pastQuestionContents,
  sectionTags,
  AllCourses,
  mainCards,
  setCourses,
  search,
}
