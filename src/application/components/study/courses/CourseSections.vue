<template>
	<div v-if="list" class="w-full flex gap-2 overflow-x-auto scrollbar-hide">
		<template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
			<template v-for="(listItem, itemIndex) in section.items" :key="itemIndex">
				<a
					:id="getItemId(listItem)"
					class="rounded-custom p-3 flex flex-col gap-1 border border-grayColor bg-white text-bodyBlack shrink-0"
					:class="{ '!bg-primaryPurple !border-primaryPurple !text-white': isItemSelected(listItem) }"
					@click="onClickItem(listItem)">
					<SofaNormalText color="text-current">{{ section.label }} - {{ listItem.title }}</SofaNormalText>

					<span class="w-full flex items-center gap-2">
						<SofaIcon :name="listItem.icon" class="h-[15px] fill-current" />
						<SofaNormalText color="text-current" :content="listItem.info" class="capitalize" />
					</span>
				</a>
			</template>
		</template>
	</div>
	<VueDraggable
		v-else
		:modelValue="factory?.factories ?? []"
		:disabled="!factory"
		class="flex flex-col gap-4"
		handle=".sectionHandle"
		group="sections"
		@update:modelValue="
			(values) => {
				if (factory) factory.factories = values
			}
		">
		<div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="flex flex-col gap-4">
			<div class="flex items-center gap-2 justify-between">
				<SofaCustomInput
					v-if="factory && editedLabelSections.has(sectionIndex)"
					v-model="factory.factories[sectionIndex].label"
					class="grow !px-0"
					:autoFocus="true"
					placeholder="Section label"
					@onBlur="closeLabelSection(sectionIndex)"
					@onEnter="closeLabelSection(sectionIndex)" />
				<SofaHeaderText v-else size="base" class="grow truncate">{{ section.label }}</SofaHeaderText>
				<SofaIcon
					v-if="factory"
					class="h-[16px] fill-grayColor"
					name="edit"
					@click.stop.prevent="toggleLabelSection(sectionIndex)" />
				<SofaIcon v-if="factory" class="h-[16px] fill-grayColor" name="trash" @click.stop.prevent="factory.delete(sectionIndex)" />
				<SofaIcon v-if="factory" class="h-[20px] sectionHandle fill-grayColor" name="reorder" />
				<SofaIcon
					class="h-[8px]"
					name="chevron-down"
					:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
					@click.stop.prevent="toggleSection(sectionIndex)" />
			</div>
			<VueDraggable
				v-if="expandedSections.has(sectionIndex)"
				:modelValue="factory?.factories[sectionIndex].items ?? []"
				:disabled="!factory"
				class="flex flex-col gap-2"
				handle=".itemHandle"
				:group="`sectionItems-${sectionIndex}`"
				@update:modelValue="
					(values) => {
						if (factory && factory.factories[sectionIndex]) factory.factories[sectionIndex].items = values
					}
				">
				<a
					v-for="(listItem, itemIndex) in section.items"
					:id="getItemId(listItem)"
					:key="itemIndex"
					class="flex items-center gap-2 p-2"
					:class="{ 'bg-lightBlue rounded-lg py-2': isItemSelected(listItem) }"
					@click="onClickItem(listItem)">
					<SofaIcon :name="listItem.icon" class="h-[16px] fill-deepGray" />
					<SofaNormalText color="text-deepGray" :content="listItem.title" class="truncate flex-1" />
					<SofaIcon v-if="factory" class="h-[16px] fill-grayColor" name="trash" @click.stop.prevent="removeItem(listItem)" />
					<SofaIcon v-if="factory" class="h-[20px] itemHandle fill-grayColor" name="reorder" />
				</a>
				<a
					v-if="factory"
					class="flex items-center gap-2 p-2 text-primaryPurple"
					@click.stop.prevent="addStudyMaterial(sectionIndex)">
					<SofaIcon name="add" class="h-[16px] fill-current" />
					<SofaNormalText color="text-current" content="Add study material" />
				</a>
				<div v-if="factory && sectionIndex < factory.factories.length - 1" class="h-0.5 w-full bg-lightGray" />
			</VueDraggable>
		</div>
		<a v-if="factory" class="flex items-center gap-2 px-2 text-primaryPink" @click.stop.prevent="factory.add()">
			<SofaIcon name="add" class="h-[16px] fill-current" />
			<SofaNormalText color="text-current" content="Add section" />
		</a>
	</VueDraggable>
</template>

<script lang="ts" setup>
import { ref, watch, watchEffect } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useModals } from '@app/composables/core/modals'
import { useDeleteFile } from '@app/composables/study/files'
import { Coursable, CourseSectionsFactory, ExtendedCourseSectionItem, ExtendedCourseSections } from '@modules/study'

const props = defineProps<{
	list?: boolean
	factory?: CourseSectionsFactory
	sections: ExtendedCourseSections
}>()

const selectedItem = defineModel<ExtendedCourseSectionItem | null>('selectedItem', { default: null })

const { deleteFile } = useDeleteFile()

const addStudyMaterial = (index: number) => {
	if (!props.factory?.factories.at(index)) return
	useModals().study.selectStudyMaterial.open({
		onSelected: (selected) => {
			if ('file' in selected) props.factory?.factories[index].addFile(selected.file)
			else props.factory?.factories[index].addQuiz(selected.quiz, selected.mode)
		},
	})
}

const expandedSections = ref(new Set<number>([0]))
const editedLabelSections = ref(new Set<number>([]))
function toggleSection(index: number) {
	if (expandedSections.value.has(index)) expandedSections.value.delete(index)
	else expandedSections.value.add(index)
}
function toggleLabelSection(index: number) {
	if (editedLabelSections.value.has(index)) editedLabelSections.value.delete(index)
	else editedLabelSections.value.add(index)
}
function closeLabelSection(index: number) {
	if (editedLabelSections.value.has(index)) editedLabelSections.value.delete(index)
}

const getItemId = (item: ExtendedCourseSectionItem) => `course-section-item-${item.type}-${item.id}-${item.sectionIndex}-${item.itemIndex}`

const isItemSelected = (item: ExtendedCourseSectionItem) =>
	selectedItem.value?.id === item.id &&
	selectedItem.value?.sectionIndex === item.sectionIndex &&
	selectedItem.value?.itemIndex === item.itemIndex

const removeItem = async (item: ExtendedCourseSectionItem) => {
	selectedItem.value = null
	props.factory?.factories[item.sectionIndex].removeItem(item.itemIndex)
	if (item.type === Coursable.file) await deleteFile(item.file)
}

const onClickItem = (item: ExtendedCourseSectionItem) => {
	selectedItem.value = item
}

watchEffect(() => {
	if (!$screen.desktop) return
	if (!selectedItem.value && props.sections.at(0)?.items.at(0)) onClickItem(props.sections[0].items[0])
})

watch(
	selectedItem,
	() => {
		if (!selectedItem.value) return
		const id = getItemId(selectedItem.value)
		setTimeout(() => {
			document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
		}, 250)
	},
	{ deep: true, immediate: true },
)
</script>
