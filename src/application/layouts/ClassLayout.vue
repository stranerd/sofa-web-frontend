<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!user || !classInst.isEnrolled(user)" :classInst="classInst" />
	<DashboardLayout
		v-else
		:title="classInst.title"
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
						:to="`${classInst.pageLink}${tab.route}`"
						exactActiveClass="text-primaryPurple !border-primaryPurple">
						<SofaIcon :name="tab.icon" class="h-[24px] fill-current" />
						<span>{{ tab.title }}</span>
					</SofaText>
				</div>
			</div>
		</template>
		<template #default="{ extras }">
			<slot v-if="!$screen.desktop" name="pre-tabs" />
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
				<slot :classInst="classInst" :extras="extras" />
			</div>
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import DashboardLayout from './DashboardLayout.vue'
import { useClass } from '@app/composables/organizations/classes'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity } from '@modules/organizations'

const props = withDefaults(
	defineProps<{
		title: string
		rounded?: boolean
		extraCrumbs?: InstanceType<typeof DashboardLayout>['$props']['breadcrumbs']
		primary?: InstanceType<typeof DashboardLayout>['$props']['primary']
		tabs?: { title: string; icon: IconName; route: string }[]
	}>(),
	{
		rounded: undefined,
		extraCrumbs: () => [],
		primary: undefined,
		tabs: undefined,
	},
)

const model = defineModel<ClassEntity | null>({ default: null })

const route = useRoute()

const { class: classInst } = useClass(route.params.organizationId as string, route.params.classId as string)
const { user } = useAuth()

const pageTitle = computed(() => classInst.value?.title ?? 'Class')
useMeta(
	computed(() => ({
		title: pageTitle.value,
	})),
)

const tabs = computed(
	() =>
		props.tabs ??
		([
			{ title: 'Feed', icon: 'feed', route: '/feed' },
			{ title: 'Subjects', icon: 'lessons', route: '/subjects' },
			{ title: 'Live', icon: 'live', route: '/live' },
			{ title: `Students (${classInst.value?.members.students.length})`, icon: 'users', route: '/students' },
			{ title: `Teachers (${classInst.value?.teachers.length})`, icon: 'tutor', route: '/teachers' },
			{ title: 'About', icon: 'info', route: '/about' },
		] as const),
)

watch(classInst, () => {
	model.value = classInst.value
})
</script>
