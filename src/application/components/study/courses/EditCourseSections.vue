<template>
	<Draggable v-model="factory.factories" class="flex flex-col gap-4" handle=".sectionHandle" itemKey="" group="sections">
		<template #item="{ index: sectionIndex }">
			<div v-if="sections[sectionIndex]" class="flex flex-col gap-4">
				<div class="flex items-center gap-2 justify-between">
					<SofaCustomInput
						v-if="editedLabelSections.has(sectionIndex)"
						v-model="factory.factories[sectionIndex].label"
						class="grow !px-0"
						:autoFocus="true"
						placeholder="Section label"
						@onBlur="closeLabelSection(sectionIndex)"
						@onEnter="closeLabelSection(sectionIndex)" />
					<SofaHeaderText v-else size="base" class="grow truncate">{{ sections[sectionIndex].label }}</SofaHeaderText>
					<SofaIcon class="h-[16px]" name="edit-gray" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
					<SofaIcon class="h-[16px]" name="trash-gray" @click.stop.prevent="factory.delete(sectionIndex)" />
					<SofaIcon class="h-[20px] sectionHandle" name="reorder-gray" />
					<SofaIcon
						class="h-[8px]"
						name="chevron-down"
						:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
						@click.stop.prevent="toggleSection(sectionIndex)" />
				</div>
				<Draggable
					v-if="expandedSections.has(sectionIndex)"
					class="flex flex-col gap-4"
					:list="factory.factories[sectionIndex].items"
					itemKey=""
					handle=".itemHandle"
					:group="`sectionItems-${sectionIndex}`">
					<template #item="{ index: itemIndex }">
						<a
							v-if="sections[sectionIndex].items[itemIndex]"
							class="flex items-center gap-2 px-2"
							:class="{ 'bg-lightBlue rounded-lg py-2': selectedItem?.id === sections[sectionIndex].items[itemIndex].id }"
							@click="onClickItem(sectionIndex, itemIndex)">
							<SofaIcon :name="getItemIcon(sections[sectionIndex].items[itemIndex])" class="h-[16px]" />
							<SofaNormalText
								color="text-deepGray"
								:content="getItemTitle(sections[sectionIndex].items[itemIndex])"
								class="truncate flex-1" />
							<SofaIcon class="h-[16px]" name="trash-gray" @click.stop.prevent="removeItem(sectionIndex, itemIndex)" />
							<SofaIcon class="h-[20px] itemHandle" name="reorder-gray" />
						</a>
					</template>
					<template #footer>
						<a class="flex items-center gap-2 px-2 text-primaryPurple" @click.stop.prevent="addStudyMaterial(sectionIndex)">
							<SofaIcon name="box-add" class="h-[16px] fill-current" />
							<SofaNormalText color="text-current" content="Add study material" />
						</a>
						<div class="h-1 w-full bg-lightGray" />
					</template>
				</Draggable>
			</div>
		</template>
		<template #footer>
			<a class="flex items-center gap-2 px-2 text-primaryPink" @click.stop.prevent="factory.add()">
				<SofaIcon name="box-add" class="h-[16px] fill-current" />
				<SofaNormalText color="text-current" content="Add section" />
			</a>
		</template>
	</Draggable>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import { useModals } from '@app/composables/core/modals'
import { useUpdateSections } from '@app/composables/study/courses'
import { Coursable, CourseEntity, ExtendedCourseSectionItem, FileType } from '@modules/study'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	course: CourseEntity
}>()

const emits = defineEmits<{
	deleteItem: [ExtendedCourseSectionItem]
}>()

const selectedItem = defineModel<ExtendedCourseSectionItem>()

const { factory, extendedSections: sections, updateSections } = useUpdateSections(computed(() => props.course))

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

const getItemTitle = (item: ExtendedCourseSectionItem) => {
	if (item.type == Coursable.quiz) return item.quiz.title
	if (item.type == Coursable.file) return item.file.title
}

const getItemIcon = (item: ExtendedCourseSectionItem) => {
	if (item.type === Coursable.quiz) return 'quiz'
	if (item.type === Coursable.file) {
		if (item.fileType === FileType.document) return 'file'
		if (item.fileType === FileType.image) return 'image-course'
		if (item.fileType === FileType.video) return 'video-course'
	}
	return 'file'
}

const removeItem = async (sectionIndex: number, itemIndex: number) => {
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (!item) return
	emits('deleteItem', item)
}

const onClickItem = (sectionIndex: number, itemIndex: number) => {
	selectedItem.value = sections.value.at(sectionIndex)?.items.at(itemIndex)
}

watch(
	() => factory.factories,
	async () => {
		if (factory.valid && factory.hasChanges) Logic.Common.debounce('updateSections', updateSections, 1000)
	},
	{ deep: true, immediate: true },
)
</script>
