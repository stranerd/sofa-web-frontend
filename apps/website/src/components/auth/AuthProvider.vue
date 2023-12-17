<template>
	<div class="w-full flex flex-col items-center gap-4">
		<GoogleLogin :callback="onSuccessGoogle" />

		<vue-apple-login v-if="false" color="white" :border="false" logoSize="large" mode="center-align" type="sign in"
			:onSuccess="onSuccessApple" class="border border-darkLightGray rounded-lg text-[1em]" :onFailure="onFailure">
			Sign in with Apple
		</vue-apple-login>
	</div>
	<div class="w-full flex gap-3 items-center">
		<div class="border border-darkLightGray w-full"></div>
		<sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">Or use email</sofa-normal-text>
		<div class="border border-darkLightGray w-full"></div>
	</div>
</template>

<script lang="ts" setup>
import { createSession } from '@/composables/auth/session'
import { Logic } from 'sofa-logic'
import { SofaNormalText } from 'sofa-ui-components'

const onSuccessGoogle = (data: any) => {
	Logic.Auth.GoogleSignIn({
		accessToken: '',
		idToken: data.credential,
	})
		.then(createSession)
		.catch((error) => Logic.Common.showError(error?.message ?? ''))
}

const onSuccessApple = (data: any) => {
	console.log(data)
}

const onFailure = () => {
	//
}
</script>