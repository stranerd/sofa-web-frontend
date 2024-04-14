<template>
	<div v-if="user" class="bg-white flex flex-col gap-2 rounded-custom shadow-custom p-4 mdlg:p-0 mdlg:shadow-none mdlg:rounded-none">
		<div class="flex gap-3 items-start">
			<SofaAvatar :photoUrl="announcement.user?.bio.photo?.link" :size="$screen.desktop ? 48 : 24" />
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
						{{ lessons }}
					</SofaBadge>
					<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="bg-[#6419C8] hidden mdlg:block">
						{{ recipients }}
					</SofaBadge>
				</div>
				<SofaNormalText color="text-deepGray" :content="announcement.body" customClass="hidden mdlg:block" />
			</div>
		</div>
		<div class="flex mdlg:hidden items-start flex-col gap-1">
			<SofaNormalText color="text-deepGray">{{ announcement.body }}</SofaNormalText>
			<div class="flex items-center gap-1">
				<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)">{{ lessons }}</SofaBadge>
				<SofaBadge v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="bg-[#6419C8]">{{ recipients }} </SofaBadge>
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

const recipients = computed(() => {
	const userTypes = props.announcement.filter.userTypes
	if (!userTypes) return 'All Members'
	const results: string[] = []
	if (userTypes.includes(MemberTypes.teacher)) results.push('Teachers')
	if (userTypes.includes(MemberTypes.student)) results.push('Students')
	return results.join(', ')
})

const lessons = computed(() => {
	const lessonIds = props.announcement.filter.lessonIds
	if (!lessonIds) return 'All Lessons'
	return lessonIds.map((lessonId) => props.classInst.getLesson(lessonId)?.title ?? lessonId).join(', ')
})
</script>
