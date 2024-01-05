<template>
	<sub-page-layout v-if="!index && !Logic.Common.isLarge">
		<div class="h-full w-full">
			<slot />
		</div>
	</sub-page-layout>
	<dashboard-layout v-else>
		<template v-slot:left-session>
			<div
				class="w-full shadow-custom px-4 pb-4 bg-white relative rounded-2xl gap-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:scrollbar-thin flex flex-col">
				<router-link
					class="w-full flex items-center justify-start pt-7 top-0 left-0 sticky bg-white z-30 gap-3 p-3"
					to="/chats/new"
					v-if="userType.isStudent">
					<sofa-icon name="box-add-pink" custom-class="h-[17px]" />
					<sofa-normal-text :color="'text-primaryPink'"> New chat </sofa-normal-text>
				</router-link>

				<div class="w-full flex justify-start pt-4 pb-2" v-if="conversations.length && userType.isTeacher">
					<sofa-header-text customClass="text-left mdlg:!text-base text-sm" content="All Chats" />
				</div>

				<!-- Chat list -->
				<ChatList />

				<!-- Empty state -->
				<template v-if="userType.isTeacher && !conversations.length">
					<div class="pt-4">
						<sofa-empty-state title="No chat" subTitle="Your active chats will show up here" actionLabel="" />
					</div>
				</template>
			</div>
		</template>

		<template v-slot:right-session>
			<!-- Student POV -->
			<slot name="right-extras">
				<div v-if="userType.isStudent" class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
					<div class="w-full flex flex-row items-center gap-3">
						<div
							:style="`background-image: url('${userAi.image}')`"
							class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"></div>

						<div class="flex flex-col gap-1">
							<sofa-header-text :customClass="'!text-base !font-bold'" :content="userAi.name" />
						</div>
					</div>
					<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
						<sofa-normal-text :customClass="'text-left'" :color="'text-deepGray'">
							Hello! I am here to respond to your messages in every chat 24/7.
							<br /><br />
							Let us work towards your highest ever academic achievements.
						</sofa-normal-text>
					</div>
				</div>
			</slot>
		</template>

		<template v-slot:middle-session>
			<slot />
		</template>
	</dashboard-layout>
</template>

<script lang="ts" setup>
import { Logic } from 'sofa-logic'
import { SofaEmptyState, SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineProps } from 'vue'
import ChatList from './ChatList.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList } from '@/composables/conversations/conversations'

defineProps({
	title: {
		type: String,
		required: true,
	},
	index: {
		type: Boolean,
		required: false,
		default: false,
	},
})

const { userType, userAi } = useAuth()
const { conversations } = useConversationsList()
</script>
