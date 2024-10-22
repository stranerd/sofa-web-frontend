<template>
	<AdminLayout title="Tutors">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Tutor applications" class="px-4 w-[60%]" size="mid" />
				<form class="w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
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
							id: 'name',
							key: 'user.publicName',
							label: 'Teacher',
							headerClass: 'w-[60%]',
							onClick: (_, index) => handleClick(index),
						},
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.tutorRequest.createdAt),
							label: 'Applied',
							class: 'text-grayColor',
							headerClass: 'w-[20%]',
						},
						{ id: 'action', key: 'tutorRequest.id', label: 'Action', class: 'text-grayColor w-[20%]', headerClass: 'w-[20%]' },
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-name="{ data: { user } }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="user.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ user.publicName }}</span>
						</span>
					</template>
					<template #data-action="{ data: { tutorRequest } }">
						<div v-if="tutorRequest.pending" class="flex items-center justify-between gap-6">
							<SofaButton color="white" class="!text-primaryRed" padding="py-1" @click="handleReject(tutorRequest)">
								Reject
							</SofaButton>
							<SofaButton color="white" class="!text-primaryGreen" padding="py-1" @click="handleAccept(tutorRequest)">
								Accept
							</SofaButton>
						</div>
						<div v-else />
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useModals } from '@app/composables/core/modals'
import { useAcceptTutorRequest, useTutorRequestsList } from '@app/composables/users/tutorRequests'

const { currentlyViewing, mapped, currentViewingIndex, limit, limitText, canPrev, canNext, previous, next } = useTutorRequestsList()
const { handleAccept, handleReject } = useAcceptTutorRequest()

const handleClick = (selectedIndex: number) => {
	useModals().users.tutorRequest.open({
		data: mapped.value,
		selectedIndex: currentViewingIndex.value * limit + selectedIndex,
	})
}
</script>
