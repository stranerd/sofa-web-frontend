import { Logic } from 'sofa-logic'
import { reactive, ref } from 'vue'

const quizSettingsForm = reactive({
  description: '',
  tagIds: [],
  title: '',
  topicId: '',
  photo: undefined,
  visibility: '',
})

const quizSettingSaved = ref(false)

const createQuiz = (formComp: any) => {
  Logic.Study.CreateQuizForm = {
    description: quizSettingsForm.description,
    tagIds: [],
    title: quizSettingsForm.title,
    topicId: quizSettingsForm.topicId,
    photo: quizSettingsForm.photo,
  }

  const formState: boolean = formComp.validate()
  quizSettingSaved.value = false
  Logic.Study.CreateQuiz(formState)
    ?.then(() => {
      quizSettingSaved.value = true
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

export { quizSettingsForm, quizSettingSaved, createQuiz }
