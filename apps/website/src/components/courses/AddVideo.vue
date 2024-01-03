<template>
	<div class="w-full flex flex-col gap-4">
		<div class="w-full flex flex-col gap-4">
			<div class="bg-primaryPurple rounded-custom px-4 py-4 flex flex-col gap-2">
				<div class="flex flex-row items-center justify-start gap-2" v-for="(item, index) in videoUploadSteps"
					:key="index">
					<span class="h-[4px] w-[4px] rounded-full bg-white"> </span>
					<sofa-normal-text :color="'text-white'">
						{{ item }}
					</sofa-normal-text>
				</div>
			</div>

			<sofa-text-field :custom-class="'rounded-custom !bg-lightGray'"
				type="text" :name="'Youtube video link'" ref="video_link"
				v-model="addVideoForm.link" :placeholder="'Paste link here'" :borderColor="'border-transparent'"
				:rules="[Logic.Form.RequiredRule]">
				<template v-slot:inner-prefix>
					<sofa-icon :customClass="'h-[15px]'" :name="'youtube'" />
				</template>
			</sofa-text-field>
		</div>

		<div
			class="w-full flex mdlg:!flex-row flex-col items-center justify-between mdlg:!relative sticky bottom-0 left-0 md:!bottom-auto md:!left-auto bg-white md:!py-0 md:!px-0">
			<sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
				:customClass="'border border-gray-100 hidden mdlg:!inline-block'">
				Exit
			</sofa-button>

			<div class="mdlg:!w-auto w-full flex flex-col">
				<sofa-button :padding="'px-5 mdlg:!py-2 py-3'" :customClass="'mdlg:!w-auto w-full'">
					Add
				</sofa-button>
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import {
	SofaIcon,
	SofaNormalText,
	SofaTextField,
	SofaButton,
} from 'sofa-ui-components'
import { Logic } from 'sofa-logic'
import { FormValidations } from '@/composables'

export default defineComponent({
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
	name: 'AddVideo',
	setup () {
		const showAddVideo = ref(false)

		const videoUploadSteps = reactive([
			'Find or post a video on YouTube',
			'Tap share and copy the video link',
			'Paste the link below',
		])

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
