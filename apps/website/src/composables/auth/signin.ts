import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthUseCases, EmailSigninFactory, EmailSignupFactory } from '@modules/auth'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '@app/composables/core/states'
import { NetworkError, StatusCodes } from '@modules/core'
import { storage } from '@utils/storage'
import { createSession } from '@app/composables/auth/session'

const store = {
	referrerId: ref(undefined as string | undefined),
	emailSignin: { ...useErrorHandler(), ...useLoadingHandler(), ...useSuccessHandler() },
	emailSignup: { ...useErrorHandler(), ...useLoadingHandler(), ...useSuccessHandler() },
	googleSignin: { ...useErrorHandler(), ...useLoadingHandler(), ...useSuccessHandler() },
	appleSignin: { ...useErrorHandler(), ...useLoadingHandler(), ...useSuccessHandler() },
	emailVerification: { email: ref(''), ...useErrorHandler(), ...useLoadingHandler(), ...useSuccessHandler() }
}

export const getReferrerId = async () => await storage.get('referrer') ?? store.referrerId.value

export const setReferrerId = async (id: string) => {
	store.referrerId.value = id
	await storage.set('referrer', id)
}
export const saveReferrerId = async () => {
	const id = getReferrerId()
	if (id) await storage.set('referrer', id)
}

export const useEmailSignin = () => {
	const factory = new EmailSigninFactory()
	const { error, loading, setError, setLoading } = store.emailSignin
	const signin = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			await setLoading(true)
			try {
				const user = await AuthUseCases.signinWithEmail(factory, {
					referrer: await getReferrerId()
				})
				await createSession(user)
				await storage.remove('referrer')
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}
	return { factory, loading, error, signin }
}

export const useEmailSignup = () => {
	const factory = new EmailSignupFactory()
	const { error, loading, setError, setLoading } = store.emailSignup
	const signup = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			await setLoading(true)
			try {
				const user = await AuthUseCases.signupWithEmail(factory, { referrer: await getReferrerId() })
				await createSession(user)
				await storage.remove('referrer')
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}
	return { factory, loading, error, signup }
}


export const setEmailVerificationEmail = (email: string) => store.emailVerification.email.value = email
export const getEmailVerificationEmail = () => store.emailVerification.email.value

export const useEmailVerification = () => {
	const router = useRouter()
	const sent = ref(false)
	const token = ref('')
	const { email, error, loading, message, setError, setLoading, setMessage } = store.emailVerification
	const completeVerification = async () => {
		await setError('')
		await setLoading(true)
		try {
			const user = await AuthUseCases.completeEmailVerification(token.value)
			await createSession(user)
		} catch (error) {
			await setError(error)
			if (error instanceof NetworkError && error.statusCode === StatusCodes.InvalidToken) {
				await setError('Invalid or expired token. Proceed to signin!')
				await router.push('/auth/signin')
			} else await setError(error)
		}
		await setLoading(false)
	}
	const sendVerificationEmail = async () => {
		if (!email.value) return
		await setError('')
		await setLoading(true)
		try {
			await AuthUseCases.sendVerificationEmail()
			await setMessage('An OTP was just sent to your mail')
			sent.value = true
		} catch (error) {
			await setError(error)
		}
		await setLoading(false)
	}
	onMounted(sendVerificationEmail)

	return {
		token, sent, email, loading, error, message,
		sendVerificationEmail, completeVerification
	}
}
