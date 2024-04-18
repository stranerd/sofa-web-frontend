<template>
	<div v-if="list" class="w-full flex gap-2 overflow-x-auto scrollbar-hide">
		<template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
			<template v-for="(listItem, itemIndex) in section.items" :key="itemIndex">
				<a
					:id="getItemId(listItem)"
					class="rounded-custom p-3 flex flex-col gap-1 border border-grayColor bg-white text-bodyBlack shrink-0"
					:class="{ '!bg-primaryPurple !border-primaryPurple !text-white': item?.id === listItem.id }"
					@click="onClickItem(sectionIndex, itemIndex)">
					<SofaNormalText color="text-current">{{ section.label }} - {{ getItemTitle(listItem) }}</SofaNormalText>

					<span class="w-full flex items-center gap-2">
						<SofaIcon :name="getItemIcon(listItem)" class="h-[15px] fill-current" />
						<SofaNormalText color="text-current" :content="getItemInfo(listItem)" class="capitalize" />
					</span>
				</a>
			</template>
		</template>
	</div>
	<Draggable
		v-else
		v-model="factory.factories"
		:disabled="!edit"
		class="flex flex-col gap-4"
		handle=".sectionHandle"
		itemKey=""
		group="sections">
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
					<SofaIcon v-if="edit" class="h-[16px]" name="edit-gray" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
					<SofaIcon v-if="edit" class="h-[16px]" name="trash-gray" @click.stop.prevent="factory.delete(sectionIndex)" />
					<SofaIcon v-if="edit" class="h-[20px] sectionHandle" name="reorder-gray" />
					<SofaIcon
						class="h-[8px]"
						name="chevron-down"
						:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
						@click.stop.prevent="toggleSection(sectionIndex)" />
				</div>
				<Draggable
					v-if="expandedSections.has(sectionIndex)"
					:disabled="!edit"
					class="flex flex-col gap-2"
					:list="factory.factories[sectionIndex].items"
					itemKey=""
					handle=".itemHandle"
					:group="`sectionItems-${sectionIndex}`">
					<template #item="{ index: itemIndex }">
						<a
							v-if="sections[sectionIndex].items[itemIndex]"
							:id="getItemId(sections[sectionIndex].items[itemIndex])"
							class="flex items-center gap-2 p-2"
							:class="{ 'bg-lightBlue rounded-lg py-2': item?.id === sections[sectionIndex].items[itemIndex].id }"
							@click="onClickItem(sectionIndex, itemIndex)">
							<SofaIcon :name="getItemIcon(sections[sectionIndex].items[itemIndex])" class="h-[16px] fill-deepGray" />
							<SofaNormalText
								color="text-deepGray"
								:content="getItemTitle(sections[sectionIndex].items[itemIndex])"
								class="truncate flex-1" />
							<SofaIcon
								v-if="edit"
								class="h-[16px]"
								name="trash-gray"
								@click.stop.prevent="removeItem(sectionIndex, itemIndex)" />
							<SofaIcon v-if="edit" class="h-[20px] itemHandle" name="reorder-gray" />
						</a>
					</template>
					<template #footer>
						<a
							v-if="edit"
							class="flex items-center gap-2 p-2 text-primaryPurple"
							@click.stop.prevent="addStudyMaterial(sectionIndex)">
							<SofaIcon name="box-add" class="h-[16px] fill-current" />
							<SofaNormalText color="text-current" content="Add study material" />
						</a>
						<div v-if="sectionIndex < factory.factories.length - 1" class="h-0.5 w-full bg-lightGray" />
					</template>
				</Draggable>
			</div>
		</template>
		<template #footer>
			<a v-if="edit" class="flex items-center gap-2 px-2 text-primaryPink" @click.stop.prevent="factory.add()">
				<SofaIcon name="box-add" class="h-[16px] fill-current" />
				<SofaNormalText color="text-current" content="Add section" />
			</a>
		</template>
	</Draggable>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from 'vue'
import Draggable from 'vuedraggable'
import { useModals } from '@app/composables/core/modals'
import { useUpdateSections } from '@app/composables/study/courses'
import { useDeleteFile } from '@app/composables/study/files'
import { Coursable, CourseEntity, ExtendedCourseSectionItem, FileType } from '@modules/study'
import { Logic } from 'sofa-logic'

const props = defineProps<{
	course: CourseEntity
	edit?: boolean
	item?: ExtendedCourseSectionItem
	list?: boolean
}>()

const emits = defineEmits<{
	selectItem: [ExtendedCourseSectionItem]
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

const getItemTitle = (item: ExtendedCourseSectionItem) => {
	if (item.type == Coursable.quiz) return item.quiz.title
	if (item.type == Coursable.file) return item.file.title
	return ''
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

const getItemInfo = (item: ExtendedCourseSectionItem) => {
	if (item.type == Coursable.quiz) return `${item.quizMode} - ${Logic.Common.formatNumber(item.quiz.questions.length)} questions`
	if (item.type == Coursable.file) return `${item.fileType}`
	return ''
}

const getItemId = (item: ExtendedCourseSectionItem) => `course-section-item-${item.type}-${item.id}`

const removeItem = async (sectionIndex: number, itemIndex: number) => {
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (!item) return
	factory.factories[sectionIndex].removeItem(itemIndex)
	if (item.type === Coursable.file) await deleteFile(item.file)
}

const onClickItem = (sectionIndex: number, itemIndex: number) => {
	const item = sections.value.at(sectionIndex)?.items.at(itemIndex)
	if (item) emits('selectItem', item)
}

watchEffect(() => {
	if (!Logic.Screen.desktop) return
	if (!props.item && sections.value.at(0)?.items.at(0)) onClickItem(0, 0)
})

watch(
	() => factory.factories,
	async () => {
		if (!props.edit) return
		if (factory.valid && factory.hasChanges) Logic.Common.debounce('updateSections', updateSections, 1000)
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
