<template>
	<div v-if="user" class="px-4 mdlg:px-0">
		<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
			<SofaNormalText class="!font-bold" content="Overview" />

			<div class="grid grid-cols-2 md:grid-cols-2 gap-4">
				<div
					v-for="stat in [
						// { label: 'Classes', value: user.account.meta.classes, icon: 'classes', color: '#3296C8' },
						// { label: 'Lessons', value: user.account.meta.lessons, icon: 'lessons', color: '#3219AF' },
						{ label: 'Quizzes', value: user.account.meta.publishedQuizzes, icon: 'quiz', color: '#4BAF7D' },
						{ label: 'Courses', value: user.account.meta.publishedCourses, icon: 'courses', color: '#FF4BC8' },
						// { label: 'Teachers', value: user.account.meta.teachers, icon: 'tutor', color: '#FA9632' },
						// { label: 'Students', value: user.account.meta.students, icon: 'user-unfilled', color: '#197DFA' },
					]"
					:key="stat.label"
					class="flex flex-col-reverse sm:flex-row items-start sm:items-center gap-2 sm:gap-4 justify-between col-span-1 bg-lightGray p-4 md:p-6 rounded-custom">
					<div class="flex flex-col items-start">
						<SofaHeaderText
							size="xl"
							color="text-inherit !font-normal"
							:content="formatNumber(stat.value).padStart(!!stat.value ? 2 : 0, '0')" />
						<SofaNormalText size="lg" color="text-inherit" :content="stat.label" />
					</div>
					<div class="flex p-2 md:p-4 rounded-full items-center justify-center" :style="`background-color: ${stat.color}50`">
						<SofaIcon :style="`fill: ${stat.color}`" class="w-[20px] h-[20px] md:w-[28px] md:h-[28px]" :name="stat.icon" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="w-full mdlg:shadow-custom mdlg:p-4 pl-4 py-1 mdlg:bg-white rounded-2xl flex flex-col gap-4">
		<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
			<SofaNormalText class="!font-bold" content="My study materials" />
			<SofaNormalText color="text-primaryPink" as="router-link" to="/library" class="mdlg:hidden" content="View all" />
		</div>

		<div
			v-if="materials.length"
			class="mdlg:flex-col mdlg:gap-4 flex gap-3 mdlg:p-0 py-2 pr-4 flex-nowrap overflow-x-auto scrollbar-hide">
			<SofaActivityCard
				v-for="activity in materials.slice(0, 4)"
				:key="activity.id"
				as="router-link"
				:activity="activity"
				:to="activity.route"
				:has-bookmark="true"
				:bookmark-action="() => saveToFolder(activity.original)"
				class="flex-shrink-0" />
		</div>
		<div v-else class="pr-4 mdlg:pr-0">
			<SofaEmptyState title="No materials found" sub-title="You have not created any materials so far" custom-class="!h-[230px]" />
		</div>

		<SofaNormalText
			v-if="materials.length"
			color="text-primaryPink"
			class="pr-4 hidden mdlg:inline"
			as="router-link"
			to="/library"
			content="View all" />
	</div>
</template>

<script lang="ts" setup>
import { useAuth } from '@app/composables/auth/auth'
import { extractContent } from '@app/composables/marketplace'
import { saveToFolder } from '@app/composables/study/folders'
import { useUsersMaterials } from '@app/composables/study/users-materials'
import { formatNumber } from 'valleyed'
import { computed } from 'vue'

const { id, user } = useAuth()

const { courses, quizzes } = useUsersMaterials(id.value, { user: true })
const materials = computed(() => [...quizzes, ...courses].sort((a, b) => b.createdAt - a.createdAt).map(extractContent))
</script>
