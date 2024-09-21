<template>
	<form class="flex flex-col gap-8" @submit.prevent="submit">
		<div class="flex flex-col mdlg:flex-row items-start gap-4">
			<div class="w-full mdlg:w-1/2">
				<div class="w-full flex flex-col justify-center">
					<SofaImageLoader class="w-full bg-grayColor rounded-custom" :photoUrl="factory.photo?.link ?? '/images/default.svg'">
						<div
							class="absolute bottom-0 left-0 p-3 flex w-full items-center justify-center bg-black text-white bg-opacity-50 rounded-custom">
							<SofaFileInput v-model="factory.photo" accept="image/*">
								<div class="w-full flex items-center justify-center gap-3">
									<SofaIcon class="h-[18px] fill-current" name="camera" />
									<SofaText content="Add cover photo" />
								</div>
							</SofaFileInput>
						</div>
					</SofaImageLoader>
				</div>
			</div>
			<div class="w-full mdlg:w-1/2 flex flex-col gap-4">
				<SofaInput v-model="factory.title" placeholder="Name your class (e.g JAMB Class)" :error="factory.errors.title" />
				<SofaTextarea
					v-model="factory.description"
					class="h-[90px] resize-none"
					:error="factory.errors.description"
					placeholder="Describe your class" />
				<SofaInput v-model="factory.amount" type="number" placeholder="Price per month" :error="factory.errors.amount">
					<template #suffix>
						<div class="flex items-center gap-1 border-l-2 border-darkLightGray px-2 py-1">
							<SofaHeading size="title">
								{{ $utils.getCurrency(factory.currency) }}
							</SofaHeading>
						</div>
					</template>
				</SofaInput>
			</div>
		</div>
		<div class="flex items-center justify-between">
			<SofaButton color="gray" padding="py-3 px-6" class="hidden mdlg:block" @click="cancel"> Cancel </SofaButton>
			<SofaButton type="submit" padding="py-3 px-6" :disabled="!factory.valid" class="w-full mdlg:w-auto"> Save </SofaButton>
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
