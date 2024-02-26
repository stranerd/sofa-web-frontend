<template>
	<div class="w-full flex flex-col gap-4">
		<SofaButton
			bgColor="bg-transparent"
			padding="px-8 py-5"
			:hasShadow="false"
			:disabled="googleLoading"
			:loading="appleLoading"
			class="border-2 border-darkLightGray font-bold"
			@click="googleSignin">
			<div class="flex gap-2 items-center normal-case">
				<SofaIcon name="google" class="text-[16px]" />
				<SofaNormalText :content="`${message} with Google`" />
			</div>
		</SofaButton>
		<SofaButton
			v-if="showAppleSignin"
			bgColor="bg-transparent"
			padding="px-8 py-5"
			:hasShadow="false"
			:disabled="appleLoading"
			:loading="appleLoading"
			class="border-2 border-darkLightGray font-bold"
			@click="appleSignin">
			<span class="flex gap-2 items-center normal-case">
				<SofaIcon name="apple" class="text-[16px]" />
				<SofaNormalText :content="`${message} with Apple`" />
			</span>
		</SofaButton>
	</div>
	<div class="w-full flex gap-3 items-center">
		<div class="border border-darkLightGray w-full"></div>
		<SofaNormalText color="text-grayColor" class="!whitespace-nowrap">Or use email</SofaNormalText>
		<div class="border border-darkLightGray w-full"></div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppleSignin, useGoogleSignin } from '@app/composables/auth/signin'
import { isIos, isWeb } from '@utils/constants'

const props = defineProps({
	signUp: Boolean,
})

const { loading: googleLoading, signin: googleSignin } = useGoogleSignin()
const { loading: appleLoading, signin: appleSignin } = useAppleSignin()

const showAppleSignin = isWeb || isIos

const message = computed(() => (props.signUp ? 'Sign up' : 'Sign in'))
</script>
