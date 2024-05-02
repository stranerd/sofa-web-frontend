<template>
	<ClassLayout
		v-model="classInst"
		:title="title"
		:tabs="tabs"
		:extraCrumbs="[{ text: 'Subjects', to: `${classInst?.pageLink}/subjects` }]">
		<template #default="{ extras }">
			<slot v-if="!lesson" name="notfound" />
			<slot v-else :classInst="classInst" :lesson="lesson" :extras="extras" />
		</template>
	</ClassLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ClassEntity, ClassLesson } from '@modules/organizations'

defineProps<{
	title: string
}>()

const model = defineModel<ClassLesson | null>({ default: null })

const route = useRoute()
const classInst = ref<ClassEntity | null>(null)
const lesson = computed(() => classInst.value?.getLesson(route.params.lessonId as string) ?? null)

const tabs = computed(() => [
	{ title: 'Curriculum', icon: 'feed' as const, route: `/students/${lesson.value?.id}/curriculum` },
	{ title: `Students (${lesson.value?.users.students.length})`, icon: 'users' as const, route: `/students/${lesson.value?.id}/students` },
	{ title: `Teachers (${lesson.value?.users.teachers.length})`, icon: 'tutor' as const, route: `/students/${lesson.value?.id}/teachers` },
])

watch(lesson, () => {
	model.value = lesson.value
})
</script>
