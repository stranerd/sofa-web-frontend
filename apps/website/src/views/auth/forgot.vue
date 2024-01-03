<template>
	<auth-layout :title="sent ? 'Reset your password' : 'Forgot your password'"
		:subTitle="sent ? undefined : 'Enter the email address associated with your account and we’ll send you a link to reset your password'">
		<form v-if="!sent" class="flex flex-col gap-6 w-full" @submit.prevent="sendResetEmail">
			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				type="text" :name="'Email'" ref="email" v-model="factory.email" :placeholder="'Email'"
				:error="factory.errors.email" />

			<div class="w-full flex flex-col">
				<sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" type="submit">
					Continue
				</sofa-button>
			</div>
		</form>

		<form v-else class="flex flex-col gap-6 w-full" @submit.prevent="resetPassword">
			<div class="w-full flex flex-col gap-4">
				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
					type="tel" :name="'Token'" ref="token" v-model="factory.token"
					:placeholder="'Enter 6-digit token'" :error="factory.errors.token" />

				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
					type="password" :name="'New password'" ref="new_password" v-model="factory.password"
					:placeholder="'New password'" :error="factory.errors.password" />

				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
					type="password" :name="'Confirm password'" ref="confirm_new_password"
					v-model="factory.cPassword" :placeholder="'Confirm new password'" :error="factory.errors.cPassword" />
			</div>

			<div class="w-full flex flex-col">
				<sofa-button :customClass="'w-full'" :padding="'md:py-4 py-3'" type="submit">
					Continue
				</sofa-button>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<sofa-normal-text :color="'text-grayColor'">Don’t have an account?</sofa-normal-text>
			<router-link to="/auth/register">
				<sofa-normal-text :color="'!text-primaryBlue'">Sign up</sofa-normal-text>
			</router-link>
		</div>
	</auth-layout>
</template>

<script lang="ts">
import { usePasswordReset } from '@/composables/auth/passwords'
import { generateMiddlewares } from '@/middlewares'
import { SofaButton, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: { SofaNormalText, SofaTextField, SofaButton },
	name: 'AuthForgotPage',
	beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
	setup () {
		useMeta({ title: 'Forgot password' })

		const { factory, sent, sendResetEmail, resetPassword } = usePasswordReset()
		return { factory, sent, sendResetEmail, resetPassword }
	}
})
</script>
