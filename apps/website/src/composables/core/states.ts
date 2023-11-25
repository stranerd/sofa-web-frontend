import { Logic } from 'sofa-logic'
import { ref } from 'vue'

export const useErrorHandler = () => {
	const errorState = ref('')
	const setError = async (error: any, skipAlert = false) => {
		errorState.value = error.message ?? error
		if (errorState.value && !skipAlert) Logic.Common.showLoader({ show: true, message: errorState.value, type: 'error' })
	}
	return { error: errorState, setError }
}

export const useLoadingHandler = () => {
	const loadingState = ref(false)
	const setLoading = async (loading: boolean, skipAlert = false) => {
		loadingState.value = loading
		if (loading && !skipAlert) Logic.Common.showLoader({ loading: true, show: false })
		if (!loading && !skipAlert) Logic.Common.hideLoader()
	}
	return { loading: loadingState, setLoading }
}

export const useSuccessHandler = () => {
	const successState = ref('')
	const setMessage = async (message: string, skipAlert = false) => {
		successState.value = message
		if (message && !skipAlert) Logic.Common.showLoader({ show: true, message, type: 'success' })
	}
	return { message: successState, setMessage }
}