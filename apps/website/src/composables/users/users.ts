import { UserEntity, UsersUseCases } from '@modules/users'
import { Logic } from 'sofa-logic'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { Refable, useItemsInList } from '../core/hooks'
import { useListener } from '../core/listener'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const searchStore = {
	users: reactive<UserEntity[]>([]),
	...useLoadingHandler(),
	...useErrorHandler(),
}

const store = {
	tutors: ref<UserEntity[]>([]),
	fetched: ref(false),
	...useLoadingHandler(),
	...useErrorHandler(),
	listener: useListener(async () => {
		return await UsersUseCases.listenToAllTeachers({
			created: async (entity) => {
				Logic.addToArray(
					store.tutors.value,
					entity,
					(e) => e.id,
					(e) => e.account.ratings.avg,
				)
			},
			updated: async (entity) => {
				Logic.addToArray(
					store.tutors.value,
					entity,
					(e) => e.id,
					(e) => e.account.ratings.avg,
				)
			},
			deleted: async (entity) => {
				store.tutors.value = store.tutors.value.filter((m) => m.id !== entity.id)
			},
		})
	}),
}

export const useTutorsList = () => {
	const fetchTutors = async () => {
		try {
			await store.setError('')
			await store.setLoading(true)
			const tutors = await UsersUseCases.getAllTeachers()
			tutors.results.forEach((r) =>
				Logic.addToArray(
					store.tutors.value,
					r,
					(e) => e.id,
					(e) => e.account.ratings.avg,
				),
			)
			store.fetched.value = true
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
	}

	onMounted(async () => {
		if (/* !store.fetched.value &&  */ !store.loading.value) await fetchTutors()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store }
}

export const useSearchUsers = () => {
	const searchValue = ref('')

	const searchUsersByEmails = async (emails: string[]) => {
		try {
			await searchStore.setError('')
			await searchStore.setLoading(true)
			searchStore.users.length = 0
			const users = await UsersUseCases.getInEmails(emails)
			users.forEach((r) =>
				Logic.addToArray(
					searchStore.users,
					r,
					(e) => e.id,
					(e) => e.bio.name.first,
				),
			)
			searchValue.value = ''
		} catch (e) {
			await searchStore.setError(e)
		}
		await searchStore.setLoading(false)
		return searchStore.users
	}
	return { ...searchStore, searchValue, searchUsersByEmails }
}

export const useUsersInList = (ids: Refable<string[]>, listen = false) => {
	const allUsers = computed(() => [...store.tutors.value, ...searchStore.users])

	const { items: users, addToList } = useItemsInList('users', ids, allUsers, (ids) => UsersUseCases.getInList(ids))

	const listener = useListener(async () => {
		return await UsersUseCases.listenToInList(() => ids.value, {
			created: addToList,
			updated: addToList,
			deleted: () => {},
		})
	})

	onMounted(async () => {
		if (listen) await listener.start()
	})

	onUnmounted(async () => {
		if (listen) await listener.close()
	})

	return { users }
}
