<template>
	<div
		:class="`items-center w-full lg:text-sm mdlg:text-[12px] text-xs  z-[100] gap-2 px-3 mdlg:px-4 sticky  top-0 mdlg:!bg-white bg-lightGray justify-between mdlg:!shadow-custom lg:!shadow-custom ${customClass}`">
		<template v-if="type == 'main'">
			<div class="mdlg:hidden flex items-center justify-between w-full">
				<SofaAvatar size="32" :photoUrl="user?.bio.photo?.link" @click="openSideBar" />

				<div class="py-4 flex items-center justify-center">
					<img v-if="!title" src="/images/logo.svg" class="h-[24px]" />
					<SofaNormalText customClass="!font-bold !text-base">{{ title }}</SofaNormalText>
				</div>

				<div class="w-[30px] h-[30px] flex flex-row items-center justify-center" @click="showNotification = true">
					<SofaIcon customClass="h-[22px]" name="bell" />
				</div>
			</div>
			<div class="hidden gap-5 items-center justify-start flex-grow mdlg:flex">
				<router-link class="py-2 pr-3 flex items-center gap-1" to="/dashboard">
					<img src="/images/logo.svg" class="h-[32px]" />
					<img src="/images/logo-text.svg" class="h-[16px]" />
				</router-link>

				<router-link
					v-for="tab in tabs"
					:key="tab.name"
					class="py-4 flex items-center justify-center gap-2"
					:class="Logic.Common.tabIsActive(tab.path) ? 'border-b-2 border-primaryPurple' : ''"
					:to="tab.path">
					<SofaIcon
						:name="tab.icon"
						class="h-[18px]"
						:class="{
							'!fill-primaryPurple': Logic.Common.tabIsActive(tab.path),
							'fill-bodyBlack': true,
						}" />
					<SofaNormalText
						customClass="font-bold"
						:color="Logic.Common.tabIsActive(tab.path) ? 'text-primaryPurple' : 'text-darkBody'">
						{{ tab.name }}
					</SofaNormalText>
				</router-link>

				<form
					class="bg-lightGray w-[30%] py-2 rounded-[24px] flex flex-row items-center gap-2 px-4"
					@submit.prevent="initiateSearch">
					<SofaIcon customClass="h-[15px]" name="search" />
					<SofaTextField
						v-model="searchQuery"
						customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-full"
						placeholder="Search"
						padding="px-1" />
				</form>
			</div>

			<div class="hidden mdlg:!flex items-center gap-4">
				<SofaButton padding="p-2 rounded-full" @click="handleShowAddMaterial">
					<SofaIcon name="plus-white" />
				</SofaButton>
				<div class="flex flex-col relative" tabindex="10" @blur="showNotification = false">
					<div
						class="w-[36px] h-[36px] flex flex-row items-center justify-center border border-darkLightGray rounded-full cursor-pointer"
						@click="showNotification = true">
						<SofaIcon customClass="h-[16px]" name="bell" />
					</div>
					<div
						v-if="showNotification"
						class="w-[400px] min-h-[250px] max-h-[400px] bg-white shadow-custom rounded-custom pb-3 px-4 absolute top-[140%] right-0 z-[100] hidden mdlg:flex flex-col">
						<Notification :close="() => (showNotification = false)" />
					</div>
				</div>

				<SofaAvatar size="36" :photoUrl="user?.bio?.photo?.link" as="router-link" to="/settings/profile" />
			</div>

			<SofaButton
				bgColor="bg-primaryPurple"
				:hasShadow="false"
				class="mdlg:hidden rounded-full !p-4 !fixed bottom-[4rem] right-[1.5rem]"
				@click="handleShowAddMaterial">
				<SofaIcon name="plus-white" />
			</SofaButton>
		</template>

		<template v-if="type == 'subpage'">
			<div class="flex flex-row gap-4 items-center">
				<SofaIcon customClass="h-[12px] cursor-pointer" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaHeaderText customClass="!font-bold py-4" :content="title" />
				<div v-if="badges.length" class="flex flex-row gap-2 items-center">
					<SofaBadge v-for="item in badges" :key="item.text" :color="item.color">
						{{ item.text }}
					</SofaBadge>
				</div>
			</div>

			<div class="md:!flex hidden flex-row items-center gap-4">
				<template v-for="(action, index) in subpageActions" :key="index">
					<template v-if="action.isIcon && !action.hide">
						<div class="flex gap-4 border-r border-darkLightGray items-center pr-3">
							<a
								v-for="(icon, i) in action.data.filter((d: any) => !d.hide)"
								:key="i"
								class="flex flex-row gap-2 items-center"
								@click="icon.handler()">
								<SofaIcon :name="icon.icon" :customClass="icon.size" />

								<SofaNormalText>
									{{ icon.name }}
								</SofaNormalText>
							</a>
						</div>
					</template>
					<template v-else-if="!action.hide">
						<SofaButton
							v-if="!action.IsOutlined"
							:disabled="action.disabled"
							padding="px-4 py-1"
							:customClass="`!font-semibold ${action.class ?? ''}`"
							@click="action.handler()">
							{{ action.name }}
						</SofaButton>
						<SofaButton
							v-else
							:disabled="action.disabled"
							bgColor="bg-white"
							textColor="text-grayColor"
							:customClass="`!font-semibold border border-gray-200 ${action.class ?? ''}`"
							padding="px-4 py-1"
							@click="action.handler()">
							{{ action.name }}
						</SofaButton>
					</template>
				</template>
			</div>
		</template>

		<!-- Notification modal -->
		<SofaModalOld v-if="showNotification" :close="() => (showNotification = false)" customClass="mdlg:!hidden">
			<div class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-auto max-h-[80%] md:w-[70%] flex flex-col items-center relative">
				<div
					class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-3 px-4 pb-5 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
					<Notification :close="() => (showNotification = false)" />
				</div>
			</div>
		</SofaModalOld>
	</div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SofaAvatar from '../SofaAvatar'
