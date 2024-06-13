import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { useCoursesInList } from '../study/courses-list'
import { useQuizzesInList } from '../study/quizzes-list'
import { useModals } from '../core/modals'
import { useUsersInList } from './users'
import { VerificationEntity, VerificationFactory, VerificationsUseCases } from '@modules/users'
import { AcceptVerificationInput } from '@modules/users/domain/types'

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
	verificationRequests: ref<VerificationEntity[]>([]),
	hasMore: ref(true),
	total: ref(0),
	currentViewingIndex: ref(0),
}

export const useAcceptVerificationRequest = () => {
	const {
		asyncFn: acceptVerificationRequest,
		loading,
		error,
	} = useAsyncFn(
		async (verificationRequest: VerificationEntity, data: AcceptVerificationInput) => {
			const updated = await VerificationsUseCases.accept(verificationRequest.id, data)
			addToArray(
				store.verificationRequests.value,
				updated,
				(e) => e.id,
				(e) => e.createdAt,
			)
			useModals().users.tutorRequest.close()
		},
		{
			pre: (verificationRequest: VerificationEntity) => verificationRequest.pending,
		},
	)

	const handleReject = async (verificationRequest: VerificationEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be rejecting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, reject' },
		})
		if (message) {
			await acceptVerificationRequest(verificationRequest, { accept: false, message })
		}
	}

	const handleAccept = async (verificationRequest: VerificationEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be accepting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, accept' },
			required: false,
		})
		if (message) {
			await acceptVerificationRequest(verificationRequest, { accept: true, message })
		}
	}

	return {
		acceptVerificationRequest,
		loading,
		error,
		handleReject,
		handleAccept,
	}
}

export const useVerificationRequests = () => {
	const {
		asyncFn: fetchVerificationRequests,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const verificationRequests = await VerificationsUseCases.get(store.verificationRequests.value.at(-1)?.createdAt)
			if (!called.value) store.total.value = verificationRequests.docs.total
			store.hasMore.value = !!verificationRequests.pages.next
			verificationRequests.results.forEach((r) =>
				addToArray(
					store.verificationRequests.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `users/verificationRequests/all` },
	)

	const limit = 10
	const verificanRequestId = computed(() => store.verificationRequests.value.map((r) => r.userId))
	const { users } = useUsersInList(verificanRequestId)
	const verificationRequests = computed(() =>
		store.verificationRequests.value
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
			await fetchVerificationRequests()
			// await listener.restart()
		}
		store.currentViewingIndex.value += 1
	}

	onMounted(async () => {
		if (!called.value) await fetchVerificationRequests()
		// await listener.start()
	})
	// onUnmounted(async () => {
	// 	await listener.close()
	// })

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
