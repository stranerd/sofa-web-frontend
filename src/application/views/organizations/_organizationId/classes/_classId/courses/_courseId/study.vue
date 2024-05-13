<template>
	<ClassLessonLayout v-model="lesson" title="Study" :full="true">
		<template #full="{ lesson: ls, classInst: cls }">
			<ExpandedLayout layoutStyle="mdlg:p-5" :hide="{ bottom: true }">
				<StudyCourse
					:title="ls.title"
					hasAccess
					:sections="sections"
					:defaultSelected="defaultSelected"
					:embeddedProps="{ classInst: cls, lesson: ls }"
					class="w-full h-full overflow-y-auto" />
			</ExpandedLayout>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCourseSections } from '@app/composables/study/courses'
import { ClassLesson } from '@modules/organizations'

const lesson = ref<ClassLesson | null>(null)

const { sections } = useCourseSections(computed(() => lesson.value?.curriculum ?? []))

const route = useRoute()
const defaultSelected =
	route.query.sectionIndex && route.query.itemIndex
		? {
				sectionIndex: Number(route.query.sectionIndex),
				itemIndex: Number(route.query.itemIndex),
			}
		: undefined
</script>
