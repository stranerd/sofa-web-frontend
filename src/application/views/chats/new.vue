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
					<SofaHeaderText>{{ userAi.name }}</SofaHeaderText>
					<SofaNormalText>{{ content.title }}</SofaNormalText>
				</div>
				<div class="bg-fadedPurple flex flex-col px-3 py-4 text-center rounded-2xl">
					<SofaNormalText>{{ content.body1 }}</SofaNormalText>
					<SofaNormalText>{{ content.body2 }}</SofaNormalText>
				</div>
			</div>
			<template #bottom>
				<form
					class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1"
					@submit.prevent="createConversation">
					<input
						v-model="factory.body"
						class="w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto"
						placeholder="Enter message" />
					<button type="submit" class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
						<SofaIcon name="send" customClass="h-[19px]" />
					</button>
				</form>
			</template>
		</ChatContent>
	</ChatLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import ChatContent from '@app/components/conversations/ChatContent.vue'
import ChatLayout from '@app/components/conversations/ChatLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCreateConversation } from '@app/composables/conversations/conversations'

export const content = {
	title: 'AI assistant',
	body1: 'Hello! I am here to answer all your questions on any subject 24/7.',
	body2: 'You can also add a tutor if you require further assistance',
}

export default defineComponent({
	name: 'ChatsNewPage',
	components: { ChatLayout, ChatContent },
	routeConfig: { goBackRoute: '/dashboard' },
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
