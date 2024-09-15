<template>
	<div class="flex flex-col gap-4 mdlg:p-6 p-4">
		<div class="flex justify-between mdlg:justify-center items-center gap-4">
			<div class="flex flex-col items-start mdlg:items-center">
				<SofaHeading size="title" content="Choose content" />
				<SofaText content="All you’ve created are shown below" />
			</div>
			<SofaIcon class="h-[19px] mdlg:hidden" name="circle-close" @click="close" />
		</div>
		<div class="w-full flex flex-col gap-4">
			<StudyMaterialCard
				v-for="material in [...publishedCourses, ...publishedQuizzes]"
				:key="material.hash"
				:material="material"
				:isRoute="false"
				:hasBookmark="false"
				:class="hasMaterial(material) ? '!bg-lightBlue' : '!bg-lightGray'"
				@click="toggleMaterial(material)" />
		</div>
		<div class="flex items-center justify-between gap-4 sticky bottom-0 pb-4">
			<SofaButton
				padding="px-5 py-2"
				bgColor="bg-white"
				textColor="text-grayColor"
				class="border border-gray-100 hidden mdlg:inline-block"
				@click="close">
				Exit
			</SofaButton>

			<SofaButton padding="px-5 py-2" :disabled="selectedMaterials.length === 0" class="mdlg:w-auto w-full" @click="add">
				Add
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useUsersMaterials } from '@app/composables/study/users-materials'
import { StudyMaterial } from '@modules/study'

const props = defineProps<{
	close: () => void
	selected: { courses: string[]; quizzes: string[] }
	onAdd: (materials: { courses: string[]; quizzes: string[] }) => void
}>()

const selectedMaterials = ref([
	...props.selected.courses.map((id) => ({ type: 'course' as const, id })),
	...props.selected.quizzes.map((id) => ({ type: 'quiz' as const, id })),
])

const { id } = useAuth()
const { courses, quizzes } = useUsersMaterials(id.value)

const publishedCourses = computed(() => courses.filter((course) => course.isPublished))
const publishedQuizzes = computed(() => quizzes.filter((quiz) => quiz.isPublished))

const add = () => {
	const courses = selectedMaterials.value.filter((material) => material.type === 'course').map((material) => material.id)
	const quizzes = selectedMaterials.value.filter((material) => material.type === 'quiz').map((material) => material.id)
	props.onAdd({ courses, quizzes })
	props.close()
}

const hasMaterial = (material: StudyMaterial) => {
	const type = material.isCourse() ? 'course' : 'quiz'
	return selectedMaterials.value.some((m) => m.id === material.id && m.type === type)
}

const toggleMaterial = (material: StudyMaterial) => {
	const type = material.isCourse() ? 'course' : 'quiz'
	const inListIndex = selectedMaterials.value.findIndex((m) => m.id === material.id && m.type === type)
	if (inListIndex !== -1) selectedMaterials.value.splice(inListIndex, 1)
	else selectedMaterials.value.push({ type, id: material.id })
}
</script>
