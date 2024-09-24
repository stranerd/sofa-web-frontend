<template>
	<VueDraggable
		v-model="factory.factories"
		:disabled="!edit"
		class="w-full flex flex-col gap-4"
		handle=".sectionHandle"
		group="curriculum">
		<div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="bg-white flex flex-col rounded-xl">
			<div class="border-b-2 border-lightGray flex items-center gap-2 justify-between p-4">
				<SofaCustomInput
					v-if="edit && editedLabelSections.has(sectionIndex)"
					v-model="factory.factories[sectionIndex].label"
					class="grow !px-0"
					:autoFocus="true"
					placeholder="Section label"
					@onBlur="closeLabelSection(sectionIndex)"
					@onEnter="closeLabelSection(sectionIndex)" />
				<SofaHeading v-else class="grow" :content="section.label" />
				<SofaIcon v-if="edit" class="h-[16px] fill-grayColor" name="edit" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
				<SofaIcon v-if="edit" class="h-[20px] sectionHandle fill-grayColor" name="reorder" />
				<SofaIcon v-if="edit" class="h-[16px] fill-grayColor" name="trash" @click.stop.prevent="factory.delete(sectionIndex)" />
				<SofaIcon
					class="h-[8px]"
					name="chevron-down"
					:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
					@click.stop.prevent="toggleSection(sectionIndex)" />
			</div>
			<VueDraggable
				v-if="expandedSections.has(sectionIndex)"
				v-model="factory.factories[sectionIndex].items"
				class="grid grid-cols-1"
				:class="view === CurriculumView.grid ? 'md:grid-cols-2 mdlg:grid-cols-4' : ''"
				:disabled="!edit"
				handle=".itemHandle"
				:group="`sectionItems-${sectionIndex}`">
				<a
					v-for="(item, itemIndex) in section.items"
					:key="itemIndex"
					class="flex flex-col gap-2 p-4 border-b-2 border-lightGray"
					:class="view === CurriculumView.grid ? 'md:border-none' : ''"
					@click="onClickItem(item)">
					<SofaImageLoader v-if="view === CurriculumView.grid" :photoUrl="item.image" class="w-full aspect-video rounded" />
					<div class="flex items-center gap-3 w-full">
						<div
							class="size-[40px] mdlg:size-[44px] rounded flex items-center justify-center"
							:style="`background-color: ${item.color};`">
							<SofaIcon :name="item.icon" class="fill-white w-[20px]" />
						</div>
						<div class="flex flex-col flex-1">
							<SofaText :content="item.title" clamp />
							<SofaText :content="item.info" size="sub" class="capitalize text-grayColor" />
						</div>
					</div>
				</a>
			</VueDraggable>
			<a
				v-if="edit && expandedSections.has(sectionIndex)"
				class="flex items-center gap-2 p-4 text-primaryPink"
				@click.stop.prevent="addStudyMaterial(sectionIndex)">
				<SofaIcon name="add" class="h-[16px] fill-current" />
				<SofaText content="Add study material" />
			</a>
		</div>
		<div v-if="edit" class="flex flex-col mdlg:px-4">
			<SofaButton color="purple" padding="px-6 py-3" class="flex items-center gap-2" @click="factory.add()">
				<SofaIcon name="add" class="h-[16px] fill-current" />
				<span>Add section</span>
			</SofaButton>
		</div>
	</VueDraggable>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useModals } from '@app/composables/core/modals'
import { useCourseSections } from '@app/composables/study/courses'
import { useDeleteFile } from '@app/composables/study/files'
import { ClassEntity, ClassLesson, CurriculumView, LessonCurriculumFactory } from '@modules/organizations'
import { Coursable, ExtendedCourseSectionItem } from '@modules/study'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		lesson: ClassLesson
		view: CurriculumView
		curriculum: ClassLesson['curriculum']
		factory?: LessonCurriculumFactory
		onClick?: (item: ExtendedCourseSectionItem) => void
	}>(),
	{
		factory: undefined,
		onClick: undefined,
	},
)

const { sections } = useCourseSections(computed(() => props.curriculum))
const { deleteFile } = useDeleteFile()

const edit = computed(() => !!props.factory)
const factory = computed(() => {
	if (props.factory) return props.factory
	const f = new LessonCurriculumFactory()
	f.loadEntity(props.curriculum)
	return f
})

const addStudyMaterial = (index: number) => {
	if (!props.factory || !props.factory.factories.at(index)) return
	useModals().study.selectStudyMaterial.open({
		onSelected: (selected) => {
			if ('file' in selected) props.factory!.factories[index].addFile(selected.file)
			else props.factory!.factories[index].addQuiz(selected.quiz, selected.mode)
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

const removeItem = async (item: ExtendedCourseSectionItem) => {
	if (!props.factory || !props.factory.factories.at(item.sectionIndex)) return
	const fac = props.factory.factories[item.sectionIndex]
	if (item.type === Coursable.file)
		await deleteFile(item.file).then((deleted) => {
			if (deleted) fac.removeItem(item.itemIndex)
		})
	else fac.removeItem(item.itemIndex)
}
removeItem

const onClickItem = (item: ExtendedCourseSectionItem) => {
	props.onClick?.(item)
}
</script>
