<template>
	<AuthLayout
		:title="sent ? 'Reset your password' : 'Forgot your password'"
		:subTitle="
			sent ? undefined : 'Enter the email address associated with your account and we’ll send you a link to reset your password'
		">
		<form v-if="!sent" class="flex flex-col gap-6 w-full" @submit.prevent="sendResetEmail">
			<SofaTextField
				v-model="factory.email"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="Email"
				placeholder="Email"
				:error="factory.errors.email" />

			<SofaButton class="w-full" padding="md:py-4 py-3" type="submit"> Continue </SofaButton>
		</form>

		<form v-else class="flex flex-col gap-6 w-full" @submit.prevent="resetPassword">
			<div class="w-full flex flex-col gap-4">
				<SofaTextField
					v-model="factory.token"
					customClass="rounded-custom !bg-lightGray"
					type="number"
					name="Token"
					placeholder="Enter 6-digit token"
					:error="factory.errors.token" />

				<SofaTextField
					v-model="factory.password"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					name="New password"
					placeholder="New password"
					:error="factory.errors.password" />

				<SofaTextField
					v-model="factory.cPassword"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					name="Confirm password"
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
