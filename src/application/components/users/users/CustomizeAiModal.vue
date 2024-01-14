<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="updateAi">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Customize AI" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Customize AI" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-8">
			<div class="w-full flex flex-col items-center gap-4 py-3">
				<SofaImageLoader
					custom-class="w-[93px] aspect-square flex items-center justify-center relative bg-grayColor border border-grayColor rounded-full"
					:photo-url="factory.photo?.link ?? UserEntity.defaultAiPhotoLink">
					<SofaIcon v-if="!factory.photo" class="h-[50px]" name="user" />
					<SofaFileInput
						v-model="factory.photo"
						class="absolute bottom-0 right-0 bg-black bg-opacity-50 rounded-full aspect-square w-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px]" name="camera-white" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaTextField
					v-model="factory.name"
					custom-class="rounded-custom !bg-lightGray"
					type="text"
					border-color="border-transparent"
					placeholder="Name"
					:error="factory.errors.name" />

				<SofaTextField
					v-model="factory.tagline"
					custom-class="rounded-custom !bg-lightGray"
					type="text"
					border-color="border-transparent"
					placeholder="Tagline"
					:error="factory.errors.tagline" />
			</div>

			<div class="w-full flex items-center justify-between">
				<SofaButton
					padding="px-5 py-2"
					bg-color="bg-white"
					text-color="text-grayColor"
					class="border border-gray-100"
					@click="close">
					Exit
				</SofaButton>

				<SofaButton padding="px-5 py-2" type="submit" :disabled="!factory.valid || loading">Save</SofaButton>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { useUserAiUpdate } from '@app/composables/users/profile'
import { UserEntity } from '@modules/users'

defineProps<{
	close: () => void
}>()

const { factory, loading, updateAi } = useUserAiUpdate()
</script>
