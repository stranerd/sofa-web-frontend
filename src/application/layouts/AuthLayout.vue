<template>
	<div
		v-if="showBodyBgImage"
		class="flex gap-2 items-center w-full lg:text-sm mdlg:text-[12px] text-xs z-[100] px-4 py-4 mdlg:py-0 sticky top-0 bg-white justify-between mdlg:shadow-custom">
		<div class="py-2 pr-3 hidden mdlg:block">
			<Logo class="h-[32px]" />
		</div>
		<SofaHeaderText content="Account Setup" />
		<SofaButton class="bg-primaryPurple">Skip</SofaButton>
	</div>
	<div
		:class="['w-full h-full flex', { 'bg-white': !showBodyBgImage, 'justify-center items-center': showBodyBgImage }]"
		:style="{
			backgroundImage: showBodyBgImage ? `url(${bodyBgImage})` : '',
			backgroundSize: showBodyBgImage ? 'cover' : '',
			backgroundPosition: showBodyBgImage ? 'center' : '',
		}">
		<div
			:class="[
				'bg-white rounded-xl overflow-y-auto flex flex-col justify-center items-center shrink-0 md:p-8 p-4',
				showBodyBgImage ? 'w-[80%] mdlg:w-[60%]' : 'h-full w-full lg:w-[45%] mdlg:w-[50%]',
			]">
			<div v-if="!showBodyBgImage" class="w-full py-4">
				<div class="w-full flex gap-4 items-center pt-1">
					<SofaIcon v-if="!hideBack" class="md:h-[26px] h-[20px]" name="arrow-left" @click="$utils.goBack()" />

					<div class="w-full flex flex-col justify-center items-center gap-1">
						<SofaHeaderText class="md:!text-2xl text-lg" :content="title" />
						<SofaNormalText v-if="subTitle" color="text-grayColor" class="!font-normal" :content="subTitle" />
					</div>
				</div>
			</div>

			<div class="flex flex-col items-center gap-4 justify-center w-full md:px-10 px-0">
				<slot />
			</div>
		</div>

		<SofaImageLoader v-if="hideBack" :photoUrl="bgImage" class="bg-primaryPurple hidden mdlg:flex h-full mdlg:w-[50%] lg:w-[55%]" />
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		title: string
		subTitle?: string
		hideBack?: boolean
		bgImage?: string
		bodyBgImage?: string
		showBodyBgImage?: boolean
	}>(),
	{
		subTitle: '',
		hideBack: false,
		bgImage: '/images/auth.png',
		bodyBgImage: '/images/auth-setup-frame.svg',
		showBodyBgImage: false,
	},
)
</script>
