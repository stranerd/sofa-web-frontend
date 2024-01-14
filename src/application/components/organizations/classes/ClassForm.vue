<template>
	<form class="flex flex-col gap-8" @submit.prevent="submit">
		<div class="flex flex-col mdlg:flex-row items-start gap-4">
			<div class="w-full mdlg:w-1/2">
				<div class="w-full flex flex-col justify-center">
					<sofa-image-loader
						:custom-class="`w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain`"
						:photo-url="factory.photo?.link ?? '/images/default.png'">
						<div
							class="absolute bottom-0 left-0 p-3 flex w-full items-center justify-center bg-black bg-opacity-50 rounded-custom">
							<sofa-file-input v-model="factory.photo" accept="image/*">
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
					v-model="factory.title"
					custom-class="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Name your class"
					:error="factory.errors.title"
					border-color="border-transparent" />
				<SofaTextarea
					v-model="factory.description"
					text-area-style="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
					:error="factory.errors.description"
					:placeholder="'Describe your class'" />
				<SofaNumberField
					v-model="factory.amount"
					custom-class="rounded-custom !bg-lightGray"
					placeholder="Price per month"
					:error="factory.errors.amount"
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
				:padding="'py-3 px-6'"
				custom-class="hidden mdlg:block"
				@click="cancel">
				Cancel
			</SofaButton>
			<SofaButton
				:bg-color="'bg-primaryBlue'"
				type="submit"
				:text-color="'text-white'"
				:padding="'py-3 px-6'"
				:disabled="!factory.valid"
				custom-class="w-full mdlg:w-auto">
				Save
			</SofaButton>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { ClassFactory } from '@modules/organizations'

defineProps<{
	factory: ClassFactory
	submit: () => void
	cancel: () => void
}>()
</script>
