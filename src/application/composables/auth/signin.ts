import { SignInWithApple } from '@capacitor-community/apple-sign-in'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { createSession } from '@app/composables/auth/session'
import { useErrorHandler, useSuccessHandler } from '@app/composables/core/states'
import { AuthUseCases, EmailSigninFactory, EmailSignupFactory } from '@modules/auth'
import { NetworkError, StatusCodes } from '@modules/core'
import { storage } from '@utils/storage'

const { isWeb } = $utils.constants
const { googleClientId, packageName } = $utils.environment

const store = {
	referrerId: ref(undefined as string | undefined),
	emailVerification: { email: ref(''), ...useSuccessHandler() },
}

export const getReferrerId = async () => (await storage.get<string>('referrer')) ?? store.referrerId.value

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
	const router = useRouter()
	const {
		asyncFn: signin,
		loading,
		error,
	} = useAsyncFn(async () => {
		const user = await AuthUseCases.signinWithEmail(factory, { referrer: await getReferrerId() })
		await createSession(user, router)
		await storage.remove('referrer')
	})
	return { factory, loading, error, signin }
}

export const useEmailSignup = () => {
	const factory = new EmailSignupFactory()
	const router = useRouter()
	const {
		asyncFn: signup,
		loading,
		error,
	} = useAsyncFn(async () => {
		const user = await AuthUseCases.signupWithEmail(factory, { referrer: await getReferrerId() })
		await createSession(user, router)
		await storage.remove('referrer')
	})
	return { factory, loading, error, signup }
}

export const setEmailVerificationEmail = (email: string) => (store.emailVerification.email.value = email)
export const getEmailVerificationEmail = () => store.emailVerification.email.value

export const useEmailVerification = () => {
	const router = useRouter()
	const sent = ref(false)
	const token = ref('')
	const { email, message, setMessage } = store.emailVerification

	const {
		asyncFn: completeVerification,
		loading: completeVerificationLoading,
		error: completeVerificationError,
	} = useAsyncFn(async () => {
		try {
			const user = await AuthUseCases.completeEmailVerification(token.value)
			await createSession(user, router)
		} catch (error) {
			if (error instanceof NetworkError && error.statusCode === StatusCodes.InvalidToken) {
				await router.push('/auth/signin')
				throw new Error('Invalid or expired token. Proceed to signin!')
			} else throw error
		}
	})

	const {
		asyncFn: sendVerificationEmail,
		loading: sendVerificationEmailLoading,
		error: sendVerificationEmailError,
	} = useAsyncFn(async () => {
		if (!email.value) return
		await AuthUseCases.sendVerificationEmail()
		await setMessage('An OTP was just sent to your mail')
		sent.value = true
	})

	onMounted(sendVerificationEmail)

	return {
		token,
		sent,
		email,
		message,
		sendVerificationEmail,
		sendVerificationEmailLoading,
		sendVerificationEmailError,
		completeVerification,
		completeVerificationLoading,
		completeVerificationError,
	}
}

export const useGoogleSignin = () => {
	const { setError } = useErrorHandler()
	const router = useRouter()

	const {
		asyncFn: signin,
		loading,
		error,
	} = useAsyncFn(async () => {
		try {
			const googleUser = await GoogleAuth.signIn()
			const { idToken } = googleUser.authentication
			await GoogleAuth.signOut()
			const user = await AuthUseCases.signinWithGoogle({ idToken }, { referrer: await getReferrerId() })
			await createSession(user, router)
			await storage.remove('referrer')
		} catch (error) {
			throw error ?? 'Error signing in with google'
		}
	})

	onMounted(async () => {
		try {
			GoogleAuth.initialize({
				clientId: googleClientId,
				scopes: ['profile', 'email'],
			})
		} catch (err) {
			await setError(err)
		}
	})

	return { loading, error, signin }
}

export const useAppleSignin = () => {
	const router = useRouter()
	const {
		asyncFn: signin,
		loading,
		error,
	} = useAsyncFn(async () => {
		try {
			const clientId = isWeb ? packageName.replace('.app', '') : packageName
			const redirectURI = 'https://' + clientId.split('.').reverse().join('.')
			const { response } = await SignInWithApple.authorize({
				clientId,
				redirectURI,
				scopes: 'name email',
			})
			const user = await AuthUseCases.signinWithApple(
				{
					firstName: response.givenName,
					lastName: response.familyName,
					email: response.email,
					idToken: response.identityToken,
				},
				{ referrer: await getReferrerId() },
			)
			await createSession(user, router)
			await storage.remove('referrer')
		} catch (error) {
			throw 'Error signing in with apple'
		}
	})
	return { loading, error, signin }
}
