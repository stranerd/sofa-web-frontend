<template>
	<div class="w-full flex flex-col gap-4">
		<div
			v-for="(section, sectionIndex) in curriculum"
			:key="sectionIndex"
			:class="isModal ? '' : 'bg-white rounded-custom p-4 mdlg:p-0 mdlg:bg-transparent mdlg:rounded-none'">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<SofaHeaderText>{{ section.label }}</SofaHeaderText>
					<SofaIcon v-if="canEdit" class="h-[16px]" name="edit-gray" />
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
					<SofaIcon class="h-[8px]" name="chevron-down" @click="toggleSection(sectionIndex)" />
				</div>
			</div>
			<div v-if="isSectionVisible(sectionIndex)" class="flex flex-col gap-4 my-5">
				<div
					v-for="(item, itemIndex) in section.items"
					:key="itemIndex"
					class="flex flex-col mdlg:flex-row mdlg:items-center gap-2 mdlg:gap-4">
					<div class="flex items-center gap-2 flex-1">
						<SofaIcon :name="getItemIcon(item)" class="h-[16px]" />
						<SofaNormalText color="text-deepGray" :content="getItemTitle(item)" class="truncate" />
						<SofaBadge v-if="showLiveBadgeForItem(item)" class="flex-shrink-0"> LIVE </SofaBadge>
					</div>
					<div class="flex items-center gap-2 shrink-0">
						<SofaNormalText color="text-grayColor" :content="getItemInfo(item)" />
						<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
						<SofaIcon v-if="canEdit" class="h-[16px]" name="trash-gray" />
					</div>
				</div>
				<a v-if="canEdit" class="flex items-center gap-2" @click="addSchedule(sectionIndex)">
					<SofaIcon name="box-add-white" class="h-[16px] !fill-primaryBlue" />
					<SofaNormalText color="text-primaryBlue" content="Add live schedule" />
				</a>
				<a v-if="canEdit" class="flex items-center gap-2" @click="addStudyMaterial(sectionIndex)">
					<SofaIcon name="box-add-white" class="h-[16px] !fill-primaryPink" />
					<SofaNormalText color="text-primaryPink" content="Add study material" />
				</a>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useLessonCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson, ClassLessonable, CurriculumView, LessonCurriculumFactory } from '@modules/organizations'
import { FileType } from '@modules/study'
import { formatTime } from '@utils/dates'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		view: CurriculumView
		curriculum: ClassLesson['curriculum']
		isModal?: boolean
		factory?: LessonCurriculumFactory
	}>(),
	{
		isModal: false,
		factory: undefined,
	},
)

const { curriculum } = useLessonCurriculum(
	props.classInst,
	computed(() => props.curriculum),
)

const canEdit = computed(() => props.factory !== undefined)

type ExtendedCurriculumItem = (typeof curriculum)['value'][number]['items'][number]

const getItemTitle = (item: ExtendedCurriculumItem) => {
	if (item.type == ClassLessonable.quiz) return item.quiz.title
	if (item.type == ClassLessonable.file) return item.file.title
	if (item.type == ClassLessonable.schedule) return item.schedule.title
}

const getItemIcon = (item: ExtendedCurriculumItem) => {
	if (item.type === ClassLessonable.quiz) return 'quiz'
	if (item.type === ClassLessonable.schedule) return 'translation'
	if (item.type === ClassLessonable.file) {
		if (item.fileType === FileType.document) return 'file'
		if (item.fileType === FileType.image) return 'image-course'
		if (item.fileType === FileType.video) return 'video-course'
	}
	return 'translation'
}

const getItemInfo = (item: ExtendedCurriculumItem) => {
	if (item.type == ClassLessonable.quiz) return `${item.quizMode} . ${item.quiz.questions.length} questions`
	if (item.type == ClassLessonable.file) return `${item.fileType}`
	if (item.type == ClassLessonable.schedule) return `${formatTime(item.schedule.time.start)} - ${formatTime(item.schedule.time.end)}`
}

const showLiveBadgeForItem = (item: ExtendedCurriculumItem) => item.type === ClassLessonable.schedule && item.schedule.isOngoing

const addSchedule = (index: number) => {
	if (!props.factory || !props.factory.factories.at(index)) return
	useModals().organizations.createSchedule.open({
		classInst: props.classInst,
		lesson: props.classInst.lessons[index],
		afterSubmit: (schedule) => {
			props.factory!.factories[index].addSchedule(schedule)
		},
	})
}

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
function toggleSection(index: number): void {
	if (expandedSections.value.has(index)) {
		expandedSections.value.delete(index)
	} else {
		expandedSections.value.add(index)
	}
	expandedSections.value = new Set(expandedSections.value)
}
function isSectionVisible(index: number): boolean {
	return expandedSections.value.has(index)
}
</script>
