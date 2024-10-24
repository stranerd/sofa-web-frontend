<template>
	<AdminLayout title="Admins">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Admins" class="px-4 w-[60%]" size="mid" />
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
					<SofaIcon class="h-[20px]" name="alt-arrow-left" :class="{ 'fill-grayColor': !canPrev }" @click="previous" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="alt-arrow-right" :class="{ 'fill-grayColor': !canNext }" @click="next" />
				</div>
			</div>
			<form class="flex items-center border-y border-lightGray p-4 gap-4" @submit.prevent="submit">
				<SofaInput v-model="searchValue" placeholder="Enter account email" class="flex-grow" />
				<SofaButton type="submit" class="py-3">Grant Admin Access</SofaButton>
			</form>
			<div class="px-1 py-2 flex flex-col">
				<SofaTable
					:fields="[
						{
							id: 'account',
							key: (d) => d.id,
							label: 'Account',
							headerClass: 'w-[75%]',
						},
						{
							id: 'joined',
							key: (d) => $utils.formatTime(d.dates.createdAt),
							label: 'Joined',
							class: 'text-grayColor',
							headerClass: 'w-[15%]',
						},
						{ id: 'action', key: '', label: 'Action', headerClass: 'w-[10%]' },
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
						<SofaButton color="white" class="!text-primaryRed" padding="py-1" @click="updateRole(data)">
							Revoke Access
						</SofaButton>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useToggleRoles } from '@app/composables/auth/roles'
import { useAdminsList, useSearchUsersByEmail } from '@app/composables/users/users'
import { AuthRoles } from '@modules/auth'

const { currentlyViewing, limitText, canPrev, canNext, previous, next } = useAdminsList()
const { updateRole } = useToggleRoles(AuthRoles.isAdmin)

const { searchUsersByEmails, searchValue } = useSearchUsersByEmail()

const submit = async () => {
	const users = await searchUsersByEmails(searchValue.value)
	if (users?.at(0)) await updateRole(users[0])
	searchValue.value = ''
}
</script>
