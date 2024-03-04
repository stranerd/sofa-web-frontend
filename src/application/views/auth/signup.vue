<template>
	<AuthLayout title="Create your account" subTitle="Join the School Of Future Africa">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signup">
			<AuthProvider :signUp="true" />

			<div class="w-full flex flex-col gap-4">
				<div class="flex gap-4 items-center">
					<SofaTextField
						v-model="factory.first"
						customClass="rounded-custom !bg-lightGray w-full"
						placeholder="First Name"
						:error="factory.errors.first" />
					<SofaTextField
						v-model="factory.last"
						customClass="rounded-custom !bg-lightGray w-full"
						placeholder="Last Name"
						:error="factory.errors.last" />
				</div>
				<SofaTextField
					v-model="factory.email"
					customClass="rounded-custom !bg-lightGray"
					type="email"
					placeholder="Email"
					:error="factory.errors.email" />
				<SofaTextField
					v-model="factory.password"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Password"
					:error="factory.errors.password" />
				<SofaTextField
					v-model="factory.cPassword"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Confirm password"
					:error="factory.errors.cPassword" />

				<SofaCheckbox v-model="factory.termsAccepted">
					<span class="text-grayColor text-left flex flex-wrap gap-[4px]">
						I have read and accepted SOFA’s
						<SofaNormalText
							color="text-primaryBlue"
							as="router-link"
							to="/legal/terms-of-service"
							class="hover:underline"
							content="Terms of Service" />
						<span> and </span>
						<SofaNormalText
							color="text-primaryBlue"
							as="router-link"
							to="/legal/privacy-policy"
							class="hover:underline"
							content="Privacy Policy" />
					</span>
				</SofaCheckbox>
			</div>

			<div class="w-full flex flex-col">
				<SofaButton :disabled="!factory.valid" customClass="w-full" padding="md:py-4 py-3" type="submit"> Sign Up </SofaButton>
			</div>
		</form>

		<div class="flex items-center gap-2 pt-3">
			<SofaNormalText color="text-grayColor">Have an account?</SofaNormalText>
			<router-link to="/auth/signin">
				<SofaNormalText color="!text-primaryBlue">Sign in</SofaNormalText>
			</router-link>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import AuthProvider from '@app/components/auth/AuthProvider.vue'
import { useEmailSignup } from '@app/composables/auth/signin'

export default defineComponent({
	name: 'AuthSignupPage',
	components: { AuthProvider },
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useMeta({ title: 'Create Your Account' })
		const { factory, signup } = useEmailSignup()
		return { factory, signup }
	},
})
</script>
