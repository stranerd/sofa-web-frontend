import {
	UserAiFactory,
	UserLocationFactory,
	UserSocials,
	UserSocialsFactory,
	UserType,
	UserTypeFactory,
	UsersUseCases,
} from '@modules/users'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuth } from '../auth/auth'
import { useErrorHandler, useLoadingHandler, useSuccessHandler } from '../core/states'

export const useUserTypeUpdate = () => {
	const factory = new UserTypeFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	const type = Logic.Common.route?.query?.type as UserType
	if (type && Object.values(UserType).includes(type)) factory.type = type
	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateType = async (skipAlert = false) => {
		await setError('')
		let succeeded = false
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateType(factory)
				await setMessage('Updated successfully!', skipAlert)
				succeeded = true
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
		return succeeded
	}

	return { error, loading, factory, updateType }
}

export const showCustomizeAi = ref(false)

export const useUserAiUpdate = () => {
	const factory = new UserAiFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateAi = async () => {
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateAi(factory)
				await setMessage('Updated successfully!')
				showCustomizeAi.value = false
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
	}

	return { error, loading, factory, updateAi }
}

const locationStore = {
	countries: ref<Awaited<ReturnType<(typeof UsersUseCases)['getCountries']>>>([]),
	fetched: ref(false),
}

export const useUserLocationUpdate = () => {
	const factory = new UserLocationFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	onMounted(async () => {
		if (locationStore.fetched.value || loading.value) return
		await setLoading(true)
		try {
			locationStore.countries.value = await UsersUseCases.getCountries()
			locationStore.fetched.value = true
		} catch (error) {
			await setError(error)
		}
		await setLoading(false)
	})

	const updateLocation = async (skipAlert = false) => {
		let succeeded = false
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateLocation(factory)
				await setMessage('Updated successfully!', skipAlert)
				succeeded = true
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
		return succeeded
	}

	const countries = computed(() => locationStore.countries.value.map((c) => c.name))
	const states = computed(
		() =>
			locationStore.countries.value.find((c) => c.name.toLowerCase() === factory.country.toLowerCase())?.states.map((s) => s.name) ??
			[],
	)

	return { error, loading, factory, countries, states, updateLocation }
}

export const socials = {
	[UserSocials.website]: 'website',
	[UserSocials.youtube]: 'youtube',
	[UserSocials.instagram]: 'instagram-social',
	[UserSocials.tiktok]: 'tiktok-social',
	[UserSocials.facebook]: 'facebook-social',
	[UserSocials.twitter]: 'twitter-social',
}

export const useUserSocialsUpdate = () => {
	const factory = new UserSocialsFactory()
	const { error, setError } = useErrorHandler()
	const { loading, setLoading } = useLoadingHandler()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const updateSocials = async (skipAlert = false) => {
		let succeeded = false
		await setError('')
		if (factory.valid && !loading.value) {
			try {
				await setLoading(true)
				await UsersUseCases.updateSocials(factory)
				await setMessage('Updated successfully!', skipAlert)
				succeeded = true
			} catch (error) {
				await setError(error)
			}
			await setLoading(false)
		} else factory.validateAll()
		return succeeded
	}

	return { error, loading, factory, updateSocials }
}
