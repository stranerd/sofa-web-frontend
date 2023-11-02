<template>
	<sub-page-layout v-if="!index && ['sm', 'md'].includes(Logic.Common.mediaQuery())">
		<div class="h-full w-full">
			<slot />
		</div>
	</sub-page-layout>
	<dashboard-layout v-else>
		<template v-slot:left-session>
			<div
				class="w-full shadow-custom px-4 pb-4 bg-white relative rounded-2xl gap-1 overflow-y-auto scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin flex flex-col">
				<a class="w-full flex items-center justify-start pt-7 top-0 left-0 sticky bg-white z-30 gap-3 p-3"
					@click="newChat" v-if="Logic.Users.getUserType() == 'student'">
					<sofa-icon name="box-add-pink" custom-class="h-[17px]" />
					<sofa-normal-text :color="'text-primaryPink'">
						New chat
					</sofa-normal-text>
				</a>

				<div class="w-full flex justify-start pt-4 pb-2"
					v-if="chatList.length && Logic.Users.getUserType() == 'teacher'">
					<sofa-header-text customClass="text-left mdlg:!text-base text-sm">
						All Chats
					</sofa-header-text>
				</div>

				<!-- Chat list -->
				<ChatList />

				<!-- Empty state -->
				<template v-if="Logic.Users.getUserType() == 'teacher' && !chatList.length">
					<div class="pt-4">
						<sofa-empty-state title="No chat" subTitle="Your active chats will show up here" actionLabel="" />
					</div>
				</template>
			</div>
		</template>

		<template v-slot:right-session>
			<!-- Student POV -->
			<template v-if="Logic.Users.getUserType() == 'student' && Logic.Users.UserProfile">
				<div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4"
					v-if="!selectedTutorRequestData || !SingleConversation?.tutor">
					<div class="w-full flex flex-row items-center gap-3">
						<div :style="`background-image: url('${Logic.Users.UserProfile.ai.photo?.link ?? '/images/icons/robot.svg'}')`"
							class="w-[64px] h-[64px] flex flex-row items-center justify-center bg-cover bg-center rounded-full">
						</div>

						<div class="flex flex-col gap-1">
							<sofa-header-text :customClass="'!text-base !font-bold'">{{
								Logic.Users.UserProfile.ai.name || "Dr. Sofa"
							}}</sofa-header-text>
							<sofa-normal-text>AI assistant</sofa-normal-text>
						</div>
					</div>
					<div class="w-full flex flex-row justify-start px-4 py-4 rounded-[8px] bg-fadedPurple">
						<sofa-normal-text :customClass="'text-left'" :color="'text-deepGray'">
							Hello! I am here to respond to your messages in every chat 24/7.
							<br /><br />
							Let us work towards your highest ever academic achievements.
						</sofa-normal-text>
					</div>
				</div>

				<div class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col gap-4"
					v-if="SingleConversation && !itIsNewMessage">
					<div class="w-full flex flex-row items-center justify-start gap-2 cursor-pointer"
						v-if="selectedTutorRequestData && SingleConversation?.tutor" @click.stop="
							showEndSession = true
						selectedConvoId = SingleConversation?.id;
						">
						<sofa-icon :customClass="'h-[16px]'" :name="'tutor-red'" />
						<sofa-normal-text :color="'text-primaryRed'">
							End tutor session</sofa-normal-text>
					</div>
					<div class="w-full flex flex-row items-center justify-start gap-2 cursor-pointer">
						<sofa-icon :customClass="'h-[16px]'" :name="'trash'" />
						<sofa-normal-text :color="'text-primaryRed'" @click.stop="
							showDeleteConvo = true
						selectedConvoId = SingleConversation?.id;
						">
							Delete chat</sofa-normal-text>
					</div>
				</div>

				<template v-if="Logic.Payment.UserWallet.subscription.data.tutorAidedConversations > 0">
					<div class="w-full shadow-custom px-4 py-4 bg-primaryPurple rounded-[16px] flex flex-col gap-3" v-if="((hasMessage && !selectedTutorRequestData) ||
						(!SingleConversation?.tutor && !itIsNewMessage)) &&
						SingleConversation
						">
						<div class="w-full flex flex-row gap-2 items-center justify-start">
							<sofa-icon :customClass="'h-[24px]'" :name="'add-tutor-white'" />
							<sofa-normal-text :color="'text-white'" :customClass="'!text-base !font-bold'">
								Tutor help
							</sofa-normal-text>
						</div>
						<div class="w-full flex flex-col">
							<sofa-normal-text :customClass="'text-left'" :color="'text-[#E1E6EB]'">
								Need extra help with your work?
							</sofa-normal-text>
						</div>
						<div class="flex flex-row">
							<sofa-button :bg-color="'bg-white'" :text-color="'!text-primaryPurple'" :padding="'px-5 py-1'"
								@click="showAddTutor = true">
								Add a tutor
							</sofa-button>
						</div>
					</div>
				</template>
			</template>

			<!-- Teacher POV -->
			<template v-if="Logic.Users.getUserType() == 'teacher'">
				<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col gap-4 justify-center items-center">
					<div class="w-full flex flex-col items-center justify-center gap-3">
						<sofa-avatar :size="'180'" :bgColor="'bg-grayColor'"
							:photoUrl="Logic.Users.UserProfile?.bio?.photo?.link ?? ''" :customClass="'!cursor-pointer'"
							@click="Logic.Common.GoToRoute('/settings')">
							<sofa-icon :customClass="'h-[23px]'" :name="'user'" />
						</sofa-avatar>
					</div>

					<sofa-header-text :size="'xl'">
						{{ Logic.Users.UserProfile?.bio.name.full }}
					</sofa-header-text>

					<sofa-normal-text :customClass="'text-center'" :color="'text-[#78828C]'">
						{{ Logic.Users.UserProfile?.bio.description }}
					</sofa-normal-text>
				</div>
			</template>
		</template>

		<template v-slot:middle-session>
			<slot />
		</template>
	</dashboard-layout>
	<sofa-delete-prompt v-if="showDeleteConvo" title="Are you sure?"
		subTitle="This action is permanent. All messages in this conversation would be lost"
		:close="() => showDeleteConvo = false" :buttons="[
			{
				label: 'No',
				isClose: true,
				action: () => {
					showDeleteConvo = false
				},
			},
			{
				label: 'Yes, delete',
				isClose: false,
				action: () => {
					deleteConvo(selectedConvoId)
				},
			},
		]" />

	<!-- End session modal -->
	<sofa-delete-prompt v-if="showEndSession" title="End session with tutor?"
		subTitle="Are you sure you want to end this session? The tutor will be removed from this chat"
		:close="() => showEndSession = false" :buttons="[
			{
				label: 'No',
				isClose: true,
				action: () => {
					showEndSession = false
				},
			},
			{
				label: 'End session',
				isClose: false,
				action: () => {
					showEndSession = false
					showRateAndReviewTutor = true
				},
			},
		]" />
