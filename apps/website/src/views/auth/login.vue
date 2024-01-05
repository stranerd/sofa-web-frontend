<template>
	<auth-layout title="Welcome back" subTitle="Let the progress continue">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signin">
			<AuthProvider />

			<div class="w-full flex flex-col gap-4">
				<sofa-text-field
					:custom-class="'rounded-custom !bg-lightGray'"
					type="text"
					:name="'Email'"
					ref="email"
					v-model="factory.email"
					:placeholder="'Email'"
					:error="factory.errors.email" />
				<sofa-text-field
					:custom-class="'rounded-custom !bg-lightGray'"
					:type="'password'"
					:placeholder="'Password'"
					:name="'Password'"
					ref="password"
					:error="factory.errors.password"
					v-model="factory.password" />
			</div>

			<div class="w-full flex flex-col">
				<sofa-button :disabled="!factory.valid" :customClass="'w-full'" :padding="'md:py-4 py-3'" type="submit">
					Login
				</sofa-button>
			</div>
		</form>

		<div class="w-full flex items-center justify-center pt-3">
			<router-link to="/auth/forgot">
				<sofa-normal-text :color="'!text-primaryBlue'">Forgot password?</sofa-normal-text>
			</router-link>
		</div>

		<div class="flex items-center gap-2 pt-3">
			<sofa-normal-text :color="'text-grayColor'">Don’t have an account?</sofa-normal-text>
			<router-link to="/auth/register">
				<sofa-normal-text :color="'!text-primaryBlue'">Sign up</sofa-normal-text>
			</router-link>
		</div>
	</auth-layout>
</template>

<script lang="ts">
import AuthProvider from '@/components/auth/AuthProvider.vue'
import { useEmailSignin } from '@/composables/auth/signin'
import { generateMiddlewares } from '@/middlewares'
import { SofaButton, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	components: { AuthProvider, SofaNormalText, SofaTextField, SofaButton },
	name: 'AuthLoginPage',
	beforeRouteEnter: generateMiddlewares(['isNotAuthenticated']),
	setup() {
		useMeta({ title: 'Login To Your Account' })
		const { factory, signin } = useEmailSignin()
		return { factory, signin }
	},
})
</script>
