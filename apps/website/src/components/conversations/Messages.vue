<template>
	<div
		v-chat-scroll
		class="w-full flex flex-col overflow-y-auto scrollbar-hide gap-4"
		@scroll-top="() => hasMore && fetchOlderMessages()">
		<template v-for="message in messages" :key="message.hash">
			<div
				v-if="message.userId !== id"
				class="w-auto min-w-[80px] flex max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%] flex-row gap-2 items-end justify-start">
				<sofa-avatar :photo-url="users[message.userId]?.photoUrl" class="flex-shrink-0" :size="'27'" />
				<div class="p-3 rounded-custom text-left bg-lightBlue flex flex-col gap-1 justify-start">
					<sofa-normal-text :custom-class="'!font-semibold'" :color="'text-[#3296C8]'">
						{{ users[message.userId]?.name }}
					</sofa-normal-text>
					<sofa-normal-text :custom-class="'text-left'" :is-html="true" :content="message.body"></sofa-normal-text>
				</div>
			</div>

			<div v-else class="min-w-[80px] w-full flex gap-2 items-end justify-end py-4">
				<div class="flex flex-row items-end gap-2 max-w-full md:!max-w-[80%] mdlg:!max-w-[80%] lg:!max-w-[70%]">
					<div class="p-3 rounded-custom text-left bg-darkLightGray">
						<sofa-normal-text :custom-class="'text-left'" :is-html="true" :content="message.body"> </sofa-normal-text>
					</div>
					<sofa-avatar :photo-url="users[message.userId]?.photoUrl" class="flex-shrink-0" :size="'27'" />
				</div>
			</div>
		</template>

		<div v-if="messages.length === 0" class="w-full flex items-center justify-center">
			<div class="px-4 py-2 rounded-custom bg-lightGray text-center">
				<sofa-normal-text :color="'text-grayColor'" content="Send a message to get started" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { useMessages } from '@/composables/conversations/messages'
import { ChatScroll as vChatScroll } from '@/directives/chat-scroll'
import { ConversationEntity } from '@modules/conversations'
import { SofaAvatar, SofaNormalText } from 'sofa-ui-components'
import { PropType, defineProps } from 'vue'

const props = defineProps({
	conversation: {
		type: Object as PropType<ConversationEntity>,
		required: true,
	},
})

const { id } = useAuth()
const { messages, users, hasMore, fetchOlderMessages } = useMessages(props.conversation)
</script>
