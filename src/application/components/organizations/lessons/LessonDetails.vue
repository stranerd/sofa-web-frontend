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
			<button class="pb-3" @click="changeTab('curriculum')">
				<SofaNormalText
					:customClass="
						selectedTab === 'curriculum'
							? 'text-primaryPurple pb-3 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Curriculum
				</SofaNormalText>
			</button>
			<button class="pb-3" @click="changeTab('teachers')">
				<SofaNormalText
					:customClass="
						selectedTab === 'teachers'
							? 'text-primaryPurple pb-4 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Teachers {{ lesson.users.teachers.length }}
				</SofaNormalText>
			</button>
			<button class="pb-3" @click="changeTab('students')">
				<SofaNormalText
					:customClass="
						selectedTab === 'students'
							? 'text-primaryPurple pb-4 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Students {{ lesson.users.students.length }}
				</SofaNormalText>
			</button>
		</div>
		<div v-if="selectedTab === 'curriculum'">
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center">
					{{
						lessonTeachers.length
							? lessonTeachers[0].user?.bio.publicName + ' has not set the curriculum yet'
							: 'Teacher has not set the curriculum yet'
					}}
				</SofaNormalText>
			</div>
		</div>
		<div v-if="selectedTab === 'teachers'" class="py-4 flex flex-col gap-4">
			<div v-if="lessonTeachers.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Teachers" />
			</div>
			<div v-for="teacher in lessonTeachers" v-else :key="teacher.id" class="flex items-center gap-3">
				<div>
					<SofaAvatar :photoUrl="teacher.user?.bio.photo?.link || ''" customClass="!w-[32px] !h-[32px]" />
				</div>
				<SofaNormalText color="text-deepGray">{{ teacher.user?.bio.publicName }}</SofaNormalText>
			</div>
		</div>
		<div v-if="selectedTab === 'students'" class="py-4 flex flex-col gap-4">
			<div v-if="lessonStudents.length === 0" class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Students" />
			</div>
			<div v-for="i in 10" v-else :key="i" class="flex items-center gap-3">
				<div>
					<SofaAvatar photoUrl="/images/freeman.png" customClass="!w-[32px] !h-[32px]" />
				</div>
				<SofaNormalText color="text-deepGray">{{ 'Adedeji Tewogbade' }}</SofaNormalText>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ClassLesson, MemberEntity } from '@modules/organizations'
import { computed, ref } from 'vue'

const props = defineProps<{
	organizationId: string
	classId: string
	close: () => void
	lesson: ClassLesson
	teachers: MemberEntity[]
}>()

const selectedTab = ref('curriculum')

const changeTab = (val: string) => {
	selectedTab.value = val
}

const lessonTeachers = computed(() => props.teachers.filter((teacher) => props.lesson.users.teachers.includes(teacher?.user?.id ?? '')))
const lessonStudents = computed(() => props.lesson.users.students)
</script>
