import { Logic } from 'sofa-logic'
import { ref } from 'vue'

export const useErrorHandler = () => {
	const errorState = ref('')
	const setError = async (error: any, skipAlert = false) => {
		errorState.value = error.message ?? error
		if (errorState.value && !skipAlert) Logic.Common.showAlert({ message: errorState.value, type: 'error' })
	}
	return { error: errorState, setError }
}

export const useLoadingHandler = () => {
	const id = Logic.Common.makeid(6)
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