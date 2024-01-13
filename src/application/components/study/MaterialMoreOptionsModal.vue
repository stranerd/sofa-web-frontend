<template>
	<div class="flex flex-col">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 px-4 border-lightGray border-b">
			<sofa-normal-text :custom-class="'!font-bold !text-base'">Options</sofa-normal-text>
			<sofa-icon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<a v-for="item in moreOptions" :key="item.title" class="w-full flex items-center gap-2 p-4" @click.stop.prevent="item.action()">
			<sofa-icon :name="item.icon" :custom-class="'h-[15px]'" />
			<sofa-normal-text>{{ item.title }}</sofa-normal-text>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables/auth/auth'
import { reportMaterial, shareMaterialLink } from '@/composables/library'
import { saveToFolder } from '@/composables/study/folders'
import { CourseEntity, QuizEntity } from '@modules/study'
import { Logic } from 'sofa-logic'
import { SofaIcon, SofaNormalText } from 'sofa-ui-components'
import { computed, defineProps } from 'vue'

const props = defineProps<{
	close: () => void
	material: CourseEntity | QuizEntity
}>()

const { id } = useAuth()

const moreOptions = computed(() => [
	{
		icon: 'edit-option',
		title: 'Edit',
		show: () => props.material?.user.id === id.value,
		action: () => {
			props.close()
			if (props.material.isQuiz()) Logic.Common.GoToRoute(`/quiz/${props.material.id}/edit`)
			else Logic.Common.GoToRoute(`/course/create?id=${props.material.id}`)
		},
	},
	{
		icon: 'share-option',
		title: 'Share',
		show: () => props.material.isPublished,
		action: () => {
			props.close()
			shareMaterialLink(props.material)
		},
	},
	{
		icon: 'report-option',
		title: 'Report',
		show: () => props.material.user.id !== id.value,
		action: () => {
			props.close()
			reportMaterial(props.material)
		},
	},
	{
		icon: 'save',
		title: 'Save/unsave to folder',
		show: () => props.material.isPublished,
		action: () => {
			props.close()
			saveToFolder({ id: props.material.id, type: props.material.isQuiz() ? 'quiz' : 'course' })
		},
	},
])
</script>
