<template>
	<div class="flex flex-col gap-4">
		<template v-for="task in tasks" :key="task.title">
			<div
				v-if="task.list.find((s) => !s.isDone)"
				class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:!bg-white rounded-2xl flex flex-col mdlg:gap-4 gap-1">
				<div class="w-full flex gap-2 items-center">
					<SofaNormalText class="!font-bold" :content="task.title" />
				</div>

				<div
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide">
					<SofaIconCard v-for="item in task.list" :key="item.title" :data="item" class="shrink-0" @click="item.action?.()">
						<template #title>
							<SofaNormalText customClass="!font-bold" :content="item.title" />
						</template>
					</SofaIconCard>
				</div>
			</div>
		</template>

		<template v-for="material in materials" :key="material.title">
			<div class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
					<SofaNormalText class="!font-bold" :content="material.title" />
					<SofaNormalText color="text-primaryPink" as="router-link" to="/marketplace" class="mdlg:hidden" content="View all" />
				</div>

				<div
					v-if="material.list.length"
					class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto scrollbar-hide">
					<StudyMaterialCard v-for="m in material.list.slice(0, 4)" :key="m.hash" :material="m" class="mdlg:bg-lightGray" />
				</div>
				<div v-else class="pr-4 mdlg:pr-0">
					<SofaEmptyState :title="material.emptyTitle" :subTitle="material.emptySub" customClass="!h-[230px]" />
				</div>

				<SofaNormalText
					v-if="material.list.length"
					color="text-primaryPink"
					class="pr-4 hidden mdlg:inline"
					as="router-link"
					to="/marketplace"
					content="View all" />
			</div>
		</template>

		<div class="w-full mdlg:shadow-custom px-4 mdlg:p-0 mdlg:bg-white rounded-2xl flex flex-col gap-4">
			<div class="w-full flex flex-col gap-3 justify-center items-center py-9 px-6 rounded-lg bg-primaryPurple">
				<SofaIcon class="h-[28px] fill-white" name="search" />
				<div class="w-full flex flex-col gap-2 justify-center items-center py-2">
					<SofaNormalText color="text-white" class="!font-bold" content="Discover more" />
					<SofaNormalText color="text-white" class="!font-semibold">
						There are lots of quizzes and courses that you can learn from, so start searching!
					</SofaNormalText>
				</div>
				<SofaButton bgColor="bg-white" padding="py-1 px-3" textColor="text-deepGray" @click="$router.push('/marketplace')">
					Explore more
				</SofaButton>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { useMyStudy } from '@app/composables/study'

const { user, userType } = useAuth()
const router = useRouter()

const { materials: recent } = useMyStudy('recent')
const { materials: suggested } = useMyStudy('suggested')
const { materials: myOrgs } = useMyStudy('byMyOrgs')

const profileSteps = computed(() =>
	user.value
		? [
				{
					title: 'Add profile',
					subTitle: 'Picture, name and bio',
					icon: 'add-profile' as const,
					iconSize: 'h-[46px]',
					isDone: user.value?.checkTaskState('profile_setup'),
					action: () => router.push('/settings/profile#profile'),
				},
				{
					title: userType.value.isTeacher ? 'Add experience' : 'Add education',
					subTitle: 'Current place you teach at',
					icon: 'add-education' as const,
					iconSize: 'h-[46px]',
					isDone: user.value?.checkTaskState('education_setup'),
					action: () => router.push('/settings/profile#type'),
				},
				/* {
					title: 'Add phone',
					subTitle: 'Enter your phone number',
					icon: 'add-phone' as const,
					iconSize: 'h-[46px]',
					isDone: !!auth.value?.phone,
					action: () => router.push('/settings/profile#contact'),
				}, */
			]
		: [],
)

const studyMaterialsSteps = computed(() =>
	user.value
		? [
				{
					title: 'Create a quiz',
					subTitle: 'Build a customized quiz with different question types and study modes',
					icon: 'pink-question' as const,
					iconSize: 'h-[46px]',
					isDone: user.value?.checkTaskState('create_quiz'),
					action: () => router.push('/study/quizzes/create'),
				},
				{
					title: 'Create a course',
					subTitle: 'Develop and publish a series of educational material on a particular subject',
					icon: 'orange-list' as const,
					iconSize: 'h-[46px]',
					isDone: user.value?.checkTaskState('create_course'),
					action: () => router.push('/study/courses/create'),
				},
			]
		: [],
)

const takeOnTasks = computed(() =>
	user.value
		? [
				{
					title: 'Learn a quiz',
					subTitle: 'Practice alone with a quiz',
					icon: 'learn-quiz' as const,
					isDone: user.value?.checkTaskState('learn_quiz'),
					iconSize: 'h-[46px]',
					action: () => router.push('/marketplace'),
				},
				{
					title: 'Study flashcards',
					subTitle: 'Learn flashcards on a quiz',
					icon: 'study-flashcard' as const,
					isDone: user.value?.checkTaskState('quiz_flashcard'),
					iconSize: 'h-[46px]',
					action: () => router.push('/marketplace'),
				},
				{
					title: 'Play a quiz game ',
					subTitle: 'Challenge your friends',
					icon: 'play-quiz' as const,
					isDone: user.value?.checkTaskState('quiz_game'),
					iconSize: 'h-[46px]',
					action: () => router.push('/marketplace'),
				},
			]
		: [],
)

const tasks = computed(() => [
	{ list: profileSteps.value, title: 'Complete your account setup' },
	{ list: studyMaterialsSteps.value, title: 'Create study materials' },
	{ list: takeOnTasks.value, title: 'Take on some tasks' },
])

const materials = computed(() => [
	{
		list: suggested.value,
		title: 'Suggested for you',
		emptyTitle: 'No suggested materials',
		emptySub: 'We could not find any suggested materials',
	},
	{
		list: recent.value,
		title: 'Recent study materials',
		emptyTitle: 'No recent materials',
		emptySub: 'We could not find any recent materials',
	},
	...(myOrgs.value.length
		? [
				{
					list: myOrgs.value,
					title: 'From your organizations',
					emptyTitle: 'No materials found',
					emptySub: 'We could not find any materials from your organizations',
				},
			]
		: []),
])
</script>
