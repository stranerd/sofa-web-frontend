<template>
	<div class="bg-lightGray px-5 py-4 rounded-custom cursor-pointer flex items-center justify-between">
		<div>
			<SofaHeaderText>{{ currentLesson.title }}</SofaHeaderText>
			<div class="flex items-center gap-1">
				<SofaNormalText color="text-grayColor">
					{{ currentLesson.users.teachers.length }}
					{{ currentLesson.users.teachers.length > 1 ? 'teachers' : 'teacher' }}</SofaNormalText
				>
				<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor"></div>
				<SofaNormalText v-if="!isStudent" color="text-grayColor">
					{{ currentLesson.users.students.length }} {{ currentLesson.users.students.length > 1 ? 'students' : 'student' }}
				</SofaNormalText>
				<SofaNormalText v-else color="text-grayColor">
					{{ '0 resources' }}
				</SofaNormalText>
			</div>
		</div>
		<div v-if="isStudent" @click.stop="selectLesson(currentLesson)">
			<SofaCheckbox v-model="currentLesson.joined" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ClassLesson, ClassEntity } from '@modules/organizations'
import { useJoinLesson } from '@app/composables/organizations/lessons'
const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
	isStudent: boolean
	userId: string
}>()

interface ExtendedClassLesson extends ClassLesson {
	joined: boolean
}

const currentLesson = ref<ExtendedClassLesson>({
	...props.lesson,
	joined: props.lesson.users.students.includes(props.userId),
})

const { joinLesson } = useJoinLesson()

const selectLesson = async (val: ExtendedClassLesson) => {
	await joinLesson(props.classInst, props.lesson.id, val.joined)
}
</script>
