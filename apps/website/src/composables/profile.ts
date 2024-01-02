import { CreateTutorRequestForm, Logic } from 'sofa-logic'
import { reactive, ref } from 'vue'

const showAccountSetup = ref(false)
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

const updatePhoneForm = reactive({
	phone: {
		code: '+234',
		number: '',
	},
	otp: '',
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

const UpdatePhone = async () => {
	Logic.Auth.SendPhoneVerificationForm = {
		phone: {
			code: updatePhoneForm.phone.code,
			// TODO: substring is used to remove 0 if no starts with zero, might only work for 9ja numbers, so needs a more robust solution
			number: updatePhoneForm.phone.number?.substring(updatePhoneForm.phone.number?.charAt(0) == '0' ? 1 : 0)
		},
	}

	return await Logic.Auth.SendPhoneVerification(true)
}

const VerifyPhone = async () => {
	if (updatePhoneForm.otp) {
		Logic.Auth.VerifyPhone(updatePhoneForm.otp).then(() => {
			showAccountSetup.value = false
			Logic.Common.GoToRoute('/')
		})
	}
}

const submitVerification = async (useLoader = true) => {
	Logic.Users.CreateVerificationForm = {
		content: updateVerificationForm.content,
	}

	await Logic.Users.CreateVerification(true, useLoader)
	Logic.Common.showAlert({
		message: 'Verification submitted. You will get an email after your account has been reviewed',
		type: 'success'
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
	if (
		tutorRequestForm.qualification.length &&
    tutorRequestForm.topicId &&
    tutorRequestForm.verification
	) {
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
	UpdatePhone, VerifyPhone, accountSetupOptions, autoCreateVerification, createTutorRequest, showAccountSetup, showCustomizeAI, submitVerification, tutorRequestForm, updatePhoneForm,
	updateVerificationForm
}
