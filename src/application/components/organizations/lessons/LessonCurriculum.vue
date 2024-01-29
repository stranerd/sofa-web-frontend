<template>
	<div class="w-full flex flex-col gap-4">
		<div v-for="(c, index) in curriculum" :key="index" class="">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<SofaHeaderText>{{ c.label }}</SofaHeaderText>
					<SofaIcon customClass="h-[16px]" name="edit-gray" />
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon customClass="h-[20px]" name="reorder-gray" />
					<SofaIcon customClass="h-[8px]" name="chevron-down" />
				</div>
			</div>
			<div class="flex flex-col gap-4 my-5">
				<div v-for="(item, idx) in c.items" :key="idx">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<SofaIcon :name="getItemIcon(item)" customClass="h-[16px]"></SofaIcon>
							<SofaNormalText color="text-deepGray">{{ getItemTitle(item) }}</SofaNormalText>
							<SofaBadge v-if="showLiveBadgeForItem(item)"> LIVE </SofaBadge>
						</div>
						<div class="flex items-center gap-2">
							<SofaNormalText color="text-grayColor">{{ getItemInfo(item) }}</SofaNormalText>
							<SofaIcon customClass="h-[20px]" name="reorder-gray" />
							<SofaIcon customClass="h-[16px]" name="trash-gray" />
						</div>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon name="box-add-white" customClass="h-[16px]" class="!fill-primaryBlue"></SofaIcon>
					<SofaNormalText color="text-primaryBlue">Add live session</SofaNormalText>
				</div>
				<div class="flex items-center gap-2">
					<SofaIcon name="box-add-white" customClass="h-[16px]" class="!fill-primaryPink"></SofaIcon>
					<SofaNormalText color="text-primaryPink">Add study material</SofaNormalText>
				</div>
			</div>
		</div>
		<SofaButton bgColor="bg-primaryPurple" customClass="py-3 mdlg:py-4">
			<SofaIcon name="box-add-white" customClass="h-[16px]"></SofaIcon>
			Add section
		</SofaButton>
		<div class="grid mdlg:hidden grid-cols-2 gap-3">
			<SofaButton customClass="border border-primaryBlue !text-primaryBlue bg-transparent" padding="py-2 px-4"> Preview </SofaButton>
			<SofaButton customClass="bg-primaryBlue" padding="py-2 px-4"> Publish </SofaButton>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { ClassEntity, ClassLesson, ClassLessonable, CurriculumView } from '@modules/organizations'
import { FileType } from '@modules/study'
import { formatTime } from '@utils/dates'
export default defineComponent({
	props: {
		classObj: {
			type: ClassEntity,
			required: true,
		},
		view: {
			type: String as PropType<CurriculumView>,
			default: CurriculumView.list,
			required: true,
		},
		curriculum: {
			type: Array as PropType<ClassLesson['curriculum']>,
			required: true,
		},
		lesson: {
			type: Object as PropType<ClassLesson>,
			required: true,
		},
		isModal: {
			type: Boolean,
			default: false,
		},
	},
	setup(props) {
		const lessons = computed(() => props.classObj.lessons)
		const getItemTitle = (item: any) => {
			if (item.type == ClassLessonable.quiz) return item.quiz.title
			if (item.type == ClassLessonable.file) return item.file.title
			if (item.type == ClassLessonable.schedule) return item.schedule.title
		}
		const getItemIcon = (item: any) => {
			if (item.type === ClassLessonable.quiz) return 'quiz'
			if (item.type === ClassLessonable.schedule) return 'translation'
			if (item.type === ClassLessonable.file) {
				if (item.fileType === FileType.document) return 'file'
				if (item.fileType === FileType.image) return 'image-course'
				if (item.fileType === FileType.video) return 'video-course'
			}
			return 'translation'
		}
		const getItemInfo = (item: any) => {
			if (item.type == ClassLessonable.quiz) return `${formatTime(item.quiz.updatedAt)} . ${item.quiz.questions.length} questions`
			if (item.type == ClassLessonable.file) return `${item.fileType}`
			if (item.type == ClassLessonable.schedule)
				return `${formatTime(item.schedule.time.start)} - ${formatTime(item.schedule.time.start)}`
		}
		const showLiveBadgeForItem = (item: any) => {
			if (item.type === ClassLessonable.schedule) {
				if (item.schedule.isOngoing) {
					return true
				}
			}
			return false
		}
		return {
			lessons,
			getItemTitle,
			getItemInfo,
			ClassLessonable,
			FileType,
			getItemIcon,
			showLiveBadgeForItem,
		}
	},
})
</script>
