<template>
	<SofaModal2 :close="() => $emit('close')">
		<div class="p-4 bg-white flex flex-col gap-8">
			<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
				<SofaHeaderText class="!font-bold !text-deepGray" :content="'Create a class'" />
				<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="$emit('close')" />
			</div>
			<!-- Form -->
			<form class="flex flex-col gap-8" @submit.prevent="createClass">
				<div class="flex flex-col mdlg:flex-row items-start gap-4">
					<div class="w-full mdlg:w-1/2">
						<div class="w-full flex flex-col justify-center">
							<sofa-image-loader
								:custom-class="`w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain`"
								:photo-url="classFactory.photo?.link ?? '/images/default.png'">
								<div
									class="absolute bottom-0 left-0 p-3 flex w-full items-center justify-center bg-black bg-opacity-50 rounded-custom">
									<sofa-file-input v-model="classFactory.photo" accept="image/*">
										<div class="w-full flex items-center justify-center gap-3">
											<SofaIcon class="h-[18px]" name="camera-white" />
											<SofaNormalText content="Add cover photo" color="text-white" />
										</div>
									</sofa-file-input>
								</div>
							</sofa-image-loader>
						</div>
					</div>
					<div class="w-full mdlg:w-1/2 flex flex-col gap-4">
						<SofaTextField
							v-model="classFactory.title"
							custom-class="rounded-custom !bg-lightGray"
							type="text"
							placeholder="Name your class"
							:error="classFactory.errors.title"
							border-color="border-transparent" />
						<SofaTextarea
							v-model="classFactory.description"
							text-area-style="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
							:error="classFactory.errors.description"
							:placeholder="'Describe your class'" />
						<SofaNumberField
							v-model="classFactory.amount"
							custom-class="rounded-custom !bg-lightGray"
							placeholder="Price per month"
							:error="classFactory.errors.amount"
							border-color="border-transparent">
							<template #inner-suffix>
								<div class="flex items-center gap-1 border-l-2 border-darkLightGray px-2 py-1">
									<SofaNormalText custom-class="font-bold text-deepGray !text-xl"> ₦ </SofaNormalText>
								</div>
							</template>
						</SofaNumberField>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<SofaButton
						:bg-color="'bg-grayColor'"
						:text-color="'text-white'"
						:padding="'py-4 px-6'"
						custom-class="hidden mdlg:block"
						@click="$emit('close')">
						Cancel
					</SofaButton>
					<SofaButton
						:bg-color="'bg-primaryBlue'"
						:text-color="'text-white'"
						:padding="'py-4 px-6'"
						:disabled="!classFactory.valid"
						custom-class="w-full mdlg:w-auto">
						Save
					</SofaButton>
				</div>
			</form>
		</div>
	</SofaModal2>
</template>

<script lang="ts" setup>
import { defineEmits, watch, defineProps, PropType, onMounted, ref } from 'vue'
import {
	SofaModal2,
	SofaIcon,
	SofaHeaderText,
	SofaButton,
	SofaTextField,
	SofaTextarea,
	SofaImageLoader,
	SofaFileInput,
	SofaNormalText,
	SofaNumberField,
} from 'sofa-ui-components'
import { useCreateClass } from '@/composables/organizations/classes'
import { useAuth } from '@/composables/auth/auth'

const { id } = useAuth()

const { createClass, factory: classFactory, created } = useCreateClass(id.value)


const emit = defineEmits(['close'])



watch(created, () => {
	if (created.value) {
		emit('close')
	}
})

</script>
