<template>
	<AdminLayout title="Quizzes">
		<div class="flex flex-col bg-white rounded-2xl">
			<div class="flex justify-between items-center py-1">
				<SofaHeading content="Quizzes" class="px-4 w-[60%]" />
				<form class="py-1 w-[20%] border-l border-lightGray">
					<SofaInput placeholder="Search" class="!py-2 !bg-transparent !border-none">
						<template #prefix>
							<SofaIcon class="h-[15px]" name="search" />
						</template>
					</SofaInput>
				</form>
				<div class="flex items-center w-[20%] border-l border-lightGray px-4 gap-2">
					<div>1-10 of 50</div>
					<span class="flex-1" />
					<SofaIcon class="h-[20px]" name="alt-arrow-left" />
					<div class="w-1 h-4 bg-lightGray" />
					<SofaIcon class="h-[20px]" name="alt-arrow-right" />
				</div>
			</div>
			<div class="px-1 py-2 flex flex-col border-y border-lightGray">
				<SofaTable
					:fields="[
						{
							id: 'quiz',
							key: '',
							label: 'Quiz',
							class: 'w-[40%]',
						},
						{
							id: 'author',
							key: '',
							label: 'Author',
							class: 'text-grayColor w-[20%]',
						},
						{
							id: 'created',
							key: '',
							label: 'Created',
							class: 'text-grayColor w-[20%]',
						},
						{ id: 'action', key: '', label: 'Action', class: 'text-grayColor w-[20%]' },
					]"
					:data="[]"
					headClass="text-left text-grayColor"
					:rowClass="(_, index) => (index % 2 == 0 ? 'bg-lightGray' : '')">
					<template #data-quiz>
						<!-- <span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="user.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ user.publicName }}</span>
						</span> -->
					</template>
					<template #data-author>
						<!-- <span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="user.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ user.publicName }}</span>
						</span> -->
					</template>
					<template #data-action>
						<div class="flex items-center justify-between gap-6">
							<SofaButton bgColor="bg-none" textColor="text-primaryRed" padding="py-1"> Delete </SofaButton>
							<SofaButton bgColor="bg-none" textColor="text-primaryBlue" padding="py-1"> Edit </SofaButton>
						</div>
					</template>
				</SofaTable>
			</div>
		</div>
	</AdminLayout>
</template>

<script setup lang="ts">
// import { useGetQuizList } from '@app/composables/study/quizzes'
// const {} = useGetQuizList()
</script>
