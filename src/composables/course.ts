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
  visibility: '',
  tags: '',
  photo: undefined,
  topic: '',
})

const allTopics = reactive<SelectOption[]>([])

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
  allTopics.length = 0

  Logic.Study.Tags?.results.forEach((tag) => {
    allTopics.push({
      key: tag.id,
      value: tag.title,
    })
  })
}

const createCourse = (formComp: any) => {
  Logic.Study.CreateCourseForm = {
    description: courseSettingForm.description,
    price: {
      amount: 0,
      currency: 'NGN',
    },
    tagIds: [],
    title: courseSettingForm.title,
    topicId: courseSettingForm.topic,
    photo: courseSettingForm.photo,
  }

  const formState: boolean = formComp.validate()
  courseSettingSaved.value = false
  Logic.Study.CreateCourse(formState)
    ?.then(() => {
      courseSettingSaved.value = true
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const updateCourseSections = () => {
  Logic.Study.UpdateCourseSectionForm = {
    id: Logic.Study.SingleCourse.id,
    sections: updateCourseSectionForm.sections,
  }

  Logic.Study.UpdateCourseSection().then(() => {
    //
  })
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

  Logic.Study.CreateFile(true).then(() => {
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
  })
}

export {
  courseSettingForm,
  allTopics,
  courseSettingSaved,
  updateCourseSectionForm,
  addCourseFileForm,
  createCourse,
  getTopics,
  updateCourseSections,
  addCourseFile,
  addQuizToCourse,
}
