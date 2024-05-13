<template>
	<div v-if="user" class="pt-4 px-4 mdlg:px-0 flex flex-col mdlg:grid grid-cols-4 gap-4 h-full overflow-y-auto">
		<div class="col-span-3 flex flex-col gap-4 h-full overflow-y-auto">
			<CreateAnnouncementForm
				v-if="classInst.isAdmin(user) || classInst.isTeacher(user)"
				:classInst="classInst"
				class="bg-white rounded-2xl" />

			<EmptyState
				v-if="!announcements.length"
				image="announcements"
				title="Getting started with feed"
				class="bg-white"
				:sub="[
					'See latest class updates and information',
					...(classInst.isAdmin(user) || classInst.isTeacher(user)
						? ['Make announcements to students and teachers', 'Make announcements for a specific course']
						: []),
				]" />

			<AnnouncementCard
				v-for="announcement in announcements.filter((announcement) => announcement.search(searchQuery))"
				:key="announcement.hash"
				:classInst="classInst"
				:announcement="announcement" />
			<SofaButton v-if="hasMore" padding="px-6 py-4" @click="fetchOlderAnnouncements"> Load More </SofaButton>
		</div>
		<div v-if="$screen.desktop" class="col-span-1 h-full overflow-y-auto">
			<div class="bg-white text-deepGray flex flex-col gap-4 rounded-2xl p-4">
				<div class="flex items-center justify-between">
					<SofaHeading content="Upcoming live" />
					<SofaText as="router-link" class="text-primaryBlue" content="view all" :to="`${classInst.pageLink}/live`" />
				</div>
				<EmptyState
					v-if="!upcoming.length"
					image="live"
					title="There is nothing here"
					class="bg-lightGray"
					sub="There are no live sessions scheduled" />
				<UpcomingScheduleCard
					v-for="schedule in upcoming.slice(0, 5)"
					:key="schedule.hash"
					:classInst="classInst"
					:schedule="schedule" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { useClassAnnouncements } from '@app/composables/organizations/announcements'
import { useClassSchedules } from '@app/composables/organizations/schedules'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{ classInst: ClassEntity }>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const { user } = useAuth()
const { announcements, hasMore, fetchOlderAnnouncements } = useClassAnnouncements(props.classInst.organizationId, props.classInst.id)
const { upcoming } = useClassSchedules(props.classInst.organizationId, props.classInst.id)
</script>
