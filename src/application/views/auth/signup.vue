<template>
	<AuthLayout title="Create your account" :hideBack="true">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signup">
			<AuthProvider :signUp="true" />

			<div class="w-full flex flex-col gap-4">
				<SofaInput v-model="factory.email" type="email" placeholder="Email" :error="factory.errors.email" />
				<SofaInput v-model="factory.password" type="password" placeholder="Password" :error="factory.errors.password" />
				<SofaInput v-model="factory.cPassword" type="password" placeholder="Confirm password" :error="factory.errors.cPassword" />

				<SofaCheckbox v-model="factory.termsAccepted">
					<span class="text-grayColor text-left flex flex-wrap gap-1">
						<span>I accepts Stranerd's </span>
						<SofaText as="router-link" to="/legal/terms-of-service" class="text-primaryBlue" content="Terms of Service" />
						<span> and </span>
						<SofaText class="text-primaryBlue" as="router-link" to="/legal/privacy-policy" content="Privacy Policy" />
					</span>
				</SofaCheckbox>
			</div>

			<SofaButton :disabled="!factory.valid" class="w-full" padding="md:py-4 py-3" type="submit"> Sign Up </SofaButton>
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
import AuthProvider from '@app/components/auth/AuthProvider.vue'
import { useEmailSignup } from '@app/composables/auth/signin'

export default defineComponent({
	name: 'AuthSignupPage',
	components: { AuthProvider },
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useHead({ title: 'Create Your Account' })
		const { factory, signup } = useEmailSignup()
		return { factory, signup }
	},
})
</script>
