<template>
	<div class="flex flex-col gap-6">
		<div v-if="selectedOptions.length" class="flex flex-col gap-3">
			<div class="flex items-center gap-2 justify-between">
				<SofaHeading class="!font-bold">Applied filters</SofaHeading>
				<SofaText content="Clear all" class="text-primaryPink" as="a" @click="selectedOptions.length = 0" />
			</div>

			<div class="flex gap-3 flex-wrap items-center">
				<span
					v-for="option in selectedOptions"
					:key="option.id"
					class="px-4 py-2 bg-primaryPurple rounded-custom flex items-center justify-center gap-1">
					<SofaText class="text-white" :content="option.name" />
					<SofaIcon class="h-[18px] fill-white" name="circle-close" c @click="toggleOption(option)" />
				</span>
			</div>
		</div>

		<div v-for="option in searchOptions" :key="option.icon" class="w-full flex flex-col gap-3">
			<a class="flex items-center justify-between" @click="openOption = option.name === openOption ? '' : option.name">
				<div class="flex items-center gap-2">
					<SofaIcon class="h-[16px]" :name="option.icon" />
					<SofaText bold :content="option.name" />
				</div>
				<SofaIcon class="h-[7px]" name="chevron-down" :class="{ 'rotate-180': option.name === openOption }" />
			</a>

			<div v-if="option.name === openOption" class="w-full flex flex-wrap gap-3">
				<SofaText
					v-for="item in option.options"
					:key="item.id"
					:content="item.name"
					:class="optionIsSelected(item.id) ? 'bg-primaryPurple text-white' : 'bg-lightGray text-deepGray'"
					as="a"
					class="px-4 py-2 rounded-custom flex items-center justify-center gap-1 capitalize"
					@click="toggleOption(item)" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { topics } = useTopicsList()
const { tags } = useGenericTagsList()

const selectedOptions = defineModel<SelectedOption[]>({ default: [] })

const searchOptions = computed<{ name: string; options: SelectedOption[]; icon: IconName }[]>(
	() =>
		[
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
				icon: 'price-filter',
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
				icon: 'rating-filter',
			},
			{
				name: 'Author',
				options: [UserType.student, UserType.teacher, UserType.organization].map((option) => ({
					name: option,
					type: 'author',
					id: option,
					query: {
						field: 'user.type.type',
						value: option,
					},
				})),
				icon: 'author-filter',
			},
			{
				name: 'Topic',
				options: topics.slice(0, 25).map((tag) => ({
					name: tag.title,
					id: tag.id,
					type: 'topic',
					query: {
						field: 'topicId',
						value: tag.id,
					},
				})),
				icon: 'subject-filter',
			},
			{
				name: 'Popular tags',
				options: tags.slice(0, 25).map((tag) => ({
					name: tag.title,
					id: tag.id,
					type: 'tags',
					query: {
						field: 'tagIds',
						value: tag.id,
						condition: Conditions.in,
					},
				})),
				icon: 'tag-filter',
			},
		] as const,
)

const openOption = ref(searchOptions.value.at(0)?.name)

const optionIsSelected = (id: string) => !!selectedOptions.value.find((item) => item.id == id)

const toggleOption = (option: SelectedOption) => {
	const currentOptions = selectedOptions.value
	if (optionIsSelected(option.id)) {
		const itemIndex = currentOptions.indexOf(option)
		if (itemIndex > -1) currentOptions.splice(itemIndex, 1)
	} else {
		const typeIndex = currentOptions.findIndex((o) => o.type === option.type)
		if (typeIndex > -1) currentOptions.splice(typeIndex, 1, option)
		else currentOptions.push(option)
	}
	selectedOptions.value = currentOptions
}
</script>

<script lang="ts">
import { computed, ref } from 'vue'
import { useGenericTagsList, useTopicsList } from '@app/composables/interactions/tags'
import { Conditions, QueryParams } from '@modules/core'
import { UserType } from '@modules/users'

export type SelectedOption = {
	name: string
	id: string
	type: 'price' | 'ratings' | 'user' | 'topic' | 'author' | 'tags'
	query: Readonly<Exclude<QueryParams['where'], undefined>[number]>
}
</script>
