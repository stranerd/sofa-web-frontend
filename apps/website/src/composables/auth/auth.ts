import { AuthUser, Logic, SingleUser, Wallet } from 'sofa-logic'
import { computed, ref } from 'vue'
import { useListener } from '../core/listener'

const store = {
	auth: ref(null as AuthUser | null),
	user: ref(null as SingleUser | null),
	wallet: ref(null as Wallet | null),
	listener: useListener(async () => {
		const id = store.auth.value?.id as string | undefined
		if (!id) return () => {
			//
		}
		const setUser = async (user: SingleUser) => {
			store.user.value = user
		}
		const setWallet = async (wallet: Wallet) => {
			store.wallet.value = wallet
		}
		const listeners = [
			await Logic.Common.listenToOne(`users/users/${id}`, {
				created: setUser,
				updated: setUser,
				deleted: setUser
			}),
			await Logic.Common.listenToOne('payment/wallets',{
				created: setWallet,
				updated: setWallet,
				deleted: setWallet
			})
		]
		return async () => await Promise.all(listeners.map((l) => l()))
	})
}

export const useAuth = () => {
	const id = computed(() => store.auth.value?.id ?? '')
	const bio = computed(() => store.user.value?.bio)
	const isLoggedIn = computed(() => !!id.value && !!store.user.value)
	const isEmailVerified = computed(() => !!store.auth.value?.isEmailVerified)
	const isAdmin = computed(() => !!store.user.value?.roles.isAdmin || !!store.user.value?.roles.isSuperAdmin)
	const isSubscribed = computed(() => !!store.wallet.value?.subscription.active)

	const setAuthUser = async (details: AuthUser | null) => {
		if (store.listener) await store.listener.close()
		store.auth.value = details
		if (details?.id) {
			store.user.value = await Logic.Users.GetUser(details.id)
			store.wallet.value = await Logic.Payment.GetUserWallet()
		} else store.user.value = null
	}

	const startProfileListener = async () => {
		await store.listener.restart()
	}

	const signin = async (remembered: boolean) => {
		remembered
		await Promise.all([
			// setupPush(id.value),
			startProfileListener()
		])
		return true
	}

	const signout = async () => {
		// await unregisterDeviceOnLogout()
		// await AuthUseCases.sessionSignout()
		await setAuthUser(null)
		// if (isClient()) window.location.assign('/auth/signin')
	}

	const deleteAccount = async () => {
		// await unregisterDeviceOnLogout()
		// await AuthUseCases.deleteAccount()
		await setAuthUser(null)
		// if (isClient()) window.location.assign('/auth/signin')
	}

	return {
		id, bio, user: store.user, auth: store.auth, wallet: store.wallet,
		isLoggedIn, isEmailVerified, isAdmin, isSubscribed,
		setAuthUser, signin, signout, deleteAccount
	}
}
