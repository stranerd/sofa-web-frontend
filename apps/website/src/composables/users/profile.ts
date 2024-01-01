import { UserAiFactory, UserTypeFactory, UsersUseCases } from '@modules/users'
import { ref, watch } from 'vue'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'

export const useUserTypeUpdate = () => {
	const factory = new UserTypeFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateType = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateType(factory)
				await setMessage('Updated successfully!')
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, updateType }
}

export const showCustomizeAi = ref(false)

export const useUserAiUpdate = () => {
	const factory = new UserAiFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateAi = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateAi(factory)
				await setMessage('Updated successfully!')
				showCustomizeAi.value = false
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, updateAi }
}