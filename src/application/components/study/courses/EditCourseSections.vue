<template>
	<Draggable v-model="factory.factories" class="w-full flex flex-col p-4" handle=".sectionHandle" itemKey="" group="sections">
		<template #item="{ index: sectionIndex }">
			<div v-if="sections[sectionIndex]">
				<div class="flex items-center gap-2 justify-between">
					<SofaCustomInput
						v-if="editedLabelSections.has(sectionIndex)"
						v-model="factory.factories[sectionIndex].label"
						customClass="w-full cursor-text !bg-white !px-0"
						:autoFocus="true"
						placeholder="Section label"
						@onBlur="closeLabelSection(sectionIndex)"
						@onEnter="closeLabelSection(sectionIndex)" />
					<SofaHeaderText v-else size="base">{{ sections[sectionIndex].label }}</SofaHeaderText>
					<span class="flex-1" />
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
					class="gap-4 flex flex-col"
					:list="factory.factories[sectionIndex].items"
					itemKey=""
					handle=".itemHandle"
					:group="`sectionItems-${sectionIndex}`">
					<template #item="{ index: itemIndex }">
						<a
							v-if="sections[sectionIndex].items[itemIndex]"
							class="flex items-center gap-2"
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
						<a class="flex items-center gap-2" @click.stop.prevent="addStudyMaterial(sectionIndex)">
							<SofaIcon name="box-add" class="h-[16px] fill-primaryPurple" />
							<SofaNormalText color="text-primaryPink" content="Add study material" />
						</a>
						<div class="h-1 w-full bg-lightGray my-4" />
					</template>
				</Draggable>
			</div>
		</template>
		<template #footer>
			<a class="flex items-center gap-2" @click.stop.prevent="factory.add()">
				<SofaIcon name="box-add" class="h-[16px] fill-primaryPink" />
				<SofaNormalText color="text-primaryPink" content="Add section" />
			</a>
		</template>
	</Draggable>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable'
import { Coursable, CourseEntity, ExtendedCourseSectionItem, FileType } from '@modules/study'
import { useUpdateSections } from '@app/composables/study/courses'
import { useModals } from '@app/composables/core/modals'
import { useDeleteFile } from '@app/composables/study/files'

const props = defineProps<{
	course: CourseEntity
}>()

const selectedItem = defineModel<ExtendedCourseSectionItem>()

const { deleteFile } = useDeleteFile()
const { factory, extendedSections: sections } = useUpdateSections(computed(() => props.course))

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
	if (factory.factories.at(sectionIndex)) return
	const fac = factory.factories[sectionIndex]
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (!item) return
	if (item.type === Coursable.file)
		await deleteFile(item.file).then((deleted) => {
			if (deleted) factory.factories[sectionIndex].removeItem(itemIndex)
		})
	else fac.removeItem(itemIndex)
}

const onClickItem = (sectionIndex: number, itemIndex: number) => {
	selectedItem.value = sections.value.at(sectionIndex)?.items.at(itemIndex)
}
</script>
