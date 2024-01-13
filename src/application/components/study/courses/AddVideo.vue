<template>
	<div class="w-full flex flex-col gap-4">
		<div class="w-full flex flex-col gap-4">
			<div class="bg-primaryPurple rounded-custom px-4 py-4 flex flex-col gap-2">
				<div v-for="(item, index) in videoUploadSteps" :key="index" class="flex flex-row items-center justify-start gap-2">
					<span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
					<sofa-normal-text :color="'text-white'">
						{{ item }}
					</sofa-normal-text>
				</div>
			</div>

			<sofa-text-field
				ref="video_link"
				v-model="addVideoForm.link"
				:custom-class="'rounded-custom !bg-lightGray'"
				type="text"
				:name="'Youtube video link'"
				:placeholder="'Paste link here'"
				:border-color="'border-transparent'"
				:rules="[Logic.Form.RequiredRule]">
				<template #inner-prefix>
					<sofa-icon :custom-class="'h-[15px]'" :name="'youtube'" />
				</template>
			</sofa-text-field>
		</div>

		<div
			class="w-full flex mdlg:!flex-row flex-col items-center justify-between mdlg:!relative sticky bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0">
			<sofa-button
				:padding="'px-5 py-2'"
				:bg-color="'bg-white'"
				:text-color="'text-grayColor'"
				:custom-class="'border border-gray-100 hidden mdlg:!inline-block'">
				Exit
			</sofa-button>

			<div class="mdlg:!w-auto w-full flex flex-col">
				<sofa-button :padding="'px-5 mdlg:!py-2 py-3'" :custom-class="'mdlg:!w-auto w-full'"> Add </sofa-button>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { FormValidations } from '@app/composables'
import { Logic } from 'sofa-logic'
import { SofaButton, SofaIcon, SofaNormalText, SofaTextField } from 'sofa-ui-components'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
	name: 'AddVideo',
	components: {
		SofaIcon,
		SofaTextField,
		SofaNormalText,
		SofaButton,
	},
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
			FormValidations,
			showAddVideo,
			videoUploadSteps,
			addVideoForm,
		}
	},
})
</script>
