import { Logic } from 'sofa-logic'
import { Conditions, SelectOption } from 'sofa-logic/src/logic/types/common'
import {
  CreateDocumentInput,
  UpdateCourseSectionsInput,
} from 'sofa-logic/src/logic/types/forms/study'
import { reactive, ref } from 'vue'

const courseSettingForm = reactive({
  title: '',
  description: '',
  visibility: '',
  tags: [],
  photo: undefined,
  topic: '',
  price: '0',
  contentType: '',
})

const allTopics = ref<SelectOption[]>([])
const allGenericTags = ref<SelectOption[]>([])
const contentTypeOptions = ref<SelectOption[]>([])

const courseSettingSaved = ref(false)

const updateCourseSectionForm = reactive<UpdateCourseSectionsInput>({
  sections: [],
  id: '',
})

const addCourseFileForm = reactive<CreateDocumentInput>({
  description: '',
  tagIds: [],
  title: '',
  type: '',
  media: undefined,
  topicId: '',
  id: '',
})

const getTopics = () => {
  Logic.Study.GetTags({
    where: [
      {
        field: 'type',
        value: 'topics',
        condition: Conditions.eq,
      },
    ],
  }).then((response) => {
    if (response) {
      const data = []
      response?.results.forEach((tag) => {
        data.push({
          key: tag.id,
          value: tag.title,
        })
      })
      allTopics.value.length = 0
      allTopics.value = data
    }
  })
}

const getGenericTags = () => {
  Logic.Study.GetTags({
    where: [
      {
        field: 'type',
        value: 'generic',
        condition: Conditions.eq,
      },
    ],
  }).then((response) => {
    if (response) {
      contentTypeOptions.value.length = 0
      const data = []
      response?.results.forEach((tag) => {
        if (
          tag.title == 'Past question' ||
          tag.title == 'Note' ||
          tag.title == 'Textbook solutions'
        ) {
          contentTypeOptions.value.push({
            key: tag.id,
            value: tag.title,
          })
        } else {
          data.push({
            key: tag.id,
            value: tag.title,
          })
        }
      })
      allGenericTags.value.length = 0
      allGenericTags.value = data
    }
  })
}

const createCourse = (formComp: any) => {
  if (!courseSettingForm.contentType) return

  const allTags = [...courseSettingForm.tags, courseSettingForm.contentType]
  Logic.Study.CreateCourseForm = {
    description: courseSettingForm.description,
    price: {
      amount: parseFloat(courseSettingForm.price.replace(/,/g, '')),
      currency: 'NGN',
    },
    tagIds: allTags,
    title: courseSettingForm.title,
    topicId: courseSettingForm.topic,
    photo: courseSettingForm.photo,
  }

  const formState: boolean = formComp.validate()
  courseSettingSaved.value = false
  Logic.Study.CreateCourse(formState)
    ?.then((data) => {
      if (data) {
        courseSettingSaved.value = true
        const newSection = [
          {
            items: [],
            label: `Section 1`,
          },
        ]

        updateCourseSectionForm.sections = newSection

        updateCourseSections()

        Logic.Common.hideLoader()
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const updateCourse = (formComp: any) => {
  if (!courseSettingForm.contentType) return
  const allTags = [...courseSettingForm.tags, courseSettingForm.contentType]
  Logic.Study.UpdateCourseForm = {
    description: courseSettingForm.description,
    price: {
      amount: parseFloat(courseSettingForm.price.replace(/,/g, '')),
      currency: 'NGN',
    },
    tagIds: allTags,
    title: courseSettingForm.title,
    topicId: courseSettingForm.topic,
    photo: courseSettingForm.photo,
  }

  const formState: boolean = formComp.validate()
  courseSettingSaved.value = false

  Logic.Study.UpdateCourse(formState, Logic.Study.SingleCourse.id)
    ?.then((data) => {
      if (data) {
        courseSettingSaved.value = true
        Logic.Common.hideLoader()
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const updateCourseSections = () => {
  if (Logic.Study.SingleCourse) {
    Logic.Study.UpdateCourseSectionForm = {
      id: Logic.Study.SingleCourse.id,
      sections: updateCourseSectionForm.sections,
    }
    Logic.Study.UpdateCourseSection().then(() => {
      //
    })
  }
}

const addCourseFile = () => {
  Logic.Study.CreateFileForm = {
    description: addCourseFileForm.description,
    tagIds: addCourseFileForm.tagIds,
    title: addCourseFileForm.title,
    type: addCourseFileForm.type,
    media: addCourseFileForm.media,
    topicId: addCourseFileForm.topicId,
    id: '',
  }

  Logic.Study.CreateFile(true).then((data) => {
    if (data) {
      // empty quiz
      Logic.Study.SingleQuiz = undefined
      // move item to course
      Logic.Study.MoveItemToCourseForm = {
        add: true,
        coursableId: Logic.Study.SingleFile.id,
        type: 'file',
        id: Logic.Study.SingleCourse.id,
      }
      Logic.Study.MoveItemToCourse(true)

      Logic.Common.showLoader({
        show: true,
        loading: false,
        message: 'Material added.',
        type: 'success',
      })
    }
  })
}

const addQuizToCourse = (quizId: string) => {
  Logic.Study.GetQuiz(quizId).then(() => {
    Logic.Study.SingleFile = undefined
    Logic.Study.MoveItemToCourseForm = {
      add: true,
      coursableId: quizId,
      type: 'quiz',
      id: Logic.Study.SingleCourse.id,
    }
    Logic.Study.MoveItemToCourse(true)

    Logic.Common.showLoader({
      show: true,
      loading: false,
      message: 'Quiz added.',
      type: 'success',
    })
  })
}

export {
  courseSettingForm,
  allTopics,
  courseSettingSaved,
  updateCourseSectionForm,
  addCourseFileForm,
  allGenericTags,
  contentTypeOptions,
  createCourse,
  updateCourse,
  getTopics,
  updateCourseSections,
  addCourseFile,
  addQuizToCourse,
  getGenericTags,
}
