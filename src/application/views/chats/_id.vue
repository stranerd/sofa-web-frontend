<template>
	<ChatLayout title="Chat">
		<ChatContent
			v-if="conversation"
			class="h-full"
			:data="{
				title: conversation.title,
				photoUrl: otherUsers.at(0).photo ?? null,
				userNames: ['You', ...otherUsers.map((u) => u.name)],
			}">
			<template #top-extras>
				<div class="flex items-center gap-3">
					<SofaIcon
						v-if="conversation.user.id === id"
						:class="{ 'fill-primaryPurple': conversation.isActive }"
						class="h-[17px] mdlg:hidden"
						name="tutor"
						@click="showAddTutorModalConfirmation = true" />
					<SofaIcon class="h-[23px] mdlg:hidden" name="menu" @click="showMoreOptions = true" />
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
						<sofa-header-text :custom-class="'!text-base !font-bold'" :content="userAi.name" />
					</div>
				</div>
				<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
					<sofa-normal-text :custom-class="'text-left'" :color="'text-deepGray'">
						Hello! I am here to respond to your messages in every chat 24/7.
						<br /><br />
						Let us work towards your highest ever academic achievements.
					</sofa-normal-text>
				</div>
			</div>

			<div
				v-if="conversation.user.id === id && !conversation.tutor"
				class="w-full shadow-custom p-4 bg-primaryPurple rounded-[16px] flex flex-col gap-3 items-start">
				<div class="w-full flex flex-row gap-2 items-center justify-start">
					<sofa-icon class="h-[24px] fill-white" name="add-tutor" />
					<sofa-normal-text :color="'text-white'" :custom-class="'!text-base !font-bold'" content="Tutor help" />
				</div>
				<sofa-normal-text :custom-class="'text-left'" :color="'text-darkLightGray'">
					Need extra help with your work?
				</sofa-normal-text>
				<sofa-button :bg-color="'bg-white'" :text-color="'!text-primaryPurple'" :padding="'px-5 py-1'" @click="onClickAddTutor">
					Message a tutor
				</sofa-button>
			</div>

			<div v-if="conversation.user.id === id" class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4">
				<a
					v-if="conversation.tutor && conversation.accepted?.is && !conversation.ended"
					class="w-full flex items-center justify-start gap-2 text-primaryRed"
					@click="onClickEndSession">
					<sofa-icon :custom-class="'h-[16px] fill-current'" :name="'tutor'" />
					<sofa-normal-text :color="'text-inherit'">End conversation</sofa-normal-text>
				</a>

				<a class="w-full flex items-center justify-start gap-2" @click="deleteConv">
					<sofa-icon :custom-class="'h-[16px]'" :name="'trash'" />
					<sofa-normal-text :color="'text-primaryRed'">Delete conversation</sofa-normal-text>
				</a>
			</div>

			<!-- Teacher POV -->
			<template v-if="conversation.tutor?.id === id">
				<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
					<router-link to="/profile" class="w-full flex flex-col items-center justify-center gap-3">
						<sofa-avatar :size="'180'" :photo-url="user?.bio.photo?.link" />
					</router-link>

					<sofa-header-text :size="'xl'" :content="user?.bio.name.full" />

					<sofa-normal-text :custom-class="'text-center'" :color="'text-grayColor'">
						{{ user?.bio.description }}
					</sofa-normal-text>
				</div>
			</template>
		</template>

		<!-- More options for smaller screens -->
		<SofaModal
			v-if="showMoreOptions && !Logic.Common.isLarge"
			:close="() => (showMoreOptions = false)"
			max-width="w-[80%] md:w-[60%] ml-auto">
			<div class="flex flex-col gap-4 relative overflow-y-auto h-full">
				<router-link
					v-if="conversation.user.id === id"
					to="/chats/new"
					class="w-full flex items-center justify-start top-0 left-0 sticky pt-4 bg-white z-30 gap-3 py-3 px-4 cursor-pointer">
					<sofa-icon :name="'box-add-pink'" class="h-[17px]" />
					<sofa-normal-text :color="'text-primaryPink'" content="New chat" />
				</router-link>

				<ChatList :custom-class="'!rounded-none'" :extra-style="'px-3'" />

				<div
					v-if="conversation.user.id === id"
					class="sticky w-full bottom-0 left-0 bg-white z-50 p-4 border-t border-lightGray flex flex-col gap-4">
					<a
						v-if="conversation.tutor && conversation.accepted?.is && !conversation.ended"
						class="w-full flex items-center justify-start gap-2 text-primaryRed"
						@click="onClickEndSession">
						<SofaIcon class="h-[16px] fill-current" name="tutor" />
						<SofaNormalText color="text-inherit" content="End conversation" />
					</a>
					<a
						v-else-if="!conversation.tutor"
						class="w-full flex items-center justify-start gap-2 text-primaryGreen"
						@click="onClickAddTutor">
						<SofaIcon class="h-[16px] fill-current" name="tutor" />
						<SofaNormalText color="text-inherit" content="Message a tutor" />
					</a>
					<a class="w-full flex items-center justify-start gap-2" @click="deleteConv">
						<SofaIcon class="h-[16px]" name="trash" />
						<SofaNormalText color="text-primaryRed" content="Delete conversation" />
					</a>
				</div>
			</div>
		</SofaModal>

		<!-- Tutor help mobile popup -->
		<SofaModal v-if="showAddTutorModalConfirmation && !Logic.Common.isLarge" :close="() => (showAddTutorModalConfirmation = false)">
			<div class="w-full flex flex-col items-start gap-4 p-4">
				<div class="flex w-full items-center gap-2 justify-between">
					<div class="flex items-center gap-1">
						<SofaIcon class="h-[24px] fill-primaryPurple" name="add-tutor" />
						<SofaHeaderText class="!font-bold !text-primaryPurple" content="Tutor help" />
					</div>
					<SofaIcon class="h-[16px]" name="circle-close" @click="showAddTutorModalConfirmation = false" />
				</div>
				<SofaNormalText color="" content="Need extra help with your work?" class="!text-deppGray" />
				<sofa-button :bg-color="'bg-primaryPurple'" :text-color="'!text-white'" :padding="'px-6 py-4'" @click="onClickAddTutor">
					Add a tutor
				</sofa-button>
			</div>
		</SofaModal>

		<AddTutor v-if="showAddTutor" @close="showAddTutor = false" />

		<!-- Rate and review modal -->
		<RateAndReviewModal
			v-if="showRateAndReviewTutor && conversation.tutor"
			:close="() => (showRateAndReviewTutor = false)"
			title="Session ended, rate tutor"
			:tutor="{ name: conversation.tutor.bio.name.full, photo: conversation.tutor.bio.photo?.link }"
			@on-review-submitted="(data) => end({ rating: data.ratings, message: data.review })" />
	</ChatLayout>
