<template>
	<div class="flex gap-3">
		<SofaAvatar :photoUrl="announcement.user?.bio.photo?.link" />
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<SofaNormalText customClass="font-bold">
					{{ id === announcement.user.id ? 'You' : announcement.user.bio.name.full }}
				</SofaNormalText>
				<div class="flex items-center gap-1">
					<div class="h-[5px] w-[5px] bg-grayColor rounded-full"></div>
					<SofaNormalText color="text-grayColor">{{ time }}</SofaNormalText>
				</div>
				<SofaBadge v-if="classObj.isAdmin(id) || classObj.isTeacher(id)">{{ lesson }}</SofaBadge>
				<SofaBadge customClass="bg-[#6419C8]">{{ recipient }}</SofaBadge>
			</div>
			<SofaNormalText color="text-deepGray">{{ announcement.body }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useTimeDifference } from '@app/composables/dates'
import { AnnouncementEntity, ClassEntity, MemberTypes } from '@modules/organizations'
import { computed } from 'vue'
const props = defineProps<{
	announcement: AnnouncementEntity
	classObj: ClassEntity
}>()

const { id } = useAuth()
const { time } = useTimeDifference(props.announcement.updatedAt)

const recipient = computed(() => {
	const userType = props.announcement.filter.userType
	if (userType === MemberTypes.teacher) return 'Teachers'
	if (userType === MemberTypes.student) return 'Students'
	return 'All Members'
})

const lesson = computed(() => {
	const lessonId = props.announcement.filter.lessonId
	if (lessonId) return props.classObj.getLesson(lessonId)?.title || lessonId
	else return 'All Lessons'
})
</script>
