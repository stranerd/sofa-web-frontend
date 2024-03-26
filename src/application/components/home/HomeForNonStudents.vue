<template>
	<div v-if="user" class="px-4 mdlg:px-0">
		<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
			<SofaNormalText class="!font-bold" content="Overview" />

			<div class="grid grid-cols-2 md:grid-cols-2 gap-4">
				<div
					v-for="stat in [
						{
							label: 'Classes',
							value: user.account.meta.classes,
							icon: 'classes' as const,
							color: '#3296C8',
							hide: !userType.isOrg,
						},
						{
							label: 'Lessons',
							value: user.account.meta.lessons,
							icon: 'lessons' as const,
							color: '#3219AF',
							hide: !userType.isOrg,
						},
						{ label: 'Quizzes', value: user.account.meta.publishedQuizzes, icon: 'quiz' as const, color: '#4BAF7D' },
						{ label: 'Courses', value: user.account.meta.publishedCourses, icon: 'courses' as const, color: '#FF4BC8' },
						{
							label: 'Teachers',
							value: user.account.meta.teachers,
							icon: 'tutor' as const,
							color: '#FA9632',
							hide: !userType.isOrg,
						},
						{
							label: 'Students',
							value: user.account.meta.students,
							icon: 'user-unfilled' as const,
							color: '#197DFA',
							hide: !userType.isOrg,
						},
					].filter((stat) => !stat.hide)"
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
			<StudyMaterialCard v-for="m in materials.slice(0, 4)" :key="m.hash" type="activity" :material="m" />
		</div>
		<div v-else class="pr-4 mdlg:pr-0">
			<SofaEmptyState title="No materials found" subTitle="You have not created any materials so far" customClass="!h-[230px]" />
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
import { formatNumber } from 'valleyed'
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useUsersMaterials } from '@app/composables/study/users-materials'

const { id, user, userType } = useAuth()

const { courses, quizzes } = useUsersMaterials(id.value, { user: true })
const materials = computed(() => [...quizzes, ...courses].sort((a, b) => b.createdAt - a.createdAt))
</script>
