<template>
	<slot v-if="!classInst" name="notfound" />
	<ExploreClassView v-else-if="!user || !classInst.isEnrolled(user)" :classInst="classInst" />
	<slot v-else-if="full" name="full" :classInst="classInst" :user="user" />
	<ExpandedLayout v-else-if="!Logic.Common.isLarge" :hide="{ top: true, bottom: true }">
		<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4 sticky top-0">
			<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
			<SofaNormalText class="!font-bold !text-base" :content="pageTitle" />
			<span class="w-4" />
		</div>
		<div class="w-full flex items-center gap-4 px-4 border-b border-darkLightGray overflow-x-auto">
			<router-link v-for="item in options" :key="item.route" :to="`${classInst.pageLink}${item.route}`" class="pb-3">
				<SofaNormalText
					class="text-md font-700 border-b-2 pb-1"
					:class="$route.path.includes(item.route) ? 'border-black text-deepGray' : 'text-grayColor border-transparent'">
					{{ item.title }}
				</SofaNormalText>
			</router-link>
		</div>
		<div class="w-full flex flex-col gap-4 flex-1 overflow-y-auto p-4">
			<slot :classInst="classInst" :user="user" />
		</div>
	</ExpandedLayout>
	<DashboardLayout v-else :topbarOptions="{ title: pageTitle }">
		<template #left-session>
			<div v-if="classInst" class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div class="w-full flex flex-col gap-5">
					<SofaImageLoader
						customClass="w-full h-[233px] flex items-center justify-center relative rounded-custom !object-contain"
						:photoUrl="classInst.picture">
					</SofaImageLoader>
					<SofaHeaderText>{{ classInst.title }}</SofaHeaderText>
				</div>

				<div>
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="w-full flex flex-col gap-1">
						<router-link
							v-for="item in options"
							:key="item.route"
							class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="`${classInst.pageLink}${item.route}`"
							exactActiveClass="bg-lightBlue font-semibold">
							<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
							<SofaNormalText color="text-inherit" :content="item.title" />
						</router-link>
					</div>
				</div>
			</div>
		</template>
		<template #middle-session>
			<div class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :classInst="classInst" :user="user" />
			</div>
		</template>
		<template #right-session>
			<SidebarScheduleList :classInst="classInst" />
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const options = computed(() => [
	{ title: 'Lessons', icon: 'lessons' as const, route: '/lessons' },
	{ title: 'Announcements', icon: 'announcement' as const, route: '/announcements' },
	{ title: 'Schedule', icon: 'calendar' as const, route: '/schedules' },
	{ title: 'About', icon: 'info' as const, route: '/about' },
])
</script>
