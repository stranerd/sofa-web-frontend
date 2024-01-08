<template>
	<ChatLayout title="Chat">
		<ChatContent
			class="h-full"
			:data="{
				title: 'New chat',
				photoUrl: userAi.image,
				userNames: ['You', userAi.name],
			}">
			<div class="flex flex-col items-center justify-center text-center gap-4 h-full w-[90%] md:w-1/2 mx-auto">
				<div class="flex flex-col gap-1">
					<img :src="userAi.image" class="w-[96px] h-[96px] pb-1" />
					<sofa-header-text>{{ userAi.name }}</sofa-header-text>
					<sofa-normal-text>{{ content.title }}</sofa-normal-text>
				</div>
				<div class="bg-fadedPurple flex flex-col px-3 py-4 text-center rounded-2xl">
					<sofa-normal-text>{{ content.body1 }}</sofa-normal-text>
					<sofa-normal-text>{{ content.body2 }}</sofa-normal-text>
				</div>
			</div>
			<template #bottom>
				<form
					class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1"
					@submit.prevent="createConversation">
					<input
						v-model="factory.body"
						:class="`w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto`"
						placeholder="Enter message" />
					<button type="submit" class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
						<sofa-icon :name="'send'" :custom-class="'h-[19px]'" />
					</button>
				</form>
			</template>
		</ChatContent>
	</ChatLayout>
</template>

<script lang="ts">
import ChatContent from '@/components/conversations/ChatContent.vue'
import ChatLayout from '@/components/conversations/ChatLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { useCreateConversation } from '@/composables/conversations/conversations'
import { SofaIcon, SofaNormalText, SofaHeaderText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export const content = {
	title: 'AI assistant',
	body1: 'Hello! I am here to answer all your questions on any subject 24/7.',
	body2: 'You can also add a tutor if you require further assistance',
}

export default defineComponent({
	name: 'ChatsNewPage',
	components: { ChatLayout, ChatContent, SofaIcon, SofaNormalText, SofaHeaderText },
	middlewares: { goBackRoute: '/' },
	setup() {
		useMeta({
			title: 'New Chat',
		})

		const { userAi } = useAuth()
		const { factory, createConversation } = useCreateConversation()

		return {
			userAi,
			factory,
			createConversation,
			content,
		}
	},
})
</script>
