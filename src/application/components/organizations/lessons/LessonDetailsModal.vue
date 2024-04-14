<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="activeLesson.title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px]" name="back-arrow" :class="canPrev ? 'fill-black' : 'fill-grayColor'" @click="prev" />
				<SofaIcon class="h-[16px]" name="arrow-right-white" :class="canNext ? 'fill-black' : 'fill-grayColor'" @click="next" />
				<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
			</div>
		</div>
		<div class="flex items-center gap-6 border-b border-darkLightGray">
			<SofaNormalText
				v-for="tab in [
					{ title: 'Curriculum', key: 'curriculum' },
					{ title: `Teachers ${$utils.formatNumber(activeLesson.users.teachers.length)}`, key: 'teachers' },
					{ title: `Students ${$utils.formatNumber(activeLesson.users.students.length)}`, key: 'students' },
				]"
				:key="tab.key"
				as="a"
				class="pb-3 font-bold border-b"
				:content="tab.title"
				:class="selectedTab === tab.key ? 'text-primaryPurple border-primaryPurple' : 'text-deepGray'"
				@click="selectedTab = tab.key" />
			<SofaIcon :name="curriculumViewIcon" class="h-[20px] ml-auto" @click="toggleView" />
		</div>
		<div v-if="selectedTab === 'curriculum'">
			<div v-if="curriculum.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center">
					{{ (teachers.at(0)?.publicName ?? 'Teacher') + ' has not set the curriculum yet' }}
				</SofaNormalText>
			</div>
			<LessonCurriculum
				v-else
				:classInst="classInst"
				:lesson="lesson"
				:view="curriculumView"
				:curriculum="curriculum"
				:isModal="true" />
		</div>
		<div v-if="selectedTab === 'teachers'" class="py-4 flex flex-col gap-4">
			<div v-if="teachers.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Teachers" />
			</div>
			<div v-for="teacher in teachers" v-else :key="teacher.id" class="flex items-center gap-3">
				<SofaAvatar :photoUrl="teacher.bio.photo?.link" :size="32" />
				<SofaNormalText color="text-deepGray">{{ teacher.publicName }}</SofaNormalText>
			</div>
		</div>
		<div v-if="selectedTab === 'students'" class="py-4 flex flex-col gap-4">
			<div v-if="students.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/empty-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Students" />
			</div>
			<div v-for="student in students" v-else :key="student.id" class="flex items-center gap-3">
				<SofaAvatar :photoUrl="student.bio.photo?.link" :size="32" />
				<SofaNormalText color="text-deepGray">{{ student.publicName }}</SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ClassLesson, ClassEntity } from '@modules/organizations'
import { useUsersInList } from '@app/composables/users/users'
import { useCurriculumViewToggle, useLessonCurriculum } from '@app/composables/organizations/lessons'

const props = defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
}>()

const activeLessonIndex = ref(props.classInst.lessons.findIndex((lesson) => lesson.id === props.lesson.id) ?? 0)
const activeLesson = computed(() => props.classInst.lessons[activeLessonIndex.value])
const selectedTab = ref('curriculum')

const { curriculumView, curriculumViewIcon, toggleView } = useCurriculumViewToggle()

const { curriculum } = useLessonCurriculum(
	props.classInst,
	computed(() => props.lesson.curriculum),
)

const { users: students } = useUsersInList(computed(() => activeLesson.value.users.students))
const { users: teachers } = useUsersInList(computed(() => activeLesson.value.users.teachers))

const canNext = computed(() => activeLessonIndex.value < props.classInst.lessons.length - 1)
const canPrev = computed(() => activeLessonIndex.value > 0)
const next = () => {
	if (canNext.value) activeLessonIndex.value++
}
const prev = () => {
	if (canPrev.value) activeLessonIndex.value--
}
</script>
