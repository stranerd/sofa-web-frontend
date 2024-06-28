<template>
	<AdminLayout title="Admins">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Admins" class="px-4 w-[60%]" size="mid" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<SofaText :content="limitText" />
					<span class="flex-1" />
					<SofaIcon
						class="h-[20px]"
						name="alt-arrow-left"
						:class="{ 'fill-grayColor': !canPrev }"
						@click="canPrev ? previous() : undefined" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon
						class="h-[20px]"
						name="alt-arrow-right"
						:class="{ 'fill-grayColor': !canNext }"
						@click="canNext ? next() : undefined" />
				</div>
			</div>
			<form class="flex items-center border-y border-lightGray p-4 gap-4">
				<SofaInput placeholder="Enter your email" class="flex-grow" />
				<SofaButton bgColor="bg-primaryBlue" type="submit" class="py-3">Grant Admin Access</SofaButton>
			</form>
			<div class="px-1 py-2 flex flex-col">
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
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" @click="updateRole(data)">
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
import { useToggleRoles } from '@app/composables/auth/roles'
import { useAdminsList } from '@app/composables/users/users'
import { AuthRoles } from '@modules/auth'

const { currentlyViewing, limitText, canPrev, canNext, previous, next } = useAdminsList()
const { updateRole } = useToggleRoles(AuthRoles.isAdmin)
</script>
