<template>
	<ChatLayout v-if="request" title="Chat">
		<ChatContent class="h-full" :data="{
			title: otherUser?.bio.name.full ?? 'New Request',
			photoUrl: otherUser?.bio.photo?.link ?? null,
			userNames: ['You', otherUser?.bio.name.first].filter(Boolean)
		}">
			<div class="w-full flex items-start justify-start p-4 pb-[90px]">
				<div class="w-[90%] rounded-custom bg-[#E2F3FD] p-3 flex items-start justify-start">
					<sofa-normal-text :customClass="'text-left'">
						{{ request.message }}
					</sofa-normal-text>
				</div>
			</div>

			<template v-slot:bottom>
				<div class="w-full grid grid-cols-2 gap-4">
					<div class="col-span-1 flex flex-col">
						<sofa-button :bgColor="'bg-primaryRed'" :textColor="'text-white'"
							:customClass="'w-full rounded-custom'" :padding="'py-3'" :has-double-layer="false"
							@click="accept(false)">
							Decline
						</sofa-button>
					</div>

					<div class="col-span-1 flex flex-col">
						<sofa-button :bgColor="'bg-primaryGreen'" :textColor="'text-white'"
							:customClass="'w-full rounded-custom'" :padding="'py-3'" :has-double-layer="false"
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
import ChatContent from "@/components/conversations/ChatContent.vue"
import ChatLayout from "@/components/conversations/ChatLayout.vue"
import { useAuth } from '@/composables/auth/auth'
import { useRequest } from '@/composables/conversations/tutorRequests'
import { SofaButton, SofaNormalText } from 'sofa-ui-components'
import { computed, defineComponent } from "vue"
import { useMeta } from "vue-meta"
import { useRoute } from "vue-router"

export default defineComponent({
	components: { ChatLayout, ChatContent, SofaButton, SofaNormalText },
	middlewares: {
		goBackRoute: "/chats",
	},
	name: "ChatsRequestsIdPage",
	setup () {
		useMeta({
			title: "Request",
		})

		const { id } = useAuth()
		const route = useRoute()
		const { id: requestId } = route.params

		const { request, accept } = useRequest(requestId as string)

		const otherUser = computed(() => request.value ? request.value.userId === id.value ? request.value.tutor : request.value.user : null)

		return { request, accept, otherUser }
	},
})
</script>
