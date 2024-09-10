<template>
	<div class="w-full h-full flex bg-white">
		<div
			class="bg-white w-full lg:w-[45%] mdlg:w-[50%] h-full overflow-y-auto flex flex-col justify-center items-center shrink-0 md:p-8 p-4">
			<div class="w-full py-4">
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

		<SofaImageLoader :photoUrl="bgImage" class="bg-primaryPurple hidden mdlg:flex h-full mdlg:w-[50%] lg:w-[55%]" />
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		title: string
		subTitle?: string
		hideBack?: boolean
		bgImage?: string
	}>(),
	{
		subTitle: '',
		hideBack: false,
		bgImage: '/images/auth.png',
	},
)
</script>
