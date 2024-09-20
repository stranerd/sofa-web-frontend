<template>
	<AuthLayout title="Choose account type" :hideBack="!type" bgImage="/images/auth-setup.png" :showBodyBgImage="type ? true : false">
		<AccountSetup v-if="type" />
		<div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 place-items-center mt-24 md:mt-0 w-full">
			<router-link
				v-for="(userType, index) in userTypes"
				:key="userType.value"
				:to="`/onboarding?type=${userType.value}`"
				:class="[
					'md:h-[220px] md:w-[180px] lg:w-[220px] h-[180px] w-3/4 p-3 cursor-pointer rounded-xl flex flex-col items-center gap-2 justify-center',
					userType.bgClass,
					index === 2 ? 'md:col-span-2 flex justify-center' : '',
				]">
				<SofaIcon class="md:h-[65px] h-[45px]" :name="userType.icon" />
				<SofaText class="text-white font-semibold">
					{{ userType.label }}
				</SofaText>
				<SofaText class="text-white text-center" size="sub">{{ userType.description }}</SofaText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { ref, computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { UserType } from '@modules/users'

export default defineComponent({
	name: 'OnboardingPage',
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
		useHead({ title: 'Setup Your Account' })
		const route = useRoute()
		const type = computed(() => route.query.type as UserType | undefined)
		const userTypes = ref([
			{
				value: UserType.student,
				label: 'Student',
				icon: 'auth-student' as const,
				bgClass: 'bg-primaryBlue',
				description: 'For both academic and vocational learners alike.',
			},
			{
				value: UserType.teacher,
				label: 'Teacher',
				icon: 'auth-tutor' as const,
				bgClass: 'bg-primaryGreen',
				description: 'For tutors and creators of learning materials',
			},
			{
				value: UserType.organization,
				label: 'Organization',
				icon: 'auth-organization' as const,
				bgClass: 'bg-primaryPurple',
				description: 'For businesses, enterprises, and academic institutions.',
			},
			//will be added when needed.
			// {
			// 	value: UserType.agent,
			// 	label: 'Agent',
			// 	icon: 'auth-agent' as const,
			// 	bgClass: 'bg-primaryPurplePink',
			// 	description: 'For individuals who want to earn by referring users.',
			// },
		])

		return { type, userTypes, UserType }
	},
})
</script>
