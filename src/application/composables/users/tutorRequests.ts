import { addToArray } from 'valleyed'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../auth/auth'
import { useAsyncFn } from '../core/hooks'
import { useListener } from '../core/listener'
import { useSuccessHandler } from '../core/states'
import { TutorRequestEntity, TutorRequestFactory, TutorRequestsUseCases } from '@modules/users'

const store = {
	tutorRequests: ref<TutorRequestEntity[]>([]),
	listener: useListener(async () => {
		const { id } = useAuth()
		return TutorRequestsUseCases.listenToMine(id.value, {
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
		})
	}),
}

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
					store.tutorRequests.value,
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
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, loading, error }
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
