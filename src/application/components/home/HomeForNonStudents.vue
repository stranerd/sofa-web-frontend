<template>
	<div v-if="user">
		<div class="w-full md:shadow-custom md:bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 py-4 mdlg:py-6">
			<SofaNormalText class="!font-bold px-4 mdlg:px-6" content="Overview" />
			<div class="flex items-center md:grid md:grid-cols-2 mdlg:grid-cols-3 gap-4 sm:px-4 mdlg:px-6 overflow-x-auto">
				<div
					v-for="stat in [
						{
							label: 'Classes',
							value: user.account.meta.classes,
							icon: 'book' as const,
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
							icon: 'users-group' as const,
							color: '#197DFA',
							hide: !userType.isOrg,
						},
					].filter((stat) => !stat.hide)"
					:key="stat.label"
					class="flex min-w-[140px] items-start sm:items-center gap-2 sm:gap-4 justify-between col-span-1 bg-white md:bg-lightGray p-4 md:p-6 rounded-custom">
					<div class="flex flex-col items-start">
						<SofaHeaderText
							size="xl"
							color="text-inherit !font-normal"
							:content="formatNumber(stat.value).padStart(!!stat.value ? 2 : 0, '0')" />
						<SofaNormalText size="lg" color="text-inherit" customClass="whitespace-nowrap" :content="stat.label" />
					</div>
					<div class="flex p-2 md:p-4 rounded-full items-center justify-center" :style="`background-color: ${stat.color}50`">
						<SofaIcon :style="`fill: ${stat.color}`" class="w-[20px] h-[20px] md:w-[28px] md:h-[28px]" :name="stat.icon" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 pl-4 md:pr-0 mdlg:grid-cols-2 gap-6">
		<!-- Classes -->
		<div class="w-full mdlg:shadow-custom md:p-4 mdlg:p-6 mdlg:bg-white rounded-2xl flex flex-col gap-4">
			<div class="w-full flex gap-2 md:pr-4 mdlg:pr-0 items-center justify-between">
				<SofaNormalText class="!font-bold" content="My classes" />
				<SofaNormalText
					v-if="classes.length"
					color="text-primaryBlue"
					class="inline"
					as="router-link"
					to="/organization/classes"
					content="View all" />
			</div>
			<div v-if="classes.length" class="flex mdlg:flex-col items-center overflow-x-auto gap-4">
				<div v-for="cl in classes" :key="cl.id" class="w-full bg-white md:bg-lightGray rounded-lg px-4">
					<ClassCard :classInst="cl" :showOptionsIcon="false" :wrap="true" />
				</div>
			</div>
			<div v-else class="pr-4 mdlg:pr-0 bg-white mdlg:bg-lightGray py-10 rounded-lg">
				<SofaEmptyStateNew
					title="You have no classes"
					:contents="['Add classes to your organization']"
					imageUrl="/images/classes.png"
					:firstButton="classesEmptyStateButtonConfig.firstButton" />
			</div>
		</div>
		<!-- Study Materials -->
		<div class="w-full mdlg:shadow-custom md:p-4 mdlg:p-6 mdlg:bg-white rounded-2xl flex flex-col gap-4">
			<div class="w-full flex gap-2 pr-4 mdlg:pr-0 items-center justify-between">
				<SofaNormalText class="!font-bold" content="My study materials" />
				<SofaNormalText
					v-if="materials.length"
					color="text-primaryBlue"
					class="inline"
					as="router-link"
					to="/library"
					content="View all" />
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
					:hasBookmark="true"
					:bookmarkAction="() => saveToFolder(activity.original)"
					class="shrink-0" />
			</div>
			<div v-else class="pr-4 mdlg:pr-0 bg-white mdlg:bg-lightGray py-10 rounded-lg">
				<SofaEmptyStateNew
					title="You have no study materials"
					:contents="['Add study materials to your organization']"
					imageUrl="/images/study-material.png"
					:firstButton="materialsEmptyStateButtonConfig.firstButton"
					:secondButton="materialsEmptyStateButtonConfig.secondButton" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { formatNumber } from 'valleyed'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { extractContent } from '@app/composables/marketplace'
import { saveToFolder } from '@app/composables/study/folders'
import { useUsersMaterials } from '@app/composables/study/users-materials'
import { useOrganizationClasses } from '@app/composables/organizations/classes'
import { useModals } from '@app/composables/core/modals'

const { id, user, userType } = useAuth()
const router = useRouter()

const { courses, quizzes } = useUsersMaterials(id.value, { user: true })
const materials = computed(() => [...quizzes, ...courses].sort((a, b) => b.createdAt - a.createdAt).map(extractContent))

const { classes } = useOrganizationClasses(id.value)

const materialsEmptyStateButtonConfig = computed(() => ({
	firstButton: {
		label: 'Add course',
		action: () => {
			router.push('/course/create')
		},
	},
	secondButton: {
		label: 'Add quiz',
		action: () => {
			router.push('/quizzes/create')
		},
	},
}))
const classesEmptyStateButtonConfig = computed(() => ({
	firstButton: {
		label: 'Add class',
		action: () => {
			useModals().organizations.createClass.open({ organizationId: id.value })
		},
	},
}))
</script>
