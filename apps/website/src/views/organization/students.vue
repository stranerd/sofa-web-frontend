<template>
	<OrganizationLayout title="Students">
		<template v-slot="{ extras }">
			<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col mdlg:flex-row gap-4 p-6">
				<div class="h-full aspect-square bg-lightGrayVaraint rounded flex items-center justify-center">
					<img class="w-3/4 h-3/4" src="@/assets/images/class-students.png" />
				</div>
				<div class="flex flex-col gap-2">
					<SofaHeaderText color="text-inherit" size="xl" content="Getting started with teachers" />
					<div v-for="message in messages" :key="message" class="flex gap-2 items-center">
						<SofaIcon name="checkmark-circle" class="w-[16px] h-[16px]" />
						<SofaNormalText color="text-grayColor" :content="message" />
					</div>
					<SofaButton
						bgColor="bg-primaryBlue" textColor="text-white" class="self-start mt-2" padding="px-6 py-4"
						@click="extras.openAddModal(MemberTypes.student)">
						Add students
					</SofaButton>
				</div>
			</div>
		</template>
	</OrganizationLayout>
</template>

<script lang="ts">
import OrganizationLayout from "@/components/users/organizations/OrganizationLayout.vue"
import { generateMiddlewares } from '@/middlewares'
import { Logic } from 'sofa-logic'
import { SofaHeaderText, SofaIcon, SofaNormalText, SofaButton } from 'sofa-ui-components/src'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"
import { MemberTypes } from "@modules/organizations"

export default defineComponent({
	components: { OrganizationLayout, SofaHeaderText, SofaNormalText, SofaIcon, SofaButton },
	name: "OrganizationStudentsPage",
	middlewares: { goBackRoute: '/organization' },
	beforeRouteEnter: generateMiddlewares(['isOrg']),
	setup () {
		useMeta({
			title: "Students",
		})

		const messages = [
			'Add students from your physical class here.',
			'Students here get your classes, courses, and quizzes for FREE.',
			'Your students can revisit live classes for revision purposes.',
			'No loss of study resources so students can keep coming back to them.'
		]

		return { Logic, messages, MemberTypes }
	},
})
</script>
