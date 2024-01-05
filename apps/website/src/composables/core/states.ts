import { Logic } from 'sofa-logic'
import { NetworkError, StatusCodes } from '@modules/core'
import { ref } from 'vue'
import { useAuth } from '../auth/auth'

export const useErrorHandler = () => {
	const errorState = ref('')
	const setError = async (error: any, skipAlert = false) => {
		if (error instanceof NetworkError) {
			errorState.value = error.errors.map(({ message, field }) => `${Logic.capitalize(field ?? 'Error')}: ${message}`).join('\n')
			if ([StatusCodes.NotAuthenticated, StatusCodes.AccessTokenExpired, StatusCodes.RefreshTokenMisused].includes(error.statusCode))
				await useAuth().signout()
		} else errorState.value = error?.message ?? error?.error ?? error
		if (errorState.value && !skipAlert) Logic.Common.showAlert({ message: errorState.value, type: 'error' })
	}
	return { error: errorState, setError }
}

export const useLoadingHandler = () => {
	const id = Logic.getRandomValue()
	const loadingState = ref(false)
	const setLoading = async (loading: boolean, skipAlert = false) => {
		loadingState.value = loading
		if (loading && !skipAlert) Logic.Common.showLoading(id)
		if (!loading && !skipAlert) Logic.Common.hideLoading(id)
	}
	return { loading: loadingState, setLoading }
}

export const useSuccessHandler = () => {
	const successState = ref('')
	const setMessage = async (message: string, skipAlert = false) => {
		successState.value = message
		if (message && !skipAlert) Logic.Common.showAlert({ message, type: 'success' })
	}
	return { message: successState, setMessage }
}
