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
						{
							id: 'account',
							key: (d) => d.verification.userId,
							label: 'Account',
							class: 'w-[40%]',
							onClick: (_, index) => handleClick(index),
						},
						{ id: 'type', key: (d) => d.verification.id, label: 'Type', class: 'text-grayColor w-[20%]' },
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.verification.createdAt),
							label: 'Applied',
							class: 'text-grayColor w-[20%]',
						},
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
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
import { UserEntity, VerificationEntity } from '@modules/users'

const data: { verification: VerificationEntity; user: UserEntity }[] = [
	{
		verification: new VerificationEntity({
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
		}),
		user: new UserEntity({} as any),
	},
]

const handleClick = (selectedIndex: number) => {
	useModals().users.verification.open({ data, selectedIndex })
}
</script>
