<template>
	<SubPageLayout v-if="!index && !Logic.Common.isLarge">
		<div class="w-full h-full flex flex-col justify-start relative">
			<div class="w-full flex items-center gap-3 justify-between bg-lightGray p-4">
				<SofaIcon class="h-[15px]" name="back-arrow" @click="Logic.Common.goBack()" />
				<SofaNormalText class="!font-bold !text-base" :content="pageTitle" />
				<span class="w-4" />
			</div>
			<div class="flex items-center justify-between px-4 border-b border-darkLightGray">
				<router-link v-for="item in options" :key="item.route" :to="item.route" class="py-4">
					<SofaNormalText
						:customClass="
							$route.path.includes(item.route)
								? 'text-md font-700 border-b-2 border-black text-deepGray pb-4'
								: 'text-md font-700 text-grayColor'
						">
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
			<div class="w-full shadow-custom bg-white rounded-2xl flex flex-col p-4 gap-4">
				<div class="w-full flex flex-col gap-5">
					<SofaImageLoader
						customClass="w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain"
						:photoUrl="currentClass?.picture">
					</SofaImageLoader>
					<SofaHeaderText>{{ currentClass?.title }}</SofaHeaderText>
				</div>

				<div>
					<div class="h-[1px] w-full bg-lightGray" />
					<div class="w-full flex flex-col gap-1">
						<router-link
							v-for="item in options"
							:key="item.route"
							class="w-full flex items-center gap-3 py-3 rounded-lg text-deepGray hover:bg-lightBlue"
							:to="item.route"
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
				<slot :classObj="currentClass" />
			</div>
		</template>
		<template #right-session>
			<div class="w-full shadow-custom p-4 bg-white rounded-2xl flex flex-col items-start gap-3">
				<SofaHeaderText>{{ 'Live Sessions' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />
				<div class="w-full flex flex-col gap-2 items-center justify-center">
					<SofaImageLoader
						customClass="w-[64px] h-[64px] flex items-center justify-center rounded-custom !object-contain"
						photoUrl="/images/calendar.png">
					</SofaImageLoader>
					<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
					<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
				</div>
			</div>
		</template>
	</DashboardLayout>
</template>

<script setup lang="ts">
import { useMeta } from 'vue-meta'
import { Logic } from 'sofa-logic'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClass } from '@app/composables/organizations/classes'
import { ClassEntity } from '@modules/organizations'

withDefaults(
	defineProps<{
		index?: boolean
	}>(),
	{
		index: false,
	},
)

const pageTitle = ref('Class')

useMeta(
	computed(() => ({
		title: pageTitle.value,
	})),
)

const route = useRoute()
const organizationId = route.params.id as string
const classId = route.params.classId as string
const { fetchClass } = useClass(organizationId, classId)

const currentClass = ref<ClassEntity | null | undefined>(null)

const options = computed(() => [
	{ title: 'Lessons', icon: 'lessons', route: `/organizations/${organizationId}/classes/${classId}/lessons` },
	{ title: 'Announcements', icon: 'announcement', route: `/organizations/${organizationId}/classes/${classId}/announcements` },
	{ title: 'Schedule', icon: 'calendar', route: `/organizations/${organizationId}/classes/${classId}/schedules` },
	{ title: 'About', icon: 'info', route: `/organizations/${organizationId}/classes/${classId}/about` },
])

onMounted(async () => {
	currentClass.value = await fetchClass()
	if (currentClass.value) {
		pageTitle.value = currentClass.value?.title || 'Class'
	}
})
</script>
