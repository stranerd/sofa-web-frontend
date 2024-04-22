<template>
	<div v-if="list" class="w-full flex gap-2 overflow-x-auto scrollbar-hide">
		<template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
			<template v-for="(listItem, itemIndex) in section.items" :key="itemIndex">
				<a
					:id="getItemId(listItem)"
					class="rounded-custom p-3 flex flex-col gap-1 border border-grayColor bg-white text-bodyBlack shrink-0"
					:class="{ '!bg-primaryPurple !border-primaryPurple !text-white': item?.id === listItem.id }"
					@click="onClickItem(sectionIndex, itemIndex)">
					<SofaNormalText color="text-current">{{ section.label }} - {{ listItem.title }}</SofaNormalText>

					<span class="w-full flex items-center gap-2">
						<SofaIcon :name="listItem.icon" class="h-[15px] fill-current" />
						<SofaNormalText color="text-current" :content="listItem.info" class="capitalize" />
					</span>
				</a>
			</template>
		</template>
	</div>
	<VueDraggable v-else v-model="factory.factories" :disabled="!edit" class="flex flex-col gap-4" handle=".sectionHandle" group="sections">
		<div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="flex flex-col gap-4">
			<div class="flex items-center gap-2 justify-between">
				<SofaCustomInput
					v-if="editedLabelSections.has(sectionIndex)"
					v-model="factory.factories[sectionIndex].label"
					class="grow !px-0"
					:autoFocus="true"
					placeholder="Section label"
					@onBlur="closeLabelSection(sectionIndex)"
					@onEnter="closeLabelSection(sectionIndex)" />
				<SofaHeaderText v-else size="base" class="grow truncate">{{ section.label }}</SofaHeaderText>
				<SofaIcon v-if="edit" class="h-[16px]" name="edit-gray" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
				<SofaIcon v-if="edit" class="h-[16px]" name="trash-gray" @click.stop.prevent="factory.delete(sectionIndex)" />
				<SofaIcon v-if="edit" class="h-[20px] sectionHandle" name="reorder-gray" />
				<SofaIcon
					class="h-[8px]"
					name="chevron-down"
					:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
					@click.stop.prevent="toggleSection(sectionIndex)" />
			</div>
			<VueDraggable
				v-if="expandedSections.has(sectionIndex)"
				v-model="factory.factories[sectionIndex].items"
				:disabled="!edit"
				class="flex flex-col gap-2"
				handle=".itemHandle"
				:group="`sectionItems-${sectionIndex}`">
				<a
					v-for="(listItem, itemIndex) in section.items"
					:id="getItemId(listItem)"
					:key="itemIndex"
					class="flex items-center gap-2 p-2"
					:class="{ 'bg-lightBlue rounded-lg py-2': item?.id === listItem.id }"
					@click="onClickItem(sectionIndex, itemIndex)">
					<SofaIcon :name="listItem.icon" class="h-[16px] fill-deepGray" />
					<SofaNormalText color="text-deepGray" :content="listItem.title" class="truncate flex-1" />
					<SofaIcon v-if="edit" class="h-[16px]" name="trash-gray" @click.stop.prevent="removeItem(sectionIndex, itemIndex)" />
					<SofaIcon v-if="edit" class="h-[20px] itemHandle" name="reorder-gray" />
				</a>
				<a v-if="edit" class="flex items-center gap-2 p-2 text-primaryPurple" @click.stop.prevent="addStudyMaterial(sectionIndex)">
					<SofaIcon name="box-add" class="h-[16px] fill-current" />
					<SofaNormalText color="text-current" content="Add study material" />
				</a>
				<div v-if="sectionIndex < factory.factories.length - 1" class="h-0.5 w-full bg-lightGray" />
			</VueDraggable>
		</div>
		<a v-if="edit" class="flex items-center gap-2 px-2 text-primaryPink" @click.stop.prevent="factory.add()">
			<SofaIcon name="box-add" class="h-[16px] fill-current" />
			<SofaNormalText color="text-current" content="Add section" />
		</a>
	</VueDraggable>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useModals } from '@app/composables/core/modals'
import { useUpdateSections } from '@app/composables/study/courses'
import { useDeleteFile } from '@app/composables/study/files'
import { Coursable, CourseEntity, ExtendedCourseSectionItem } from '@modules/study'

const props = defineProps<{
	course: CourseEntity
	edit?: boolean
	item?: ExtendedCourseSectionItem
	list?: boolean
}>()

const emits = defineEmits<{
	selectItem: [ExtendedCourseSectionItem | undefined]
}>()

const { factory, extendedSections: sections, updateSections } = useUpdateSections(computed(() => props.course))

const { deleteFile } = useDeleteFile()

const addStudyMaterial = (index: number) => {
	if (!factory.factories.at(index)) return
	useModals().study.selectStudyMaterial.open({
		onSelected: (selected) => {
			if ('file' in selected) factory.factories[index].addFile(selected.file)
			else factory.factories[index].addQuiz(selected.quiz, selected.mode)
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

const getItemId = (item: ExtendedCourseSectionItem) => `course-section-item-${item.type}-${item.id}`

const removeItem = async (sectionIndex: number, itemIndex: number) => {
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (!item) return
	emits('selectItem', undefined)
	factory.factories[sectionIndex].removeItem(itemIndex)
	if (item.type === Coursable.file) await deleteFile(item.file)
}

const onClickItem = (sectionIndex: number, itemIndex: number) => {
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (item) emits('selectItem', item)
}

watchEffect(() => {
	if (!$screen.desktop) return
	if (!props.item && sections.value.at(0)?.items.at(0)) onClickItem(0, 0)
})

watch(
	() => factory.factories,
	async () => {
		if (!props.edit) return
		if (factory.valid && factory.hasChanges) $utils.debounce('updateSections', updateSections, 500)
	},
	{ deep: true, immediate: true },
)

watch(
	() => props.item,
	() => {
		if (!props.item) return
		const id = getItemId(props.item)
		setTimeout(() => {
			document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
		}, 250)
	},
	{ deep: true, immediate: true },
)
</script>
