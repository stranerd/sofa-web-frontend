import { computed, ref } from 'vue'
import { useListener } from '@app/composables/core/listener'
import { AuthDetails, AuthTypes, AuthUseCases } from '@modules/auth'
import { WalletsUseCases } from '@modules/payment'
import { WalletEntity } from '@modules/payment/domain/entities/wallets'
import { UserEntity, UsersUseCases } from '@modules/users'

const store = {
	auth: ref(null as AuthDetails | null),
	user: ref(null as UserEntity | null),
	wallet: ref(null as WalletEntity | null),
	listener: useListener(async () => {
		const id = store.auth.value?.id as string | undefined
		if (!id) return () => {}
		const setUser = async (user: UserEntity) => {
			store.user.value = user
		}
		const setWallet = async (wallet: WalletEntity) => {
			store.wallet.value = wallet
		}
		const listeners = [
			await UsersUseCases.listenToOne(id, { created: setUser, updated: setUser, deleted: setUser }),
			await WalletsUseCases.listen({
				created: setWallet,
				updated: setWallet,
				deleted: setWallet,
			}),
		]
		return () => Promise.all(listeners.map((l) => l()))
	}),
}

export const useAuth = () => {
	const id = computed(() => store.auth.value?.id ?? '')
	const bio = computed(() => store.user.value?.bio)
	const isLoggedIn = computed(() => !!id.value && !!store.user.value)
	const isEmailVerified = computed(() => !!store.auth.value?.isEmailVerified)
	const isAdmin = computed(() => !!store.auth.value?.roles.isAdmin)
	const isSubscribed = computed(() => !!store.wallet.value?.subscription.active)

	const userType = computed(() => store.user.value?.userType ?? UserEntity.getDefaultUserType())

	const userAi = computed(() => ({
		name: store.user.value?.ai?.name ?? UserEntity.defaultAi,
		tagline: store.user.value?.ai?.tagline ?? '',
		image: store.user.value?.ai?.photo?.link ?? UserEntity.defaultAiPhotoLink,
	}))

	const hasPassword = computed(() => !!store.auth.value?.authTypes.includes(AuthTypes.email))

	const setAuthUser = async (details: AuthDetails | null) => {
		await store.listener?.close()
		store.auth.value = details
		if (details?.id) {
			store.user.value = await UsersUseCases.find(details.id)
			store.wallet.value = await WalletsUseCases.get()
		} else store.user.value = null
	}

	const startProfileListener = async () => {
		await store.listener.restart()
	}

	const signin = async (remembered: boolean) => {
		remembered
		await Promise.all([
			// setupPush(id.value),
			startProfileListener(),
		])
		return true
	}

	const signout = async () => {
		const confirmed = await $utils.confirm({
			title: 'Are you sure you want to logout?',
			sub: '',
			right: { label: 'Yes, logout' },
		})
		if (!confirmed) return
		// await unregisterDeviceOnLogout()
		await AuthUseCases.sessionSignout()
		await setAuthUser(null)
		window.location.assign('/auth/signin')
	}

	const deleteAccount = async () => {
		const confirmed = await $utils.confirm({
			title: 'Are you sure?',
			sub: 'This action is permanent. All your learning resources will be lost',
			right: { label: 'Yes, delete account' },
		})
		if (!confirmed) return
		// await unregisterDeviceOnLogout()
		await AuthUseCases.deleteAccount()
		await setAuthUser(null)
		window.location.assign('/auth/signin')
	}

	return {
		id,
		bio,
		user: store.user,
		auth: store.auth,
		wallet: store.wallet,
		isLoggedIn,
		isEmailVerified,
		isAdmin,
		isSubscribed,
		userType,
		userAi,
		hasPassword,
		setAuthUser,
		signin,
		signout,
		deleteAccount,
	}
}
