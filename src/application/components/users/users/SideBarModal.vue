<template>
	<div class="flex flex-col py-5 gap-4 text-deepGray">
		<div v-if="user" class="w-full flex items-center gap-3 px-5">
			<SofaAvatar :size="75" :photoUrl="user.bio.photo?.link" />

			<div class="flex flex-col">
				<UserName :user="user" :avatar="false" bold />
				<SofaText class="capitalize text-grayColor" :content="userType.type" />
				<SofaText class="text-primaryBlue" as="router-link" to="/profile" content="View Profile" />
			</div>
		</div>
		<div v-if="user && userType.isStudent" class="w-full grid grid-cols-2 gap-3 px-5">
			<div class="p-4 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
				<SofaIcon class="h-[40px]" name="xp-points" />
				<div class="flex flex-col items-start justify-center">
					<SofaHeading> {{ $utils.formatNumber(user.account.rankings.overall.value, 2) }} xp </SofaHeading>
					<SofaText content="Point" />
				</div>
			</div>
			<div class="p-4 rounded-custom bg-lightGray col-span-1 flex gap-3 justify-start items-center">
				<SofaIcon class="h-[40px]" name="streak-new" />
				<div class="flex flex-col items-start justify-center">
					<SofaHeading>
						{{ user.account.streak.count }} {{ $utils.pluralize(user.account.streak.count, 'day', 'days') }}
					</SofaHeading>
					<SofaText>Streak</SofaText>
				</div>
			</div>
		</div>
		<div class="h-[1px] bg-lightGray" />
		<div class="w-full flex flex-col gap-1">
			<router-link
				v-for="item in routes"
				:key="item.route"
				class="w-full flex items-center gap-3 px-5 py-4 text-inherit hover:bg-lightBlue"
				:to="item.route"
				exactActiveClass="bg-lightBlue font-semibold">
				<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
				<SofaText :content="item.title" />
			</router-link>
		</div>
		<div class="h-[1px] bg-lightGray" />
		<template v-if="userType.isStudent">
			<router-link class="flex items-center gap-2 px-5" to="/chats/new">
				<SofaAvatar :photoUrl="userAi.image" :size="24" />
				<SofaText content="Ask me anything" />
			</router-link>
			<a class="flex items-center gap-2 px-5" @click="customizeAi">
				<SofaIcon name="robot" class="h-6" />
				<SofaText content="Customize AI" />
			</a>
			<div class="h-[1px] bg-lightGray" />
		</template>
		<template v-if="user">
			<SofaText as="a" class="text-primaryRed px-6" content="Log out" @click="signout" />
			<div class="h-[1px] bg-lightGray" />
		</template>
		<div class="flex flex-col gap-6 px-6 text-grayColor">
			<SofaText as="router-link" to="/legal/privacy-policy" content="Privacy Policy" />
			<SofaText as="router-link" to="/legal/terms-of-service" content="Terms of Service" />
			<SofaText v-if="user && !user.roles.isVerified" content="Get Verified" as="router-link" to="/verification" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'

defineProps<{
	close: () => void
}>()

const { user, userType, userAi, signout } = useAuth()

const customizeAi = () => useModals().users.customizeAi.open({})

const routes = computed(() => [
	{ title: 'Dashboard', icon: 'dashboard' as const, route: '/dashboard' },
	...(userType.value.isOrg
		? [
				{ title: 'Classes', icon: 'classes' as const, route: '/dashboard/classes' },
				{ title: 'Teachers', icon: 'tutor' as const, route: '/dashboard/teachers' },
				{ title: 'Students', icon: 'user-unfilled' as const, route: '/dashboard/students' },
			]
		: []),
	{ title: 'Settings', icon: 'cog' as const, route: '/settings' },
])
</script>
