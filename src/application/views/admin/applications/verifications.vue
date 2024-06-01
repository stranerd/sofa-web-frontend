<template>
	<AdminLayout title="Verifications">
		<div class="header flex justify-between items-center p-4">
			<div class="w-[40%]">
				<SofaHeaderText content="Verification applications" />
			</div>
			<div class="w-[20%]">
				<form class="py-1">
					<SofaInput placeholder="Search" class="!py-2">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
			</div>
			<div class="w-[20%]">
				<SofaSelect :options="[]" place />
			</div>
			<div class="flex items-center justify-end w-[20%]">
				<div class="mx-2">1-10 of 50</div>
				<SofaIcon class="h-[15px] text-grayColor" name="arrow-left-round" />
				<div class="border-r h-4 mx-2"></div>
				<SofaIcon class="h-[15px]" name="arrow-right-round" />
			</div>
		</div>
		<SofaTable
			:fields="[
				{ id: 'account', key: 'userId', label: 'Account', class: 'w-[40%]' },
				{ id: 'type', key: 'id', label: 'Type', class: 'text-grayColor text-[10px] w-[20%]' },
				{ id: 'applied', key: 'createdAt', label: 'Applied', class: 'text-grayColor text-[10px] w-[20%]' },
				{ id: 'action', key: () => 'Reject', label: 'Action', hide: false, class: 'text-grayColor w-[20%]' },
			]"
			:data="data"
			headClass="text-left border-b-[##F1F6FA] border-t-[##F1F6FA] border text-grayColor"
			:rowClass="(item, index) => ((index + 1) % 2 !== 0 ? 'bg-[#F1F6FA]' : '')">
			<template #data-action>
				<div class="flex items-center justify-between">
					<SofaButton bgColor="bg-none" textColor="text-deepGray" padding="py-1" class="!font-semibold text-primaryRed"
					>Reject</SofaButton
					>
					<SofaButton bgColor="bg-none" textColor="text-deepGray" padding="py-1" class="!font-semibold text-primaryGreen"
					>Accept</SofaButton
					>
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
		createdAt: $utils.formatDateAsDigits(new Date()),
		updatedAt: Date.now(),
		content: {
			courses: [],
			quizzes: [],
		},
	},
]
</script>

<style scoped></style>
