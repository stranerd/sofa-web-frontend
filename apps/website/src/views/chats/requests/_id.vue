<template>
	<ChatLayout title="Chat">
		<ChatContent
			v-if="conversation && conversation.pending && conversation.tutor?.id === authId"
			class="h-full"
			:data="{
				title: otherUser?.bio.name.full ?? 'New Request',
				photoUrl: otherUser?.bio.photo?.link ?? null,
				userNames: ['You', otherUser?.bio.name.first].filter(Boolean),
			}">
			<div class="w-full flex items-start justify-start p-4 pb-[90px]">
				<div class="w-[90%] rounded-custom bg-lightBlue p-3 flex items-start justify-start">
					<sofa-normal-text :custom-class="'text-left'">
						{{ conversation.title }}
					</sofa-normal-text>
				</div>
			</div>

			<template #bottom>
				<div class="w-full grid grid-cols-2 gap-4">
					<div class="col-span-1 flex flex-col">
						<sofa-button
							:bg-color="'bg-primaryRed'"
							:text-color="'text-white'"
							:custom-class="'w-full rounded-custom'"
							:padding="'py-3'"
							:has-shadow="false"
							@click="accept(false)">
							Decline
						</sofa-button>
					</div>

					<div class="col-span-1 flex flex-col">
						<sofa-button
							:bg-color="'bg-primaryGreen'"
							:text-color="'text-white'"
							:custom-class="'w-full rounded-custom'"
							:padding="'py-3'"
							:has-shadow="false"
							@click="accept(true)">
							Accept
						</sofa-button>
					</div>
				</div>
			</template>
		</ChatContent>
	</ChatLayout>
</template>

<script lang="ts">
import ChatContent from '@/components/conversations/ChatContent.vue'
import ChatLayout from '@/components/conversations/ChatLayout.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversation } from '@/composables/conversations/conversations'
import { SofaButton, SofaNormalText } from 'sofa-ui-components'
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'ChatsRequestsIdPage',
	components: { ChatLayout, ChatContent, SofaButton, SofaNormalText },
	middlewares: { goBackRoute: '/chats' },
	setup() {
		useMeta({
			title: 'Request',
		})

		const { id: authId } = useAuth()
		const route = useRoute()
		const { id } = route.params

		const { conversation, accept } = useConversation(id as string)

		const otherUser = computed(() =>
			conversation.value ? (conversation.value.user.id === authId.value ? conversation.value.tutor : conversation.value.user) : null,
		)

		return { id, authId, conversation, accept, otherUser }
	},
})
</script>
