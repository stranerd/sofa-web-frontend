<template>
	<AdminLayout title="Verifications">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Verification applications" class="px-4 w-[40%]" size="mid" />
				<form class="w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="w-[20%] border-l border-lightGray">
					<SofaSelect :options="[]" placeholder="All types" class="!bg-transparent !border-none" />
				</div>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<SofaText :content="limitText" />
					<span class="flex-1" />
					<SofaIcon class="h-[20px]" name="chevron-left" :class="{ 'fill-grayColor': !canPrev }" @click="previous" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="chevron-right" :class="{ 'fill-grayColor': !canNext }" @click="next" />
				</div>
			</div>
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'account',
							key: (d) => d.verification.id,
							label: 'Account',
							headerClass: 'w-[40%]',
							onClick: (_, index) => handleClick(index),
						},
						{
							id: 'type',
							key: (d) => d.user.type?.type,
							label: 'Type',
							class: 'text-grayColor capitalize',
							headerClass: 'w-[20%]',
						},
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.verification.createdAt),
							label: 'Applied',
							class: 'text-grayColor',
							headerClass: 'w-[20%]',
						},
						{ id: 'action', key: 'verification.id', label: 'Action', class: 'text-grayColor', headerClass: 'w-[20%]' },
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
						<div v-if="verification.pending" class="flex items-center justify-between">
							<SofaButton color="white" class="!text-primaryRed" padding="py-1" @click="handleReject(verification)">
								Reject
							</SofaButton>
							<SofaButton color="white" class="!text-primaryGreen" padding="py-1" @click="handleAccept(verification)">
								Accept
							</SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
import { useAcceptVerificationRequest, useVerificationsList } from '@app/composables/users/verifications'

const { currentlyViewing, mapped, currentViewingIndex, limit, limitText, canPrev, canNext, previous, next } = useVerificationsList()

const handleClick = (selectedIndex: number) => {
	useModals().users.verification.open({
		data: mapped.value,
		selectedIndex: currentViewingIndex.value * limit + selectedIndex,
	})
}

const { handleReject, handleAccept } = useAcceptVerificationRequest()
</script>
