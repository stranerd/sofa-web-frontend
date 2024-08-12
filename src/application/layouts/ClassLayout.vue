<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!user || !classInst.isEnrolled(user)" :classInst="classInst" />
	<slot v-else-if="full" name="full" :classInst="classInst" />
	<DashboardLayout
		v-else
		:title="pageTitle ?? classInst.title"
		:breadcrumbs="[
			{ text: 'Home', to: '/dashboard' },
			{ text: classInst.title, to: classInst.pageLink },
			...extraCrumbs,
			{ text: title, to: $route.path },
		]"
		light
		:primary="primary"
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
						:to="tab.route"
						activeClass="text-primaryPurple !border-primaryPurple">
						<SofaIcon :name="tab.icon" class="h-[24px] fill-current" />
						<span>{{ tab.title }}</span>
					</SofaText>
				</div>
			</div>
		</template>
		<template #default="{ extras }">
			<slot name="pre-tabs" />
			<div v-if="!$screen.desktop" class="bg-white flex gap-1 px-2 overflow-x-auto">
				<SofaText
					v-for="tab in tabs"
					:key="tab.route"
					as="router-link"
					class="p-2 border-b-2 border-transparent shrink-0 flex items-center gap-2"
					:to="tab.route"
					activeClass="text-primaryPurple !border-primaryPurple">
					<SofaIcon :name="tab.icon" class="h-[18px] fill-current" />
					<span>{{ tab.title }}</span>
				</SofaText>
			</div>
			<slot name="post-tabs" />
			<div class="flex-1 overflow-y-auto">
				<slot :classInst="classInst" :extras="extras" />
			</div>
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from './DashboardLayout.vue'
import { ClassEntity } from '@modules/organizations'
import { useClass } from '@app/composables/organizations/classes'
import { useAuth } from '@app/composables/auth/auth'

const props = withDefaults(
	defineProps<{
		title: string
		pageTitle?: string
		rounded?: boolean
		extraCrumbs?: InstanceType<typeof DashboardLayout>['$props']['breadcrumbs']
		primary?: InstanceType<typeof DashboardLayout>['$props']['primary']
		tabs?: { title: string; icon: IconName; route: string }[]
		full?: boolean
	}>(),
	{
		pageTitle: undefined,
		rounded: undefined,
		extraCrumbs: () => [],
		primary: undefined,
		tabs: undefined,
		full: false,
	},
)

const model = defineModel<ClassEntity | null>({ default: null })

const route = useRoute()

const { class: classInst } = useClass(route.params.organizationId as string, route.params.classId as string)
const { user } = useAuth()

useHead(
	computed(() => ({
		title: classInst.value?.title ?? 'Class',
	})),
)

const getClassPath = (path: string) => `${classInst.value?.pageLink}/${path}`
const tabs = computed(
	() =>
		props.tabs ??
		([
			{ title: 'Feed', icon: 'feed', route: getClassPath('feed') },
			{ title: 'Courses', icon: 'lessons', route: getClassPath('courses') },
			{ title: 'Live', icon: 'live', route: getClassPath('live') },
			{ title: `Students (${classInst.value?.members.students.length})`, icon: 'users', route: getClassPath('students') },
			{ title: `Teachers (${classInst.value?.teachers.length})`, icon: 'tutor', route: getClassPath('teachers') },
			{ title: 'About', icon: 'info', route: getClassPath('about') },
		] as const),
)

watch(
	classInst,
	() => {
		model.value = classInst.value
	},
	{ immediate: true },
)
</script>
