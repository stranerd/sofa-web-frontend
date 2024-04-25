<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!user || !classInst.isEnrolled(user)" :classInst="classInst" />
	<DashboardLayout
		v-else
		:title="title"
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: classInst.title, to: classInst.pageLink },
			{ text: title, to: $route.path },
		]"
		light
		:rounded="rounded">
		<template #pre-crumbs>
			<div v-if="$screen.desktop" class="w-full flex flex-col mb-4">
				<SofaImageLoader :photoUrl="classInst.picture" class="h-[148px] w-full rounded-t-2xl">
					<div class="flex flex-col absolute bottom-0 left-0 p-6 bg-[00000050] text-white">
						<SofaHeading :content="classInst.title" size="title2" />
						<router-link class="gap-2 flex items-center" :to="`/profile/${classInst.user.id}`">
							<SofaAvatar :size="24" :photoUrl="classInst.user.bio.photo?.link" :userId="classInst.user.id" />
							<SofaText clamp :content="classInst.user.bio.publicName" />
							<SofaIcon v-if="classInst.user.roles.isVerified" name="verify" class="h-[13px]" />
							<SofaIcon v-if="classInst.user.type?.type === UserType.teacher" name="tutor-bagde" class="h-[13px]" />
						</router-link>
					</div>
				</SofaImageLoader>
				<div class="bg-white flex gap-4 px-6 overflow-x-auto rounded-b-2xl">
					<SofaText
						v-for="tab in tabs"
						:key="tab.route"
						as="router-link"
						class="py-4 border-b-2 border-transparent shrink-0 flex items-center gap-2"
						:to="`${classInst.pageLink}${tab.route}`"
						exactActiveClass="text-primaryPurple !border-primaryPurple">
						<SofaIcon :name="tab.icon" class="h-[24px] fill-current" />
						<span>{{ tab.title }}</span>
					</SofaText>
				</div>
			</div>
		</template>
		<div v-if="!$screen.desktop" class="bg-white flex gap-1 px-2 overflow-x-auto">
			<SofaText
				v-for="tab in tabs"
				:key="tab.route"
				as="router-link"
				class="p-2 border-b-2 border-transparent shrink-0 flex items-center gap-2"
				:to="`${classInst.pageLink}${tab.route}`"
				exactActiveClass="text-primaryPurple !border-primaryPurple">
				<SofaIcon :name="tab.icon" class="h-[18px] fill-current" />
				<span>{{ tab.title }}</span>
			</SofaText>
		</div>
		<div class="grow overflow-y-auto">
			<slot :classInst="classInst" :user="user" />
		</div>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { UserType } from '@modules/users'
import { useClass } from '@app/composables/organizations/classes'
import { useAuth } from '@app/composables/auth/auth'

const props = withDefaults(
	defineProps<{
		title: string
		organizationId?: string
		classId?: string
		rounded?: boolean
	}>(),
	{
		organizationId: undefined,
		classId: undefined,
		rounded: undefined,
	},
)

const route = useRoute()
const organizationId = props.organizationId ?? (route.params.organizationId as string)
const classId = props.classId ?? (route.params.classId as string)

const { class: classInst } = useClass(organizationId, classId)
const { user } = useAuth()

const pageTitle = computed(() => classInst.value?.title ?? 'Class')
useMeta(
	computed(() => ({
		title: pageTitle.value,
	})),
)

const tabs = computed(
	() =>
		[
			{ title: 'Subjects', icon: 'lessons', route: '/subjects' },
			{ title: 'Announcements', icon: 'announcement', route: '/announcements' },
			{ title: 'Live', icon: 'calendar', route: '/schedules' },
			{ title: 'About', icon: 'info', route: '/about' },
		] as const,
)
</script>
