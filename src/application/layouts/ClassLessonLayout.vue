<template>
	<ClassLayout
		v-model="classInst"
		:title="lesson?.title ?? 'Lesson'"
		:tabs="!$screen.desktop ? tabs : undefined"
		:primary="primary"
		:full="full"
		:extraCrumbs="[{ text: 'Courses', to: `${classInst?.pageLink}/courses` }]">
		<template v-if="full && lesson" #full="{ classInst: cls }">
			<slot name="full" :classInst="cls" :lesson="lesson" />
		</template>
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
		<template v-if="lesson && $screen.desktop" #post-tabs>
			<div class="bg-white flex items-center gap-4 p-4 w-full border-b border-lightGray">
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
			<div class="bg-white flex items-center gap-1 px-2 pt-2 overflow-x-auto w-full border-b border-lightGray">
				<SofaText
					v-for="tab in tabs"
					:key="tab.route"
					as="router-link"
					class="p-2 border-b-2 border-transparent shrink-0 flex items-center gap-2"
					:to="tab.route"
					activeClass="text-primaryPurple !border-primaryPurple">
					<SofaIcon :name="tab.icon" class="h-[18px] fill-current" />
					<span>{{ tab.title }}</span>
				</SofaText>
				<slot name="post-tabs" />
			</div>
		</template>
		<template v-if="lesson" #default="{ classInst: cls, extras }">
			<slot :classInst="cls" :lesson="lesson" :extras="extras" />
		</template>
	</ClassLayout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from './ClassLayout.vue'
import { ClassEntity, ClassLesson } from '@modules/organizations'

withDefaults(
	defineProps<{
		primary?: InstanceType<typeof ClassLayout>['$props']['primary']
		full?: boolean
	}>(),
	{
		primary: undefined,
		full: false,
	},
)

const model = defineModel<ClassLesson | null>({ default: null })
const classInst = defineModel<ClassEntity | null>('classInst', { default: null })

const route = useRoute()
const lesson = computed(() => classInst.value?.getLesson(route.params.courseId as string) ?? null)

const getLessonPath = (path: string) => `${classInst.value?.pageLink}/courses/${lesson.value?.id}/${path}`

const tabs = computed(() => [
	{ title: 'Curriculum', icon: 'curriculum' as const, route: getLessonPath('curriculum') },
	{ title: `Students (${lesson.value?.users.students.length})`, icon: 'users' as const, route: getLessonPath('students') },
	{ title: `Teachers (${lesson.value?.users.teachers.length})`, icon: 'tutor' as const, route: getLessonPath('teachers') },
])

const nextLessonLink = computed(() => {
	const l = classInst.value?.lessons.find((_, i, arr) => arr.at((i - 1) % arr.length)?.id === lesson.value?.id)
	return l ? `${classInst.value?.pageLink}/courses/${l.id}` : undefined
})

const prevLessonLink = computed(() => {
	const l = classInst.value?.lessons.find((_, i, arr) => arr.at((i + 1) % arr.length)?.id === lesson.value?.id)
	return l ? `${classInst.value?.pageLink}/courses/${l.id}` : undefined
})

watch(
	lesson,
	() => {
		model.value = lesson.value
	},
	{ immediate: true },
)
</script>
