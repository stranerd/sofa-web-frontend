<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<template v-if="classObj.isAdmin(userId)">
				<div
					v-if="lessons.length === 0"
					class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
					<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
						<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
							<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
						</div>
						<div class="flex flex-col items-start gap-1">
							<SofaHeaderText :content="emptyLessonContent.title" size="xl" />
							<div class="flex flex-col gap-2 py-2">
								<div
									v-for="(content, index) in emptyLessonContent.contents"
									:key="index"
									class="flex mdlg:items-center gap-1">
									<SofaIcon customClass="h-[16px]" name="checkmark-circle" />
									<SofaNormalText :content="content" color="text-grayColor" />
								</div>
							</div>
							<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6"> Create a Lesson </SofaButton>
						</div>
					</div>
				</div>
			</template>
		</template>
	</ClassLayout>
</template>

<script lang="ts">
import ClassLayout from '@app/components/organizations/classes/ClassLayout.vue'
import { useAuth } from '@app/composables/auth/auth'
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'OrganizationsOrganizationIdClassesClassIdLessons',
	components: { ClassLayout },
	routeConfig: {
		middlewares: ['isAuthenticated'],
	},
	setup() {
		const { id: userId } = useAuth()
		const lessons = ref([])
		const emptyLessonContent = {
			imageURL: '/images/no-lessons.png',
			title: 'Getting started with lessons',
			contents: [
				'Comprehensive subject based curriculum.',
				'Assign teachers to manage their specific subjects. ',
				'Assign teachers to manage their specific subjects. ',
				'Contains live teaching sessions and study materials.',
			],
		}
		return {
			userId,
			lessons,
			emptyLessonContent,
		}
	},
})
</script>
