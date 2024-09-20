<template>
	<AuthLayout title="Verify your email" :subTitle="`Enter the 6-digit code sent to your email ${email}`">
		<form class="flex flex-col gap-6 w-full items-center justify-center" @submit.prevent="completeVerification">
			<div class="w-full lg:w-[70%] mdlg:w-[80%] flex flex-col gap-4">
				<SofaOtpInput v-model="token" />
			</div>

			<SofaButton class="w-full" padding="md:py-4 py-3" type="submit"> Verify </SofaButton>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaText class="text-grayColor">Have an account?</SofaText>
			<SofaText as="router-link" to="/auth/signin" class="text-primaryBlue"> Sign in </SofaText>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useEmailVerification } from '@app/composables/auth/signin'

export default defineComponent({
	name: 'AuthVerifyPage',
	routeConfig: { middlewares: [({ to }) => (to.query.email ? undefined : '/auth/signin')] },
	setup() {
		useHead({ title: 'Verify your email' })

		const route = useRoute()
		const email = route.query.email as string

		const { token, message, completeVerification, sendVerificationEmail } = useEmailVerification()
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
