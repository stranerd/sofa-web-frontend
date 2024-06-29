<template>
	<ChatLayout title="Chat">
		<ChatContent
			v-if="conversation && conversation.pending && conversation.tutor?.id === authId"
			class="h-full"
			:data="{
				title: otherUser?.bio.publicName ?? 'New Request',
				photoUrl: otherUser?.bio.photo?.link ?? null,
				userNames: ['You', otherUser?.bio.name.first].filter(Boolean),
			}">
			<div class="w-full flex items-start justify-start p-4 pb-[90px]">
				<div class="w-[90%] rounded-custom bg-lightBlue p-3 flex items-start justify-start">
					<SofaNormalText customClass="text-left">
						{{ conversation.title }}
					</SofaNormalText>
				</div>
			</div>

			<template #bottom>
				<div class="w-full grid grid-cols-2 gap-4">
					<div class="col-span-1 flex flex-col">
						<SofaButton
							bgColor="bg-primaryRed"
							textColor="text-white"
							customClass="w-full rounded-custom"
							padding="py-3"
							@click="accept(false)">
							Decline
						</SofaButton>
					</div>

					<div class="col-span-1 flex flex-col">
						<SofaButton
							bgColor="bg-primaryGreen"
							textColor="text-white"
							customClass="w-full rounded-custom"
							padding="py-3"
							@click="accept(true)">
							Accept
						</SofaButton>
					</div>
				</div>
			</template>
		</ChatContent>
	</ChatLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import ChatContent from '@app/components/conversations/ChatContent.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useConversation } from '@app/composables/conversations/conversations'
import { useRoute } from '@app/composables/core/routes'

export default defineComponent({
	name: 'ChatsRequestsIdPage',
	components: { ChatContent },
	routeConfig: { goBackRoute: '/chats', middlewares: ['isAuthenticated'] },
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
