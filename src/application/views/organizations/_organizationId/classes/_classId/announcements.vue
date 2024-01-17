<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<template v-if="classObj.isAdmin(userId) || classObj.isTeacher(userId)">
				<div
					v-if="announcements.length === 0"
					class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
						<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
							<img :src="emptyAnnouncementContent.imageURL" class="w-[144px] h-[144px]" />
						</div>
						<div class="flex flex-col items-start gap-1">
							<SofaHeaderText :content="emptyAnnouncementContent.title" size="xl" />
							<div class="flex flex-col gap-2 py-2">
								<div
									v-for="(content, index) in emptyAnnouncementContent.contents"
									:key="index"
									class="flex mdlg:items-center gap-1">
									<SofaIcon customClass="h-[16px]" name="checkmark-circle" />
									<SofaNormalText :content="content" color="text-grayColor" />
								</div>
							</div>
							<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6" @click="createAnnouncemnt">
								Make an announcement
							</SofaButton>
						</div>
					</div>
				</div>
				<div v-else class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<SofaHeaderText content="Annoucements" />
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="flex flex-wrap gap-4 items-center justify-between pb-6">
						<div class="w-full mdlg:w-auto grid grid-cols-2 gap-4">
							<SofaSelect
								customClass="rounded-custom !bg-transparent border col-span-1"
								placeholder="Lesson"
								borderColor="border-darkLightGray"
								:options="[{ key: '1', value: 'All lessons' }]" />
							<SofaSelect
								customClass="rounded-custom !bg-transparent border col-span-1"
								placeholder="Recipient"
								borderColor="border-darkLightGray"
								:options="[{ key: '1', value: 'All students' }]" />
						</div>
						<SofaButton
							customClass="hidden mdlg:block"
							bgColor="bg-primaryBlue"
							textColor="text-white"
							padding="py-3 px-4"
							@click="createAnnouncemnt">
							Make an announcement
						</SofaButton>
					</div>
					<AnnouncementCard
						v-for="(announcement, index) in announcements"
						:key="index"
						:userId="userId"
						:classObj="classObj"
						:announcement="announcement" />
					<SofaButton
						customClass="block mdlg:hidden mt-6"
						bgColor="bg-primaryBlue"
						textColor="text-white"
						padding="py-3 px-4"
						@click="createAnnouncemnt">
						Make an announcement
					</SofaButton>
				</div>
			</template>
			<template v-else>
				<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<SofaHeaderText content="Annoucements" />
					<div class="h-[1px] w-full bg-lightGray" />
					<div
						v-if="!announcements.length || !classObj.isStudent(userId)"
						class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
						<img :src="emptyAnnouncementContent.imageURL" class="w-[84px] h-[84px]" />
						<SofaNormalText customClass="font-bold" content="There’s nothing here" />
						<SofaNormalText color="text-grayColor text-center" content="No announcements" />
					</div>
					<div v-else>
						<div>
							<SofaBadge>{{ 'All' }}</SofaBadge>
						</div>
						<AnnouncementCard
							v-for="(announcement, index) in announcements"
							:key="index"
							:userId="userId"
							:classObj="classObj"
							:announcement="announcement" />
					</div>
				</div>
			</template>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { formatTime } from '@utils/dates'
import { formatNumber } from 'valleyed'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useModals } from '@app/composables/core/modals'
import { useAuth } from '@app/composables/auth/auth'
import { useMyAnnouncements } from '@app/composables/organizations/announcements'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAnnouncements',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const route = useRoute()
		const { id: userId } = useAuth()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const emptyAnnouncementContent = {
			imageURL: '/images/empty-announcements.png',
			title: 'Getting started with announcements',
			contents: [
				'Reach all students and teachers in this class.',
				'Make announcements to a specific lesson. ',
				'Reach anybody, anywhere, at anytime.',
				'Faster, time-saving, and stress-free communication.',
			],
		}

		const createAnnouncemnt = () => {
			useModals().organizations.makeAnnouncement.open({
				organizationId,
				classId,
				userId: userId.value,
			})
		}

		const { announcements } = useMyAnnouncements(organizationId, classId)
		return { announcements, emptyAnnouncementContent, formatTime, formatNumber, createAnnouncemnt, userId }
	},
})
</script>
