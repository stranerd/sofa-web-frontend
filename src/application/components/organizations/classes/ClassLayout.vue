<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!classInst.isEnrolled(user!)" :classInst="classInst" />
	<slot v-else-if="full" name="full" :classInst="classInst" />
	<SubPageLayout v-else-if="!Logic.Common.isLarge">
		<div class="w-full h-full flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="pageTitle" />
				<span class="w-4" />
			</div>
			<div class="flex items-center gap-4 px-4 border-b border-darkLightGray overflow-x-auto">
				<router-link
					v-for="item in options"
					:key="item.route"
					:to="`${classInst.pageLink}${item.route}`"
					class="py-2 flex items-center gap-2 relative"
					exactActiveClass="nav-link text-primaryPurple">
					<SofaIcon
						:name="item.icon"
						class="!h-[16px]"
						:class="$route.path.includes(item.route) ? '!fill-primaryPurple' : '!fill-deepGray'" />
					<SofaNormalText class="text-md text-inherit font-700">
						{{ item.title }}
					</SofaNormalText>
				</router-link>
			</div>
			<div class="flex flex-col gap-4 h-full overflow-y-auto p-4">
				<slot :classInst="classInst" />
			</div>
		</div>
	</SubPageLayout>
	<HomeLayout v-else :title="pageTitle">
		<div class="flex flex-col gap-4 h-full overflow-y-auto">
			<div class="flex flex-col bg-white rounded-custom">
				<div
					class="w-full h-[132px] rounded-t-[16px]"
					:style="`background: url(${classInst.photo?.link}); background-repeat: no-repeat; background-size:cover; background:position:center`"></div>
				<div class="flex items-center gap-6 px-6 pt-4">
					<router-link
						v-for="item in options"
						:key="item.route"
						:to="`${classInst.pageLink}${item.route}`"
						class="pb-3 flex items-center gap-2 relative"
						exactActiveClass="text-primaryPurple nav-link">
						<SofaIcon
							:name="item.icon"
							class="!h-[20px]"
							:class="$route.path.includes(item.route) ? '!fill-primaryPurple' : '!fill-deepGray'" />
						<SofaNormalText class="text-md text-inherit font-700">
							{{ item.title }}
						</SofaNormalText>
					</router-link>
				</div>
			</div>
			<div>
				<div class="hidden mdlg:flex items-center justify-between bg-white rounded-custom px-4 mdlg:px-6 py-2">
					<div class="w-full mdlg:w-1/2 hidden mdlg:flex items-center gap-2">
						<SofaIcon name="back-arrow" class="!fill-grayColor" />
						<p class="flex items-center gap-1"><span class="text-grayColor">Home / </span> Class</p>
					</div>
					<div class="w-full mdlg:w-1/2 justify-self-end flex items-center gap-2">
						<div
							class="bg-white w-full mdlg:w-[70%] px-4 py-3 rounded-lg flex flex-row items-center gap-2 border border-darkLightGray">
							<SofaIcon customClass="h-[15px]" name="search"></SofaIcon>
							<SofaTextField
								v-model="searchQuery"
								customClass="bg-transparent text-bodyBlack w-full focus:outline-none rounded-lg"
								placeholder="Search"
								padding="px-1" />
						</div>
						<QuickActions :buttons="quickActionsOptions" />
					</div>
				</div>
				<slot :classInst="classInst" />
			</div>
		</div>
	</HomeLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import { useClass } from '@app/composables/organizations/classes'
import { Logic } from 'sofa-logic'
import { useAuth } from '@app/composables/auth/auth'

const props = withDefaults(
	defineProps<{
		full?: boolean
		organizationId?: string
		classId?: string
	}>(),
	{
		full: false,
		organizationId: undefined,
		classId: undefined,
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
const searchQuery = ref('')
const quickActionsOptions = ref([
	{
		label: 'Add a student',
		action: () => {},
	},
	{
		label: 'Add a teacher',
		action: () => {},
	},
	{
		label: 'Create a quiz',
		action: () => {},
	},
	{
		label: 'Create a course',
		action: () => {},
	},
	{
		label: 'Create a class',
		action: () => {},
	},
	{
		label: 'Create a subject',
		action: () => {},
	},
])

const options = computed(() => [
	{ title: 'Feeds', icon: 'feeds' as const, route: '/announcements' },
	{ title: 'Subjects', icon: 'lessons' as const, route: '/lessons' },
	{ title: 'Live', icon: 'live' as const, route: '/schedules' },
	{ title: 'Students', icon: 'users-group' as const, route: '#' },
	{ title: 'Teachers', icon: 'tutor' as const, route: '#' },
	{ title: 'About', icon: 'info' as const, route: '/about' },
])
</script>

<style scoped>
.nav-link::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 3px;
	background-color: blue;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	opacity: 1;
	transition: opacity 0.3s;
}
</style>
