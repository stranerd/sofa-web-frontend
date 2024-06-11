import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { useUsersInList } from './users'
import { TutorRequestEntity, TutorRequestFactory, TutorRequestsUseCases } from '@modules/users'
import { AcceptTutorRequestInput } from '@modules/users/domain/types'

const myStore = {
	tutorRequests: ref<TutorRequestEntity[]>([]),
	listener: useListener(async () => {
		const { id } = useAuth()
		return TutorRequestsUseCases.listenToMine(id.value, {
			created: async (entity) => {
				addToArray(
					myStore.tutorRequests.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					myStore.tutorRequests.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				myStore.tutorRequests.value = myStore.tutorRequests.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

const store = {
	tutorRequests: ref<TutorRequestEntity[]>([]),
	hasMore: ref(true),
	total: ref(0),
	currentViewingIndex: ref(0),
}

const listener = useListener(async () =>
	TutorRequestsUseCases.listen(
		{
			created: async (entity) => {
				addToArray(
					store.tutorRequests.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			updated: async (entity) => {
				addToArray(
					store.tutorRequests.value,
					entity,
					(e) => e.id,
					(e) => e.createdAt,
				)
			},
			deleted: async (entity) => {
				store.tutorRequests.value = store.tutorRequests.value.filter((m) => m.id !== entity.id)
			},
		},
		store.tutorRequests.value.at(-1)?.createdAt,
	),
)

export const useMyTutorRequests = () => {
	const { id } = useAuth()

	const {
		asyncFn: fetchTutorRequests,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const tutorRequests = await TutorRequestsUseCases.getMine(id.value)
			tutorRequests.results.forEach((r) =>
				addToArray(
					myStore.tutorRequests.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `users/tutorRequests/mine` },
	)

	onMounted(async () => {
		if (!called.value) await fetchTutorRequests()
		await myStore.listener.start()
	})
	onUnmounted(async () => {
		await myStore.listener.close()
	})

	return { ...myStore, loading, error }
}

export const useCreateTutorRequest = () => {
	const factory = new TutorRequestFactory()
	const router = useRouter()
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: createTutorRequest,
		loading,
		error,
	} = useAsyncFn(async () => {
		const tutorRequest = await TutorRequestsUseCases.create(factory)
		await setMessage('Verification submitted. You will get an email after your account has been reviewed')
		await router.push(tutorRequest.testFinished ? '/dashboard' : `/plays/tests/${tutorRequest.testId}`)
	})

	return { factory, createTutorRequest, loading, error }
}

export const useAcceptRejectTutorRequest = () => {
	const {
		asyncFn: acceptTutorRequest,
		loading: acceptLoading,
		error: acceptError,
	} = useAsyncFn(async (id: string, data: AcceptTutorRequestInput) => {
		await TutorRequestsUseCases.accept(id, data)
	})

	const handleReject = async (id: string) => {
		const message = await $utils.prompt({
			title: 'Will you be rejecting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, reject' },
		})
		if (message) {
			await acceptTutorRequest(id, { accept: false, message })
		}
	}

	const handleAccept = async (id: string) => {
		const message = await $utils.prompt({
			title: 'Will you be accepting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, accept' },
			required: false,
		})
		if (message) {
			await acceptTutorRequest(id, { accept: true, message })
		}
	}

	return {
		acceptTutorRequest,
		acceptLoading,
		acceptError,
		handleReject,
		handleAccept,
	}
}

export const usePendingTutorRequests = () => {
	const {
		asyncFn: fetchTutorRequests,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const tutorRequests = await TutorRequestsUseCases.get(store.tutorRequests.value.at(-1)?.createdAt)
			if (!called.value) store.total.value = tutorRequests.docs.total
			store.hasMore.value = !!tutorRequests.pages.next
			tutorRequests.results.forEach((r) =>
				addToArray(
					store.tutorRequests.value,
					r,
					(e) => e.id,
					(e) => e.createdAt,
				),
			)
		},
		{ key: `users/tutorRequests/all` },
	)

	// const {
	// 	asyncFn: acceptTutorRequest,
	// 	loading: acceptLoading,
	// 	error: acceptError,
	// } = useAsyncFn(async (id: string, data: AcceptTutorRequestInput) => {
	// 	await TutorRequestsUseCases.accept(id, data)
	// })

	const limit = 10
	const tutorRequestsUserIds = computed(() => store.tutorRequests.value.map((r) => r.userId))
	const { users } = useUsersInList(tutorRequestsUserIds)
	const tutorRequests = computed(() =>
		store.tutorRequests.value
			.map((r) => {
				const user = users.value.find((u) => u.id === r.userId)
				return user ? { tutorRequest: r, user } : null
			})
			.filter(Boolean),
	)
	const currentlyViewing = computed(() =>
		tutorRequests.value.slice(store.currentViewingIndex.value * limit, (store.currentViewingIndex.value + 1) * limit),
	)
	const isOnLastPage = computed(() => currentlyViewing.value.at(-1)?.tutorRequest.id !== tutorRequests.value.at(-1)?.tutorRequest.id)
	const canNext = computed(() => !isOnLastPage.value || store.hasMore.value)
	const canPrev = computed(() => store.currentViewingIndex.value > 0)

	const previous = async () => {
		if (!canPrev.value) return
		store.currentViewingIndex.value -= 1
	}

	const next = async () => {
		if (!canNext.value) return
		if (isOnLastPage.value && store.hasMore.value) {
			await fetchTutorRequests()
			await listener.restart()
		}
		store.currentViewingIndex.value += 1
	}

	onMounted(async () => {
		if (!called.value) await fetchTutorRequests()
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
		tutorRequests,
		limit,
		canPrev,
		canNext,
		previous,
		next,
	}
}
