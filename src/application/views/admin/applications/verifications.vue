<template>
	<AdminLayout title="Verifications">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Verification applications" class="px-4 w-[40%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="w-[20%] border-l border-lightGray">
					<SofaSelect :options="[]" placeholder="All types" class="!bg-transparent !border-none" />
				</div>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<div>1-10 of 50</div>
					<span class="flex-1" />
					<SofaIcon class="h-[20px]" name="alt-arrow-left" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="alt-arrow-right" />
				</div>
			</div>
			<div class="px-1 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{ id: 'account', key: 'userId', label: 'Account', class: 'w-[40%]' },
						{ id: 'type', key: 'id', label: 'Type', class: 'text-grayColor w-[20%]' },
						{ id: 'applied', key: (d) => $utils.formatTime(d.createdAt), label: 'Applied', class: 'text-grayColor w-[20%]' },
						{ id: 'action', key: () => 'Reject', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="data"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-action>
						<div class="flex items-center justify-between">
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1">Reject</SofaButton>
							<SofaButton bgColor="bg-none" textColor="text-primaryGreen" padding="py-1">Accept</SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
			<div class="p-4 flex justify-between items-center w-full">
				<SofaText content="Bulk actions:" class="text-grayColor font-bold" />
				<div class="flex items-center">
					<SofaButton bgColor="bg-white" textColor="text-primaryRed" padding="px-4 py-1"> Reject all </SofaButton>
					<SofaButton bgColor="bg-white" textColor="text-primaryGreen" padding="px-4 py-1"> Accept all </SofaButton>
				</div>
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
		createdAt: Date.now(),
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
		createdAt: Date.now(),
		updatedAt: Date.now(),
		content: {
			courses: [],
			quizzes: [],
		},
	},
]
</script>

<style scoped></style>
