<template>
	<AuthLayout title="Verify your email" :subTitle="`Enter the 6-digit code sent to your email ${email}`">
		<form class="flex flex-col gap-6 w-full items-center justify-center" @submit.prevent="completeVerification">
			<div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" :numberOfInput="6" />
			</div>

			<div class="w-full flex flex-col">
				<SofaButton customClass="w-full" padding="md:py-4 py-3" type="submit"> Verify </SofaButton>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaNormalText color="text-grayColor">Have an account?</SofaNormalText>
			<router-link to="/auth/login">
				<SofaNormalText color="!text-primaryBlue">Sign in</SofaNormalText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { getEmailVerificationEmail, useEmailVerification } from '@app/composables/auth/signin'

export default defineComponent({
	name: 'AuthVerifyPage',
	routeConfig: { middlewares: [() => (getEmailVerificationEmail() ? undefined : '/auth/signin')] },
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
