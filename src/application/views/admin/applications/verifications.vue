<template>
	<AdminLayout title="Verifications">
		<div class="header flex justify-between items-center h-[50px]">
			<div class="w-[40%] border-r h-full flex items-center">
				<SofaHeaderText content="Verification applications" class="px-4" />
			</div>
			<div class="w-[20%] border-r h-full">
				<form class="py-1">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
			</div>
			<div class="w-[20%] border-r h-full">
				<SofaSelect :options="[]" placeholder="All types" class="!bg-transparent !border-none" />
			</div>
			<div class="flex items-center justify-start w-[20%]">
				<div class="mx-2">1-10 of 50</div>
				<SofaIcon class="h-[20px] text-grayColor" name="alt-arrow-left" />
				<div class="border-r h-4 mx-2"></div>
				<SofaIcon class="h-[20px]" name="alt-arrow-right" />
			</div>
		</div>
		<SofaTable
			:fields="[
				{ id: 'account', key: 'userId', label: 'Account', class: 'w-[40%]' },
				{ id: 'type', key: 'id', label: 'Type', class: 'text-grayColor text-[10px] w-[20%]' },
				{ id: 'applied', key: 'createdAt', label: 'Applied', class: 'text-grayColor text-[10px] w-[20%]' },
				{ id: 'action', key: () => 'Reject', label: 'Action', class: 'text-grayColor w-[20%]' },
			]"
			:data="data"
			headClass="text-left border-t border-b text-grayColor"
			:rowClass="(item, index) => ((index + 1) % 2 !== 0 ? 'bg-[#F1F6FA]' : '')">
			<template #data-action>
				<div class="flex items-center justify-between">
					<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" class="!font-semibold">Reject</SofaButton>
					<SofaButton bgColor="bg-none" textColor="text-primaryGreen" padding="py-1" class="!font-semibold">Accept</SofaButton>
				</div>
			</template>
		</SofaTable>
		<div class="p-4 flex justify-between items-center w-full">
			<SofaText content="Bulk actions:" class="text-grayColor font-bold" />
			<div class="flex items-center">
				<SofaButton bgColor="bg-white" textColor="text-deepGray" padding="px-4 py-1" class="!font-semibold text-primaryRed">
					Reject all
				</SofaButton>
				<SofaButton bgColor="bg-white" textColor="text-deepGray" padding="px-4 py-1" class="!font-semibold text-primaryGreen">
					Accept all
				</SofaButton>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { VerificationFromModel } from '@modules/users/data/models/verifications'

const data: VerificationFromModel[] = [
	{
		id: '1',
		userId: '2768379',
		pending: false,
		accepted: null,
		createdAt: Number($utils.formatDateAsDigits(new Date())),
		updatedAt: Date.now(),
		content: {
			courses: [],
			quizzes: [],
		},
	},
	{
		id: '2',
		userId: '4567',
		pending: false,
		accepted: null,
		createdAt: Number($utils.formatDateAsDigits(new Date())),
		updatedAt: Date.now(),
		content: {
			courses: [],
			quizzes: [],
		},
	},
]
</script>

<style scoped></style>
