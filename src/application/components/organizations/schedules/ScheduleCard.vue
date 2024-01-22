<template>
	<div
		class="bg-white shadow-custom rounded-custom px-4 flex flex-col gap-2 py-6 mdlg:bg-transparent mdlg:shadow-none mdlg:rounded-none mdlg:px-0 mdlg:border-b border-lightGray">
		<SofaNormalText :content="schedule.lessonTitle" color="text-grayColor" />
		<SofaHeaderText :content="schedule.title" />
		<div class="flex items-center gap-1">
			<SofaAvatar :photoUrl="schedule.user?.bio.photo?.link" class="!w-[24px] !h-[24px]" />
			<SofaNormalText :content="schedule.user.bio.name.full" color="text-deepGray" />
		</div>
		<div class="flex items-center gap-2">
			<SofaIcon name="calendar" class="h-[17px] fill-current" />
			<SofaNormalText :content="schedule.time" color="text-deepGray" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	props: {
		schedule: {
			type: Object as any,
			required: true,
		},
	},
})
</script>
