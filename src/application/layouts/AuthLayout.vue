<template>
	<div v-if="accountSetup" class="flex gap-2 items-center w-full z-[100] p-4 sticky top-0 bg-white justify-between mdlg:shadow-custom">
		<Logo class="h-[32px] max-mdlg:hidden" />
		<SofaHeading size="title" content="Account Setup" />
		<span />
	</div>
	<div
		:class="['w-full h-full flex bg-cover bg-center', { 'bg-white': !accountSetup, 'justify-center items-center': accountSetup }]"
		:style="accountSetup ? { backgroundImage: `url(${bodyBgImage})` } : undefined">
		<div
			:class="[
				'bg-white min-w-fit rounded-xl overflow-y-auto flex flex-col justify-center items-center shrink-0 md:p-8 p-4',
				accountSetup ? 'w-[80%] mdlg:w-[60%]' : 'h-full w-full lg:w-[45%] mdlg:w-[50%]',
			]">
			<div v-if="!accountSetup" class="w-full flex gap-4 items-center py-4">
				<SofaIcon v-if="!hideBack" class="md:h-[26px] h-[20px]" name="arrow-left" @click="$utils.goBack()" />

				<div class="w-full flex flex-col justify-center items-center gap-1">
					<SofaHeading size="title" :content="title" />
					<SofaText v-if="subTitle" class="text-grayColor" :content="subTitle" />
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
		accountSetup?: boolean
	}>(),
	{
		subTitle: '',
		hideBack: false,
		bgImage: '/images/auth.png',
		bodyBgImage: '/images/auth-setup-frame.svg',
		accountSetup: false,
	},
)
</script>
