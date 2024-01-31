<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="lesson.title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px]" name="back-arrow" customClass="!fill-black" />
				<SofaIcon class="h-[16px]" name="arrow-right-white" customClass="!fill-black" />
				<div>
					<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
				</div>
			</div>
		</div>
		<div class="flex items-center gap-6 border-b border-darkLightGray">
			<SofaNormalText
				v-for="tab in [
					{ title: 'Curriculum', key: 'curriculum' },
					{ title: `Teachers ${lesson.users.teachers.length}`, key: 'teachers' },
					{ title: `Students ${lesson.users.students.length}`, key: 'students' },
				]"
				:key="tab.key"
				as="a"
				class="pb-3 font-bold border-b"
				:content="tab.title"
				:class="selectedTab === tab.key ? 'text-primaryPurple border-primaryPurple' : 'text-deepGray'"
				@click="selectedTab = tab.key" />
			<SofaIcon v-if="curriculum_view === CurriculumView.grid" name="list_view" class="h-[20px] ml-auto" @click="toggleView" />
			<SofaIcon v-else name="grid_view" class="h-[20px] ml-auto" @click="toggleView" />
		</div>
		<div v-if="selectedTab === 'curriculum'">
			<div v-if="curriculum.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center">
					{{ (teachers.at(0)?.publicName ?? 'Teacher') + ' has not set the curriculum yet' }}
				</SofaNormalText>
			</div>
			<LessonCurriculum v-else :classInst="classInst" :view="curriculum_view" :curriculum="curriculum" />
		</div>
		<div v-if="selectedTab === 'teachers'" class="py-4 flex flex-col gap-4">
			<div v-if="teachers.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Teachers" />
			</div>
			<div v-for="teacher in teachers" v-else :key="teacher.id" class="flex items-center gap-3">
				<SofaAvatar :photoUrl="teacher.bio.photo?.link" customClass="!w-[32px] !h-[32px]" />
				<SofaNormalText color="text-deepGray">{{ teacher.publicName }}</SofaNormalText>
			</div>
		</div>
		<div v-if="selectedTab === 'students'" class="py-4 flex flex-col gap-4">
			<div v-if="students.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Students" />
			</div>
			<div v-for="student in students" v-else :key="student.id" class="flex items-center gap-3">
				<SofaAvatar photoUrl="/images/freeman.png" customClass="!w-[32px] !h-[32px]" />
				<SofaNormalText color="text-deepGray">{{ student.publicName }}</SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ClassLesson, ClassEntity, CurriculumView } from '@modules/organizations'
import { useUsersInList } from '@app/composables/users/users'
import { useLessonCurriculum } from '@app/composables/organizations/lessons'

const props = defineProps<{
	close: () => void
	lesson: ClassLesson
	classInst: ClassEntity
}>()

const selectedTab = ref('curriculum')
const curriculum_view = ref(CurriculumView.list)
const toggleView = () => {
	if (curriculum_view.value === CurriculumView.list) {
		curriculum_view.value = CurriculumView.grid
	} else {
		curriculum_view.value = CurriculumView.list
	}
}

const { curriculum } = useLessonCurriculum(
	props.classInst,
	computed(() => props.lesson.curriculum),
)

const { users: students } = useUsersInList(computed(() => props.lesson.users.students))
const { users: teachers } = useUsersInList(computed(() => props.lesson.users.teachers))
</script>
