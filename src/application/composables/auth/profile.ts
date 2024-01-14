import { useAuth } from '@app/composables/auth/auth'
import { useSuccessHandler } from '@app/composables/core/states'
import { AuthUseCases, PhoneUpdateFactory, ProfileUpdateFactory } from '@modules/auth'
import { ref, watch } from 'vue'
import { useAsyncFn } from '../core/hooks'

export const useProfileUpdate = () => {
	const factory = new ProfileUpdateFactory()
	const { auth } = useAuth()
	const { setMessage } = useSuccessHandler()

	if (auth.value) factory.loadEntity(auth.value)
	watch(auth, () => auth.value && factory.loadEntity(auth.value))

	const {
		asyncFn: updateProfile,
		loading,
		error,
	} = useAsyncFn(
		async () => {
			await AuthUseCases.updateProfile(factory)
			await setMessage('Profile updated successfully!', true)
			return true
		},
		{ hideLoading: true },
	)

	return { error, loading, factory, updateProfile }
}

export const usePhoneUpdate = () => {
	const factory = new PhoneUpdateFactory()
	const sent = ref(false)
	const token = ref('')
	const { auth } = useAuth()
	const { message, setMessage } = useSuccessHandler()

	if (auth.value) factory.loadEntity(auth.value)
	watch(auth, () => auth.value && factory.loadEntity(auth.value))

	const {
		asyncFn: completeVerification,
		loading: completeVerificationLoading,
		error: completeVerificationError,
	} = useAsyncFn(async () => {
		await AuthUseCases.completePhoneVerification(token.value)
		await setMessage('Phone number updated successfully!')
		sent.value = false
		return true
	})

	const {
		asyncFn: sendVerificationText,
		loading: sendVerificationTextLoading,
		error: sendVerificationTextError,
	} = useAsyncFn(async () => {
		await AuthUseCases.sendVerificationText(factory)
		await setMessage('An OTP was just sent to your number.')
		sent.value = true
		return true
	})

	return {
		token,
		sent,
		factory,
		message,
		sendVerificationText,
		sendVerificationTextLoading,
		sendVerificationTextError,
		completeVerification,
		completeVerificationLoading,
		completeVerificationError,
	}
}
