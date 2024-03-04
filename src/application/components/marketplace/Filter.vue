<template>
	<div class="w-full flex flex-col gap-6">
		<div v-if="selectedOptions.length" class="w-full flex flex-col gap-3 px-4">
			<div class="w-full flex items-center gap-2 justify-between">
				<SofaNormalText customClass="!font-bold">Applied filters</SofaNormalText>
				<SofaNormalText
					content="Clear all"
					color="text-primaryPink"
					customClass="cursor-pointer"
					@click="selectedOptions.length = 0" />
			</div>

			<div class="flex gap-3 flex-wrap items-center">
				<div v-for="option in selectedOptions" :key="option.id" class="w-auto pb-2">
					<span class="px-4 py-2 bg-primaryPurple rounded-custom flex flex-row items-center justify-center gap-1">
						<SofaNormalText color="text-white" :content="option.name" />
						<SofaIcon customClass="h-[18px] cursor-pointer" name="close-white" @click="toggleOption(option)" />
					</span>
				</div>
			</div>
		</div>

		<div v-for="option in searchOptions" :key="option.icon" class="w-full flex flex-col gap-3 px-4">
			<a class="w-full flex items-center justify-between" @click="openOption = option.name === openOption ? '' : option.name">
				<div class="flex items-center gap-2">
					<SofaIcon customClass="h-[16px]" :name="option.icon" />
					<SofaNormalText customClass="!font-bold" :content="option.name" />
				</div>
				<SofaIcon customClass="h-[7px]" :name="option.name === openOption ? 'chevron-up' : 'chevron-down'" />
			</a>

			<div v-if="option.name === openOption" class="w-full flex flex-wrap gap-3">
				<a
					v-for="(item, i) in option.options"
					:key="i"
					:class="optionIsSelected(item.id) ? 'bg-primaryPurple' : 'bg-lightGray'"
					class="px-4 py-2 rounded-custom flex items-center justify-center gap-1"
					@click="toggleOption(item)">
					<SofaNormalText :color="optionIsSelected(item.id) ? 'text-white' : 'text-deepGray'" :content="item.name" />
				</a>
			</div>
		</div>

		<div class="h-[60px]"></div>
	</div>
	<div class="w-full flex flex-col bg-white mdlg:!hidden p-4 bottom-0 fixed left-0" @click.prevent="close?.()">
		<SofaButton customClass="w-full" padding="py-3">Show results</SofaButton>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		close?: () => void
	}>(),
	{
		close: undefined,
	},
)

const AllTopics = ref(Logic.Study.AllTopics)
const AllOtherTags = ref(Logic.Study.AllOtherTags)

const model = defineModel<SelectedOption[]>({ default: [] })
const selectedOptions = reactive(model.value)

watch(
	selectedOptions,
	(value) => {
		model.value = value
	},
	{ immediate: true },
)

const searchOptions = computed(() => [
	{
		name: 'Price',
		options: [
			{
				name: 'Free',
				type: 'price',
				id: 'free',
				query: {
					field: 'price.amount',
					value: 0,
					condition: Conditions.eq,
				},
			},
			{
				name: 'Paid',
				type: 'price',
				id: 'paid',
				query: {
					field: 'price.amount',
					value: 0,
					condition: Conditions.gt,
				},
			},
		],
		icon: 'price-filter' as const,
	},
	{
		name: 'Ratings',
		options: [4, 3, 2, 1].map((option) => ({
			name: `${option} stars and higher`,
			type: 'ratings',
			id: option.toString(),
			query: {
				field: 'ratings.avg',
				value: option,
				condition: Conditions.gte,
			},
		})),
		icon: 'rating-filter' as const,
	},
	{
		name: 'Author',
		options: ['Student', 'Teacher', 'Organization'].map((option) => ({
			name: option,
			type: 'author',
			id: option,
			query: {
				field: 'user.type.type',
				value: option.toLowerCase(),
				condition: Conditions.eq,
			},
		})),
		icon: 'author-filter' as const,
	},
	{
		name: 'Subject',
		options:
			AllTopics.value?.results.map((tag) => ({
				name: tag.title,
				id: tag.id,
				type: 'subject',
				query: {
					field: 'topicId',
					value: tag.id,
					condition: Conditions.eq,
				},
			})) ?? [],
		icon: 'subject-filter' as const,
	},
	{
		name: 'Popular tags',
		options:
			AllOtherTags.value?.results.map((tag) => ({
				name: tag.title,
				id: tag.id,
				type: 'tags',
				query: {
					field: 'tagIds',
					value: tag.id,
					condition: Conditions.in,
				},
			})) ?? [],
		icon: 'tag-filter' as const,
	},
])

const openOption = ref(searchOptions.value[0]?.name)

const optionIsSelected = (id: string) => !!selectedOptions.find((item) => item.id == id)

const toggleOption = (option: SelectedOption) => {
	if (optionIsSelected(option.id)) {
		const itemIndex = selectedOptions.indexOf(option)
		if (itemIndex > -1) selectedOptions.splice(itemIndex, 1)
	} else {
		// check it filter item of similar type exists, it yes remove before appending
		const typeIndex = selectedOptions.findIndex((o) => o.type === option.type)
		if (typeIndex > -1) selectedOptions.splice(typeIndex, 1, option)
		else selectedOptions.push(option)
	}
}
</script>

<script lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Conditions, Logic } from 'sofa-logic'

export type SelectedOption = {
	name: string
	id: string
	type: string
	query: {
		field: string
		value: any
		condition: Conditions
	}
}
</script>
