import { Conditions, Logic, QueryParams, SingleUser } from 'sofa-logic'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const searchStore = {
	users: reactive<SingleUser[]>([]),
	...useLoadingHandler(),
	...useErrorHandler(),
}

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
			tutors.results.forEach((r) => Logic.addToArray(store.tutors.value, r, (e) => e.id, (e) => e.account.ratings.avg))
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

export const useSearchUsers = () => {
	const searchValue = ref('')

	const searchUsers = async (condition: QueryParams) => {
		try {
			await searchStore.setError('')
			await searchStore.setLoading(true)
			searchStore.users.length = 0
			const users = await Logic.Users.GetUsers(condition, false)
			users.results.forEach((r) => Logic.addToArray(searchStore.users, r, (e) => e.id, (e) => e.bio.name.first))
			searchValue.value = ''
		} catch (e) {
			await searchStore.setError(e)
		}
		await searchStore.setLoading(false)
		return searchStore.users
	}
	return { ...searchStore, searchValue, searchUsers }
}

export const useUsersInList = (ids: Refable<string[]>, listen = false) => {
	const allUsers = computed(() => [...store.tutors.value, ...searchStore.users])

	const { items: users, addToList } = useItemsInList('users', ids, allUsers, async (notFetched: string[]) => {
		const users = await Logic.Users.GetUsers({
			where: [{ field: 'id', value: notFetched, condition: Conditions.in }],
			all: true
		})
		return users.results
	})

	const listener = useListener(async () => {
		return await Logic.Common.listenToMany<SingleUser>('users/users', {
			created: addToList, updated: addToList, deleted: () => {/* */}
		},  (e) => ids.value.includes(e.id))
	})

	onMounted(() => {
		if (listen) listener.start()
	})

	onUnmounted(() => {
		if (listen) listener.close()
	})

	return { users }
}