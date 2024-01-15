<template>
	<AuthLayout
		:title="sent ? 'Reset your password' : 'Forgot your password'"
		:sub-title="
			sent ? undefined : 'Enter the email address associated with your account and we’ll send you a link to reset your password'
		">
		<form v-if="!sent" class="flex flex-col gap-6 w-full" @submit.prevent="sendResetEmail">
			<SofaTextField
				ref="email"
				v-model="factory.email"
				:custom-class="'rounded-custom !bg-lightGray'"
				type="text"
				:name="'Email'"
				:placeholder="'Email'"
				:error="factory.errors.email" />

			<div class="w-full flex flex-col">
				<SofaButton :custom-class="'w-full'" :padding="'md:py-4 py-3'" type="submit"> Continue </SofaButton>
			</div>
		</form>

		<form v-else class="flex flex-col gap-6 w-full" @submit.prevent="resetPassword">
			<div class="w-full flex flex-col gap-4">
				<SofaTextField
					ref="token"
					v-model="factory.token"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="tel"
					:name="'Token'"
					:placeholder="'Enter 6-digit token'"
					:error="factory.errors.token" />

				<SofaTextField
					ref="new_password"
					v-model="factory.password"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="password"
					:name="'New password'"
					:placeholder="'New password'"
					:error="factory.errors.password" />

				<SofaTextField
					ref="confirm_new_password"
					v-model="factory.cPassword"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="password"
					:name="'Confirm password'"
					:placeholder="'Confirm new password'"
					:error="factory.errors.cPassword" />
			</div>

			<div class="w-full flex flex-col">
				<SofaButton :custom-class="'w-full'" :padding="'md:py-4 py-3'" type="submit"> Continue </SofaButton>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaNormalText :color="'text-grayColor'">Don’t have an account?</SofaNormalText>
			<router-link to="/auth/register">
				<SofaNormalText :color="'!text-primaryBlue'">Sign up</SofaNormalText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { usePasswordReset } from '@app/composables/auth/passwords'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'AuthForgotPage',
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useMeta({ title: 'Forgot password' })

		const { factory, sent, sendResetEmail, resetPassword } = usePasswordReset()
		return { factory, sent, sendResetEmail, resetPassword }
	},
})
</script>