import SofaBadge from '../SofaBadge'
import SofaButton from '../SofaButton'
import { SofaTextField } from '../SofaForm'
import SofaIcon from '../SofaIcon/index.vue'
import SofaModalOld from '../SofaModalOld'
import { SofaHeaderText } from '../SofaTypography'
import SofaNormalText from '../SofaTypography/normalText.vue'
import Notification from './notification.vue'
import { Conditions, Logic } from 'sofa-logic'
import { handleShowAddMaterial } from '@app/composables/study'
import { useModals } from '@app/composables/core/modals'
import { useAuth } from '@app/composables/auth/auth'

withDefaults(
	defineProps<{
		subpageActions?: any[]
		title?: string
		type?: string
		customClass?: string
		badges?: {
			text: string
			color: InstanceType<typeof SofaBadge>['$props']['color']
		}[]
	}>(),
	{
		subpageActions: () => [],
		title: '',
		type: 'main',
		customClass: 'flex',
		badges: () => [],
	},
)

const { user, userType } = useAuth()
const router = useRouter()
const openSideBar = () => useModals().users.sideBar.open({})
const showNotification = ref(false)

const searchQuery = ref('')

onMounted(() => {
	// get user notifications
	Logic.Notifications.GetNotifications({
		where: [
			{
				field: 'userId',
				condition: Conditions.eq,
				value: Logic.Common.AuthUser?.id,
			},
		],
	})
})

const initiateSearch = () => {
	if (searchQuery.value.length > 1) router.push('/marketplace/search?q=' + searchQuery.value)
}

const tabs = computed(() => [
	{
		name: 'Home',
		path: '/dashboard',
		icon: 'home' as const,
		icon_size: 'h-[18px]',
	},
	...(!userType.value.isOrg
		? [
				{
					name: 'Chat',
					path: '/chats',
					icon: 'chat' as const,
					icon_size: 'h-[18px]',
				},
			]
		: []),
	{
		name: 'Library',
		path: '/library',
		icon: 'library' as const,
		icon_size: 'h-[18px]',
	},
	// {
	//   name: "Analytics",
	//   path: "/analytics",
	//   icon: "analytics" as const,
	//   icon_size: "h-[18px]",
	// },
	{
		name: 'Marketplace',
		path: '/marketplace',
		icon: 'marketplace' as const,
		icon_size: 'h-[18px]',
	},
])
</script>
