<template>
	<ChatLayout title="Chats" :index="true">
		<div class="flex flex-col gap-4 py-4">
			<div class="w-full flex flex-col px-4" v-if="Logic.Users.isStudent">
				<router-link to="/chats/new"
					class="w-full rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg flex gap-3 items-center justify-start p-4 bg-primaryPurple">
					<sofa-icon :name="'box-add-white'" :custom-class="'h-[25px]'" />
					<sofa-normal-text :color="'text-white'" :custom-class="'text-left !text-sm'">
						New chat
					</sofa-normal-text>
				</router-link>
			</div>
			<div class="w-full flex flex-col px-4 gap-3 pt-1" v-if="conversations.length || requests.length">
				<div class="w-full flex gap-2 items-center" v-if="Logic.Users.isStudent">
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
import ChatLayout from '@/components/conversation/ChatLayout.vue'
import ChatList from "@/components/conversation/ChatList.vue"
import { useConversationsList } from '@/composables/conversations/conversations'
import { useRequestsList } from '@/composables/conversations/tutorRequests'
import { Logic } from "sofa-logic"
import { SofaIcon, SofaNormalText } from "sofa-ui-components"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"
import { useRouter } from 'vue-router'

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		ChatLayout,
		ChatList,
	},
	name: "ChatsIndexPage",
	setup () {
		useMeta({
			title: "Chat",
		})

		const router = useRouter()
		if (Logic.Common.isLarge) router.push("/chats/new")

		const { conversations } = useConversationsList()
		const { requests } = useRequestsList()

		return {
			conversations,
			Logic,
			requests,
		}
	},
})
</script>