<template>
	<AdminLayout title="Quizzes">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Quizzes" class="px-4 w-[60%]" size="mid" />
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
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'title',
							key: 'title',
							label: 'Course',
							headerClass: 'w-[60%]',
						},
						{
							id: 'author',
							key: 'd.user.bio.publicName',
							label: 'Author',
							class: 'text-grayColor',
							headerClass: 'w-[20%]',
						},
						{
							id: 'created',
							key: (d) => $utils.formatTime(d.createdAt),
							label: 'Created',
							class: 'text-grayColor',
							headerClass: 'w-[20%]',
						},
					]"
					:data="currentlyViewing"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-title="{ data }">
						<span class="flex items-center gap-2">
							<SofaImageLoader :photoUrl="data.picture" class="w-[2.5rem]" aspect="1/1" />
							<span>{{ data.title }}</span>
						</span>
					</template>
					<template #data-author="{ data }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="data.user.bio.photo?.link" :size="$screen.desktop ? 40 : 28" />
							<span>{{ data.user.bio.publicName }}</span>
						</span>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
import { useQuizzesList } from '@app/composables/study/quizzes-list'

const { currentlyViewing, limitText, next, previous, canNext, canPrev } = useQuizzesList()
</script>
