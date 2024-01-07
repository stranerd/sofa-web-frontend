<template>
	<div v-if="userType.isTeacher && requests.length" class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 mdlg:pb-2 pb-4">
		<a :class="`w-full flex items-center justify-between ${extraStyle}`" @click="showRequests = !showRequests">
			<sofa-header-text :custom-class="'text-left mdlg:!text-base text-sm'" :content="`Requests (${requests.length})`" />
			<sofa-icon :name="showRequests ? 'chevron-up' : 'chevron-down'" :custom-class="'h-[7px] cursor-pointer'" />
		</a>
		<div v-if="showRequests" class="w-full flex flex-col gap-3">
			<Chat
				v-for="request in requests"
				:key="request.hash"
				:custom-class="customClass"
				:chat="{
					route: `/chats/requests/${request.id}`,
					title: request.user.bio.name.full,
					lastMessage: request.title,
					lastMessageTime: formatTime(request.createdAt),
					photoUrl: request.user.bio.photo?.link ?? null,
				}" />
		</div>
	</div>
	<div v-if="pending.length" class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 mdlg:pb-2 pb-4">
		<a :class="`w-full flex items-center justify-between ${extraStyle}`" @click="showPending = !showPending">
			<sofa-header-text :custom-class="'text-left mdlg:!text-base text-sm'" :content="`Pending (${pending.length})`" />
			<sofa-icon :name="showPending ? 'chevron-up' : 'chevron-down'" :custom-class="'h-[7px] cursor-pointer'" />
		</a>
		<div v-if="showPending" class="w-full flex flex-col gap-3">
			<Chat
				v-for="request in pending.slice(0, limit)"
				:key="request.hash"
				:custom-class="customClass"
				:chat="{
					route: `/chats/${request.id}`,
					title: request.user.bio.name.full,
					lastMessage: request.title,
					lastMessageTime: formatTime(request.createdAt),
					photoUrl: request.user.bio.photo?.link ?? null,
				}" />
		</div>
	</div>
	<Chat
		v-for="chat in conversations.slice(0, limit)"
		:key="chat.hash"
		:custom-class="customClass"
		:chat="{
			route: `/chats/${chat.id}`,
			title: chat.title,
			lastMessage: chat.last?.body ?? 'No message',
			lastMessageTime: formatTime(chat.last?.createdAt ?? Date.now()),
			photoUrl:
				id === chat.user.id ? (chat.tutor ? chat.tutor.bio.photo?.link ?? null : userAi.image) : chat.user.bio.photo?.link ?? null,
		}" />
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList } from '@/composables/conversations/conversations'
import { formatTime } from '@utils/dates'
import { SofaHeaderText, SofaIcon } from 'sofa-ui-components'
import { defineProps, ref } from 'vue'
import Chat from './Chat.vue'

defineProps({
	customClass: {
		type: String,
		default: '',
	},
	extraStyle: {
		type: String,
		default: '',
	},
	limit: {
		type: Number,
		required: false,
		default: undefined,
	},
})

const { userType, id, userAi } = useAuth()

const showRequests = ref(true)
const showPending = ref(true)

const { conversations, requests, pending } = useConversationsList()
</script>
