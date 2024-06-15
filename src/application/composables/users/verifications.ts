import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { useCoursesInList } from '../study/courses-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useUsersInList } from './users'
import { AcceptVerificationInput } from '@modules/users/domain/types'
import { VerificationEntity, VerificationFactory, VerificationsUseCases } from '@modules/users'

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

const store = {
	verifications: ref<VerificationEntity[]>([]),
	hasMore: ref(true),
	total: ref(0),
	currentViewingIndex: ref(0),
}

const listener = useListener(async () =>
	VerificationsUseCases.listen(
		{
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
		},
		store.verifications.value.at(-1)?.createdAt,
	),
)

export const useAcceptVerificationRequest = () => {
	const {
		asyncFn: acceptVerification,
		loading,
		error,
	} = useAsyncFn(
		async (verification: VerificationEntity, data: AcceptVerificationInput) => {
			const updated = await VerificationsUseCases.accept(verification.id, data)
			addToArray(
				store.verifications.value,
				updated,
				(e) => e.id,
				(e) => e.createdAt,
			)
			useModals().users.verification.close()
		},
		{
			pre: (verification: VerificationEntity) => verification.pending,
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

export const useVerifications = () => {
	const {
		asyncFn: fetchVerifications,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const verifications = await VerificationsUseCases.get(store.verifications.value.at(-1)?.createdAt)
			if (!called.value) store.total.value = verifications.docs.total
			store.hasMore.value = !!verifications.pages.next
			verifications.results.forEach((r) =>
				addToArray(
					store.verifications.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `users/verifications/all` },
	)

	const limit = 10
	const verificanRequestId = computed(() => store.verifications.value.map((r) => r.userId))
	const { users } = useUsersInList(verificanRequestId)
	const verificationRequests = computed(() =>
		store.verifications.value
			.map((r) => {
				const user = users.value.find((u) => u.id === r.userId)
				return user ? { verification: r, user } : null
			})
			.filter(Boolean),
	)
	const currentlyViewing = computed(() =>
		verificationRequests.value.slice(store.currentViewingIndex.value * limit, (store.currentViewingIndex.value + 1) * limit),
	)
	const isOnLastPage = computed(
		() => currentlyViewing.value.at(-1)?.verification.id !== verificationRequests.value.at(-1)?.verification.id,
	)
	const canNext = computed(() => !isOnLastPage.value || store.hasMore.value)
	const canPrev = computed(() => store.currentViewingIndex.value > 0)

	const previous = async () => {
		if (!canPrev.value) return
		store.currentViewingIndex.value -= 1
	}

	const next = async () => {
		if (!canNext.value) return
		if (isOnLastPage.value && store.hasMore.value) {
			await fetchVerifications()
			await listener.restart()
		}
		store.currentViewingIndex.value += 1
	}

	onMounted(async () => {
		if (!called.value) await fetchVerifications()
		await listener.start()
	})
	onUnmounted(async () => {
		await listener.close()
	})

	return {
		...store,
		loading,
		error,
		currentlyViewing,
		verificationRequests,
		limit,
		canPrev,
		canNext,
		previous,
		next,
	}
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
