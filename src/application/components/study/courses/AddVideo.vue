<template>
	<div class="w-full flex flex-col gap-4">
		<div class="w-full flex flex-col gap-4">
			<div class="bg-primaryPurple rounded-custom px-4 py-4 flex flex-col gap-2">
				<div v-for="item in videoUploadSteps" :key="item" class="flex flex-row items-center justify-start gap-2">
					<span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
					<SofaNormalText color="text-white">
						{{ item }}
					</SofaNormalText>
				</div>
			</div>

			<SofaTextField
				ref="video_link"
				v-model="addVideoForm.link"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				name="Youtube video link"
				placeholder="Paste link here"
				borderColor="border-transparent"
				:rules="[Logic.Form.RequiredRule]">
				<template #inner-prefix>
					<SofaIcon customClass="h-[15px]" name="youtube" />
				</template>
			</SofaTextField>
		</div>

		<div
			class="w-full flex mdlg:!flex-row flex-col items-center justify-between mdlg:!relative sticky bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0">
			<SofaButton
				padding="px-5 py-2"
				bgColor="bg-white"
				textColor="text-grayColor"
				customClass="border border-gray-100 hidden mdlg:!inline-block">
				Exit
			</SofaButton>

			<div class="mdlg:!w-auto w-full flex flex-col">
				<SofaButton padding="px-5 mdlg:!py-2 py-3" customClass="mdlg:!w-auto w-full"> Add </SofaButton>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Logic } from 'sofa-logic'

export default defineComponent({
	name: 'AddVideo',
	props: {
		customClass: {
			type: String,
			default: '',
		},
	},
	setup() {
		const showAddVideo = ref(false)

		const videoUploadSteps = reactive(['Find or post a video on YouTube', 'Tap share and copy the video link', 'Paste the link below'])

		const addVideoForm = reactive({
			link: '',
		})

		return {
			Logic,
			showAddVideo,
			videoUploadSteps,
			addVideoForm,
		}
	},
})
</script>
