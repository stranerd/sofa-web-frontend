<template>
	<AuthLayout title="Welcome back" subTitle="Let the progress continue">
		<form class="flex flex-col gap-6 w-full" @submit.prevent="signin">
			<AuthProvider :signUp="false" />

			<div class="w-full flex flex-col gap-4">
				<SofaTextField
					ref="email"
					v-model="factory.email"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					name="Email"
					placeholder="Email"
					:error="factory.errors.email" />
				<SofaTextField
					ref="password"
					v-model="factory.password"
					customClass="rounded-custom !bg-lightGray"
					type="password"
					placeholder="Password"
					name="Password"
					:error="factory.errors.password" />
			</div>

			<div class="w-full flex flex-col">
				<SofaButton :disabled="!factory.valid" customClass="w-full" padding="md:py-4 py-3" type="submit"> Login </SofaButton>
			</div>
		</form>

		<div class="w-full flex items-center justify-center pt-3">
			<router-link to="/auth/forgot">
				<SofaNormalText color="!text-primaryBlue">Forgot password?</SofaNormalText>
			</router-link>
		</div>

		<div class="flex items-center gap-2 pt-3">
			<SofaNormalText color="text-grayColor">Don’t have an account?</SofaNormalText>
			<router-link to="/auth/signup">
				<SofaNormalText color="!text-primaryBlue">Sign up</SofaNormalText>
			</router-link>
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
