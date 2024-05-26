import { ref } from 'vue'
import { capitalize, getRandomValue } from 'valleyed'
import { useAuth } from '../auth/auth'
import { NetworkError, StatusCodes } from '@modules/core'

export const useErrorHandler = () => {
	const errorState = ref('')
	const setError = async (error: any, skipAlert = false) => {
		if (error instanceof NetworkError) {
			errorState.value = error.errors.map(({ message, field }) => `${capitalize(field ?? 'Error')}: ${message}`).join('\n')
			if ([StatusCodes.NotAuthenticated, StatusCodes.AccessTokenExpired].includes(error.statusCode)) await useAuth().signout()
		} else errorState.value = error?.message ?? error?.error ?? error
		if (errorState.value && !skipAlert) $utils.showAlert({ message: errorState.value, type: 'error' })
	}
	return { error: errorState, setError }
}

export const useLoadingHandler = () => {
	const id = getRandomValue()
	const loadingState = ref(false)
	const setLoading = async (loading: boolean, skipAlert = false) => {
		loadingState.value = loading
		if (loading && !skipAlert) $utils.showLoading(id)
		if (!loading && !skipAlert) $utils.hideLoading(id)
	}
	return { loading: loadingState, setLoading }
}

export const useSuccessHandler = () => {
	const successState = ref('')
	const setMessage = async (message: string, skipAlert = false) => {
		successState.value = message
		if (message && !skipAlert) $utils.showAlert({ message, type: 'success' })
	}
	return { message: successState, setMessage }
}
