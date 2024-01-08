<template>
	<auth-layout title="Verify your email" :sub-title="`Enter the 6-digit code sent to your email ${email}`">
		<form class="flex flex-col gap-6 w-full items-center justify-center" @submit.prevent="completeVerification">
			<div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" :number-of-input="6" />
			</div>

			<div class="w-full flex flex-col">
				<sofa-button :custom-class="'w-full'" :padding="'md:py-4 py-3'" type="submit"> Verify </sofa-button>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<sofa-normal-text :color="'text-grayColor'">Have an account?</sofa-normal-text>
			<router-link to="/auth/login">
				<sofa-normal-text :color="'!text-primaryBlue'">Sign in</sofa-normal-text>
			</router-link>
		</div>
	</auth-layout>
</template>

<script lang="ts">
import { getEmailVerificationEmail, useEmailVerification } from '@/composables/auth/signin'
import { generateMiddlewares } from '@/middlewares'
import { SofaButton, SofaNormalText, SofaOtpInput } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'AuthVerifyPage',
	components: {
		SofaNormalText,
		SofaButton,
		SofaOtpInput,
	},
	beforeRouteEnter: generateMiddlewares([
		async () => {
			if (!getEmailVerificationEmail()) return '/auth/signin'
		},
	]),
	setup() {
		useMeta({ title: 'Verify your email' })

		const { email, token, message, completeVerification, sendVerificationEmail } = useEmailVerification()
		return {
			email,
			message,
			token,
			sendVerificationEmail,
			completeVerification,
		}
	},
})
</script>
