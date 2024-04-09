<template>
	<form class="flex flex-col gap-8" @submit.prevent="submit">
		<div class="flex flex-col mdlg:flex-row items-start gap-4">
			<div class="w-full mdlg:w-1/2">
				<div class="w-full flex flex-col justify-center">
					<SofaImageLoader class="w-full bg-grayColor rounded-custom" :photoUrl="factory.photo?.link ?? '/images/default.svg'">
						<div
							class="absolute bottom-0 left-0 p-3 flex w-full items-center justify-center bg-black bg-opacity-50 rounded-custom">
							<SofaFileInput v-model="factory.photo" accept="image/*">
								<div class="w-full flex items-center justify-center gap-3">
									<SofaIcon class="h-[18px]" name="camera-white" />
									<SofaNormalText content="Add cover photo" color="text-white" />
								</div>
							</SofaFileInput>
						</div>
					</SofaImageLoader>
				</div>
			</div>
			<div class="w-full mdlg:w-1/2 flex flex-col gap-4">
				<SofaTextField
					v-model="factory.title"
					customClass="rounded-custom !bg-lightGray"
					type="text"
					placeholder="Name your class (e.g JAMB Class)"
					:error="factory.errors.title"
					borderColor="border-transparent" />
				<SofaTextarea
					v-model="factory.description"
					textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
					:error="factory.errors.description"
					placeholder="Describe your class" />
				<SofaTextField
					v-model="factory.amount"
					type="number"
					customClass="rounded-custom !bg-lightGray"
					placeholder="Price per month"
					:error="factory.errors.amount"
					borderColor="border-transparent">
					<template #inner-suffix>
						<div class="flex items-center gap-1 border-l-2 border-darkLightGray px-2 py-1">
							<SofaNormalText class="font-bold text-deepGray !text-xl">
								{{ Logic.Common.getCurrency(factory.currency) }}
							</SofaNormalText>
						</div>
					</template>
				</SofaTextField>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" customClass="hidden mdlg:block" @click="cancel">
				Cancel
			</SofaButton>
			<SofaButton
				bgColor="bg-primaryBlue"
				type="submit"
				textColor="text-white"
				padding="py-3 px-6"
				:disabled="!factory.valid"
				customClass="w-full mdlg:w-auto">
				Save
			</SofaButton>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { ClassFactory } from '@modules/organizations'
import { Logic } from 'sofa-logic'

defineProps<{
	factory: ClassFactory
	submit: () => void
	cancel: () => void
}>()
</script>
