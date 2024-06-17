<template>
	<AdminLayout title="Students">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Students" class="px-4 w-[60%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<div>1-10 of 50</div>
					<span class="flex-1" />
					<SofaIcon class="h-[20px]" name="alt-arrow-left" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="alt-arrow-right" />
				</div>
			</div>
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'teacher',
							key: '',
							label: 'Teacher',
							class: 'w-[60%]',
						},
						{
							id: 'joined',
							key: '',
							label: 'Joined',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: '', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="[]"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-action>
						<div>
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1"> Delete account </SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts"></script>

<style scoped></style>
