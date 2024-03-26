<template>
	<ClassLayout>
		<template v-if="user" #default="{ classInst }">
			<div
				v-if="announcements.length === 0"
				class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
				<div
					v-if="classInst.isAdmin(user) || classInst.isTeacher(user)"
					class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
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
						<SofaButton
							bgColor="bg-primaryBlue"
							textColor="text-white"
							padding="py-4 px-6"
							@click="createAnnouncement(classInst)">
							Make an announcement
						</SofaButton>
					</div>
				</div>
				<div v-else class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
					<img :src="emptyAnnouncementContent.imageURL" class="w-[84px] h-[84px]" />
					<SofaNormalText customClass="font-bold" content="There’s nothing here" />
					<SofaNormalText color="text-grayColor text-center" content="No announcements" />
				</div>
			</div>
			<div v-else class="w-full mdlg:shadow-custom mdlg:bg-white mdlg:text-bodyBlack mdlg:rounded-2xl flex flex-col gap-4 mdlg:p-6">
				<SofaHeaderText class="hidden mdlg:inline-block" content="Annoucements" />
				<div class="hidden mdlg:inline-block h-[1px] w-full bg-lightGray" />
				<div v-if="classInst.isAdmin(user) || classInst.isTeacher(user)" class="flex flex-wrap gap-4 items-center justify-between">
					<div class="w-full mdlg:w-auto grid grid-cols-2 gap-4">
						<SofaSelect
							v-model="filter.lesson"
							customClass="rounded-custom !bg-transparent border col-span-1"
							placeholder="Lesson"
							selectFirstOnMount
							borderColor="border-darkLightGray"
							:options="[
								{ key: null, value: 'All lessons' },
								...classInst.lessons.map((l) => ({ key: l.id, value: l.title })),
							]" />
						<SofaSelect
							v-model="filter.userType"
							customClass="rounded-custom !bg-transparent border col-span-1"
							placeholder="Recipient"
							selectFirstOnMount
							borderColor="border-darkLightGray"
							:options="userTypesOption" />
					</div>
					<SofaButton
						customClass="hidden mdlg:block"
						bgColor="bg-primaryBlue"
						textColor="text-white"
						padding="py-3 px-4"
						@click="createAnnouncement(classInst)">
						Make an announcement
					</SofaButton>
				</div>
				<div v-else class="flex gap-2 mdlg:gap-4 overflow-x-auto scrollbar-hide">
					<a
						v-for="l in [{ key: null, value: 'All' }, ...classInst.lessons.map((l) => ({ key: l.id, value: l.title }))]"
						:key="l.value"
						class="px-3 py-2 border rounded-custom truncate"
						:class="{
							'bg-primaryPurple text-white border-primaryPurple': filter.lesson === l.key,
							'bg-white text-deepGray border-darkLightGray': filter.lesson !== l.key,
						}"
						@click="filter.lesson = l.key">
						{{ l.value }}
					</a>
				</div>
				<AnnouncementCard
					v-for="announcement in filteredAnnouncements"
					:key="announcement.hash"
					:classInst="classInst"
					:announcement="announcement" />
				<SofaButton
					v-if="hasMore"
					textColor="text-grayColor"
					bgColor="bg-transparent"
					class="!shadow-none !rounded-none"
					@click="fetchOlderAnnouncements">
					Load More
				</SofaButton>
				<SofaButton
					v-if="classInst.isAdmin(user) || classInst.isTeacher(user)"
					class="block mdlg:hidden"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					padding="py-3 px-4"
					@click="createAnnouncement(classInst)">
					Make an announcement
				</SofaButton>
			</div>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useClassAnnouncements } from '@app/composables/organizations/announcements'
import { ClassEntity, MemberTypes } from '@modules/organizations'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdAnnouncements',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const route = useRoute()
		const { user } = useAuth()
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

		const filter = reactive({
			lesson: null as string | null,
			userType: null as MemberTypes | null,
		})

		const userTypesOption = [
			{ key: null, value: 'Both Teachers and Students' },
			{ key: MemberTypes.student, value: 'Students Only' },
			{ key: MemberTypes.teacher, value: 'Teachers Only' },
		]

		const createAnnouncement = (classInst: ClassEntity) => {
			useModals().organizations.createAnnouncement.open({
				organizationId,
				classInst,
			})
		}

		const { announcements, hasMore, fetchOlderAnnouncements } = useClassAnnouncements(organizationId, classId)
		const filteredAnnouncements = computed(() =>
			announcements.value.filter((an) => {
				const lessonMatch = an.filter.lessonIds && filter.lesson ? an.filter.lessonIds.includes(filter.lesson) : true
				const userTypeMatch = an.filter.userTypes && filter.userType ? an.filter.userTypes.includes(filter.userType) : true
				return lessonMatch && userTypeMatch
			}),
		)

		return {
			announcements,
			fetchOlderAnnouncements,
			filteredAnnouncements,
			user,
			emptyAnnouncementContent,
			createAnnouncement,
			filter,
			userTypesOption,
			hasMore,
		}
	},
})
</script>
