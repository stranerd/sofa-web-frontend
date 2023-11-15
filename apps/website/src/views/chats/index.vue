<template>
	<ChatLayout title="Chats" :index="true">
		<div class="mdlg:hidden flex flex-col gap-4 py-4">
			<div class="w-full flex flex-col px-4" v-if="Logic.Users.getUserType() == 'student'">
				<div @click="newChat()"
					class="w-full rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg flex gap-3 items-center justify-start p-4 bg-primaryPurple">
					<sofa-icon :name="'box-add-white'" :custom-class="'h-[25px]'" />
					<sofa-normal-text :color="'text-white'" :custom-class="'text-left !text-sm'">
						New chat
					</sofa-normal-text>
				</div>
			</div>
			<div class="w-full flex flex-col px-4 gap-3 pt-1" v-if="chatList.length || tutorRequestList.length">
				<div class="w-full flex gap-2 items-center" v-if="Logic.Users.getUserType() == 'student'">
					<sofa-normal-text :customClass="'!font-bold'">
						All chats
					</sofa-normal-text>
				</div>

				<ChatList :customClass="'!bg-white shadow-custom'" />
			</div>
		</div>
		<ChatContent class="hidden mdlg:!flex" />
	</ChatLayout>
</template>

<script lang="ts">
import ChatContent from '@/components/conversation/ChatContent.vue'
import ChatLayout from '@/components/conversation/ChatLayout.vue'
import ChatList from "@/components/conversation/ChatList.vue"
import {
chatList,
newChat,
tutorRequestList
} from "@/composables/conversation"
import { Conditions, Logic } from "sofa-logic"
import {
SofaIcon,
SofaNormalText
} from "sofa-ui-components"
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: {
		SofaIcon,
		SofaNormalText,
		ChatLayout,
		ChatList,
		ChatContent,
	},
	middlewares: {
		fetchRules: [
			{
				domain: "Users",
				property: "UserProfile",
				method: "GetUserProfile",
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: "Payment",
				property: "UserWallet",
				method: "GetUserWallet",
				params: [],
				requireAuth: true,
				ignoreProperty: false,
			},
			{
				domain: "Users",
				property: "AllTutorRequests",
				method: "GetTutorRequests",
				params: [
					{
						where: [
							{
								field: "userId",
								condition: Conditions.eq,
								value: Logic.Auth.AuthUser?.id,
							},
						],
					},
					true,
				],
				shouldSkip: () => Logic.Users.getUserType() !== "teacher",
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: "Conversations",
				property: "AllTutorRequests",
				method: "GetTutorRequests",
				params: [
					{
						where: [
							{
								field: "tutor.id",
								condition: Conditions.eq,
								value: Logic.Auth.AuthUser?.id,
							},
						],
					},
					true,
				],
				shouldSkip: () => Logic.Users.getUserType() !== "teacher",
				requireAuth: true,
				ignoreProperty: true,
			},
			{
				domain: "Conversations",
				property: "AllConversations",
				method: "GetConversations",
				params: [],
				shouldSkip: () => Logic.Users.getUserType() === "teacher",
				requireAuth: true,
				ignoreProperty: true,
			}
		]
	},
	name: "ChatsIndexPage",
	setup () {
		useMeta({
			title: "Chat",
		})


		return {
			chatList,
			Logic,
			newChat,
			tutorRequestList,
		}
	},
})
</script>