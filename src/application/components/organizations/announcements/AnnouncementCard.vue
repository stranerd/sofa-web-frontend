<template>
	<div v-if="user" class="bg-white flex flex-col gap-2 rounded-custom shadow-custom p-4 mdlg:p-0 mdlg:shadow-none mdlg:rounded-none">
		<div class="flex gap-3 items-start">
			<SofaAvatar :photoUrl="announcement.user?.bio.photo?.link" class="!w-[24px] !h-[24px] mdlg:!w-[48px] mdlg:!h-[48px]" />
			<div class="flex flex-col gap-2">
				<div class="flex items-center gap-2">
					<SofaNormalText customClass="font-bold">
						{{ user.id === announcement.user.id ? 'You' : announcement.user.bio.publicName }}
					</SofaNormalText>
					<div class="flex items-center gap-1">
						<div class="h-[5px] w-[5px] bg-grayColor rounded-full"></div>
						<SofaNormalText color="text-grayColor">{{ time }}</SofaNormalText>
					</div>
					<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="hidden mdlg:block">
						{{ lesson }}
					</SofaBadge>
					<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="bg-[#6419C8] hidden mdlg:block">
						{{ recipient }}
					</SofaBadge>
				</div>
				<SofaNormalText color="text-deepGray" :content="announcement.body" customClass="hidden mdlg:block" />
			</div>
		</div>
		<div class="flex mdlg:hidden items-start flex-col gap-1">
			<SofaNormalText color="text-deepGray">{{ announcement.body }}</SofaNormalText>
			<div class="flex items-center gap-1">
				<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)">{{ lesson }}</SofaBadge>
				<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="bg-[#6419C8]">{{ recipient }} </SofaBadge>
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

const { user } = useAuth()
const { time } = useTimeDifference(props.announcement.createdAt)

const recipient = computed(() => {
	const userType = props.announcement.filter.userType
	if (userType === MemberTypes.teacher) return 'Teachers'
	if (userType === MemberTypes.student) return 'Students'
	return 'All Members'
})

const lesson = computed(() => {
	const lessonId = props.announcement.filter.lessonId
	if (lessonId) return props.classInst.getLesson(lessonId)?.title || lessonId
	else return 'All Lessons'
})
</script>
