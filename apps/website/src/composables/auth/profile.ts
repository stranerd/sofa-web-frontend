import { useAuth } from '@app/composables/auth/auth'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/composables/core/states'
import { AuthUseCases, PhoneUpdateFactory, ProfileUpdateFactory } from '@modules/auth'
import { ref, watch } from 'vue'

export const useProfileUpdate = () => {
	const factory = new ProfileUpdateFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { auth } = useAuth()

	if (auth.value) factory.loadEntity(auth.value)
	watch(auth, () => auth.value && factory.loadEntity(auth.value))

	const updateProfile = async (skipAlert = false) => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true, skipAlert)
				await AuthUseCases.updateProfile(factory)
				await setMessage('Profile updated successfully!', skipAlert)
			} catch (error) {
				await setError(error)
			}
			await setLoading(false, skipAlert)
		} else factory.validateAll()
	}

	return { error, loading, factory, updateProfile }
}

export const usePhoneUpdate = () => {
	const factory = new PhoneUpdateFactory()
	const sent = ref(false)
	const token = ref('')
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { message, setMessage } = useSuccessHandler()
	const { auth } = useAuth()

	if (auth.value) factory.loadEntity(auth.value)
	watch(auth, () => auth.value && factory.loadEntity(auth.value))

	const completeVerification = async () => {
		if (loading.value) return
		await setError('')
		await setLoading(true)
		try {
			await AuthUseCases.completePhoneVerification(token.value)
			await setMessage('Phone number updated successfully!')
		} catch (error) {
			await setError(error)
		}
		await setLoading(false)
	}
	const sendVerificationText = async () => {
		if (!factory.valid) return
		if (loading.value) return
		await setError('')
		await setLoading(true)
		try {
			await AuthUseCases.sendVerificationText(factory)
			await setMessage('An OTP was just sent to your number.')
			sent.value = true
		} catch (error) {
			await setError(error)
		}
		await setLoading(false)
	}

	return {
		token, sent, factory, loading, error, message,
		sendVerificationText, completeVerification
	}
}
