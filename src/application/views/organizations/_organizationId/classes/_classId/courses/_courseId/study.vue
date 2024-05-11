<template>
	<ClassLessonLayout v-model="lesson" full>
		<template #full="{ lesson: ls, classInst: cls }">
			<ExpandedLayout layoutStyle="mdlg:p-5" :hide="{ bottom: true }">
				<StudyCourse
					:title="ls.title"
					hasAccess
					:sections="sections"
					:embeddedProps="{ classInst: cls, lesson: ls }"
					class="w-full h-full overflow-y-auto" />
			</ExpandedLayout>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useCourseSections } from '@app/composables/study/courses'
import { ClassLesson } from '@modules/organizations'

const lesson = ref<ClassLesson | null>(null)

const { sections } = useCourseSections(computed(() => lesson.value?.curriculum ?? []))
</script>
