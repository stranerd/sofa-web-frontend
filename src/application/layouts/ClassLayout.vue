<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!user || !classInst.isEnrolled(user)" :classInst="classInst" />
	<DashboardLayout
		v-else
		:title="classInst.title"
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
					<div class="flex flex-col justify-end w-full h-full bg-black/15 p-6 text-white rounded-t-2xl">
						<SofaHeading :content="classInst.title" size="title2" />
						<UserName :user="classInst.user" as="router-link" />
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
		<template #default="{ extras }">
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
			<div class="h-full overflow-y-auto">
				<slot :classInst="classInst" :extras="extras" />
			</div>
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
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
			{ title: 'Feed', icon: 'feed', route: '/feed' },
			{ title: 'Subjects', icon: 'lessons', route: '/subjects' },
			{ title: 'Live', icon: 'live', route: '/live' },
			{ title: `Students (${classInst.value?.members.students.length})`, icon: 'users', route: '/students' },
			{ title: `Teachers (${classInst.value?.teachers.length})`, icon: 'tutor', route: '/teachers' },
			{ title: 'About', icon: 'info', route: '/about' },
		] as const,
)
</script>
