import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn, usePaginatedTable } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { useCoursesInList } from '../study/courses-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useUsersInList } from './users'
import { AcceptVerificationInput } from '@modules/users/domain/types'
import { UserEntity, VerificationEntity, VerificationFactory, VerificationsUseCases } from '@modules/users'

const myStore = {
	verifications: ref<VerificationEntity[]>([]),
	listener: useListener(async () => {
		const { id } = useAuth()
		return VerificationsUseCases.listenToMine(id.value, {
			created: async (entity) => {
				addToArray(
					myStore.verifications.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					myStore.verifications.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				myStore.verifications.value = myStore.verifications.value.filter((m) => m.id !== entity.id)
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
					myStore.verifications.value,
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
		await myStore.listener.start()
		await afterFetch?.()
	})
	onUnmounted(async () => {
		await myStore.listener.close()
	})

	return { ...myStore, loading, error }
}

export const useAcceptVerificationRequest = () => {
	const {
		asyncFn: acceptVerification,
		loading,
		error,
	} = useAsyncFn(
		async (verification: VerificationEntity, data: AcceptVerificationInput) => {
			await VerificationsUseCases.accept(verification.id, data)
			useModals().users.verification.close()
		},
		{
			pre: (verification) => verification.pending,
		},
	)

	const handleReject = async (verification: VerificationEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be rejecting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, reject' },
		})
		if (message) await acceptVerification(verification, { accept: false, message })
	}

	const handleAccept = async (verification: VerificationEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be accepting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, accept' },
			required: false,
		})
		await acceptVerification(verification, { accept: true, message: message ?? '' })
	}

	return {
		loading,
		error,
		handleReject,
		handleAccept,
	}
}

export const useVerificationsList = () => {
	const result = usePaginatedTable<VerificationEntity, { verification: VerificationEntity; user: UserEntity }>({
		key: 'users/verifications/all',
		useCase: (lastItem) => VerificationsUseCases.get(lastItem?.createdAt),
		comparer: (item) => item.createdAt,
		listenerFn: (handlers, lastItem) => VerificationsUseCases.listen(handlers, lastItem?.createdAt),
		computedFn: (item) => {
			const user = users.value.find((u) => u.id === item.userId)
			return user ? { verification: item, user } : null
		},
	})

	const userIds = computed(() => result.items.value.map((r) => r.userId))
	const { users } = useUsersInList(userIds)

	return result
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
