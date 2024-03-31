import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { useCoursesInList } from '../study/courses-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { VerificationEntity, VerificationFactory, VerificationsUseCases } from '@modules/users'

const store = {
	verifications: ref<VerificationEntity[]>([]),
	listener: useListener(async () => {
		const { id } = useAuth()
		return VerificationsUseCases.listenToMine(id.value, {
			created: async (entity) => {
				addToArray(
					store.verifications.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.verifications.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.verifications.value = store.verifications.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useMyVerifications = (afterFetch?: () => void) => {
	const { id } = useAuth()

	const {
		asyncFn: fetchVerifications,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const verifications = await VerificationsUseCases.getMine(id.value)
			verifications.results.forEach((r) =>
				addToArray(
					store.verifications.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `users/verifications/mine` },
	)

	onMounted(async () => {
		if (!called.value) await fetchVerifications()
		await store.listener.start()
		await afterFetch?.()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, loading, error }
}

export const useCreateVerification = () => {
	const factory = new VerificationFactory()
	const router = useRouter()
	const { setMessage } = useSuccessHandler()

	const { verifications } = useMyVerifications(() => {
		const pending = verifications.value.find((v) => v.pending)
		if (pending) factory.loadEntity(pending)
	})

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
