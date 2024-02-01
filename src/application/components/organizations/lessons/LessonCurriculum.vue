<template>
	<div class="w-full flex flex-col gap-4">
		<div
			v-for="(section, sectionIndex) in curriculum"
			:key="sectionIndex"
			:class="isModal ? '' : 'bg-white rounded-custom p-4 mdlg:p-0 mdlg:bg-transparent mdlg:rounded-none'">
			<div class="flex items-center justify-between">
				<div v-if="factory" class="flex items-center gap-2">
					<SofaCustomInput
						v-if="editedLabelSections.has(sectionIndex)"
						v-model="factory.factories[sectionIndex].label"
						customClass="lg:text-sm mdlg:text-[12px] text-xs w-full cursor-text !bg-white"
						:autoFocus="true"
						placeholder="Section label"
						@onBlur="closeLabelSection(sectionIndex)"
						@onEnter="closeLabelSection(sectionIndex)" />
					<SofaHeaderText v-else>{{ section.label }}</SofaHeaderText>
					<SofaIcon v-if="canEdit" class="h-[16px]" name="edit-gray" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
					<SofaIcon
						class="h-[8px]"
						name="chevron-down"
						:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
						@click="toggleSection(sectionIndex)" />
				</div>
			</div>
			<div
				v-if="expandedSections.has(sectionIndex)"
				class="gap-4 my-5 grid grid-cols-1"
				:class="view === CurriculumView.grid ? 'sm:grid-cols-2 md:grid-cols-3 mdlg:grid-cols-2 lg:grid-cols-3' : ''">
				<div
					v-for="(item, itemIndex) in section.items"
					:key="itemIndex"
					class="flex gap-2 mdlg:gap-4"
					:class="view === CurriculumView.grid ? 'flex-col' : 'flex-col mdlg:flex-row mdlg:items-center'">
					<div class="flex items-center gap-2 flex-1">
						<SofaIcon :name="getItemIcon(item)" class="h-[16px]" />
						<SofaNormalText color="text-deepGray" :content="getItemTitle(item)" class="truncate" />
						<SofaBadge v-if="showLiveBadgeForItem(item)" class="flex-shrink-0"> LIVE </SofaBadge>
					</div>
					<div v-if="view === CurriculumView.grid">
						<SofaImageLoader
							v-if="item.type !== ClassLessonable.schedule || !item.schedule.isOngoing"
							:photoUrl="getItemImagePlaceholder(item)"
							customClass="!h-[100px] w-full mdlg:!w-[200px] mdlg:!h-[115px] bg-grayColor rounded-custom">
						</SofaImageLoader>
						<div
							v-else
							class="!h-[100px] w-full mdlg:!h-[115px] mdlg:!w-[200px] rounded-custom bg-primaryRed flex items-center justify-center">
							<SofaHeaderText content="LIVE" customClass="!uppercase !text-white" />
						</div>
					</div>
					<div class="flex items-center gap-2 shrink-0">
						<div class="flex items-center gap-1">
							<SofaIcon v-if="view === CurriculumView.grid" class="h-[16px] fill-grayColor" name="info" />
							<SofaNormalText color="text-grayColor" :content="getItemInfo(item)" class="!capitalize" />
						</div>
						<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
						<SofaIcon v-if="canEdit" class="h-[16px]" name="trash-gray" @click="removeItem(sectionIndex, itemIndex, item)" />
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
import { formatNumber } from 'valleyed'
import { useModals } from '@app/composables/core/modals'
import { useLessonCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson, ClassLessonable, CurriculumView, LessonCurriculumFactory } from '@modules/organizations'
import { FileType } from '@modules/study'
import { formatTime } from '@utils/dates'
import { useDeleteFile } from '@app/composables/study/files'
import { useDeleteSchedule } from '@app/composables/organizations/schedules'

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
const { deleteFile } = useDeleteFile()
const { deleteSchedule } = useDeleteSchedule()

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
	if (item.type == ClassLessonable.quiz) return `${item.quizMode} - ${formatNumber(item.quiz.questions.length)} questions`
	if (item.type == ClassLessonable.file) return `${item.fileType}`
	if (item.type == ClassLessonable.schedule) return `${formatTime(item.schedule.time.start)} - ${formatTime(item.schedule.time.end)}`
}

const getItemImagePlaceholder = (item: ExtendedCurriculumItem) => {
	if (item.type === ClassLessonable.quiz) return item.quiz.photo?.link ?? '/images/default.png'
	if (item.type === ClassLessonable.file) return item.file.photo?.link ?? '/images/default.png'
	return '/images/default.png'
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

const removeItem = async (sectionIndex: number, itemIndex: number, item: ExtendedCurriculumItem) => {
	if (!props.factory || !props.factory.factories.at(sectionIndex)) return
	const fac = props.factory.factories[sectionIndex]
	if (item.type === ClassLessonable.file)
		await deleteFile(item.file).then((deleted) => {
			if (deleted) props.factory!.factories[sectionIndex].removeItem(itemIndex)
		})
	else if (item.type === ClassLessonable.schedule)
		await deleteSchedule(item.schedule).then((deleted) => {
			if (deleted) props.factory!.factories[sectionIndex].removeItem(itemIndex)
		})
	else fac.removeItem(itemIndex)
}
</script>
