<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Make an announcement" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<form class="flex flex-col gap-8" @submit.prevent="makeAnnouncement">
			<SofaTextarea
				v-model="factory.body"
				textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
				:error="factory.errors.body"
				placeholder="Write announcemnt" />
			<div class="grid grid-cols-2">
				<SofaSelect
					v-model="factory.lessonId"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select lesson"
					borderColor="border-transparent"
					:error="factory.errors.lessonId"
					:options="lessonOptions" />
				<SofaSelect
					v-model="factory.userType"
					customClass="rounded-custom !bg-lightGray col-span-1"
					placeholder="Select audience"
					borderColor="border-transparent"
					:error="factory.errors.userType"
					:options="userTypesOption" />
			</div>
			<div class="flex items-center justify-between">
				<SofaButton
					bgColor="bg-grayColor"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="hidden mdlg:block"
					@click="close">
					Cancel
				</SofaButton>
				<SofaButton
					bgColor="bg-primaryBlue"
					type="submit"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="w-full mdlg:w-auto">
					Post
				</SofaButton>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { useMakeAnnouncement } from '@app/composables/organizations/announcements'
import { computed } from 'vue'
const props = defineProps<{
	organizationId: string
	classId: string
	close: () => void
}>()

const { factory, makeAnnouncement } = useMakeAnnouncement(props.organizationId, props.classId)

const lessonOptions = computed(() => {
	// TODO
	/**
	 * For teachers usertype, only show lessons which the teachers belongs to
	 * For admins, show every lessons plus the all lessons options
	 */
	return [{ key: null, value: 'All lessons' }]
})

const userTypesOption = computed(() => {
	// TODO
	/**
	 * For teachers, only show student option
	 * For admins, show student, teachers and both teachers and student options
	 */
	if (props) {
	}
	return [{ key: null, value: 'Both Teachers and Students' }]
})
</script>
