<template>
	<div class="w-full flex flex-col gap-4">
		<div v-for="(c, index) in curriculum" :key="index">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<SofaHeaderText>{{ c.label }}</SofaHeaderText>
					<SofaIcon class="h-[16px]" name="edit-gray" />
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
					<SofaIcon class="h-[8px]" name="chevron-down" />
				</div>
			</div>
			<div class="flex flex-col gap-4 my-5">
				<div v-for="(item, idx) in c.items" :key="idx">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<SofaIcon :name="getItemIcon(item)" class="h-[16px]" />
							<SofaNormalText color="text-deepGray" :content="getItemTitle(item)" />
							<SofaBadge v-if="showLiveBadgeForItem(item)"> LIVE </SofaBadge>
						</div>
						<div class="flex items-center gap-2">
							<SofaNormalText color="text-grayColor" :content="getItemInfo(item)" />
							<SofaIcon v-if="canEdit" class="h-[20px]" name="reorder-gray" />
							<SofaIcon v-if="canEdit" class="h-[16px]" name="trash-gray" />
						</div>
					</div>
				</div>
				<div v-if="canEdit" class="flex items-center gap-2">
					<SofaIcon name="box-add-white" class="h-[16px] !fill-primaryBlue" />
					<SofaNormalText color="text-primaryBlue" content="Add live session" />
				</div>
				<div v-if="canEdit" class="flex items-center gap-2">
					<SofaIcon name="box-add-white" class="h-[16px] !fill-primaryPink" />
					<SofaNormalText color="text-primaryPink" content="Add study material" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useLessonCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson, ClassLessonable, CurriculumView, LessonCurriculumFactory } from '@modules/organizations'
import { FileType } from '@modules/study'
import { formatTime } from '@utils/dates'
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		classObj: ClassEntity
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
	props.classObj,
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
</script>
