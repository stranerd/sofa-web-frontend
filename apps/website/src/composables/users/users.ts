import { Logic, QueryParams, SingleUser } from 'sofa-logic'
import { reactive, ref } from 'vue'
import { useErrorHandler, useLoadingHandler } from '../core/states'

const store = {
	users: reactive<SingleUser[]>([]),
	...useLoadingHandler(),
	...useErrorHandler(),
}

export const useSearchUsers = () => {
	const searchValue = ref('')

	const searchUsers = async (condition: QueryParams) => {
		try {
			await store.setError('')
			await store.setLoading(true)
			store.users.length = 0
			const users = await Logic.Users.GetUsers(condition, false)
			users.forEach((r) => Logic.addToArray(store.users, r, (e) => e.id, (e) => e.bio.name.first))
			searchValue.value = ''
		} catch (e) {
			await store.setError(e)
		}
		await store.setLoading(false)
		return store.users
	}
	return { ...store, searchValue, searchUsers }
}