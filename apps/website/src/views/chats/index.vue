<template>
	<ChatLayout title="Chats" :index="true">
		<div class="flex flex-col gap-4 py-4">
			<div class="w-full flex flex-col px-4" v-if="userType.isStudent">
				<router-link to="/chats/new"
					class="w-full rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg flex gap-3 items-center justify-start p-4 bg-primaryPurple">
					<sofa-icon :name="'box-add-white'" :custom-class="'h-[25px]'" />
					<sofa-normal-text :color="'text-white'" :custom-class="'text-left !text-sm'">
						New chat
					</sofa-normal-text>
				</router-link>
			</div>
			<div class="w-full flex flex-col px-4 gap-3 pt-1" v-if="conversations.length || requests.length">
				<div class="w-full flex gap-2 items-center" v-if="userType.isStudent">
					<sofa-normal-text :customClass="'!font-bold'">
						All chats
					</sofa-normal-text>
				</div>

				<ChatList :customClass="'!bg-white shadow-custom'" />
			</div>
		</div>
	</ChatLayout>
</template>

<script lang="ts">
import ChatLayout from '@/components/conversations/ChatLayout.vue'
import ChatList from '@/components/conversations/ChatList.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversationsList } from '@/composables/conversations/conversations'
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		ChatLayout,
		ChatList,
	},
	name: 'ChatsIndexPage',
	beforeRouteEnter: generateMiddlewares([async () => Logic.Common.isLarge ? '/chats/new' : undefined ]),
	setup () {
		useMeta({
			title: 'Chat',
		})

		const { userType } = useAuth()
		const { conversations, requests } = useConversationsList()

		return { conversations, userType, requests }
	},
})
</script>