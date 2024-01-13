<template>
	<ChatLayout title="Chats" :index="true">
		<div class="flex flex-col gap-4 py-4">
			<div v-if="userType.isStudent" class="w-full flex flex-col px-4">
				<router-link
					to="/chats/new"
					class="w-full rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg flex gap-3 items-center justify-start p-4 bg-primaryPurple">
					<sofa-icon :name="'box-add-white'" :custom-class="'h-[25px]'" />
					<sofa-normal-text :color="'text-white'" :custom-class="'text-left !text-sm'"> New chat </sofa-normal-text>
				</router-link>
			</div>
			<div class="w-full flex flex-col px-4 gap-3 pt-1">
				<ChatList :custom-class="'!bg-white shadow-custom'" />
			</div>
		</div>
	</ChatLayout>
</template>

<script lang="ts">
import ChatLayout from '@/components/conversations/ChatLayout.vue'
import ChatList from '@/components/conversations/ChatList.vue'
import { useAuth } from '@/composables/auth/auth'
import { Logic } from 'sofa-logic'
import { SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'ChatsIndexPage',
	components: {
		SofaIcon,
		SofaNormalText,
		ChatLayout,
		ChatList,
	},
	routeConfig: { middlewares: [() => (Logic.Common.isLarge ? '/chats/new' : undefined)] },
	setup() {
		useMeta({
			title: 'Chat',
		})
		const { userType } = useAuth()
		return { userType }
	},
})
</script>
