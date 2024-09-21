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
						class="w-full text-bodyBlack focus:outline-none !max-h-[80px] overflow-hidden rounded-lg p-3 items-start text-left overflow-y-auto"
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

					<SofaHeading :content="userAi.name" />
				</div>
				<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
					<SofaText class="text-deepGray">
						Hello! I am here to respond to your messages in every chat 24/7.
						<br /><br />
						Let us work towards your highest ever academic achievements.
					</SofaText>
				</div>
			</div>

			<div
				v-if="conversation.user.id === id && !conversation.tutor"
				class="w-full shadow-custom p-4 bg-primaryPurple text-white rounded-[16px] flex flex-col gap-3 items-start">
				<div class="w-full flex flex-row gap-2 items-center justify-start">
					<SofaIcon class="h-[24px] fill-white" name="add-tutor" />
					<SofaHeading content="Tutor help" />
				</div>
				<SofaText> Need extra help with your work? </SofaText>
				<SofaButton color="white" class="!text-primaryPurple" padding="px-5 py-1" @click="onClickAddTutor">
					Message a tutor
				</SofaButton>
			</div>

			<div v-if="conversation.user.id === id" class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<a
					v-if="conversation.isActive"
					class="w-full flex items-center justify-start gap-2 text-primaryRed"
					@click="onClickEndSession">
					<SofaIcon class="h-[16px] fill-current" name="tutor" />
					<SofaText>End conversation</SofaText>
				</a>

				<a class="w-full flex items-center justify-start gap-2 text-primaryRed" @click="deleteConv">
					<SofaIcon class="h-[16px] fill-primaryRed" name="trash" />
					<SofaText>Delete conversation</SofaText>
				</a>
			</div>

			<!-- Teacher POV -->
			<template v-if="conversation.tutor?.id === id">
				<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
					<router-link to="/profile" class="w-full flex flex-col items-center justify-center gap-3">
						<SofaAvatar :size="180" :photoUrl="user?.bio.photo?.link" />
					</router-link>

					<SofaHeading size="title2" :content="user?.publicName" />

					<SofaText class="text-center text-grayColor">
						{{ user?.bio.description }}
					</SofaText>
				</div>
			</template>
		</template>
	</ChatLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatContent from '@app/components/conversations/ChatContent.vue'
import ConversationMessages from '@app/components/conversations/Messages.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useConversation } from '@app/composables/conversations/conversations'
import { useCreateMessage } from '@app/composables/conversations/messages'
import { useModals } from '@app/composables/core/modals'
import { InteractionEntities } from '@modules/interactions'

export default defineComponent({
	name: 'ChatsIdPage',
	components: { ChatContent, ConversationMessages },
	routeConfig: { goBackRoute: '/chats', middlewares: ['isAuthenticated'] },
	setup() {
		useHead({
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
				return await $utils.confirm({
					title: 'You have run out of tutor aided conversations',
					sub: 'This feature will become available on your next subscription renewal',
					right: { label: 'Close', color: 'blue' },
					left: { hide: true },
				})
			const confirmed = await $utils.confirm({
				title: 'You have no subscription',
				sub: 'You need to be subscribed to Stranerd Plus to access this feature',
				right: { label: 'Subscribe', color: 'blue' },
				left: { label: 'Cancel' },
			})
			if (!confirmed) return
			await router.push('/settings/subscription')
		}

		const onClickEndSession = async () => {
			if (!conversation.value) return
			const confirmed = await $utils.confirm({
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
