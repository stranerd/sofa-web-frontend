<template>
	<div>
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
					<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6" @click="createAnnouncement">
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
						v-model="selectedLessonFilter"
						customClass="rounded-custom !bg-transparent border col-span-1"
						placeholder="Lesson"
						borderColor="border-darkLightGray"
						:options="lessonOptions" />
					<SofaSelect
						customClass="rounded-custom !bg-transparent border col-span-1"
						placeholder="Recipient"
						borderColor="border-darkLightGray"
						:options="userTypesOption" />
				</div>
				<SofaButton
					customClass="hidden mdlg:block"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					padding="py-3 px-4"
					@click="createAnnouncement">
					Make an announcement
				</SofaButton>
			</div>
			<AnnouncementCard
				v-for="(announcement, index) in announcements"
				:key="index"
				:classObj="classObj"
				:announcement="announcement" />
			<SofaButton
				customClass="block mdlg:hidden mt-6"
				bgColor="bg-primaryBlue"
				textColor="text-white"
				padding="py-3 px-4"
				@click="createAnnouncement">
				Make an announcement
			</SofaButton>
		</div>
	</div>
</template>

<script lang="ts">
import AnnouncementCard from '@app/components/organizations/announcements/AnnouncementCard.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { defineComponent, PropType, computed, ref, watch } from 'vue'
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
		const selectedLessonFilter = ref('')
		const selectedUserTypeFilter = ref('')
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

		const lessonOptions = computed(() => {
			// For teachers, return only lessons where user is a teacher
			if (props.classObj.isTeacher(id.value)) {
				const lessons = props.classObj.lessons.filter((lesson) => lesson.users.teachers.includes(id.value))
				if (lessons.length > 0) {
					return lessons.map((l) => {
						return { key: l.id, value: l.title }
					})
				} else {
					return []
				}
			}
			// For admins, return every lessons plus all students
			if (props.classObj.isAdmin(id.value)) {
				const lessons = props.classObj.lessons
				if (lessons.length > 0) {
					const options = lessons.map((l) => {
						return { key: l.id || null, value: l.title }
					})
					options.unshift({ key: null, value: 'All lessons' })
					return options
				} else {
					return [{ key: null, value: 'All lessons' }]
				}
			}
			return []
		})

		const userTypesOption = computed(() => {
			// For teachers return only student
			if (props.classObj.isTeacher(id.value)) {
				return [{ key: 'student', value: 'Students Only' }]
			}
			// For admins, return all user types
			if (props.classObj.isAdmin(id.value)) {
				return [
					{ key: null, value: 'Both Teachers and Students' },
					{ key: 'student', value: 'Students Only' },
					{ key: 'teacher', value: 'Teachers Only' },
				]
			}
			return []
		})

		watch(selectedLessonFilter, () => {})

		return {
			emptyAnnouncementContent,
			createAnnouncement,
			id,
			lessonOptions,
			userTypesOption,
			selectedLessonFilter,
			selectedUserTypeFilter,
		}
	},
})
</script>
