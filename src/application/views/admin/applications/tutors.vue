<template>
	<AdminLayout title="Tutors">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Tutor applications" class="px-4 w-[60%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<div>{{ currentViewingIndex * limit + 1 }}-{{ (currentViewingIndex + 1) * limit }} of {{ total }}</div>
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
							id: 'name',
							key: 'user.publicName',
							label: 'Teacher',
							headerClass: 'w-full',
							onClick: (_, index) => handleClick(index),
						},
						{
							id: 'applied',
							key: (d) => $utils.formatTime(d.tutorRequest.createdAt),
							label: 'Applied',
							class: 'text-grayColor',
						},
						{ id: 'action', key: 'tutorRequest.id', label: 'Action', class: 'text-grayColor' },
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
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" @click="handleReject(tutorRequest)">
								Reject
							</SofaButton>
							<SofaButton bgColor="bg-none" textColor="text-primaryGreen" padding="py-1" @click="handleAccept(tutorRequest)">
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
import { useAcceptTutorRequest, useTutorRequests } from '@app/composables/users/tutorRequests'

const { currentlyViewing, tutorRequests, currentViewingIndex, limit, total, canPrev, canNext, previous, next } = useTutorRequests()
const { handleAccept, handleReject } = useAcceptTutorRequest()

const handleClick = (selectedIndex: number) => {
	useModals().users.tutorRequest.open({
		data: tutorRequests.value,
		selectedIndex: currentViewingIndex.value * limit + selectedIndex,
	})
}
console.log(currentlyViewing.value)
</script>
