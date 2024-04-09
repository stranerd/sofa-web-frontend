<template>
	<div class="w-full h-full overflow-y-auto flex bg-white items-center justify-center">
		<div class="bg-white w-full lg:w-[45%] mdlg:w-[50%] h-full flex flex-col items-center justify-center">
			<div class="w-full h-full overflow-y-auto flex-1 flex flex-col justify-start relative md:p-8 p-4">
				<div class="w-full flex gap-4 items-center">
					<a v-if="!hideBack" @click="Logic.Common.goBack()">
						<SofaIcon customClass="md:h-[26px] h-[20px]" name="back-arrow" />
					</a>

					<div class="w-full flex flex-col md:justify-center md:items-center justify-start items-start gap-1">
						<SofaHeaderText customClass="md:!text-2xl text-lg" :content="title" />
						<SofaNormalText v-if="subTitle" color="text-grayColor" customClass="!font-normal" :content="subTitle" />
					</div>
				</div>

				<div class="h-full flex flex-col items-center gap-4 justify-center w-full md:px-10 px-0">
					<slot />
				</div>
			</div>
		</div>

		<SofaImageLoader
			photoUrl="/images/auth-bg.png"
			class="bg-primaryPurple hidden mdlg:flex flex-col relative lg:w-[55%] mdlg:w-[50%] h-full items-center justify-center pt-9">
			<div class="w-full h-full bg-deepGray bg-opacity-75 flex flex-col gap-5 px-[14%] py-6 justify-center">
				<div class="w-full bg-white rounded-custom px-5 py-3 flex gap-2 items-center">
					<SofaNormalText class="!font-bold !text-base"> Did you know? </SofaNormalText>
					<SofaIcon name="idea" customClass="h-[20px]" />
				</div>
				<SofaNormalText color="text-white" customClass="text-left !text-2xl">
					The human brain can store about 2.5 petabytes of information? That's roughly equivalent to three million hours of TV
					shows.
				</SofaNormalText>
			</div>
		</SofaImageLoader>
	</div>
</template>

<script lang="ts" setup>
import { Logic } from 'sofa-logic'

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
