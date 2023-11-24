import { ref } from 'vue'

export const useErrorHandler = () => {
	const errorState = ref('')
	const setError = async (error: any) => {
		errorState.value = error.message ?? error
	}
	return { error: errorState, setError }
}

export const useLoadingHandler = () => {
	const loadingState = ref(false)
	const setLoading = async (loading: boolean) => {
		loadingState.value = loading
	}
	return { loading: loadingState, setLoading }
}

export const useSuccessHandler = () => {
	const successState = ref('')
	const setMessage = async (message: string) => {
		successState.value = message
	}
	return { message: successState, setMessage }
}