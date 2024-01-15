<template>
	<div class="flex flex-col md:gap-5 gap-3 relative mdlg:p-6 items-center">
		<SofaHeaderText class="hidden mdlg:inline-block text-xl" :content="`Join ${org.orgName}`" />

		<div class="w-full flex justify-between items-center mdlg:hidden py-2 border-lightGray border-b px-4">
			<SofaNormalText class="!font-bold !text-base" :content="`Join ${org.orgName}`" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-5 mdlg:px-0 px-4">
			<SofaTextField
				v-model="joinCode"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Enter Join Code"
				borderColor="border-transparent" />
		</div>

		<div class="w-full flex justify-between items-center md:gap-0 gap-3 mdlg:p-0 p-4">
			<SofaButton
				textColor="text-grayColor"
				bgColor="bg-white"
				padding="px-4 py-1"
				class="hidden md:inline-block border-2 border-gray-100 md:w-auto w-full"
				@click="close">
				Cancel
			</SofaButton>

			<SofaButton
				textColor="text-white"
				bgColor="bg-primaryBlue"
				padding="px-4 md:py-1 py-3"
				class="border-2 border-transparent md:w-auto w-full"
				@click="requestToJoinOrganization(org.id).then((succeeded) => (succeeded ? close() : null))">
				Continue
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useMyOrganizations } from '@app/composables/users/organizations'
import { UserEntity } from '@modules/users'

defineProps<{
	close: () => void
	org: UserEntity
}>()

const { code: joinCode, requestToJoinOrganization } = useMyOrganizations()
</script>
