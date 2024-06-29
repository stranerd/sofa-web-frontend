<template>
	<AdminLayout title="Students">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center">
				<SofaHeading content="Students" class="px-4 w-[60%]" size="mid" />
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
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'student',
							key: (d) => d.id,
							label: 'Student',
							headerClass: 'w-[80%]',
						},
						{
							id: 'joined',
							key: (d) => $utils.formatTime(d.dates.createdAt),
							label: 'Joined',
							class: 'text-grayColor',
							headerClass: 'w-[20%]',
						},
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-student="{ data }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="data.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ data.publicName }}</span>
						</span>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useUserTypeList } from '@app/composables/users/users'
import { UserType } from '@modules/users'

const { currentlyViewing, limitText, canPrev, canNext, previous, next } = useUserTypeList(UserType.student)
</script>
