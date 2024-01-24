<template>
	<SubPageLayout v-if="!index && !Logic.Common.isLarge">
		<div v-if="currentClass" class="w-full h-full flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="pageTitle" />
				<span class="w-4" />
			</div>
			<div class="flex items-center gap-4 px-4 border-b border-darkLightGray overflow-x-auto">
				<router-link v-for="item in options" :key="item.route" :to="`${currentClass.pageLink}${item.route}`" class="pb-3">
					<SofaNormalText
						class="text-md font-700"
						:class="$route.path.includes(item.route) ? 'border-b-2 border-black text-deepGray pb-3' : 'text-grayColor'">
						{{ item.title }}
					</SofaNormalText>
				</router-link>
			</div>
			<div class="flex flex-col gap-4 h-full overflow-y-auto p-4">
				<slot :classObj="currentClass" />
			</div>
		</div>
	</SubPageLayout>
	<DashboardLayout v-else :topbarOptions="{ title: pageTitle }">
		<template #left-session>
			<div v-if="currentClass" class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div class="w-full flex flex-col gap-5">
					<SofaImageLoader
						customClass="w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain"
						:photoUrl="currentClass.picture">
					</SofaImageLoader>
					<SofaHeaderText>{{ currentClass.title }}</SofaHeaderText>
				</div>

				<div>
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="w-full flex flex-col gap-1">
						<router-link
							v-for="item in options"
							:key="item.route"
							class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="`${currentClass.pageLink}${item.route}`"
							exactActiveClass="bg-lightBlue font-semibold">
							<SofaIcon :name="item.icon" class="h-[17px] fill-current" />
							<SofaNormalText color="text-inherit" :content="item.title" />
						</router-link>
					</div>
				</div>
			</div>
		</template>
		<template #middle-session>
			<div v-if="currentClass" class="flex flex-col gap-4 h-full overflow-y-auto">
				<slot :classObj="currentClass" />
			</div>
		</template>
		<template #right-session>
			<div v-if="schedules.length === 0" class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<SofaHeaderText content="Live Sessions" />
				<div class="h-[1px] w-full bg-lightGray" />
				<div class="w-full flex flex-col gap-2 items-center justify-center">
					<SofaImageLoader
						customClass="w-[64px] h-[64px] flex items-center justify-center rounded-custom !object-contain"
						photoUrl="/images/calendar.png" />
					<SofaNormalText customClass="font-bold" content="There’s nothing here" />
					<SofaNormalText color="text-grayColor text-center" content="There are no live sessions scheduled" />
				</div>
			</div>
			<div
				v-else-if="schedules.length && currentClass"
				class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start">
				<SofaHeaderText content="Live Sessions" />
				<div class="mt-4 h-[1px] w-full bg-lightGray" />
				<ScheduleList :classObj="currentClass" :showFilter="false" :schedules="schedules" />
			</div>
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { useClass } from '@app/composables/organizations/classes'
import { useClassSchedules } from '@app/composables/organizations/schedules'
import { Logic } from 'sofa-logic'
import { computed } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

const props = withDefaults(
	defineProps<{
		index?: boolean
		organizationId?: string
		classId?: string
	}>(),
	{
		index: false,
		organizationId: undefined,
		classId: undefined,
	},
)

const route = useRoute()
const organizationId = props.organizationId ?? (route.params.organizationId as string)
const classId = props.classId ?? (route.params.classId as string)

const { class: currentClass } = useClass(organizationId, classId)

const pageTitle = computed(() => currentClass.value?.title ?? 'Class')
useMeta(
	computed(() => ({
		title: pageTitle.value,
	})),
)

const options = computed(() => [
	{ title: 'Lessons', icon: 'lessons', route: '/lessons' },
	{ title: 'Announcements', icon: 'announcement', route: '/announcements' },
	{ title: 'Schedule', icon: 'calendar', route: '/schedules' },
	{ title: 'About', icon: 'info', route: '/about' },
])

const { schedules } = useClassSchedules(organizationId, classId)
</script>
