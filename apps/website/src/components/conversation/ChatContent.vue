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
			class="w-full bg-white flex flex-col items-start justify-start gap-2 h-full flex-grow !overflow-y-auto px-4 py-2">
			<template v-if="itIsTutorRequest">
			</template>
			<template v-else>
				<conversation-messages :Messages="Messages" :ShowLoader="showLoader" :itIsNewMessage="itIsNewMessage" />
				<div v-if="itIsNewMessage" class="grid w-full gap-4 py-2 mdlg:!grid-cols-3"
					style="grid-template-columns: repeat(auto-fit, minmax(150px,  1fr))">
					<div class="col-span-1 flex flex-col gap-2 items-center p-3 mdlg:p-5 rounded-2xl bg-fadedPurple"
						v-for="(content, index) in contentList" :key="index">
						<sofa-icon :name="content.icon" :customClass="'h-[39px]'" />
						<sofa-normal-text :customClass="'!font-bold'">{{ content.title }}</sofa-normal-text>
						<sofa-normal-text>{{ content.body }}</sofa-normal-text>
					</div>
				</div>
			</template>
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
			<div v-else
				class="w-full flex gap-2 items-center bg-fadedPurple rounded-tl-2xl rounded-br-2xl rounded-tr-lg rounded-bl-lg mdlg:!rounded-lg px-1">
				<span :contenteditable="true" role="textbox"
					:class="`w-full textarea resize-none !min-h-[48px] text-bodyBlack whitespace-pre-wrap focus:outline-none !max-h-[80px] overflow-hidden bg-transparent rounded-lg p-3 items-start text-left overflow-y-auto`"
					placeholder="Enter message" id="messageContainer" @input="onInput" @keypress="handleKeyEvent">
					{{ messageContent }}
				</span>
				<span class="min-w-[45px]">
					<span class="h-[40px] w-[40px] flex items-center justify-center cursor-pointer"
						@click="sendNewMessage(selectConversation)">
						<sofa-icon :name="'send'" :customClass="'h-[19px]'" />
					</span>
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import ConversationMessages from "@/components/conversation/Messages.vue"
import {
	Messages,
	acceptOrRejectTutorRequest,
	contentList,
	contentTitleChanged,
	conversationTitle,
	handleKeyEvent,
	hasMessage,
	itIsNewMessage,
	itIsTutorRequest,
	messageContent, onInput, selectConversation,
	selectedChatData,
	selectedTutorRequestData,
	sendNewMessage,
	showAddTutor,
	showLoader,
	showMoreOptions,
} from '@/composables/conversation'
import { Logic } from 'sofa-logic'
import { SofaAvatar, SofaButton, SofaCustomInput, SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { ref } from 'vue'

const editTitle = ref(false)
</script>


<style scoped>
.textarea[contenteditable]:empty::before {
	content: "Enter message";
	color: #78828c;
}
</style>