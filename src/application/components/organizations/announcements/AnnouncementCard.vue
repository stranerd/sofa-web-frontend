<template>
	<div class="bg-white flex flex-col gap-3 rounded-2xl p-4">
		<div class="flex items-center gap-2">
			<SofaBadge color="gray" inverted>Courses > {{ lessons }}</SofaBadge>
			<SofaBadge color="gray" inverted>Recipeints > {{ recipients }}</SofaBadge>
		</div>
		<SofaText :content="announcement.body" />
		<div class="flex gap-2 items-center">
			<SofaAvatar :photoUrl="announcement.user.bio.photo?.link" :size="36" />
			<div class="flex flex-col">
				<SofaHeading :content="id === announcement.user.id ? 'You' : announcement.user.bio.publicName" class="leading-none" />
				<SofaText class="text-grayColor" size="sub" :content="time" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useTimeDifference } from '@app/composables/core/time'
import { AnnouncementEntity, ClassEntity, MemberTypes } from '@modules/organizations'
const props = defineProps<{
	announcement: AnnouncementEntity
	classInst: ClassEntity
}>()

const { id } = useAuth()
const { time } = useTimeDifference(props.announcement.createdAt)

const recipients = computed(() => {
	const userTypes = props.announcement.filter.userTypes
	if (!userTypes) return 'All'
	const results: string[] = []
	if (userTypes.includes(MemberTypes.teacher)) results.push('Teachers')
	if (userTypes.includes(MemberTypes.student)) results.push('Students')
	return results.join(', ')
})

const lessons = computed(() => {
	const lessonIds = props.announcement.filter.lessonIds
	if (!lessonIds) return 'All'
	return lessonIds.map((lessonId) => props.classInst.getLesson(lessonId)?.title ?? lessonId).join(', ')
})
</script>
