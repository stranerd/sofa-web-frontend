<template>
	<div class="w-full shadow-custom bg-lightGray mdlg:bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div v-if="classInst.lessons.length === 0">
			<SofaHeaderText content="Lessons" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No lessons" />
			</div>
		</div>
		<div v-else>
			<div v-if="!showLessonCurriculum">
				<SofaHeaderText content="Choose a lesson to study" customClass="text-center" />
				<div class="h-[1px] w-full bg-lightGray" />
				<div class="w-full flex flex-col items-center gap-6 mt-6">
					<LessonCard
						v-for="(lesson, index) in classInst.lessons"
						:key="index"
						:isStudent="classInst.isStudent(userId)"
						:lesson="lesson"
						class="w-full" />
					<div class="w-full flex items-center justify-between">
						<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" customClass="hidden mdlg:block">
							Clear
						</SofaButton>
						<SofaButton
							bgColor="bg-primaryBlue"
							type="submit"
							textColor="text-white"
							padding="py-3 px-6"
							customClass="w-full mdlg:w-auto">
							Done
						</SofaButton>
					</div>
				</div>
			</div>
			<div v-else>
				<SofaHeaderText content="Lessons" customClass="hidden mdlg:block" />
				<div class="hidden mdlg:block h-[1px] w-full bg-lightGray" />
				<div class="flex flex-wrap items-center gap-3 mdlg:mt-6">
					<SofaButton
						v-for="lesson in lessons"
						:key="lesson.id"
						:class="
							selectedLesson?.id === lesson.id
								? 'bg-primaryPurple !text-white !shadow-none'
								: 'bg-white border border-darkLightGray !text-deepGray !shadow-none'
						"
						padding="py-3 px-4"
						@click="selectedLesson = lesson">
						{{ lesson.title }}
					</SofaButton>
				</div>
				<div class="flex flex-col gap-6 mdlg:p-6 rounded-custom mt-4 mdlg:mt-0">
					<LessonCurriculum :classInst="classInst" :view="CurriculumView.list" :curriculum="curriculum" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useLessonCurriculum } from '@app/composables/organizations/lessons'
import { ClassEntity, CurriculumView } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
}>()

const emptyLessonContent = {
	imageURL: '/images/no-lessons.png',
}
const { id: userId } = useAuth()
const showLessonCurriculum = ref(false)
const lessons = computed(() => props.classInst.lessons.filter((l) => l.users.students.includes(userId.value)))
const selectedLesson = ref(lessons.value.at(0))
const selectedLessonCurriculum = computed(() => selectedLesson.value?.curriculum ?? [])
const { curriculum } = useLessonCurriculum(props.classInst, selectedLessonCurriculum)
watch(lessons, () => {
	showLessonCurriculum.value = !!lessons.value.length
})
</script>
