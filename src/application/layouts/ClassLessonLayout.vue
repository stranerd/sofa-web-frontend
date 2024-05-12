<template>
	<ClassLayout
		v-model="classInst"
		:title="title"
		:pageTitle="lesson?.title"
		:tabs="!$screen.desktop ? tabs : undefined"
		:primary="primary"
		:full="full"
		:rounded="rounded"
		:extraCrumbs="[
			{ text: 'Courses', to: `${classInst?.pageLink}/courses` },
			{ text: capitalize(lesson?.title ?? 'Lesson'), to: getLessonPath('') },
		]">
		<template v-if="full && lesson" #full="{ classInst: cls }">
			<slot name="full" :classInst="cls" :lesson="lesson" />
		</template>
		<template v-if="lesson && $screen.desktop" #post-tabs>
			<div
				class="bg-white flex items-center gap-1 px-2 pt-2 overflow-x-auto w-full border-b border-lightGray"
				:class="{ 'rounded-b-2xl': roundedTabs }">
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
import { capitalize } from 'valleyed'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from './ClassLayout.vue'
import { ClassEntity, ClassLesson } from '@modules/organizations'

defineProps<{
	title: string
	primary?: InstanceType<typeof ClassLayout>['$props']['primary']
	full?: InstanceType<typeof ClassLayout>['$props']['full']
	rounded?: InstanceType<typeof ClassLayout>['$props']['rounded']
	roundedTabs?: boolean
}>()

const model = defineModel<ClassLesson | null>({ default: null })
const classInst = defineModel<ClassEntity | null>('classInst', { default: null })

const route = useRoute()
const lesson = computed(() => classInst.value?.getLesson(route.params.courseId as string) ?? null)

const getLessonPath = (path: string) => `${classInst.value?.pageLink}/courses/${lesson.value?.id}/${path}`

const tabs = computed(() => [
	{ title: 'Curriculum', icon: 'curriculum' as const, route: getLessonPath('curriculum/') },
	{ title: `Students (${lesson.value?.users.students.length})`, icon: 'users' as const, route: getLessonPath('students') },
	{ title: `Teachers (${lesson.value?.users.teachers.length})`, icon: 'tutor' as const, route: getLessonPath('teachers') },
])

watch(
	lesson,
	() => {
		model.value = lesson.value
	},
	{ immediate: true },
)
</script>
