<template>
	<div
		class="flex gap-2 items-center w-full lg:text-sm mdlg:text-[12px] text-xs z-[100] px-4 sticky top-0 mdlg:bg-white bg-lightGray justify-between mdlg:shadow-custom">
		<template v-if="type == 'main'">
			<div class="mdlg:hidden flex items-center justify-between w-full">
				<SofaAvatar :size="32" :photoUrl="user?.picture" @click="openSideBar" />

				<div class="py-4 flex items-center justify-center">
					<SofaHeading v-if="title" :content="title" />
					<Logo withoutText class="h-[24px]" />
				</div>

				<NotificationIcon v-if="user" />
			</div>
			<div class="hidden gap-5 items-center justify-start grow mdlg:flex">
				<router-link class="py-2 pr-3" to="/dashboard">
					<Logo class="h-[32px]" />
				</router-link>

				<router-link
					v-for="tab in tabs"
					:key="tab.name"
					class="py-4 flex items-center justify-center gap-2 text-bodyBlack border-b-2 border-transparent"
					:class="{ '!text-primaryPurple !border-primaryPurple': $utils.tabIsActive(tab.path) }"
					:to="tab.path">
					<SofaIcon :name="tab.icon" class="h-[18px] fill-current" />
					<SofaHeading :content="tab.name" />
				</router-link>

				<form class="py-1 w-[30%]" @submit.prevent="initiateSearch">
					<SofaInput v-model="searchQuery" placeholder="Search" class="!py-2 !rounded-full">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
			</div>

			<div class="hidden mdlg:flex items-center gap-4">
				<SofaButton padding="p-2 rounded-full" @click="handleShowAddMaterial">
					<SofaIcon name="plus" class="fill-white" />
				</SofaButton>
				<NotificationIcon v-if="user" />
				<SofaAvatar :size="36" :photoUrl="user?.picture" as="router-link" to="/settings/profile" />
			</div>

			<SofaButton
				bgColor="bg-primaryPurple"
				padding="p-4"
				class="mdlg:hidden rounded-full fixed bottom-[4rem] right-[1.5rem]"
				@click="handleShowAddMaterial">
				<SofaIcon name="plus" class="fill-white" />
			</SofaButton>
		</template>

		<template v-if="type == 'sub'">
			<div class="flex gap-4 items-center">
				<SofaHeading class="py-4" :content="title" />
				<div v-if="badges.length" class="flex gap-2 items-center">
					<SofaBadge v-for="item in badges" :key="item.text" v-bind="item">
						{{ item.text }}
					</SofaBadge>
				</div>
			</div>

			<div class="md:flex hidden items-center gap-4">
				<template v-for="(action, index) in actions.filter((action) => !action.hide)" :key="index">
					<a
						v-if="'icon' in action && action.icon"
						class="flex gap-2 items-center"
						:class="{ 'border-r border-darkLightGray pr-3': action.bordered }"
						@click="action.disabled ? undefined : action.handler()">
						<SofaIcon :name="action.icon" class="fill-deepGray" :class="action.size" />
						<SofaText :content="action.label" />
					</a>
					<SofaButton
						v-else-if="!('icon' in action)"
						:disabled="action.disabled"
						padding="px-4 py-1"
						v-bind="action.outlined ? { bgColor: 'bg-white', textColor: 'text-grayColor' } : {}"
						class="!font-semibold"
						:class="{ 'border border-gray-200': action.outlined }"
						@click="action.handler">
						{{ action.label }}
					</SofaButton>
				</template>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import SofaBadge from '../SofaBadge/index.vue'
import { handleShowAddMaterial } from '@app/composables/study'
import { useModals } from '@app/composables/core/modals'
import { useAuth } from '@app/composables/auth/auth'

type Action = {
	label: string
	handler: () => void
	hide?: boolean
	disabled?: boolean
}

type ActionButton = Action & {
	outlined?: boolean
}

type ActionIcon = Action & {
	icon: IconName
	size?: string
	bordered?: boolean
}

withDefaults(
	defineProps<{
		actions?: (ActionButton | ActionIcon)[]
		title?: string
		type?: 'main' | 'sub'
		badges?: (InstanceType<typeof SofaBadge>['$props'] & { text: string })[]
	}>(),
	{
		actions: () => [],
		title: undefined,
		type: 'main',
		badges: () => [],
	},
)

const { user, isAdmin, userType } = useAuth()
const router = useRouter()
const openSideBar = () => useModals().users.sideBar.open({})

const searchQuery = ref('')

const initiateSearch = () => {
	if (searchQuery.value.length > 1) router.push('/marketplace/search?q=' + searchQuery.value)
}

const tabs = computed(
	() =>
		[
			...(isAdmin.value
				? [
						{
							name: 'Admin',
							path: '/admin',
							icon: 'admin' as const,
						},
					]
				: []),
			{
				name: 'Home',
				path: '/dashboard',
				icon: 'home' as const,
			},
			...(!userType.value.isOrg
				? [
						{
							name: 'Chat',
							path: '/chats',
							icon: 'chat' as const,
						},
					]
				: []),
			{
				name: 'Classes',
				path: userType.value.isOrg ? '/dashboard/classes' : '/classes',
				icon: 'classes' as const,
			},
			{
				name: 'Library',
				path: '/library',
				icon: 'library' as const,
			},
			{
				name: 'Marketplace',
				path: '/marketplace',
				icon: 'marketplace' as const,
			},
		] as const,
)
</script>
