<template>
	<div class="w-full flex flex-col md:gap-4 gap-1 mdlg:p-6 md:p-4">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="title" content="Create study material" />
		</div>

		<div
			class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
			<SofaHeading> Create study material </SofaHeading>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-3 px-4 py-4">
			<SofaIconCard
				v-for="item in studyMaterialItems"
				:key="item.title"
				:data="{ ...item, iconSize: 'h-[46px]' }"
				class="!bg-lightGray !w-full !shadow-none"
				@click="$router.push(item.route)">
				<template #title>
					<SofaHeading>
						{{ item.title }}
					</SofaHeading>
				</template>
			</SofaIconCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	close: () => void
}>()

const studyMaterialItems = [
	{
		title: 'Create a quiz',
		subTitle: 'Build a customized quiz with different question types and study modes',
		icon: 'pink-question' as const,
		route: '/study/quizzes/create',
	},
	{
		title: 'Create a course',
		subTitle: 'Develop and publish a series of educational material on a particular subject',
		icon: 'orange-list' as const,
		route: '/study/courses/create',
	},
]
</script>
