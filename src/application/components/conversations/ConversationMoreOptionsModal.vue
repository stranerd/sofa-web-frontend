<template>
	<div class="flex flex-col gap-4 relative overflow-y-auto h-full">
		<router-link
			v-if="conversation.user.id === id"
			to="/chats/new"
			class="w-full flex items-center justify-start top-0 left-0 sticky pt-4 bg-white z-30 gap-3 py-3 px-4 cursor-pointer">
			<SofaIcon name="box-add-pink" class="h-[17px]" />
			<SofaNormalText color="text-primaryPink" content="New chat" />
		</router-link>

		<ChatList customClass="!rounded-none" extraStyle="px-3" />

		<div
			v-if="conversation.user.id === id"
			class="sticky w-full bottom-0 left-0 bg-white z-50 p-4 border-t border-lightGray flex flex-col gap-4">
			<a
				v-if="conversation.tutor && conversation.accepted?.is && !conversation.ended"
				class="w-full flex items-center justify-start gap-2 text-primaryRed"
				@click="endSession">
				<SofaIcon class="h-[16px] fill-current" name="tutor" />
				<SofaNormalText color="text-inherit" content="End conversation" />
			</a>
			<a v-else-if="!conversation.tutor" class="w-full flex items-center justify-start gap-2 text-primaryGreen" @click="addTutor">
				<SofaIcon class="h-[16px] fill-current" name="tutor" />
				<SofaNormalText color="text-inherit" content="Message a tutor" />
			</a>
			<a class="w-full flex items-center justify-start gap-2" @click="deleteConversation">
				<SofaIcon class="h-[16px]" name="trash" />
				<SofaNormalText color="text-primaryRed" content="Delete conversation" />
			</a>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { ConversationEntity } from '@modules/conversations'

defineProps<{
	close: () => void
	conversation: ConversationEntity
	addTutor: () => void
	endSession: () => void
	deleteConversation: () => void
}>()

const { id } = useAuth()
</script>
