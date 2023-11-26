import { Logic, SingleUser } from 'sofa-logic'
import { ref, onMounted, onUnmounted } from 'vue'
import { useListener } from '../core/listener'
import { useLoadingHandler, useErrorHandler } from '../core/states'

const store = {
	tutors: ref<SingleUser[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return Logic.Common.listenToMany<SingleUser>('users/users', {
			created: async (entity) => {
				Logic.addToArray(store.tutors.value, entity, (e) => e.id, (e) => e.account.ratings.avg)
			},
			updated: async (entity) => {
				Logic.addToArray(store.tutors.value, entity, (e) => e.id, (e) => e.account.ratings.avg)
			},
			deleted: async (entity) => {
				store.tutors.value = store.tutors.value.filter((m) => m.id !== entity.id)
			}
		}, (user) => user.type?.type === 'teacher')
	})
}

export const useTutorsList = () => {
	const fetchTutors = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const tutors = await Logic.Users.GetUsers({
				where: [{ field: 'type.type', value: 'teacher' }],
				all: true
			}, false)
			tutors.forEach((r) => Logic.addToArray(store.tutors.value, r, (e) => e.id, (e) => e.account.ratings.avg))
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */!store.loading.value) await fetchTutors()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store }
}