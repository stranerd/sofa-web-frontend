<template>
	<Draggable
		v-model="factory.factories"
		:disabled="!canEdit"
		class="w-full flex flex-col gap-4"
		handle=".sectionHandle"
		itemKey=""
		group="curriculum">
		<template #item="{ index: sectionIndex }">
			<div
				v-if="curriculum[sectionIndex]"
				:class="isModal ? '' : 'bg-white rounded-custom p-4 mdlg:p-0 mdlg:bg-transparent mdlg:rounded-none'">
				<div class="flex items-center gap-2 justify-between">
					<SofaCustomInput
						v-if="canEdit && editedLabelSections.has(sectionIndex)"
						v-model="factory.factories[sectionIndex].label"
						customClass="lg:text-sm mdlg:text-[12px] text-xs w-full cursor-text !bg-white !px-0"
						:autoFocus="true"
						placeholder="Section label"
						@onBlur="closeLabelSection(sectionIndex)"
						@onEnter="closeLabelSection(sectionIndex)" />
					<SofaHeaderText v-else size="base">{{ curriculum[sectionIndex].label }}</SofaHeaderText>
					<SofaIcon v-if="canEdit" class="h-[16px]" name="edit-gray" @click.stop.prevent="toggleLabelSection(sectionIndex)" />
					<span class="flex-1" />
					<SofaIcon v-if="canEdit" class="h-[20px] sectionHandle" name="reorder-gray" />
					<SofaIcon v-if="canEdit" class="h-[16px]" name="trash-gray" @click.stop.prevent="factory.delete(sectionIndex)" />
					<SofaIcon
						class="h-[8px]"
						name="chevron-down"
						:class="{ 'rotate-180': expandedSections.has(sectionIndex) }"
						@click.stop.prevent="toggleSection(sectionIndex)" />
				</div>
				<Draggable
					v-if="expandedSections.has(sectionIndex)"
					class="gap-4 my-5 grid grid-cols-1"
					:class="view === CurriculumView.grid ? 'sm:grid-cols-2 md:grid-cols-3 mdlg:grid-cols-2 lg:grid-cols-3' : ''"
					:disabled="!canEdit"
					:list="factory.factories[sectionIndex].items"
					itemKey=""
					handle=".itemHandle"
					:group="`sectionItems-${sectionIndex}`">
					<template #item="{ index: itemIndex }">
						<a
							v-if="curriculum[sectionIndex].items[itemIndex]"
							class="flex gap-2 mdlg:gap-4"
							:class="view === CurriculumView.grid ? 'flex-col' : 'flex-col mdlg:flex-row mdlg:items-center'"
							@click="openCurriculumItem(itemIndex, sectionIndex)">
							<div class="flex items-center gap-2 flex-1">
								<SofaIcon :name="getItemIcon(curriculum[sectionIndex].items[itemIndex])" class="h-[16px]" />
								<SofaNormalText
									color="text-deepGray"
									:content="getItemTitle(curriculum[sectionIndex].items[itemIndex])"
									class="truncate" />
								<SofaBadge v-if="showLiveBadgeForItem(curriculum[sectionIndex].items[itemIndex])" class="shrink-0">
									LIVE
								</SofaBadge>
							</div>
							<div v-if="view === CurriculumView.grid">
								<SofaImageLoader
									v-if="shouldShowItemImage(curriculum[sectionIndex].items[itemIndex])"
									:photoUrl="getItemImagePlaceholder(curriculum[sectionIndex].items[itemIndex])"
									class="!h-[100px] w-full mdlg:!w-[200px] mdlg:!h-[115px] bg-grayColor rounded-custom" />
								<div
									v-else
									class="!h-[100px] w-full mdlg:!h-[115px] mdlg:!w-[200px] rounded-custom bg-primaryRed flex items-center justify-center">
									<SofaHeaderText content="LIVE" customClass="!uppercase !text-white" />
								</div>
							</div>
							<div class="flex items-center gap-2 shrink-0">
								<div class="flex items-center gap-1">
									<SofaIcon v-if="view === CurriculumView.grid" class="h-[16px] fill-grayColor" name="info" />
									<SofaNormalText
										color="text-grayColor"
										:content="getItemInfo(curriculum[sectionIndex].items[itemIndex])"
										class="!capitalize" />
								</div>
								<SofaIcon v-if="canEdit" class="h-[20px] itemHandle" name="reorder-gray" />
								<SofaIcon
									v-if="canEdit"
									class="h-[16px]"
									name="trash-gray"
									@click.stop.prevent="removeItem(sectionIndex, itemIndex)" />
							</div>
						</a>
					</template>
					<template #footer>
						<a v-if="canEdit" class="flex items-center gap-2" @click.stop.prevent="addSchedule(sectionIndex)">
							<SofaIcon name="box-add" class="h-[16px] fill-primaryBlue" />
							<SofaNormalText color="text-primaryBlue" content="Add live schedule" />
						</a>
						<a v-if="canEdit" class="flex items-center gap-2" @click.stop.prevent="addStudyMaterial(sectionIndex)">
							<SofaIcon name="box-add" class="h-[16px] fill-primaryPink" />
							<SofaNormalText color="text-primaryPink" content="Add study material" />
						</a>
					</template>
				</Draggable>
			</div>
		</template>
	</Draggable>
