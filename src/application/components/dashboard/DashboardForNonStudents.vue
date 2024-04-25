<template>
	<div class="flex flex-col mdlg:gap-4">
		<div
			v-if="user"
			class="w-full mdlg:shadow-custom mdlg:bg-white mdlg:text-bodyBlack mdlg:rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
			<SofaHeading content="Overview" />

			<div class="flex overflow-x-auto scrollbar-hide mdlg:grid mdlg:grid-cols-2 gap-4">
				<div
					v-for="stat in [
						{
							label: 'Classes',
							labelSingular: 'Class',
							value: user.account.meta.classes,
							icon: 'classes' as const,
							color: '#3296C8',
							hide: !userType.isOrg,
						},
						{
							label: 'Lessons',
							labelSingular: 'Lesson',
							value: user.account.meta.lessons,
							icon: 'lessons' as const,
							color: '#3219AF',
							hide: !userType.isOrg,
						},
						{
							label: 'Quizzes',
							labelSingular: 'Quiz',
							value: user.account.meta.publishedQuizzes,
							icon: 'quiz' as const,
							color: '#4BAF7D',
						},
						{
							label: 'Courses',
							labelSingular: 'Course',
							value: user.account.meta.publishedCourses,
							icon: 'courses' as const,
							color: '#FF4BC8',
						},
						{
							label: 'Teachers',
							labelSingular: 'Teacher',
							value: user.account.meta.teachers,
							icon: 'tutor' as const,
							color: '#FA9632',
							hide: !userType.isOrg,
						},
						{
							label: 'Students',
							labelSingular: 'Student',
							value: user.account.meta.students,
							icon: 'user-unfilled' as const,
							color: '#197DFA',
							hide: !userType.isOrg,
						},
					].filter((stat) => !stat.hide)"
					:key="stat.label"
					class="flex shrink-0 items-center gap-4 justify-between mdlg:col-span-1 bg-white mdlg:bg-lightGray p-4 md:p-6 rounded-custom">
					<div class="flex flex-col items-start">
						<SofaHeading size="title" :content="$utils.formatNumber(stat.value).padStart(!!stat.value ? 2 : 0, '0')" />
						<SofaText :content="$utils.pluralize(stat.value, stat.labelSingular, stat.label)" />
					</div>
					<div class="flex p-2 mdlg:p-4 rounded-full items-center justify-center" :style="`background-color: ${stat.color}50`">
						<SofaIcon :style="`fill: ${stat.color}`" class="size-[20px] mdlg:size-[28px]" :name="stat.icon" />
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 mdlg:grid-cols-2 gap-4">
			<div class="h-fit w-full mdlg:shadow-custom px-4 mdlg:p-6 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 items-center justify-between">
					<SofaHeading content="My classes" />
					<SofaText
						as="router-link"
						:to="userType.isOrg ? '/dashboard/classes' : '/classes'"
						class="text-primaryBlue"
						content="View all" />
				</div>

				<div v-if="materials.length" class="mdlg:flex-col mdlg:gap-4 flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
					<ClassCard
						v-for="classInst in classes"
						:key="classInst.hash"
						:isWrapped="!$screen.desktop"
						:classInst="classInst"
						class="mdlg:bg-lightGray shrink-0" />
				</div>
				<EmptyState
					v-else
					title="You have no classes"
					:sub="userType.isOrg ? 'Add classes to your organization' : 'Contact your organization\'s admin to add you to a class'"
					image="classes"
					class="bg-white mdlg:bg-lightGray"
					:primary="userType.isOrg ? { label: 'Add class', action: createClass } : undefined" />
			</div>

			<div class="h-fit w-full mdlg:shadow-custom px-4 mdlg:p-6 mdlg:bg-white rounded-2xl flex flex-col gap-4">
				<div class="w-full flex gap-2 items-center justify-between">
					<SofaHeading content="Study materials" />
					<SofaText as="router-link" to="/library" class="text-primaryBlue" content="View all" />
				</div>

				<div
					v-if="materials.length"
					class="mdlg:flex-col mdlg:gap-4 flex gap-2 flex-nowrap overflow-x-auto scrollbar-hide shrink-0">
					<StudyMaterialCard v-for="m in materials.slice(0, 10)" :key="m.hash" type="activity" :material="m" />
				</div>
				<EmptyState
					v-else
					title="You have no study materials"
					sub="Add study materials to your profile"
					image="study-materials"
					class="bg-white mdlg:bg-lightGray"
					:primary="{ label: 'Add course', action: () => $router.push('/study/courses/create') }"
					:secondary="{ label: 'Add quiz', action: () => $router.push('/study/quizzes/create') }" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useMyClasses } from '@app/composables/organizations/classes-explore'
import { useUsersMaterials } from '@app/composables/study/users-materials'

const { id, user, userType } = useAuth()

const { courses, quizzes } = useUsersMaterials(id.value)
const materials = computed(() => [...quizzes, ...courses].sort((a, b) => b.createdAt - a.createdAt))

const { classes } = useMyClasses()

const createClass = () => useModals().organizations.createClass.open({ organizationId: id.value })
</script>
