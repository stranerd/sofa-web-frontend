<template>
	<div class="w-full shadow-custom bg-lightGray mdlg:bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div v-if="classInst.lessons.length === 0">
			<SofaHeaderText content="Lessons" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
				<SofaNormalText class="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No lessons" />
			</div>
		</div>
		<div v-else-if="selectedLesson">
			<SofaHeaderText content="Lessons" customClass="hidden mdlg:block" />
			<div class="hidden mdlg:block h-[1px] w-full bg-lightGray" />
			<div class="flex items-center justify-between">
				<div class="flex flex-wrap items-center gap-3 mdlg:mt-6">
					<SofaButton
						v-for="lesson in classInst.lessons"
						:key="lesson.id"
						:class="
							selectedLesson.id === lesson.id
								? 'bg-primaryPurple !text-white !shadow-none'
								: 'bg-white border border-darkLightGray !text-deepGray !shadow-none'
						"
						padding="py-3 px-4"
						@click="selectedLesson = lesson">
						{{ lesson.title }}
					</SofaButton>
				</div>
				<div v-if="showLessonCurriculum && canEditLesson" class="hidden mdlg:flex items-center gap-3">
					<SofaButton
						class="border border-primaryBlue !text-primaryBlue bg-transparent"
						padding="py-2 px-4"
						@click="previewCurriculum">
						Preview
					</SofaButton>
					<SofaButton class="bg-primaryBlue" padding="py-2 px-4"> Publish </SofaButton>
				</div>
			</div>
			<div v-if="!showLessonCurriculum" class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
				<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
					<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
				</div>
				<div class="flex flex-col items-start gap-1">
					<SofaHeaderText :content="`Set up your ${selectedLesson.title} curriculum`" size="xl" />
					<div class="flex flex-col gap-2 py-2">
						<div v-for="(content, index) in emptyLessonContent.contents" :key="index" class="flex mdlg:items-center gap-1">
							<SofaIcon class="h-[16px]" name="checkmark-circle" />
							<SofaNormalText :content="content" color="text-grayColor" />
						</div>
					</div>
					<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6" @click="showLessonCurriculum = true">
						Get started
					</SofaButton>
				</div>
			</div>
			<div v-else class="flex flex-col gap-6 mdlg:p-6 rounded-custom mt-4 mdlg:mt-0">
				<LessonCurriculum
					:classInst="classInst"
					:view="curriculumView"
					:curriculum="factory.factories"
					:factory="canEditLesson ? factory : undefined" />
				<SofaButton v-if="canEditLesson" bgColor="bg-primaryPurple" class="py-3 mdlg:py-4" @click="factory.add">
					<SofaIcon name="box-add-white" class="h-[16px]" />
					Add section
				</SofaButton>
				<div v-if="canEditLesson" class="grid mdlg:hidden grid-cols-2 gap-3">
					<SofaButton
						class="border border-primaryBlue !text-primaryBlue bg-transparent"
						padding="py-2 px-4"
						@click="previewCurriculum">
						Preview
					</SofaButton>
					<SofaButton class="bg-primaryBlue" padding="py-2 px-4"> Publish </SofaButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCurriculumViewToggle, useUpdateCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity } from '@modules/organizations'
import { useModals } from '@app/composables/core/modals'

const props = defineProps<{
	classInst: ClassEntity
}>()

const { id } = useAuth()
const selectedLesson = ref(props.classInst.lessons.at(0))
const canEditLesson = computed(() => selectedLesson.value?.users.teachers.includes(id.value))
const showLessonCurriculum = ref(false)
const { curriculumView } = useCurriculumViewToggle()
const { factory } = useUpdateCurriculum(props.classInst, selectedLesson)

watch(
	selectedLesson,
	() => {
		showLessonCurriculum.value = !!selectedLesson.value?.curriculum.length
	},
	{ immediate: true },
)

const previewCurriculum = () => {
	if (selectedLesson.value) {
		useModals().organizations.previewCurriculum.open({
			lesson: selectedLesson.value,
			classInst: props.classInst,
			curriculum: factory.factories,
		})
	}
}

const emptyLessonContent = {
	imageURL: '/images/no-lessons.png',
	contents: [
		'Give each topic a section.',
		'Add live sessions under sections.',
		'Add study materials under sections.',
		'Preview and publish your curriculum.',
	],
}
</script>
