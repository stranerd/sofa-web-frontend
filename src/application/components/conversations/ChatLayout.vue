<template>
	<SubPageLayout v-if="!index && !Logic.Common.isLarge">
		<div class="h-full w-full">
			<slot />
		</div>
	</SubPageLayout>
	<DashboardLayout v-else :noBottomPadding="true">
		<template #left-session>
			<div
				class="w-full shadow-custom px-4 pb-4 bg-white relative rounded-2xl gap-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:scrollbar-thin flex flex-col">
				<router-link
					v-if="userType.isStudent"
					class="w-full flex items-center justify-start pt-7 top-0 left-0 sticky bg-white z-30 gap-3 p-3"
					to="/chats/new">
					<SofaIcon name="box-add-pink" customClass="h-[17px]" />
					<SofaNormalText color="text-primaryPink"> New chat </SofaNormalText>
				</router-link>

				<div v-if="conversations.length && userType.isTeacher" class="w-full flex justify-start pt-4 pb-2">
					<SofaHeaderText customClass="text-left mdlg:!text-base text-sm" content="All Chats" />
				</div>

				<!-- Chat list -->
				<ChatList />

				<!-- Empty state -->
				<template v-if="userType.isTeacher && !conversations.length">
					<div class="pt-4">
						<SofaEmptyState title="No chat" subTitle="Your active chats will show up here" actionLabel="" />
					</div>
				</template>
			</div>
		</template>

		<template #right-session>
			<!-- Student POV -->
			<slot name="right-extras">
				<div v-if="userType.isStudent" class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
					<div class="w-full flex flex-row items-center gap-3">
						<div
							:style="`background-image: url('${userAi.image}')`"
							class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"></div>

						<div class="flex flex-col gap-1">
							<SofaHeaderText customClass="!text-base !font-bold" :content="userAi.name" />
						</div>
					</div>
					<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
						<SofaNormalText customClass="text-left" color="text-deepGray">
							Hello! I am here to respond to your messages in every chat 24/7.
							<br /><br />
							Let us work towards your highest ever academic achievements.
						</SofaNormalText>
					</div>
				</div>
			</slot>
		</template>

		<template #middle-session>
			<slot />
		</template>
	</DashboardLayout>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useConversationsList } from '@app/composables/conversations/conversations'
import { Logic } from 'sofa-logic'
import ChatList from './ChatList.vue'

withDefaults(
	defineProps<{
		title: string
		index?: boolean
	}>(),
	{
		index: false,
	},
)

const { userType, userAi } = useAuth()
const { conversations } = useConversationsList()
</script>
