import { CreateTutorRequestForm, Logic } from 'sofa-logic'
import { reactive, ref } from 'vue'

const showCustomizeAI = ref(false)

const tutorRequestForm = reactive<CreateTutorRequestForm>({
	qualification: [],
	topicId: '',
	verification: undefined,
})

const updateVerificationForm = reactive({
	content: {
		quizzes: [],
		courses: [],
	},
})

const accountSetupOptions = reactive([
	{
		name: 'Profile',
		status: 'active',
		id: 'profile',
		show: true,
	},
	{
		name: 'Education',
		status: 'inactive',
		id: 'education',
		show: true,
	},
	{
		name: 'Phone',
		status: 'inactive',
		id: 'phone',
		show: true,
	},
])

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
	if (Logic.Users.Verifications.results.length == 0) {
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
			.then((res) => {
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

export {
	accountSetupOptions,
	autoCreateVerification,
	createTutorRequest,
	showCustomizeAI,
	submitVerification,
	tutorRequestForm,
	updateVerificationForm,
}
