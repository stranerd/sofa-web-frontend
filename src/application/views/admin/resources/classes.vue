<template>
	<AdminLayout title="Classes">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Classes" class="px-4 w-[60%]" />
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
							id: 'class',
							key: 'd.title',
							label: 'Class',
							class: 'w-[40%]',
						},
						{
							id: 'author',
							key: 'd.user.bio.publicName',
							label: 'Author',
							class: 'text-grayColor w-[20%]',
						},
						{
							id: 'created',
							key: (d) => $utils.formatTime(d.createdAt),
							label: 'Created',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: 'd.id', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-class="{ data }">
						<span class="flex items-center gap-2">
							<SofaImageLoader :photoUrl="data.picture" aspect="1/1" />
							<span>{{ data.title }}</span>
						</span>
					</template>
					<template #data-author="{ data }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="data.user.bio.photo" :size="$screen.desktop ? 40 : 28" />
							<span>{{ data.user.bio.publicName }}</span>
						</span>
					</template>
					<template #data-action="{ data }">
						<div class="flex items-center justify-between gap-6">
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1" @click="deleteClass(data)">
								Delete
							</SofaButton>
							<SofaButton
								bgColor="bg-none"
								textColor="text-primaryBlue"
								padding="py-1"
								@click="useUpdateClass(data.organizationId, data).updateClass()">
								Edit
							</SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useClassesList, useDeleteClass, useUpdateClass } from '@app/composables/organizations/classes'
const { deleteClass } = useDeleteClass()
const { currentlyViewing, currentViewingIndex, limit, total, next, previous, canNext, canPrev } = useClassesList()
</script>
