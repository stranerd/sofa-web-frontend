import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { createSession } from '@app/composables/auth/session'
import { useSuccessHandler } from '@app/composables/core/states'
import { AuthUseCases, PasswordResetFactory, PasswordUpdateFactory } from '@modules/auth'
import { NetworkError, StatusCodes } from '@modules/core'

export const usePasswordReset = () => {
	const sent = ref(false)
	const factory = new PasswordResetFactory()
	const { message, setMessage } = useSuccessHandler()
	const router = useRouter()

	const { asyncFn: sendResetEmail } = useAsyncFn(async () => {
		if (factory.isValid('email')) {
			const email = factory.email
			await AuthUseCases.sendPasswordResetEmail(email)
			await setMessage(`An OTP was just sent to ${email}`)
			sent.value = true
		}
	})

	const {
		asyncFn: resetPassword,
		loading,
		error,
	} = useAsyncFn(async () => {
		try {
			const user = await AuthUseCases.resetPassword(factory)
			await setMessage('Password reset successfully!')
			await createSession(user, router)
		} catch (error) {
			if (error instanceof NetworkError && error.statusCode === StatusCodes.InvalidToken) {
				throw new Error('Invalid or expired OTP. Resend a new OTP to your email')
			} else throw error
		}
	})

	return { factory, sent, loading, message, error, resetPassword, sendResetEmail }
}

export const usePasswordUpdate = () => {
	const factory = new PasswordUpdateFactory()
	const { setMessage } = useSuccessHandler()

	const {
		asyncFn: updatePassword,
		loading,
		error,
	} = useAsyncFn(async () => {
		await AuthUseCases.updatePassword(factory)
		await setMessage('Password updated successfully!')
		factory.reset()
	})

	return { error, loading, factory, updatePassword }
}
