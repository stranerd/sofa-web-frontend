<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="updateAi">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="title" content="Customize AI" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaHeading content="Customize AI" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-8">
			<div class="w-full flex flex-col items-center gap-4 py-3">
				<SofaImageLoader
					class="size-[93px] bg-grayColor rounded-full"
					:photoUrl="factory.photo?.link ?? UserEntity.defaultAiPhotoLink">
					<SofaIcon v-if="!factory.photo" class="h-[50px]" name="user" />
					<SofaFileInput
						v-model="factory.photo"
						class="absolute bottom-0 right-0 bg-black bg-opacity-50 rounded-full aspect-square w-[40px] flex items-center justify-center"
						accept="image/*">
						<SofaIcon class="h-[18px] fill-white" name="camera" />
					</SofaFileInput>
				</SofaImageLoader>

				<SofaInput v-model="factory.name" type="text" placeholder="Name" :error="factory.errors.name" />

				<SofaInput v-model="factory.tagline" type="text" placeholder="Tagline" :error="factory.errors.tagline" />
			</div>

			<div class="w-full flex items-center justify-between">
				<SofaButton padding="px-5 py-2" bgColor="bg-white" textColor="text-grayColor" class="border border-gray-100" @click="close">
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
