<template>
	<AuthLayout title="Setup your account" :subTitle="type ? undefined : 'Choose your account type'" :hideBack="!type">
		<AccountSetup v-if="type" />
		<div v-else class="flex md:flex-row flex-col gap-3 md:gap-6 justify-center items-center w-full">
			<router-link
				v-for="userType in [
					{ value: UserType.student, label: 'Student', icon: 'auth-student' as const, bgClass: 'bg-primaryBlue' },
					{ value: UserType.teacher, label: 'Teacher', icon: 'auth-tutor' as const, bgClass: 'bg-primaryGreen' },
					{
						value: UserType.organization,
						label: 'Organization',
						icon: 'auth-organization' as const,
						bgClass: 'bg-primaryPurple',
					},
				]"
				:key="userType.value"
				:to="`/onboarding?type=${userType.value}`"
				:class="`md:h-[180px] md:w-[180px] h-[120px] w-full cursor-pointer rounded-custom ${userType.bgClass} flex flex-col items-center gap-2 justify-center`">
				<SofaIcon class="md:h-[65px] h-[45px]" :name="userType.icon" />

				<SofaText class="text-white font-semibold">
					{{ userType.label }}
				</SofaText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { UserType } from '@modules/users'
import AccountSetup from '@app/components/onboarding/AccountSetup.vue'

export default defineComponent({
	name: 'OnboardingPage',
	components: { AccountSetup },
	routeConfig: {
		middlewares: [
			'isOnboarding',
			({ to }) => {
				const type = to.query.type as UserType | undefined
				if (!type || Object.values(UserType).includes(type)) return
				return '/onboarding'
			},
		],
	},
	setup() {
		useMeta({ title: 'Setup Your Account' })
		const route = useRoute()
		const type = computed(() => route.query.type as UserType | undefined)

		return { type, UserType }
	},
})
</script>
