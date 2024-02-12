<template>
	<div class="w-full bg-lightGray px-5 py-4 rounded-custom cursor-pointer flex items-center gap-4">
		<div class="w-full">
			<SofaHeaderText>{{ lesson.title }}</SofaHeaderText>
			<div class="flex items-center gap-1">
				<SofaNormalText color="text-grayColor">
					{{ formatNumber(lesson.users.teachers.length) }}
					{{ pluralize(lesson.users.teachers.length, 'teacher', 'teachers') }}
				</SofaNormalText>
				<div class="h-[5px] w-[5px] rounded-[50%] bg-grayColor"></div>
				<SofaNormalText v-if="!isStudent" color="text-grayColor">
					{{ formatNumber(lesson.users.students.length) }}
					{{ pluralize(lesson.users.students.length, 'student', 'students') }}
				</SofaNormalText>
				<SofaNormalText v-else color="text-grayColor">
					{{ formatNumber(resources) }}
					{{ pluralize(resources, 'resource', 'resources') }}
				</SofaNormalText>
			</div>
		</div>
		<div class="ml-auto">
			<SofaCheckbox v-if="isStudent && !hideJoin" v-model="joined" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { formatNumber, pluralize } from 'valleyed'
import { ClassLesson, ClassEntity } from '@modules/organizations'
import { useJoinLesson } from '@app/composables/organizations/lessons'
import { useAuth } from '@app/composables/auth/auth'
const props = defineProps<{
	classInst: ClassEntity
	lesson: ClassLesson
	hideJoin?: boolean
}>()

const { id } = useAuth()
const isStudent = computed(() => props.classInst.isStudent(id.value))
const resources = props.lesson.curriculum.reduce((acc, cur) => acc + cur.items.length, 0)

const joined = ref(props.lesson.users.students.includes(id.value))

const { joinLesson } = useJoinLesson()

watch(joined, async () => {
	await joinLesson(props.classInst, props.lesson.id, joined.value)
})
</script>
