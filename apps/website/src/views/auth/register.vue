<template>
	<auth-layout title="Create your account" subTitle="Join the School Of Future Africa">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signup">
			<AuthProvider />

			<div class="w-full flex flex-col gap-4">
				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor'"
					:padding="'md:p-4 p-3'" type="email" :name="'Email'" ref="email" v-model="factory.email" :placeholder="'Email'"
					:error="factory.errors.email" />
				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor'"
					:padding="'md:p-4 p-3'" :type="'password'" :placeholder="'Password'" :name="'Password'" ref="password"
					:error="factory.errors.password" v-model="factory.password" />
				<sofa-text-field :custom-class="'rounded-custom !bg-lightGray !placeholder:text-grayColor'"
					:padding="'md:p-4 p-3'" type="password" :name="'Confirm password'" ref="confirm_new_password"
					v-model="factory.cPassword" :placeholder="'Confirm password'" :error="factory.errors.cPassword" />
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
				<sofa-button :disabled="!factory.valid" :customClass="'w-full'" :padding="'md:py-4 py-3'" type="submit">
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
import { generateMiddlewares } from '@/middlewares'
import {
	SofaButton,
	SofaCheckbox,
	SofaNormalText,
	SofaTextField
} from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: {
		AuthProvider,
		SofaNormalText,
		SofaTextField,
		SofaCheckbox,
		SofaButton,
	},
	name: 'AuthRegisterPage',
	beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
	setup () {
		useMeta({ title: 'Create Your Account' })
		const { factory, signup } = useEmailSignup()
		return { factory, signup }
	}
})
</script>
