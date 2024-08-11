<template>
	<div>
		<div v-if="userType.isTeacher && requests.length" class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 mdlg:pb-2 pb-4">
			<a class="w-full flex items-center justify-between" :class="extraStyle" @click.stop="showRequests = !showRequests">
				<SofaHeaderText customClass="text-left mdlg:!text-base text-sm" :content="`Requests (${requests.length})`" />
				<SofaIcon name="chevron-down" class="h-[7px]" :class="{ 'rotate-180': showRequests }" />
			</a>
			<div v-if="showRequests" class="w-full flex flex-col gap-3 mdlg:gap-0">
				<Chat
					v-for="request in requests"
					:key="request.hash"
					:customClass="customClass"
					:chat="{
						route: `/chats/requests/${request.id}`,
						title: request.user.bio.publicName,
						lastMessage: request.title,
						lastMessageTime: $utils.formatTime(request.createdAt),
						photoUrl: request.user.bio.photo?.link ?? null,
					}" />
			</div>
		</div>
		<div v-if="pending.length" class="w-full flex flex-col gap-2 mdlg:pt-1 pt-0 mdlg:pb-2 pb-4">
			<a class="w-full flex items-center justify-between" :class="extraStyle" @click.stop="showPending = !showPending">
				<SofaHeaderText customClass="text-left mdlg:!text-base text-sm" :content="`Pending (${pending.length})`" />
				<SofaIcon name="chevron-down" class="h-[7px]" :class="{ 'rotate-180': showPending }" />
			</a>
			<div v-if="showPending" class="w-full flex flex-col gap-3 mdlg:gap-0">
				<Chat
					v-for="request in pending.slice(0, limit)"
					:key="request.hash"
					t
					:customClass="customClass"
					:chat="{
						route: `/chats/${request.id}`,
						title: request.user.bio.publicName,
						lastMessage: request.title,
						lastMessageTime: $utils.formatTime(request.createdAt),
						photoUrl: request.user.bio.photo?.link ?? null,
					}" />
			</div>
		</div>
		<div class="flex gap-2 mdlg:gap-0 flex-col">
			<Chat
				v-for="chat in conversations.slice(0, limit)"
				:key="chat.hash"
				:customClass="customClass"
				:chat="{
					route: `/chats/${chat.id}`,
					title: chat.title,
					lastMessage: chat.last?.body ?? 'No message',
					lastMessageTime: $utils.formatTime(chat.last?.createdAt ?? Date.now()),
					photoUrl:
						id === chat.user.id
							? chat.tutor
								? (chat.tutor.bio.photo?.link ?? null)
								: userAi.image
							: (chat.user.bio.photo?.link ?? null),
				}" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Chat from './Chat.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useConversationsList } from '@app/composables/conversations/conversations'

withDefaults(
	defineProps<{
		customClass?: string
		extraStyle?: string
		limit?: number
	}>(),
	{
		customClass: '',
		extraStyle: '',
		limit: undefined,
	},
)

const { userType, id, userAi } = useAuth()

const showRequests = ref(true)
const showPending = ref(true)

const { conversations, requests, pending } = useConversationsList()
</script>
