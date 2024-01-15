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
import { useAsyncFn } from '../core/hooks'
import { useSuccessHandler } from '../core/states'

export const useUserTypeUpdate = () => {
	const factory = new UserTypeFactory()
	const { user } = useAuth()

	const type = Logic.Common.route?.query?.type as UserType
	if (type && Object.values(UserType).includes(type)) factory.type = type
	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const {
		asyncFn: updateType,
		loading,
		error,
	} = useAsyncFn(async () => {
		await UsersUseCases.updateType(factory)
		return true
	})

	return { error, loading, factory, updateType }
}

export const showCustomizeAi = ref(false)

export const useUserAiUpdate = () => {
	const factory = new UserAiFactory()
	const { setMessage } = useSuccessHandler()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const {
		asyncFn: updateAi,
		loading,
		error,
	} = useAsyncFn(async () => {
		await UsersUseCases.updateAi(factory)
		await setMessage('Updated successfully!')
		showCustomizeAi.value = false
	})

	return { error, loading, factory, updateAi }
}

const locationStore = {
	countries: ref<Awaited<ReturnType<(typeof UsersUseCases)['getCountries']>>>([]),
}

export const useUserLocationUpdate = () => {
	const factory = new UserLocationFactory()
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const { asyncFn: fetchCountries, called } = useAsyncFn(
		async () => {
			locationStore.countries.value = await UsersUseCases.getCountries()
		},
		{ key: 'users/users/countries' },
	)

	onMounted(async () => {
		if (!called.value) await fetchCountries()
	})

	const {
		asyncFn: updateLocation,
		loading,
		error,
	} = useAsyncFn(async () => {
		await UsersUseCases.updateLocation(factory)
		return true
	})

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
	const { user } = useAuth()

	if (user.value) factory.loadEntity(user.value)
	watch(user, () => user.value && factory.loadEntity(user.value))

	const {
		asyncFn: updateSocials,
		loading,
		error,
	} = useAsyncFn(async () => {
		await UsersUseCases.updateSocials(factory)
		return true
	})

	return { error, loading, factory, updateSocials }
}
