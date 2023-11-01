import { Logic } from 'sofa-logic'
import { SelectOption } from 'sofa-logic/src/logic/types/common'
import {
  CreateDocumentInput,
  UpdateCourseSectionsInput,
} from 'sofa-logic/src/logic/types/forms/study'
import { reactive, ref } from 'vue'

const courseSettingForm = reactive({
  title: '',
  description: '',
  tags: [],
  photo: undefined,
  topic: '',
  price: '0',
  tagString: '',
})

const allTopics = ref<SelectOption[]>([])
const allGenericTags = ref<SelectOption[]>([])

const courseSettingSaved = ref(false)
const hasUnsavedChanges = ref(false)

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

const  getTopics = (useId = false) => {
  const data = []
  Logic.Study.Tags?.results?.forEach((tag) => {
    if (tag.type == 'topics') {
      if (useId) {
        data.push({
          key: tag.id,
          value: tag.title,
        })
      } else {
        data.push({
          key: tag.title,
          value: tag.title,
        })
      }
    }
  })
  allTopics.value.length = 0
  allTopics.value = data
}

const getGenericTags = () => {
  const data = []
  Logic.Study.Tags?.results?.forEach((tag) => {
    if (tag.type == 'generic') {
      data.push({
        key: tag.title,
        value: tag.title,
      })
    }
  })
  allGenericTags.value.length = 0
  allGenericTags.value = data
}

const createCourse = (formComp: any) => {
  Logic.Study.CreateCourseForm = {
    description: courseSettingForm.description,
    price: {
      amount: parseFloat(courseSettingForm.price.replace(/,/g, '')),
      currency: 'NGN',
    },
    tags: courseSettingForm.tags,
    title: courseSettingForm.title,
    topic: courseSettingForm.topic,
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
  Logic.Study.UpdateCourseForm = {
    description: courseSettingForm.description,
    price: {
      amount: parseFloat(courseSettingForm.price.replace(/,/g, '')),
      currency: 'NGN',
    },
    tags: courseSettingForm.tags
      .concat(
        ...courseSettingForm.tagString.split(',')
          .map((item) => item.trim()),
      )
      .filter(Boolean),
    title: courseSettingForm.title,
    topic: courseSettingForm.topic,
    photo: courseSettingForm.photo,
  }

  const formState: boolean = formComp.validate()
  courseSettingSaved.value = false

  Logic.Study.UpdateCourse(formState, Logic.Study.SingleCourse.id)
    ?.then((data) => {
      if (data) {
        courseSettingSaved.value = true
        Logic.Common.showLoader({
          show: true,
          loading: false,
          message: 'Course updated',
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

const updateCourseSections = () => {
  if (Logic.Study.SingleCourse) {
    Logic.Study.UpdateCourseSectionForm = {
      id: Logic.Study.SingleCourse.id,
      sections: updateCourseSectionForm.sections,
    }

    const unsectionedSection = updateCourseSectionForm.sections.filter(
      (item) => {
        return item.label == 'unsectioned'
      },
    )[0]

    Logic.Study.UpdateCourseSectionForm.sections = updateCourseSectionForm.sections.filter(
      (item) => {
        return item.label != 'unsectioned'
      },
    )

    Logic.Study.UpdateCourseSectionForm.sections.push(unsectionedSection)

    Logic.Study.SaveCourseChangesToLocal(Logic.Study.UpdateCourseSectionForm)
    hasUnsavedChanges.value = true
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
    Logic.Study.MoveItemToCourse(true).then((data) => {
      if (data) {
        Logic.Common.showLoader({
          show: true,
          loading: false,
          message: 'Quiz added.',
          type: 'success',
        })
      }
    })
  })
}

export {
  addCourseFile, addCourseFileForm, addQuizToCourse, allGenericTags, allTopics, courseSettingForm, courseSettingSaved, createCourse, getGenericTags, getTopics, hasUnsavedChanges, updateCourse, updateCourseSectionForm, updateCourseSections
}
