<template>
	<div class="flex gap-3">
		<div>
			<SofaAvatar :photoUrl="announcement.image"></SofaAvatar>
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<SofaNormalText customClass="font-bold">{{
					userId === announcement.user.id ? 'You' : announcement.user.name
				}}</SofaNormalText>
				<div class="flex items-center gap-1">
					<div class="h-[5px] w-[5px] bg-grayColor rounded-[50%]"></div>
					<SofaNormalText color="text-grayColor">{{ time }}</SofaNormalText>
				</div>
				<SofaBadge v-if="classObj.isAdmin(userId) || classObj.isTeacher(userId)">{{ lesson }}</SofaBadge>
				<SofaBadge customClass="bg-[#6419C8]">{{ recipient }}</SofaBadge>
			</div>
			<SofaNormalText color="text-deepGray">{{ announcement.body }}</SofaNormalText>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ClassEntity } from '@modules/organizations'
import { PropType, computed } from 'vue'
import { useTimeDifference } from '@app/composables/dates'
const props = defineProps({
	announcement: {
		type: Object as any,
		required: true,
	},
	classObj: {
		type: Object as PropType<ClassEntity>,
		required: true,
	},
	userId: {
		type: String,
		default: '',
		required: true,
	},
})

const recipient = computed(() => {
	const userType = props.announcement.filter.userType
	if (userType) {
		if (userType === 'teacher') {
			return 'Teachers'
		} else {
			return 'Students'
		}
	} else {
		return 'All Members'
	}
})

const lesson = computed(() => {
	const lessonId = props.announcement.filter.lessonId
	if (lessonId) {
		return lessonId
	} else {
		return 'All Lessons'
	}
})

const time = computed(() => {
	const { time } = useTimeDifference(props.announcement.updatedAt)
	return time.value
})
</script>
