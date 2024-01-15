<template>
	<ClassLayout>
		<template #default>
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
						<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6"> Make an announcement </SofaButton>
					</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { formatTime } from '@utils/dates'
import { formatNumber } from 'valleyed'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAnnouncements',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
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
		const announcements = ref([])
		return { announcements, emptyAnnouncementContent, formatTime, formatNumber }
	},
})
</script>
