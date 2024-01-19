<template>
	<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<SofaHeaderText content="Annoucements" />
		<div class="h-[1px] w-full bg-lightGray" />
		<div
			v-if="!announcements.length || !classObj.isStudent(id)"
			class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
			<img :src="emptyAnnouncementContent.imageURL" class="w-[84px] h-[84px]" />
			<SofaNormalText customClass="font-bold" content="There’s nothing here" />
			<SofaNormalText color="text-grayColor text-center" content="No announcements" />
		</div>
		<div v-else>
			<SofaBadge>{{ 'All' }}</SofaBadge>
			<AnnouncementCard
				v-for="(announcement, index) in announcements"
				:key="index"
				:classObj="classObj"
				:announcement="announcement" />
		</div>
	</div>
</template>

<script lang="ts">
import AnnouncementCard from '@app/components/organizations/announcements/AnnouncementCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { defineComponent, PropType } from 'vue'
import { useRoute } from 'vue-router'
import { ClassEntity, AnnouncementEntity } from '@modules/organizations'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAnnouncements',
	components: { AnnouncementCard },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	props: {
		classObj: {
			type: ClassEntity,
			required: true,
		},
		announcements: {
			type: Array as PropType<AnnouncementEntity[]>,
			required: true,
		},
	},
	setup(props) {
		const route = useRoute()
		const { id } = useAuth()
		const organizationId = route.params.organizationId as string
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

		const createAnnouncement = () => {
			useModals().organizations.makeAnnouncement.open({
				organizationId,
				userId: id.value,
				classObj: props.classObj,
			})
		}

		return { emptyAnnouncementContent, createAnnouncement, id }
	},
})
</script>