</template>

<script lang="ts">
import RateAndReviewModal from '@/components/common/RateAndReviewModal.vue'
import AddTutor from '@/components/conversations/AddTutor.vue'
import ChatContent from '@/components/conversations/ChatContent.vue'
import ChatLayout from '@/components/conversations/ChatLayout.vue'
import ChatList from '@/components/conversations/ChatList.vue'
import ConversationMessages from '@/components/conversations/Messages.vue'
import { useAuth } from '@/composables/auth/auth'
import { useConversation } from '@/composables/conversations/conversations'
import { useCreateMessage } from '@/composables/conversations/messages'
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaButton, SofaHeaderText, SofaIcon, SofaModal2 as SofaModal, SofaNormalText } from 'sofa-ui-components'
import { computed, defineComponent, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

export default defineComponent({
	name: 'ChatsIdPage',
	components: {
		ChatLayout,
		ChatList,
		SofaIcon,
		SofaNormalText,
		ChatContent,
		AddTutor,
		SofaModal,
		SofaButton,
		SofaAvatar,
		SofaHeaderText,
		RateAndReviewModal,
		ConversationMessages,
	},
	routeConfig: { goBackRoute: '/chats' },
	setup() {
		useMeta({
			title: 'Chat',
		})

		const { wallet, id, user, userAi } = useAuth()
		const route = useRoute()
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
					photo: conversation.value.tutor.bio.photo?.link,
				})
			else res.push({ name: userAi.value.name, photo: userAi.value.image })
			return res
		})

		const showAddTutor = ref(false)
		const showAddTutorModalConfirmation = ref(false)
		const showMoreOptions = ref(false)
		const showRateAndReviewTutor = ref(false)

		const onClickAddTutor = async () => {
			showMoreOptions.value = false
			if (wallet.value?.subscription.data.tutorAidedConversations > 0) return (showAddTutor.value = true)
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
			if (confirmed) await Logic.Common.GoToRoute('/settings/subscription')
			return confirmed
		}

		const onClickEndSession = async () => {
			const confirmed = await Logic.Common.confirm({
				title: 'End session with tutor?',
				sub: 'Are you sure you want to end this session? The tutor will be removed from this chat',
				right: { label: 'End session' },
			})
			if (confirmed) showRateAndReviewTutor.value = true
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
			showAddTutor,
			showMoreOptions,
			onClickAddTutor,
			showRateAndReviewTutor,
			showAddTutorModalConfirmation,
			onClickEndSession,
			end,
			deleteConv,
		}
	},
})
</script>
