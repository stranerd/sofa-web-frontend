<template>
	<SofaModal2 :close="() => $emit('close')">
		<div class="p-4 bg-white flex flex-col gap-8">
			<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
				<SofaHeaderText class="!font-bold !text-deepGray" content="Create a class" />
				<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="$emit('close')" />
			</div>
			<!-- Form -->
			<form class="flex flex-col gap-8" @submit.prevent>
				<div class="flex flex-col mdlg:flex-row items-center gap-8 mdlg:gap-4">
					<div class="w-full mdlg:w-1/2">
						<div class="w-full flex flex-col items-center justify-center pt-3">
							<sofa-image-loader
								:custom-class="`w-full h-[233px] flex items-center justify-center relative bg-primaryPurple border border-grayColor rounded-bl-[16px] rounded-tr-[16px] rounded-tl-[8px] rounded-tl-[8px] !object-contain !bg-contain`"
								:photo-url="classForm.localPhotoLink">
								<sofa-icon v-if="!classForm.localPhotoLink" :custom-class="'h-[50px]'" :name="'user'" />
								<sofa-file-attachment
									v-model="classForm.photo"
									v-model:localFileUrl="classForm.localPhotoLink"
									:is-wrapper="true"
									:custom-class="`absolute bottom-0 right-0 left-0 bg-black bg-opacity-50 rounded-bl-[16px] rounded-tl-[8px] !h-[50px] !w-full flex items-center justify-center`"
									:accept="'image/png, image/gif, image/jpeg'">
									<template #content>
										<div class="w-full flex items-center justify-center gap-3">
											<SofaIcon class="h-[18px]" name="camera-white" />
											<SofaNormalText content="Add cover photo" color="text-white" />
										</div>
									</template>
								</sofa-file-attachment>
							</sofa-image-loader>
						</div>
					</div>
					<div class="w-full mdlg:w-1/2 flex flex-col gap-4">
						<SofaTextField
							v-model="classForm.name"
							custom-class="rounded-custom !bg-lightGray"
							type="text"
							placeholder="Name your class"
							:error="classForm.name"
							border-color="border-transparent" />
						<SofaTextarea
							v-model="classForm.desc"
							text-area-style="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
							:error="classForm.desc"
							:placeholder="'Describe your class'" />
						<SofaTextField
							v-model="classForm.price"
							custom-class="rounded-custom !bg-lightGray"
							type="number"
							placeholder="Price per month"
							:error="classForm.name"
							border-color="border-transparent">
							<template #inner-suffix>
								<div class="flex items-center gap-1 border-l-2 border-darkLightGray px-2 py-1">
									<SofaNormalText custom-class="font-bold text-deepGray !text-xl"> ₦ </SofaNormalText>
								</div>
							</template>
						</SofaTextField>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<SofaButton :bg-color="'bg-grayColor'" :text-color="'text-white'" :padding="'py-4 px-6'" @click="$emit('close')"
						>Cancel</SofaButton
					>
					<SofaButton :bg-color="'bg-primaryBlue'" :text-color="'text-white'" :padding="'py-4 px-6'">Save</SofaButton>
				</div>
			</form>
		</div>
	</SofaModal2>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
	SofaModal2,
	SofaIcon,
	SofaHeaderText,
	SofaButton,
	SofaTextField,
	SofaTextarea,
	SofaImageLoader,
	SofaFileAttachment,
	SofaNormalText,
} from 'sofa-ui-components'

export default defineComponent({
	components: {
		SofaModal2,
		SofaIcon,
		SofaHeaderText,
		SofaButton,
		SofaTextField,
		SofaTextarea,
		SofaImageLoader,
		SofaFileAttachment,
		SofaNormalText,
	},
	setup() {
		const classForm = ref({
			name: '',
			desc: '',
			price: '',
			photo: {},
			localPhotoLink: '/images/stranerd.png',
		})
		return {
			classForm,
		}
	},
})
</script>
