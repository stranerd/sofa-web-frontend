<template>
	<ClassLayout
		v-model="classInst"
		:title="lesson?.title ?? 'Lesson'"
		:tabs="!$screen.desktop ? tabs : undefined"
		:extraCrumbs="[{ text: 'Subjects', to: `${classInst?.pageLink}/subjects` }]">
		<template v-if="lesson && !$screen.desktop" #pre-tabs>
			<div class="bg-white flex justify-between items-center gap-2 px-4 py-3 w-full border-y border-lightGray">
				<SofaIcon
					class="h-[7px] rotate-90 fill-current"
					name="chevron-down"
					:class="{ 'fill-grayColor': !prevLessonLink }"
					@click="prevLessonLink ? $router.push(prevLessonLink) : undefined" />
				<SofaHeading :content="lesson.title" size="title" />
				<SofaIcon
					class="h-[7px] rotate-[270deg] fill-current"
					:class="{ 'fill-grayColor': !nextLessonLink }"
					name="chevron-down"
					@click="nextLessonLink ? $router.push(nextLessonLink) : undefined" />
			</div>
		</template>
		<template #default="{ extras }">
			<slot v-if="!lesson" name="notfound" />
			<template v-else>
				<div v-if="$screen.desktop" class="bg-white flex items-center gap-4 p-4 w-full border-b border-lightGray">
					<SofaHeading :content="lesson.title" size="title" class="mr-auto" />
					<SofaIcon
						class="h-[7px] rotate-90 fill-current"
						name="chevron-down"
						:class="{ 'fill-grayColor': !prevLessonLink }"
						@click="prevLessonLink ? $router.push(prevLessonLink) : undefined" />
					<div class="w-[3px] self-stretch bg-lightGray" />
					<SofaIcon
						class="h-[7px] rotate-[270deg] fill-current"
						:class="{ 'fill-grayColor': !nextLessonLink }"
						name="chevron-down"
						@click="nextLessonLink ? $router.push(nextLessonLink) : undefined" />
				</div>
				<slot :classInst="classInst" :lesson="lesson" :extras="extras" />
			</template>
		</template>
	</ClassLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const model = defineModel<ClassLesson | null>({ default: null })

const route = useRoute()
const classInst = ref<ClassEntity | null>(null)
const lesson = computed(() => classInst.value?.getLesson(route.params.subjectId as string) ?? null)

const getLessonPath = (path: string) => `${classInst.value?.pageLink}/subjects/${lesson.value?.id}/${path}`

const tabs = computed(() => [
	{ title: 'Curriculum', icon: 'curriculum' as const, route: getLessonPath('curriculum') },
	{ title: `Students (${lesson.value?.users.students.length})`, icon: 'users' as const, route: getLessonPath('students') },
	{ title: `Teachers (${lesson.value?.users.teachers.length})`, icon: 'tutor' as const, route: getLessonPath('teachers') },
])

const nextLessonLink = computed(() => {
	const l = classInst.value?.lessons.find((_, i, arr) => arr.at((i - 1) % arr.length)?.id === lesson.value?.id)
	return l ? `${classInst.value?.pageLink}/subjects/${l.id}` : undefined
})

const prevLessonLink = computed(() => {
	const l = classInst.value?.lessons.find((_, i, arr) => arr.at((i + 1) % arr.length)?.id === lesson.value?.id)
	return l ? `${classInst.value?.pageLink}/subjects/${l.id}` : undefined
})

watch(
	lesson,
	() => {
		model.value = lesson.value
	},
	{ immediate: true },
)
</script>
