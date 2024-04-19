<template>
	<div class="flex flex-col">
		<div class="w-full flex justify-between items-center sticky top-0 left-0 md:!hidden py-2 px-4 border-lightGray border-b">
			<SofaNormalText customClass="!font-bold !text-base">Options</SofaNormalText>
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<a v-for="item in moreOptions" :key="item.title" class="w-full flex items-center gap-2 p-4" @click.stop.prevent="item.action()">
			<SofaIcon :name="item.icon" customClass="h-[15px]" />
			<SofaNormalText>{{ item.title }}</SofaNormalText>
		</a>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { reportMaterial, shareMaterialLink } from '@app/composables/library'
import { saveToFolder } from '@app/composables/study/folders'
import { StudyMaterial } from '@modules/study'

const props = defineProps<{
	close: () => void
	material: StudyMaterial
}>()

const { id } = useAuth()
const router = useRouter()

const moreOptions = computed(() => [
	{
		icon: 'edit-option' as const,
		title: 'Edit',
		show: () => props.material?.user.id === id.value,
		action: () => {
			props.close()
			if (props.material.isQuiz()) router.push(`/study/quizzes/${props.material.id}/edit`)
			else router.push(`/study/courses/${props.material.id}/edit`)
		},
	},
	{
		icon: 'share-option' as const,
		title: 'Share',
		show: () => props.material.isPublished,
		action: () => {
			props.close()
			shareMaterialLink(props.material)
		},
	},
	{
		icon: 'report-option' as const,
		title: 'Report',
		show: () => props.material.user.id !== id.value,
		action: () => {
			props.close()
			reportMaterial(props.material)
		},
	},
	{
		icon: 'save' as const,
		title: 'Save/unsave to folder',
		show: () => props.material.isPublished,
		action: () => {
			props.close()
			saveToFolder(props.material)
		},
	},
])
</script>
