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
		return () => Promise.all(listeners.map((l) => l()))
	})
}

export const useAuth = () => {
	const id = computed(() => store.auth.value?.id ?? '')
	const bio = computed(() => store.user.value?.bio)
	const isLoggedIn = computed(() => !!id.value && !!store.user.value)
	const isEmailVerified = computed(() => !!store.auth.value?.isEmailVerified)
	const isAdmin = computed(() => !!store.user.value?.roles.isAdmin || !!store.user.value?.roles.isSuperAdmin)
	const isSubscribed = computed(() => !!store.wallet.value?.subscription.active)

	const userType = computed(() => ({
		isStudent: store.user.value?.type.type === 'student',
		isTeacher: store.user.value?.type.type === 'teacher',
		isOrg: store.user.value?.type.type === 'organization',
	}))

	const userAi = computed(() => ({
		name: store.user.value?.ai?.name ?? 'Dr. Sofa',
		tagline: store.user.value?.ai?.tagline ?? '',
		image: store.user.value?.ai?.photo?.link ?? '/images/icons/robot.svg'
	}))

	const setAuthUser = async (details: AuthUser | null) => {
		await store.listener?.close()
		store.auth.value = details
		if (details?.id) {
			store.user.value = await Logic.Users.GetUserProfile(details.id)
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
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure you want to logout?',
			sub: '',
			rightLabel: 'Yes, logout',
		})
		if (!confirmed) return
		// await unregisterDeviceOnLogout()
		await Logic.Auth.SignOut()
		await setAuthUser(null)
		window.location.assign('/auth/login')
	}

	const deleteAccount = async () => {
		const confirmed = await Logic.Common.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All your learning resources will be lost',
			rightLabel: 'Yes, delete account',
		})
		if (!confirmed) return
		//
		// await unregisterDeviceOnLogout()
		await Logic.Auth.DeleteUserAccount()
		await setAuthUser(null)
		window.location.assign('/auth/login')
	}

	return {
		id, bio, user: store.user, auth: store.auth, wallet: store.wallet,
		isLoggedIn, isEmailVerified, isAdmin, isSubscribed, userType, userAi,
		setAuthUser, signin, signout, deleteAccount
	}
}
