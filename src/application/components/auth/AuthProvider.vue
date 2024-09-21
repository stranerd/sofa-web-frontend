<template>
	<div class="w-full flex flex-col gap-4">
		<SofaButton
			color="white"
			padding="px-8 py-5"
			:disabled="googleLoading"
			:loading="appleLoading"
			class="border-2 border-darkLightGray"
			@click="googleSignin">
			<div class="flex gap-2 items-center">
				<SofaIcon name="google" class="text-[16px]" />
				<SofaText :content="`${message} with Google`" />
			</div>
		</SofaButton>
		<SofaButton
			v-if="showAppleSignin"
			color="white"
			padding="px-8 py-5"
			:disabled="appleLoading"
			:loading="appleLoading"
			class="border-2 border-darkLightGray"
			@click="appleSignin">
			<span class="flex gap-2 items-center">
				<SofaIcon name="apple" class="text-[16px]" />
				<SofaText :content="`${message} with Apple`" />
			</span>
		</SofaButton>
	</div>
	<div class="w-full flex gap-3 items-center">
		<div class="border border-darkLightGray w-full"></div>
		<SofaText class="!whitespace-nowrap">Or use email</SofaText>
		<div class="border border-darkLightGray w-full"></div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppleSignin, useGoogleSignin } from '@app/composables/auth/signin'
const { isIos, isWeb } = $utils.constants

const props = defineProps({
	signUp: Boolean,
})

const { loading: googleLoading, signin: googleSignin } = useGoogleSignin()
const { loading: appleLoading, signin: appleSignin } = useAppleSignin()

const showAppleSignin = isWeb || isIos

const message = computed(() => (props.signUp ? 'Continue with' : 'Sign in'))
</script>