</template>

<script lang="ts" setup>
import { formatNumber } from 'valleyed'
import { computed, ref } from 'vue'
import Draggable from 'vuedraggable'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useLessonCurriculum } from '@app/composables/organizations/lessons'
import { useDeleteSchedule } from '@app/composables/organizations/schedules'
import { useDeleteFile } from '@app/composables/study/files'
import {
	ClassEntity,
	ClassLesson,
	ClassLessonable,
	CurriculumView,
	ExtendedClassLessonCurriculumSectionItem,
	LessonCurriculumFactory,
} from '@modules/organizations'
import { FileType } from '@modules/study'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		lesson: ClassLesson
		view: CurriculumView
		curriculum: ClassLesson['curriculum']
		isModal?: boolean
		factory?: LessonCurriculumFactory
		disableClick?: boolean
	}>(),
	{
		isModal: false,
		factory: undefined,
		lesson: undefined,
		disableClick: false,
	},
)

const { id } = useAuth()
const { curriculum } = useLessonCurriculum(
	props.classInst,
	computed(() => props.curriculum),
)
const { deleteFile } = useDeleteFile()
const { deleteSchedule } = useDeleteSchedule()

const canEdit = computed(() => props.factory !== undefined)

const factory = computed(() => {
	if (props.factory) return props.factory
	const f = new LessonCurriculumFactory()
	f.loadEntity(props.curriculum)
	return f
})

const getItemTitle = (item: ExtendedClassLessonCurriculumSectionItem) => {
	if (item.type == ClassLessonable.quiz) return item.quiz.title
	if (item.type == ClassLessonable.file) return item.file.title
	if (item.type == ClassLessonable.schedule) return item.schedule.title
}

const getItemIcon = (item: ExtendedClassLessonCurriculumSectionItem) => {
	if (item.type === ClassLessonable.quiz) return 'quiz'
	if (item.type === ClassLessonable.schedule) return 'translation'
	if (item.type === ClassLessonable.file) {
		if (item.fileType === FileType.document) return 'file'
		if (item.fileType === FileType.image) return 'image-course'
		if (item.fileType === FileType.video) return 'video-course'
	}
	return 'translation'
}

const getItemInfo = (item: ExtendedClassLessonCurriculumSectionItem) => {
	if (item.type == ClassLessonable.quiz) return `${item.quizMode} - ${formatNumber(item.quiz.questions.length)} questions`
	if (item.type == ClassLessonable.file) return `${item.fileType}`
	if (item.type == ClassLessonable.schedule) return item.schedule.timeRange
}

const shouldShowItemImage = (item: ExtendedClassLessonCurriculumSectionItem) => {
	if (item.type !== ClassLessonable.schedule) return true
	return !item.schedule.canJoin(props.classInst, id.value)
}

const getItemImagePlaceholder = (item: ExtendedClassLessonCurriculumSectionItem) => {
	if (item.type === ClassLessonable.quiz) return item.quiz.photo?.link ?? '/images/default.svg'
	if (item.type === ClassLessonable.file) return item.file.photo?.link ?? '/images/default.svg'
	return '/images/default.svg'
}

const showLiveBadgeForItem = (item: ExtendedClassLessonCurriculumSectionItem) =>
	item.type === ClassLessonable.schedule && item.schedule.canJoin(props.classInst, id.value)

const addSchedule = (index: number) => {
	if (!props.factory || !props.factory.factories.at(index) || !props.lesson) return
	useModals().organizations.createSchedule.open({
		classInst: props.classInst,
		lesson: props.lesson,
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

const removeItem = async (sectionIndex: number, itemIndex: number) => {
	if (!props.factory || !props.factory.factories.at(sectionIndex)) return
	const fac = props.factory.factories[sectionIndex]
	const item = curriculum.value.at(sectionIndex)?.items.at(itemIndex)
	if (!item) return
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
const openCurriculumItem = (itemIndex: number, sectionIndex: number) => {
	if (props.disableClick) return
	useModals().organizations.viewCurriculum.open({
		classInst: props.classInst,
		lesson: props.lesson,
		curriculum: curriculum.value,
		itemIndex,
		sectionIndex,
	})
}
</script>
