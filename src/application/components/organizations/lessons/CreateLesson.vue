<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Create a lesson" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<form class="flex flex-col gap-8" @submit.prevent>
			<SofaTextarea textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none" placeholder="Enter subject name" />
			<SofaSelect
				customClass="rounded-custom !bg-lightGray col-span-1"
				placeholder="Assign a teacher"
				borderColor="border-transparent"
				:options="[{ key: null, value: 'Adedeji' }]" />
			<div class="flex items-center justify-between">
				<SofaButton
					bgColor="bg-grayColor"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="hidden mdlg:block"
					@click="close">
					Cancel
				</SofaButton>
				<SofaButton
					bgColor="bg-primaryBlue"
					type="submit"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="w-full mdlg:w-auto">
					Save
				</SofaButton>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	organizationId: string
	classId: string
	userId: string
	close: () => void
}>()
</script>
