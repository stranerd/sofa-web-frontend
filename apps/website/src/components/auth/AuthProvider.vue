<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-col items-center justify-center">
      <GoogleLogin :callback="onSuccessGoogle" />
    </div>

    <!-- <div>
      <div
        class="w-full border-[2px] border-[#E1E6EB] custom-border md:!py-4 md:!px-4 px-3 py-3 flex flex-row items-center justify-center"
      >
        <vue-apple-login
          color="white"
          :border="false"
          type="continue"
          width="100%"
          height="25"
          logoSize="large"
          :onSuccess="onSuccessApple"
          mode="center-align"
          :className="'!border-none !h-auto'"
          :onFailure="onFailure"
        ></vue-apple-login>
      </div>
    </div> -->
  </div>
  <div class="w-full flex gap-3 items-center">
    <div class="border border-[#E1E6EB] w-full"></div>
    <sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">Or use email</sofa-normal-text>
    <div class="border border-[#E1E6EB] w-full"></div>
  </div>
</template>

<script lang="ts" setup>
import { SofaNormalText } from "sofa-ui-components"
import { Logic } from "sofa-logic"

const onSuccessGoogle = (data: any) => {
  Logic.Auth.GoogleSignInForm = {
    accessToken: "",
    idToken: data.credential,
  }
  Logic.Auth.GoogleSignIn()
}

/* const onSuccessApple = (data: any) => {
  console.log(data)
}

const onFailure = () => {
  //
} */
</script>