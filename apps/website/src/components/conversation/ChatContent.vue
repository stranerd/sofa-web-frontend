<template>
	<div class="w-full flex shadow-custom mdlg:bg-white rounded-2xl justify-between flex-grow h-full flex-col">
		<div class="w-full flex p-4 rounded-t-2xl gap-3 items-center justify-between border-b border-[#E1E6EB]">
			<div class="flex flex-row items-center gap-3">
				<sofa-icon class="mdlg:hidden" customClass="h-[15px]" :name="'back-arrow'"
					@click="hasMessage = false; Logic.Common.goBack();" />
				<sofa-avatar :photoUrl="selectedChatData.photoUrl" :size="'40'" :bgColor="'bg-grayColor'"
					customClass="hidden mdlg:flex">
					<sofa-icon :customClass="'h-[23px]'" :name="'user'" v-if="!selectedChatData.photoUrl" />
				</sofa-avatar>
				<sofa-avatar :photoUrl="selectedChatData.photoUrl" :size="'34'" :bgColor="'bg-grayColor'"
					customClass="mdlg:hidden">
					<sofa-icon :customClass="'h-[23px]'" :name="'user'" v-if="!selectedChatData.photoUrl" />
				</sofa-avatar>
				<div class="flex flex-col">
					<sofa-custom-input :updateValue="conversationTitle"
						:customClass="'!font-bold w-full flex flex-row justify-start !px-0 !py-0 !text-sm mdlg:!text-base'"
						@onContentChange="contentTitleChanged" @onBlur="editTitle = false" :autoFocus="true"
						v-if="editTitle && !itIsNewMessage"></sofa-custom-input>
					<sofa-normal-text @click="editTitle = true"
						:customClass="'!font-bold w-full flex flex-row justify-start !px-0 !py-0 !text-sm mdlg:!text-base'"
						v-else>
						{{ selectedChatData.title }}
					</sofa-normal-text>
					<sofa-normal-text v-if="Logic.Users.getUserType() == 'student'" :color="'text-grayColor'"
						:customClass="'!text-[12px]'">
						You, {{ Logic.Users.UserProfile?.ai?.name || "Dr. Sofa" }}
					</sofa-normal-text>
					<sofa-normal-text v-if="Logic.Users.getUserType() == 'teacher'" :color="'text-grayColor'"
						:customClass="'!text-[12px]'">
						You
					</sofa-normal-text>
				</div>
			</div>
			<div class="flex flex-row items-center gap-3" v-if="!editTitle && !itIsNewMessage && !itIsTutorRequest">
				<sofa-icon :customClass="'h-[17px] cursor-pointer mdlg:hidden'" :name="'tutor-black'"
					@click="showAddTutor = true" v-if="Logic.Users.getUserType() == 'student' && !selectedTutorRequestData && Logic.Payment.UserWallet.subscription.data.tutorAidedConversations > 1
						" />

				<sofa-icon :customClass="'h-[23px] mdlg:hidden cursor-pointer'" :name="'menu'"
					@click="showMoreOptions = true" />
			</div>
		</div>

		<div
			class="w-full bg-white flex flex-col items-start justify-start gap-2 h-full flex-grow overflow-y-auto px-4 py-2">
			<slot>
				<div v-if="itIsTutorRequest" class="w-full flex items-start justify-start p-4 pb-[90px]">
					<div class="w-[90%] custom-border bg-[#E2F3FD] p-3 flex items-start justify-start">
						<sofa-normal-text :customClass="'text-left'">
							{{ selectedChatData.lastMessage }}
						</sofa-normal-text>
					</div>
				</div>
			</slot>
		</div>

		<div class="w-full px-4 py-2 bg-white mdlg:border-t mdlg:border-[#E1E6EB]">
			<div class="w-full grid grid-cols-2 gap-4" v-if="itIsTutorRequest">
				<div class="col-span-1 flex flex-col">
					<sofa-button :bgColor="'bg-primaryRed'" :textColor="'text-white'" :customClass="'w-full custom-border'"
						:padding="'py-3'" :has-double-layer="false" @click="acceptOrRejectTutorRequest(false)">
						Decline
					</sofa-button>
				</div>

				<div class="col-span-1 flex flex-col">
					<sofa-button :bgColor="'bg-primaryGreen'" :textColor="'text-white'"
						:customClass="'w-full custom-border'" :padding="'py-3'" :has-double-layer="false"
						@click="acceptOrRejectTutorRequest(true)">
						Accept
					</sofa-button>
				</div>
			</div>
			<slot v-else name="bottom" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	acceptOrRejectTutorRequest,
	contentTitleChanged,
	conversationTitle,
	hasMessage,
	itIsNewMessage,
	itIsTutorRequest,
	selectedChatData,
	selectedTutorRequestData,
	showAddTutor,
	showMoreOptions
} from '@/composables/conversation'
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaButton, SofaCustomInput, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { ref } from 'vue'

const editTitle = ref(false)
</script>