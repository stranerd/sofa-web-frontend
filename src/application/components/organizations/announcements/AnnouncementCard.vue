<template>
	<div class="bg-white flex flex-col gap-2 rounded-custom shadow-custom p-4 mdlg:p-0 mdlg:shadow-none mdlg:rounded-none">
		<div class="flex gap-3 items-start">
			<SofaAvatar :photoUrl="announcement.user?.bio.photo?.link" class="!w-[24px] !h-[24px] mdlg:!w-[48px] mdlg:!h-[48px]" />
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<SofaNormalText customClass="font-bold">
						{{ id === announcement.user.id ? 'You' : announcement.user.bio.name.full }}
					</SofaNormalText>
					<div class="flex items-center gap-1">
						<div class="h-[5px] w-[5px] bg-grayColor rounded-full"></div>
						<SofaNormalText color="text-grayColor">{{ time }}</SofaNormalText>
					</div>
					<SofaBadge v-if="classObj.isAdmin(id) || classObj.isTeacher(id)" class="hidden mdlg:block">{{ lesson }}</SofaBadge>
					<SofaBadge v-if="classObj.isAdmin(id) || classObj.isTeacher(id)" class="bg-[#6419C8] hidden mdlg:block">{{
						recipient
					}}</SofaBadge>
				</div>
				<SofaNormalText color="text-deepGray" customClass="hidden mdlg:block">{{ announcement.body }}</SofaNormalText>
			</div>
		</div>
		<div class="flex mdlg:hidden items-start flex-col gap-1">
			<SofaNormalText color="text-deepGray">{{ announcement.body }}</SofaNormalText>
			<div class="flex items-center gap-1">
				<SofaBadge v-if="classObj.isAdmin(id) || classObj.isTeacher(id)">{{ lesson }}</SofaBadge>
				<SofaBadge v-if="classObj.isAdmin(id) || classObj.isTeacher(id)" class="bg-[#6419C8]">{{ recipient }}</SofaBadge>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useTimeDifference } from '@app/composables/core/time'
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
