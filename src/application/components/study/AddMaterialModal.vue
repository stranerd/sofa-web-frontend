<template>
	<div class="w-full flex flex-col md:gap-4 gap-1 mdlg:p-6 md:p-4">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<sofa-header-text :custom-class="'text-xl'" content="Create study material" />
		</div>

		<div
			class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-lightGray border-b px-4">
			<sofa-normal-text :custom-class="'!font-bold !text-base'"> Create study material </sofa-normal-text>
			<sofa-icon :custom-class="'h-[19px]'" :name="'circle-close'" @click="close" />
		</div>

		<div class="w-full flex flex-col gap-3 px-4 py-4">
			<sofa-icon-card
				v-for="item in studyMaterialItems"
				:key="item.title"
				:data="{ ...item, iconSize: 'h-[46px]' }"
				:custom-class="'!bg-lightGray !w-full !shadow-none'"
				@click="$router.push(item.route)">
				<template #title>
					<sofa-normal-text :custom-class="'!font-bold'">
						{{ item.title }}
					</sofa-normal-text>
				</template>
			</sofa-icon-card>
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
		icon: 'pink-question',
		route: '/quiz/create',
	},
	{
		title: 'Create a course',
		subTitle: 'Develop and publish a series of educational material on a particular subject',
		icon: 'orange-list',
		route: '/course/create',
	},
]
</script>
