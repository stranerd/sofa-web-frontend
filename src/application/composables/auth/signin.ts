import { SignInWithApple } from '@capacitor-community/apple-sign-in'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAsyncFn } from '../core/hooks'
import { createStore } from '../core/store'
import { storage } from '@utils/storage'
import { AuthUseCases, EmailSigninFactory, EmailSignupFactory } from '@modules/auth'
import { useErrorHandler, useSuccessHandler } from '@app/composables/core/states'
import { createSession } from '@app/composables/auth/session'

const store = createStore(
	{
		referrerId: ref<string>(),
	},
	'auth/signin',
)

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

export const useEmailVerification = () => {
	const router = useRouter()
	const sent = ref(false)
	const token = ref('')
	const { message, setMessage } = useSuccessHandler()

	const {
		asyncFn: completeVerification,
		loading: completeVerificationLoading,
		error: completeVerificationError,
	} = useAsyncFn(async () => {
		const user = await AuthUseCases.completeEmailVerification(token.value)
		await createSession(user, router)
	})

	const {
		asyncFn: sendVerificationEmail,
		loading: sendVerificationEmailLoading,
		error: sendVerificationEmailError,
	} = useAsyncFn(async () => {
		await AuthUseCases.sendVerificationEmail()
		await setMessage('An OTP was just sent to your mail')
		sent.value = true
	})

	onMounted(sendVerificationEmail)

	return {
		token,
		sent,
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
				clientId: $utils.environment.googleClientId,
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
			const packageName = $utils.environment.packageName
			const clientId = $utils.constants.isWeb ? packageName.replace('.app', '') : packageName
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
