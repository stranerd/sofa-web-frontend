<template>
	<OrganizationLayout title="Dashboard">
		<template v-slot="{ user }">
			<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-6">
				<SofaHeaderText color="text-inherit" class="!text-lg !font-bold" content="Overview" />

				<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
					<div v-for="stat in [
						{ label: 'Classes', value: user.account.meta.classes, icon: 'classes', color: '#3296C8' },
						{ label: 'Lessons', value: user.account.meta.lessons, icon: 'lessons', color: '#3219AF' },
						{ label: 'Teachers', value: user.account.meta.lessons, icon: 'tutor', color: '#FA9632' },
						{ label: 'Quizzes', value: user.account.meta.publishedQuizzes, icon: 'quiz', color: '#4BAF7D' },
						{ label: 'Courses', value: user.account.meta.publishedCourses, icon: 'courses', color: '#FF4BC8' },
						{ label: 'Students', value: user.account.meta.students, icon: 'user-unfilled', color: '#197DFA' },
					]" :key="stat.label"
						class="flex items-center gap-4 justify-between col-span-1 bg-lightGrayVaraint p-4 md:p-6 rounded-custom">
						<div class="flex flex-col items-start">
							<SofaHeaderText size="xl" color="text-inherit !font-normal"
								:content="Logic.formatNumber(stat.value).padStart(!!stat.value ? 2 : 0, '0')" />
							<SofaNormalText size="lg" color="text-inherit" :content="stat.label" />
						</div>
						<div class="flex p-2 md:p-4 rounded-full items-center justify-center"
							:style="`background-color: ${stat.color}50`">
							<SofaIcon :style="`fill: ${stat.color}`" class="w-[20px] h-[20px] md:w-[28px] md:h-[28px]"
								:name="stat.icon" />
						</div>
					</div>
				</div>
			</div>
		</template>
	</OrganizationLayout>
</template>

<script lang="ts">
import OrganizationLayout from "@/components/users/organizations/OrganizationLayout.vue"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaNormalText } from 'sofa-ui-components/src'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: { OrganizationLayout, SofaHeaderText, SofaNormalText, SofaIcon },
	name: "OrganizationDashboardPage",
	middlewares: { goBackRoute: '/organization' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup () {
		useMeta({
			title: "Home",
		})

		return { Logic }
	},
})
</script>
