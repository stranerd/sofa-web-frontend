import { addToArray } from 'valleyed'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useAuth } from '../auth/auth'
import { Refable, useAsyncFn, useItemsInList, usePaginatedTable } from '../core/hooks'
import { useListener } from '../core/listener'
import { UserEntity, UserType, UsersUseCases } from '@modules/users'
import { AuthRoles, AuthUseCases } from '@modules/auth'

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

export const useAdminsList = () => {
	const result = usePaginatedTable<UserEntity>({
		key: 'users/admins/all',
		useCase: () => UsersUseCases.getAdmins(),
		comparer: (users) => users.dates.createdAt,
		listenerFn: (handlers) => UsersUseCases.listenToAdmins(handlers),
	})

	return result
}
export const useUserTypeList = (type: string) => {
	const userType = type as UserType
	const result = usePaginatedTable<UserEntity>({
		key: `users/admins/${userType}`,
		useCase: () => UsersUseCases.getType(userType),
		comparer: (users) => users.dates.createdAt,
		listenerFn: (handlers) => UsersUseCases.listenToType(handlers, userType),
	})

	return result
}

export const useMakeAdmin = () => {
	const {
		asyncFn: makeAdmin,
		loading,
		error,
	} = useAsyncFn(async (user: UserEntity) => {
		await AuthUseCases.updateRole(user.id, AuthRoles.isAdmin, user.roles.isAdmin)
	})

	const handleAccept = async (user: UserEntity) => {
		const confirmed = await $utils.confirm({
			title: 'Are you sure?',
			sub: '',
			right: { label: 'Yes, make admin' },
		})
		if (!confirmed) return
		await makeAdmin(user)
	}

	return { loading, error, handleAccept }
}
