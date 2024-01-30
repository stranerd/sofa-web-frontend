import { reactive } from 'vue'
import { CreateTutorRequestForm, Logic } from 'sofa-logic'

const tutorRequestForm = reactive<CreateTutorRequestForm>({
	qualification: [],
	topicId: '',
	verification: undefined as any,
})

const updateVerificationForm = reactive({
	content: {
		quizzes: [] as string[],
		courses: [] as string[],
	},
})

const submitVerification = async (useLoader = true) => {
	Logic.Users.CreateVerificationForm = {
		content: updateVerificationForm.content,
	}

	await Logic.Users.CreateVerification(true, useLoader)
	Logic.Common.showAlert({
		message: 'Verification submitted. You will get an email after your account has been reviewed',
		type: 'success',
	})
	await Logic.Common.GoToRoute('/')
}

const autoCreateVerification = () => {
	if (Logic.Users.Verifications?.results.length == 0) {
		Logic.Users.CreateVerificationForm = {
			content: {
				quizzes: [],
				courses: [],
			},
		}

		Logic.Users.CreateVerification(true)
	}
}

const createTutorRequest = () => {
	if (tutorRequestForm.qualification.length && tutorRequestForm.topicId && tutorRequestForm.verification) {
		Logic.Users.CreateTutorRequestForm = {
			qualification: tutorRequestForm.qualification,
			topicId: tutorRequestForm.topicId,
			verification: tutorRequestForm.verification,
		}
		Logic.Users.CreateTutorRequest()
			?.then((res) => {
				Logic.Common.GoToRoute(`/tests/${res.testId}`)
			})
			.catch((e) => {
				Logic.Common.hideLoading()
				Logic.Common.showAlert({
					message: e?.response?.data?.at(0)?.message ?? e.message,
					type: 'error',
				})
			})
	}
}

export { autoCreateVerification, createTutorRequest, submitVerification, tutorRequestForm, updateVerificationForm }
