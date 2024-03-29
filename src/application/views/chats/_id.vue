<template>
	<ChatLayout title="Chat">
		<ChatContent
			v-if="conversation"
			class="h-full"
			:data="{
				title: conversation.title,
				photoUrl: otherUsers.at(0)?.photo ?? null,
				userNames: ['You', ...otherUsers.map((u) => u.name)],
			}">
			<template #top-extras>
				<div class="flex items-center gap-3">
					<SofaIcon
						v-if="conversation.user.id === id"
						:class="{ 'fill-primaryPurple': conversation.isActive }"
						class="h-[17px] mdlg:hidden"
						name="tutor"
						@click="showAddTutorConfirmation" />
					<SofaIcon class="h-[23px] mdlg:hidden" name="menu" @click="showMoreOptions" />
				</div>
			</template>
			<ConversationMessages id="MessagesScrollContainer" :conversation="conversation" />
			<template #bottom>
				<form
					class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1"
					@submit.prevent="createMessage">
					<input
						v-model="factory.body"
						:disabled="!conversation.accepted?.is"
						class="w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto"
						placeholder="Enter message" />
					<button type="submit" class="min-w-[45px] h-[40px] flex items-center justify-center pr-[5px]">
						<SofaIcon name="send" class="h-[19px]" />
					</button>
				</form>
			</template>
		</ChatContent>

		<template v-if="conversation" #right-extras>
			<div
				v-if="conversation.user.id === id && !conversation.tutor"
				class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<div class="w-full flex flex-row items-center gap-3">
					<div
						:style="`background-image: url('${userAi.image}')`"
						class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"></div>

					<div class="flex flex-col gap-1">
						<SofaHeaderText customClass="!text-base !font-bold" :content="userAi.name" />
					</div>
				</div>
				<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
					<SofaNormalText customClass="text-left" color="text-deepGray">
						Hello! I am here to respond to your messages in every chat 24/7.
						<br /><br />
						Let us work towards your highest ever academic achievements.
					</SofaNormalText>
				</div>
			</div>

			<div
				v-if="conversation.user.id === id && !conversation.tutor"
				class="w-full shadow-custom p-4 bg-primaryPurple rounded-[16px] flex flex-col gap-3 items-start">
				<div class="w-full flex flex-row gap-2 items-center justify-start">
					<SofaIcon class="h-[24px] fill-white" name="add-tutor" />
					<SofaNormalText color="text-white" customClass="!text-base !font-bold" content="Tutor help" />
				</div>
				<SofaNormalText customClass="text-left" color="text-darkLightGray"> Need extra help with your work? </SofaNormalText>
				<SofaButton bgColor="bg-white" textColor="!text-primaryPurple" padding="px-5 py-1" @click="onClickAddTutor">
					Message a tutor
				</SofaButton>
			</div>

			<div v-if="conversation.user.id === id" class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<a
					v-if="conversation.isActive"
					class="w-full flex items-center justify-start gap-2 text-primaryRed"
					@click="onClickEndSession">
					<SofaIcon customClass="h-[16px] fill-current" name="tutor" />
					<SofaNormalText color="text-inherit">End conversation</SofaNormalText>
				</a>

				<a class="w-full flex items-center justify-start gap-2" @click="deleteConv">
					<SofaIcon customClass="h-[16px]" name="trash" />
					<SofaNormalText color="text-primaryRed">Delete conversation</SofaNormalText>
				</a>
			</div>

			<!-- Teacher POV -->
			<template v-if="conversation.tutor?.id === id">
				<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
					<router-link to="/profile" class="w-full flex flex-col items-center justify-center gap-3">
						<SofaAvatar size="180" :photoUrl="user?.bio.photo?.link" />
					</router-link>

					<SofaHeaderText size="xl" :content="user?.publicName" />

					<SofaNormalText customClass="text-center" color="text-grayColor">
						{{ user?.bio.description }}
					</SofaNormalText>
				</div>
			</template>
		</template>
	</ChatLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'
import ChatContent from '@app/components/conversations/ChatContent.vue'
import ChatLayout from '@app/components/conversations/ChatLayout.vue'
import ConversationMessages from '@app/components/conversations/Messages.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useConversation } from '@app/composables/conversations/conversations'
import { useCreateMessage } from '@app/composables/conversations/messages'
import { useModals } from '@app/composables/core/modals'
import { InteractionEntities } from '@modules/interactions'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'ChatsIdPage',
	components: { ChatLayout, ChatContent, ConversationMessages },
	routeConfig: { goBackRoute: '/chats' },
	setup() {
		useMeta({
			title: 'Chat',
		})

		const { wallet, id, user, userAi } = useAuth()
		const route = useRoute()
		const router = useRouter()
		const { id: conversationId } = route.params

		const { conversation, end, deleteConv } = useConversation(conversationId as string)
		const { factory, createMessage } = useCreateMessage(conversationId as string)

		const otherUsers = computed(() => {
			if (!conversation.value) return []
			const res: { name: string; photo: string | null }[] = []
			if (conversation.value.user.id !== id.value)
				return [{ name: conversation.value.user.bio.name.first, photo: conversation.value.user.bio.photo?.link }]
			if (conversation.value.tutor)
				res.push({
					name: conversation.value.tutor.bio.name.first,
					photo: conversation.value.tutor.bio.photo?.link ?? null,
				})
			else res.push({ name: userAi.value.name, photo: userAi.value.image })
			return res
		})

		const showMoreOptions = () =>
			useModals().conversations.conversationMoreOptions.open({
				conversation: conversation.value!,
				addTutor: onClickAddTutor,
				endSession: onClickEndSession,
				deleteConversation: deleteConv,
			})

		const showAddTutorConfirmation = () =>
			useModals().conversations.addTutorConfirmation.open({
				conversation: conversation.value!,
				addTutor: onClickAddTutor,
			})

		const onClickAddTutor = async () => {
			useModals().conversations.conversationMoreOptions.close()
			if (wallet.value?.subscription.data.tutorAidedConversations ?? 0 > 0)
				return useModals().conversations.addTutor.open({
					conversation: conversation.value!,
				})
			if (wallet.value?.subscription.active)
				return await Logic.Common.confirm({
					title: 'You have run out of tutor aided conversations',
					sub: 'This feature will become available on your next subscription renewal',
					right: { label: 'Close', bg: 'bg-primaryBlue' },
					left: { hide: true },
				})
			const confirmed = await Logic.Common.confirm({
				title: 'You have no subscription',
				sub: 'You need to be subscribed to Stranerd Plus to access this feature',
				right: { label: 'Subscribe', bg: 'bg-primaryBlue' },
				left: { label: 'Cancel' },
			})
			if (!confirmed) return
			await router.push('/settings/subscription')
		}

		const onClickEndSession = async () => {
			if (!conversation.value) return
			const confirmed = await Logic.Common.confirm({
				title: 'End session with tutor?',
				sub: 'Are you sure you want to end this session? The tutor will be removed from this chat',
				right: { label: 'End session' },
			})
			if (!confirmed) return
			useModals().interactions.createReview.open({
				conversation: conversation.value,
				id: conversation.value.id,
				type: InteractionEntities.conversations,
				title: 'Session ended, rate this tutor',
				submit: end,
			})
		}

		return {
			wallet,
			id,
			user,
			userAi,
			Logic,
			factory,
			createMessage,
			conversation,
			otherUsers,
			showMoreOptions,
			onClickAddTutor,
			showAddTutorConfirmation,
			onClickEndSession,
			end,
			deleteConv,
		}
	},
})
</script>
