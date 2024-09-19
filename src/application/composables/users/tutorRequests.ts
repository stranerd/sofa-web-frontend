import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn, usePaginatedTable } from '../core/hooks'
import { useListener } from '../core/listener'
import { useModals } from '../core/modals'
import { useSuccessHandler } from '../core/states'
import { createStore } from '../core/store'
import { useUsersInList } from './users'
import { AcceptTutorRequestInput } from '@modules/users/domain/types'
import { TutorRequestEntity, TutorRequestFactory, TutorRequestsUseCases, UserEntity } from '@modules/users'

const myStore = createStore(
	{
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
	},
	'users/tutorRequests/mine',
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

export const useAcceptTutorRequest = () => {
	const {
		asyncFn: acceptTutorRequest,
		loading,
		error,
	} = useAsyncFn(
		async (tutorRequest: TutorRequestEntity, data: AcceptTutorRequestInput) => {
			await TutorRequestsUseCases.accept(tutorRequest.id, data)
			useModals().users.tutorRequest.close()
		},
		{
			pre: (tutorRequest) => tutorRequest.pending,
		},
	)

	const handleReject = async (tutorRequest: TutorRequestEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be rejecting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, reject' },
		})
		if (message) await acceptTutorRequest(tutorRequest, { accept: false, message })
	}

	const handleAccept = async (tutorRequest: TutorRequestEntity) => {
		const message = await $utils.prompt({
			title: 'Will you be accepting this?',
			sub: 'Please let us know why',
			right: { label: 'Yes, accept' },
			required: false,
		})
		await acceptTutorRequest(tutorRequest, { accept: true, message: message ?? '' })
	}

	return {
		loading,
		error,
		handleReject,
		handleAccept,
	}
}

export const useTutorRequestsList = () => {
	const result = usePaginatedTable<TutorRequestEntity, { tutorRequest: TutorRequestEntity; user: UserEntity }>({
		key: 'users/tutorRequests/all',
		useCase: (lastItem) => TutorRequestsUseCases.get(lastItem?.createdAt),
		comparer: (item) => item.createdAt,
		listenerFn: (handlers, lastItem) => TutorRequestsUseCases.listen(handlers, lastItem?.createdAt),
		computedFn: (item) => {
			const user = users.value.find((u) => u.id === item.userId)
			return user ? { tutorRequest: item, user } : null
		},
	})

	const userIds = computed(() => result.items.value.map((r) => r.userId))
	const { users } = useUsersInList(userIds)

	return result
}
