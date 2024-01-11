import { createSession } from '@app/composables/auth/session'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/composables/core/states'
import { AuthUseCases, PasswordResetFactory, PasswordUpdateFactory } from '@modules/auth'
import { NetworkError, StatusCodes } from '@modules/core'
import { ref } from 'vue'
import { useAsyncFn } from '../core/hooks'

export const usePasswordReset = () => {
	const sent = ref(false)
	const factory = new PasswordResetFactory()
	const { error } = useErrorHandler()
	const { message, setMessage } = useSuccessHandler()
	const { loading } = useLoadingHandler()

	const { asyncFn: sendResetEmail } = useAsyncFn(async () => {
		if (factory.isValid('email')) {
			const email = factory.email
			await AuthUseCases.sendPasswordResetEmail(email)
			await setMessage(`An OTP was just sent to ${email}`)
			sent.value = true
		}
	})

	const { asyncFn: resetPassword } = useAsyncFn(async () => {
		if (factory.valid && !loading.value) {
			try {
				const user = await AuthUseCases.resetPassword(factory)
				await setMessage('Password reset successfully!')
				await createSession(user)
			} catch (error) {
				if (error instanceof NetworkError && error.statusCode === StatusCodes.InvalidToken) {
					throw new Error('Invalid or expired OTP. Resend a new OTP to your email')
				} else throw error
			}
		} else factory.validateAll()
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
		if (factory.valid && !loading.value) {
			await AuthUseCases.updatePassword(factory)
			await setMessage('Password updated successfully!')
			factory.reset()
		} else factory.validateAll()
	})

	return { error, loading, factory, updatePassword }
}
