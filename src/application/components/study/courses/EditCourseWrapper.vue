<template>
	<slot v-if="fetched && course" :course="course" :extras="extras" />
	<slot v-if="fetched && !course" name="notfound" />
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useEditCourse } from '@app/composables/study/courses'
import { CourseEntity } from '@modules/study'

const props = defineProps<{
	id: string
}>()

const model = defineModel<CourseEntity | null>('course', { default: null })

const { id: authId } = useAuth()
const { course, fetched, deleteCourse } = useEditCourse(props.id)

watch(
	course,
	() => {
		model.value = course.value
	},
	{ immediate: true },
)

const extras = computed(() => ({
	deleteCourse,
	isMine: course.value?.user.id === authId.value,
	canEdit: course.value?.user.id === authId.value,
}))
</script>
