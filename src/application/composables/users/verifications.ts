import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { useSuccessHandler } from '../core/states'
import { useCoursesInList } from '../study/courses-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { VerificationFactory, VerificationsUseCases } from '@modules/users'

export const useCreateVerification = () => {
	const factory = new VerificationFactory()
	const router = useRouter()
	const { setMessage } = useSuccessHandler()

	const coursesIds = computed(() => factory.courses)
	const quizzesIds = computed(() => factory.quizzes)
	const { courses } = useCoursesInList(coursesIds)
	const { quizzes } = useQuizzesInList(quizzesIds)

	const content = computed(() => ({
		courses: courses.value,
		quizzes: quizzes.value,
	}))

	const {
		asyncFn: createVerification,
		loading,
		error,
	} = useAsyncFn(async () => {
		await VerificationsUseCases.create(factory)
		await setMessage('Verification submitted. You will get an email after your account has been reviewed')
		await router.push('/dashboard')
	})

	return { factory, createVerification, loading, error, content }
}
