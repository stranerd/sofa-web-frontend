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
					<div>{{ currentViewingIndex * limit + 1 }} -{{ limit }} of {{ total }}</div>
					<span class="flex-1" />
					<SofaIcon
						class="h-[20px]"
						name="alt-arrow-left"
						:class="{ 'fill-grayColor': canPrev }"
						@click="canPrev ? previous : undefined" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon
						class="h-[20px]"
						name="alt-arrow-right"
						:class="{ 'fill-grayColor': canNext }"
						@click="canNext ? next : undefined" />
				</div>
			</div>
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'account',
							key: (d) => d.verification.id,
							label: 'Account',
							class: 'w-[40%]',
							onClick: (_, index) => handleClick(index),
						},
						{ id: 'type', key: (d) => d.user.type?.type, label: 'Type', class: 'text-grayColor w-[20%]' },
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.verification.createdAt),
							label: 'Applied',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: 'verification.id', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-account="{ data: { user } }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="user.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ user.publicName }}</span>
						</span>
					</template>
					<template #data-action="{ data: { verification } }">
						<div class="flex items-center justify-between">
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" @click="handleReject(verification.id)"
							>Reject</SofaButton
							>
							<SofaButton
								bgColor="bg-none"
								textColor="text-primaryGreen"
								padding="py-1"
								@click="handleAccept(verification.id)"
							>Accept</SofaButton
							>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
import { usePendingVerificationRequest, useAcceptRejectVerificationRequest } from '@app/composables/users/verifications'

const { currentlyViewing, verificationRequests, currentViewingIndex, limit, total, canPrev, canNext, previous, next } =
	usePendingVerificationRequest()

const handleClick = (selectedIndex: number) => {
	useModals().users.verification.open({
		data: verificationRequests.value,
		selectedIndex: currentViewingIndex.value * limit + selectedIndex,
	})
}

const { handleReject, handleAccept } = useAcceptRejectVerificationRequest()
</script>
