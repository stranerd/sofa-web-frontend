<template>
	<slot v-if="fetched && course" :course="course" :extras="extras" />
	<slot v-if="fetched && !course" name="notfound" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useEditCourse } from '@app/composables/study/courses'

const props = defineProps<{
	id: string
}>()

const { id: authId } = useAuth()
const { course, fetched, deleteCourse } = useEditCourse(props.id)

const extras = computed(() => ({
	deleteCourse,
	isMine: course.value?.user.id === authId.value,
	canEdit: course.value?.user.id === authId.value,
}))
</script>
