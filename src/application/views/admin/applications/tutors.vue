<template>
	<AdminLayout title="Tutors">
		<div class="header flex justify-between items-center p-4">
			<div>
				<SofaHeaderText content="Tutor applications" />
			</div>
			<div>
				<form class="py-1">
					<SofaInput placeholder="Search" class="!py-2">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
			</div>
			<div class="flex items-center">
				<div class="mx-2">1-10 of 50</div>
				<SofaIcon class="h-[15px] text-grayColor" name="arrow-left-round" />
				<div class="border-r h-4 mx-2"></div>
				<SofaIcon class="h-[15px]" name="arrow-right-round" />
			</div>
		</div>
		<SofaTable
			:fields="fields"
			:data="data"
			headClass="text-left border-b-[##F1F6FA] border-t-[##F1F6FA] border text-grayColor"
			:rowClass="(item, index) => ((index + 1) % 2 !== 0 ? 'bg-[#F1F6FA]' : '')" />
		<div class="bottom p-4 flex justify-between items-center w-full">
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
const fields = [
	{ id: 'teacher', key: 'teacher', label: 'Teacher' },
	{ id: 'applied', key: 'applied', label: 'Applied' },
	{ id: 'action', key: 'action', label: 'Action', hide: false },
]

const data = [{ teacher: 'Ayomide Adekunle', applied: 'May 21', action: 'Reject' }]
</script>

<style scoped></style>
