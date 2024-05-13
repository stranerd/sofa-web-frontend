<template>
	<div class="w-full h-full flex bg-white">
		<div class="bg-white w-full lg:w-[45%] mdlg:w-[50%] h-full overflow-y-auto flex flex-col shrink-0 md:p-8 p-4">
			<div class="w-full flex gap-4 items-center">
				<SofaIcon v-if="!hideBack" class="md:h-[26px] h-[20px]" name="arrow-left" @click="$utils.goBack()" />

				<div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
					<SofaHeaderText class="md:!text-2xl text-lg" :content="title" />
					<SofaNormalText v-if="subTitle" color="text-grayColor" class="!font-normal" :content="subTitle" />
				</div>
			</div>

			<div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10 px-0">
				<slot />
			</div>
		</div>

		<SofaImageLoader photoUrl="/images/auth-bg.png" class="bg-primaryPurple hidden mdlg:flex h-full mdlg:w-[50%] lg:w-[55%]">
			<div class="w-full h-full bg-deepGray bg-opacity-75 flex flex-col gap-5 p-[14%] justify-center items-center">
				<div class="w-full bg-white rounded-custom px-5 py-3 flex gap-2 items-center">
					<SofaNormalText class="!font-bold !text-base"> Did you know? </SofaNormalText>
					<SofaIcon name="idea" class="h-[20px]" />
				</div>
				<SofaNormalText color="text-white" class="!text-2xl">
					The human brain can store about 2.5 petabytes of information? That's roughly equivalent to three million hours of TV
					shows.
				</SofaNormalText>
			</div>
		</SofaImageLoader>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		title: string
		subTitle?: string
		hideBack?: boolean
	}>(),
	{
		subTitle: '',
		hideBack: false,
	},
)
</script>
