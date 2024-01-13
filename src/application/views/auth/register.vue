<template>
	<auth-layout title="Create your account" sub-title="Join the School Of Future Africa">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signup">
			<AuthProvider />

			<div class="w-full flex flex-col gap-4">
				<sofa-text-field
					ref="email"
					v-model="factory.email"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="email"
					:name="'Email'"
					:placeholder="'Email'"
					:error="factory.errors.email" />
				<sofa-text-field
					ref="password"
					v-model="factory.password"
					:custom-class="'rounded-custom !bg-lightGray'"
					:type="'password'"
					:placeholder="'Password'"
					:name="'Password'"
					:error="factory.errors.password" />
				<sofa-text-field
					ref="confirm_new_password"
					v-model="factory.cPassword"
					:custom-class="'rounded-custom !bg-lightGray'"
					type="password"
					:name="'Confirm password'"
					:placeholder="'Confirm password'"
					:error="factory.errors.cPassword" />
			</div>

			<div class="flex flex-col items-center gap-2">
				<sofa-checkbox v-model="factory.termsAccepted">
					<span class="text-grayColor text-left">
						I have read and accepted SOFA’s
						<a class="text-primaryBlue hover:underline">Terms of Service</a>
						<span> and </span>
						<a class="text-primaryBlue hover:underline">Privacy Policy</a>
					</span>
				</sofa-checkbox>
			</div>

			<div class="w-full flex flex-col">
				<sofa-button :disabled="!factory.valid" :custom-class="'w-full'" :padding="'md:py-4 py-3'" type="submit">
					Sign Up
				</sofa-button>
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
import AuthProvider from '@/components/auth/AuthProvider.vue'
import { useEmailSignup } from '@/composables/auth/signin'
import { SofaButton, SofaCheckbox, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'AuthRegisterPage',
	components: {
		AuthProvider,
		SofaNormalText,
		SofaTextField,
		SofaCheckbox,
		SofaButton,
	},
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useMeta({ title: 'Create Your Account' })
		const { factory, signup } = useEmailSignup()
		return { factory, signup }
	},
})
</script>
