<template>
	<ChatLayout title="Chats" :index="true">
		<div class="flex flex-col gap-4 py-4">
			<div v-if="userType.isStudent" class="w-full flex flex-col px-4">
				<router-link
					to="/chats/new"
					class="w-full rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg flex gap-3 items-center justify-start p-4 bg-primaryPurple">
					<SofaIcon name="box-add" customClass="h-[25px] fill-white" />
					<SofaNormalText color="text-white" customClass="text-left !text-sm" content="New chat" />
				</router-link>
			</div>
			<div class="w-full flex flex-col px-4 gap-3 pt-1">
				<ChatList customClass="!bg-white shadow-custom" />
			</div>
		</div>
	</ChatLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import ChatLayout from '@app/components/conversations/ChatLayout.vue'
import ChatList from '@app/components/conversations/ChatList.vue'
import { useAuth } from '@app/composables/auth/auth'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'ChatsIndexPage',
	components: { ChatLayout, ChatList },
	routeConfig: { middlewares: ['isAuthenticated', () => (Logic.Common.isLarge ? '/chats/new' : undefined)] },
	setup() {
		useMeta({
			title: 'Chat',
		})
		const { userType } = useAuth()
		return { userType }
	},
})
</script>
