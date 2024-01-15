<template>
	<AuthLayout title="Create your account" subTitle="Join the School Of Future Africa">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signup">
			<AuthProvider />

			<div class="w-full flex flex-col gap-4">
				<SofaTextField
					ref="email"
					v-model="factory.email"
					:customClass="'rounded-custom !bg-lightGray'"
					type="email"
					:name="'Email'"
					:placeholder="'Email'"
					:error="factory.errors.email" />
				<SofaTextField
					ref="password"
					v-model="factory.password"
					:customClass="'rounded-custom !bg-lightGray'"
					:type="'password'"
					:placeholder="'Password'"
					:name="'Password'"
					:error="factory.errors.password" />
				<SofaTextField
					ref="confirm_new_password"
					v-model="factory.cPassword"
					:customClass="'rounded-custom !bg-lightGray'"
					type="password"
					:name="'Confirm password'"
					:placeholder="'Confirm password'"
					:error="factory.errors.cPassword" />
			</div>

			<div class="flex flex-col items-center gap-2">
				<SofaCheckbox v-model="factory.termsAccepted">
					<span class="text-grayColor text-left">
						I have read and accepted SOFA’s
						<a class="text-primaryBlue hover:underline">Terms of Service</a>
						<span> and </span>
						<a class="text-primaryBlue hover:underline">Privacy Policy</a>
					</span>
				</SofaCheckbox>
			</div>

			<div class="w-full flex flex-col">
				<SofaButton :disabled="!factory.valid" :customClass="'w-full'" :padding="'md:py-4 py-3'" type="submit">
					Sign Up
				</SofaButton>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaNormalText :color="'text-grayColor'">Have an account?</SofaNormalText>
			<router-link to="/auth/login">
				<SofaNormalText :color="'!text-primaryBlue'">Sign in</SofaNormalText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import AuthProvider from '@app/components/auth/AuthProvider.vue'
import { useEmailSignup } from '@app/composables/auth/signin'
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

export default defineComponent({
	name: 'AuthRegisterPage',
	components: { AuthProvider },
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useMeta({ title: 'Create Your Account' })
		const { factory, signup } = useEmailSignup()
		return { factory, signup }
	},
})
</script>