</template>

<script lang="ts" setup>
import { scrollToTop } from '@/composables'
import {
	AllConversations,
	AllTutorRequests,
	ChatMembers,
	Messages,
	SingleConversation,
	chatList,
	deleteConvo,
	hasMessage,
	itIsNewMessage,
	listenToTutorRequest,
	newChat,
	selectedConvoId,
	selectedTutorRequestData,
	setConversations,
	setConvoFromRoute,
	showAddTutor,
	showDeleteConvo,
	showEndSession,
	showRateAndReviewTutor
} from '@/composables/conversation'
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaButton, SofaDeletePrompt, SofaEmptyState, SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { defineProps, onMounted } from 'vue'
import ChatList from './ChatList.vue'

defineProps({
	title: {
		type: String,
		required: true
	},
	index: {
		type: Boolean,
		required: false,
		default: false
	}
})

onMounted(() => {
	Logic.Conversations.watchProperty("AllConversations", AllConversations)
	Logic.Conversations.watchProperty("AllTutorRequests", AllTutorRequests)
	Logic.Conversations.watchProperty(
		"SingleConversation",
		SingleConversation
	)
	Logic.Conversations.watchProperty("Messages", Messages)
	Logic.Conversations.watchProperty("ChatMembers", ChatMembers)

	setConversations()
	setConvoFromRoute()
	scrollToTop()
	listenToTutorRequest()
})
</script>