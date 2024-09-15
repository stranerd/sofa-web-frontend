<template>
	<AuthLayout title="Welcome back" :hideBack="true" subTitle="Let the progress continue">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signin">
			<AuthProvider :signUp="false" />

			<div class="w-full flex flex-col gap-4">
				<SofaInput v-model="factory.email" type="text" placeholder="Email" :error="factory.errors.email" />
				<SofaInput v-model="factory.password" type="password" placeholder="Password" :error="factory.errors.password" />
			</div>

			<SofaButton :disabled="!factory.valid" class="w-full" padding="md:py-4 py-3" type="submit"> Login </SofaButton>
		</form>

		<div class="w-full flex items-center justify-center pt-3">
			<SofaText as="router-link" to="/auth/forgot" class="text-primaryBlue"> Forgot password? </SofaText>
		</div>

		<div class="flex items-center gap-2 pt-3">
			<SofaText class="text-grayColor">Don’t have an account?</SofaText>
			<SofaText as="router-link" to="/auth/signup" class="text-primaryBlue"> Sign up </SofaText>
		</div>
	</AuthLayout>
</template>

<script lang="ts">
import { useHead } from '@unhead/vue'
import { defineComponent } from 'vue'
import AuthProvider from '@app/components/auth/AuthProvider.vue'
import { useEmailSignin } from '@app/composables/auth/signin'

export default defineComponent({
	name: 'AuthSigninPage',
	components: { AuthProvider },
	routeConfig: { middlewares: ['isNotAuthenticated'] },
	setup() {
		useHead({ title: 'Sign In To Your Account' })
		const { factory, signin } = useEmailSignin()
		return { factory, signin }
	},
})
</script>
