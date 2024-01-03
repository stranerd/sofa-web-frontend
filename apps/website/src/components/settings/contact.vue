<template>
	<div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
		<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'" content="Contact details" />

			<div class="w-full flex flex-row items-center gap-5 flex-wrap">
				<a href="mailto:support@stranerd.com" target="_blank"><sofa-icon :customClass="'h-[15px]'"
					:name="'email-social'" /></a>
				<a href="Wa.me/+2348130322791" target="_blank">
					<sofa-icon :customClass="'h-[22px]'" :name="'whatsapp-social'" /></a>
				<a href="https://instagram.com/stranerdapp?igshid=MzRlODBiNWFlZA==" target="_blank"><sofa-icon
					:customClass="'h-[18px]'" :name="'instagram-social'" /></a>
				<a href="https://www.tiktok.com/@stranerd?_t=8fCMYT3iCbl&_r=1" target="_blank"><sofa-icon
					:customClass="'h-[18px]'" :name="'tiktok-social'" /></a>
				<a href="https://x.com/stranerds?s=21&t=BufB-e-PFvnG949QyKQtgw" target="_blank"><sofa-icon
					:customClass="'h-[18px]'" :name="'twitter-social'" /></a>
			</div>
		</div>

		<div class="w-full flex flex-col gap-4 bg-white rounded-[16px] md:!px-5 md:!py-5 px-4 py-4 shadow-custom">
			<sofa-header-text :size="'xl'" :customClass="'text-left'" content="Give feedback" />

			<sofa-textarea :hasTitle="false"
				:textAreaStyle="'h-[90px] rounded-custom !bg-lightGray md:p-4 p-3'"
				:placeholder="'Let us know how we can help'" v-model="message" />

			<div class="w-full flex flex-row justify-end">
				<div class="flex flex-row">
					<sofa-button :padding="'px-7 py-2'" :customClass="'!w-auto'" @click="sendFeedback()">
						Send
					</sofa-button>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import {
	SofaHeaderText,
	SofaIcon,
	SofaTextarea,
	SofaButton,
} from 'sofa-ui-components'
import { FormValidations } from '@/composables'
import { Logic } from 'sofa-logic'

export default defineComponent({
	components: {
		SofaHeaderText,
		SofaIcon,
		SofaTextarea,
		SofaButton,
	},
	setup () {
		const message = ref('')

		const sendFeedback = () => {
			if (message.value.length > 7) {
				Logic.Users.SendFeedbackMessage(message.value).then(() => {
					message.value = ''
				})
			}
		}

		onMounted(() => {
			if (Logic.Common.route.query?.query?.toString()) {
				message.value = Logic.Common.route.query?.query?.toString()
			}
		})
		return {
			FormValidations,
			message,
			sendFeedback,
		}
	},
})
</script>
