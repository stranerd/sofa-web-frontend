<template>
	<div v-if="user" class="w-full bg-lightGray px-5 py-4 rounded-custom cursor-pointer flex items-center gap-4">
		<div>
			<SofaHeaderText :content="lesson.title" />
			<div class="flex items-center gap-1">
				<SofaNormalText color="text-grayColor">
					{{ $utils.formatNumber(lesson.users.teachers.length) }}
					{{ $utils.pluralize(lesson.users.teachers.length, 'teacher', 'teachers') }}
				</SofaNormalText>
				<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor" />
				<SofaNormalText color="text-grayColor">
					{{ $utils.formatNumber(lesson.users.students.length) }}
					{{ $utils.pluralize(lesson.users.students.length, 'student', 'students') }}
				</SofaNormalText>
				<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor" />
				<SofaNormalText color="text-grayColor">
					{{ $utils.formatNumber(resources) }}
					{{ $utils.pluralize(resources, 'resource', 'resources') }}
				</SofaNormalText>
			</div>
		</div>
		<SofaCheckbox v-if="classInst.isStudent(user) && !hideJoin" v-model="joined" class="ml-auto" />
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useJoinLesson } from '@app/composables/organizations/lessons'
import { ClassEntity, ClassLesson } from '@modules/organizations'
const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
	hideJoin?: boolean
}>()

const { id, user } = useAuth()
const resources = props.lesson.curriculum.reduce((acc, cur) => acc + cur.items.length, 0)

const joined = ref(props.lesson.users.students.includes(id.value))

const { joinLesson } = useJoinLesson()

watch(joined, async () => {
	await joinLesson(props.classInst, props.lesson.id, joined.value)
})
</script>
