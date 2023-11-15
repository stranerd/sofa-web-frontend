<template>
  <div class="w-full flex flex-col items-center gap-4">
    <GoogleLogin :callback="onSuccessGoogle" />

    <vue-apple-login v-if="false" color="white" :border="false" logoSize="large" mode="center-align" type="sign in"
      :onSuccess="onSuccessApple" class="border border-[#E1E6EB] rounded-lg text-[1em]" :onFailure="onFailure">
      Sign in with Apple
    </vue-apple-login>
  </div>
  <div class="w-full flex gap-3 items-center">
    <div class="border border-[#E1E6EB] w-full"></div>
    <sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">Or use email</sofa-normal-text>
    <div class="border border-[#E1E6EB] w-full"></div>
  </div>
</template>

<script lang="ts" setup>
import { Logic } from "sofa-logic"
import { SofaNormalText } from "sofa-ui-components"

const onSuccessGoogle = (data: any) => {
  Logic.Auth.GoogleSignInForm = {
    accessToken: "",
    idToken: data.credential,
  }
  Logic.Auth.GoogleSignIn()
}

const onSuccessApple = (data: any) => {
  console.log(data)
}

const onFailure = () => {
  //
}
</script>