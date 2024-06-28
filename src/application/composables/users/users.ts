import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn, useItemsInList, usePaginatedTable } from '../core/hooks'
import { useListener } from '../core/listener'
import { UserEntity, UserType, UsersUseCases } from '@modules/users'

const searchStore = {
	users: reactive<UserEntity[]>([]),
}

const store = {
	tutors: ref<UserEntity[]>([]),
	listener: useListener(
		async () =>
			await UsersUseCases.listenToAllTeachers({
				created: async (entity) => {
					addToArray(
						store.tutors.value,
						entity,
						(e) => e.id,
						(e) => e.account.ratings.avg,
					)
				},
				updated: async (entity) => {
					addToArray(
						store.tutors.value,
						entity,
						(e) => e.id,
						(e) => e.account.ratings.avg,
					)
				},
				deleted: async (entity) => {
					store.tutors.value = store.tutors.value.filter((m) => m.id !== entity.id)
				},
			}),
	),
}

export const useTutorsList = () => {
	const {
		asyncFn: fetchTutors,
		loading,
		error,
		called,
	} = useAsyncFn(
		async () => {
			const tutors = await UsersUseCases.getAllTeachers()
			tutors.results.forEach((r) =>
				addToArray(
					store.tutors.value,
					r,
					(e) => e.id,
					(e) => e.account.ratings.avg,
				),
			)
		},
		{ key: 'users/users/teachers' },
	)

	onMounted(async () => {
		if (!called.value) await fetchTutors()
		await store.listener.start()
	})
	onUnmounted(async () => {
		await store.listener.close()
	})

	return { ...store, loading, error }
}

export const useSearchUsers = () => {
	const searchValue = ref('')

	const {
		asyncFn: searchUsersByEmails,
		loading,
		error,
	} = useAsyncFn(async (emails: string[]) => {
		searchStore.users.length = 0
		const users = await UsersUseCases.getInEmails(emails)
		users.forEach((r) =>
			addToArray(
				searchStore.users,
				r,
				(e) => e.id,
				(e) => e.bio.name.first,
			),
		)
		searchValue.value = ''
		return searchStore.users
	})
	return { ...searchStore, loading, error, searchValue, searchUsersByEmails }
}

export const useUsersInList = (ids: Refable<string[]>, listen = true) => {
	const { user } = useAuth()
	const allUsers = computed(() => [...store.tutors.value, ...searchStore.users, ...(user.value ? [user.value] : [])])

	const listener = useListener(
		async () =>
			await UsersUseCases.listenToInList(() => ids.value, {
				created: addToList,
				updated: addToList,
				deleted: () => {},
			}),
	)

	const { items: users, addToList } = useItemsInList(
		'users',
		ids,
		allUsers,
		(ids) => UsersUseCases.getInList(ids),
		listen ? listener : undefined,
	)

	return { users }
}

export const useAdminsList = () =>
	usePaginatedTable<UserEntity>({
		key: 'users/users/admins',
		useCase: () => UsersUseCases.getAdmins(),
		comparer: (users) => users.dates.createdAt,
		listenerFn: (handlers) => UsersUseCases.listenToAdmins(handlers),
	})
export const useUserTypeList = (type: UserType) =>
	usePaginatedTable<UserEntity>({
		key: `users/users/${type}`,
		useCase: () => UsersUseCases.getType(type),
		comparer: (users) => users.dates.createdAt,
		listenerFn: (handlers) => UsersUseCases.listenToType(handlers, type),
	})
