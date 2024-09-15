<template>
	<AuthLayout
		:title="sent ? 'Reset your password' : 'Forgot your password'"
		:subTitle="
			sent ? undefined : 'Enter the email address associated with your account and we’ll send you a link to reset your password'
		">
		<form v-if="!sent" class="flex flex-col gap-6 w-full" @submit.prevent="sendResetEmail">
			<SofaInput v-model="factory.email" type="text" placeholder="Email" :error="factory.errors.email" />

			<SofaButton class="w-full" padding="md:py-4 py-3" type="submit"> Continue </SofaButton>
		</form>

		<form v-else class="flex flex-col gap-6 w-full" @submit.prevent="resetPassword">
			<div class="w-full flex flex-col gap-4">
				<SofaInput v-model="factory.token" type="number" placeholder="Enter 6-digit token" :error="factory.errors.token" />

				<SofaInput v-model="factory.password" type="password" placeholder="New password" :error="factory.errors.password" />

				<SofaInput
					v-model="factory.cPassword"
					type="password"
					placeholder="Confirm new password"
					:error="factory.errors.cPassword" />
			</div>

			<SofaButton class="w-full" padding="md:py-4 py-3" type="submit"> Continue </SofaButton>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaText class="text-grayColor">Don’t have an account?</SofaText>
			<SofaText as="router-link" to="/auth/signup" class="text-primaryBlue"> Sign up </SofaText>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import { usePasswordReset } from '@app/composables/auth/passwords'

export default defineComponent({
	name: 'AuthForgotPage',
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useHead({ title: 'Forgot password' })

		const { factory, sent, sendResetEmail, resetPassword } = usePasswordReset()
		return { factory, sent, sendResetEmail, resetPassword }
	},
})
</script>
