<template>
	<AdminLayout title="Admins">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Admins" class="px-4 w-[60%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
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
			<div class="flex justify-center items-center border-t py-4">
				<form class="py-1 w-[80%] mr-2 border-lightGray">
					<SofaInput placeholder="Enter your email" class="!py-3 !bg-lightGray !border-none" />
				</form>
				<SofaButton bgColor="bg-primaryBlue" class="py-3">Grant Admin Access</SofaButton>
			</div>
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'account',
							key: (d) => d.id,
							label: 'Account',
							class: 'w-[60%]',
						},
						{
							id: 'promoted',
							key: (d) => $utils.formatTime(d.dates.createdAt),
							label: 'Promoted',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: '', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-account="{ data }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="data.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ data.publicName }}</span>
						</span>
					</template>
					<template #data-action="{ data }">
						<div>
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" @click="handleAccept(data)">
								Revoke Access
							</SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useAdminsList, useMakeAdmin } from '@app/composables/users/users'

const { currentlyViewing, currentViewingIndex, limit, total, canPrev, canNext, previous, next } = useAdminsList()
const { handleAccept } = useMakeAdmin()
</script>

<style scoped></style>
