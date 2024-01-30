<template>
	<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div v-if="classInst.lessons.length === 0">
			<SofaHeaderText content="Lessons" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No lessons" />
			</div>
		</div>
		<div v-else>
			<SofaHeaderText content="Choose a lesson to study" customClass="text-center" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="w-full flex flex-col items-center gap-6 mt-6">
				<LessonCard
					v-for="(lesson, index) in classInst.lessons"
					:key="index"
					:isStudent="classInst.isStudent(userId)"
					:lesson="lesson"
					class="w-full" />
				<div class="w-full flex items-center justify-between">
					<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" customClass="hidden mdlg:block">
						Clear
					</SofaButton>
					<SofaButton
						bgColor="bg-primaryBlue"
						type="submit"
						textColor="text-white"
						padding="py-3 px-6"
						customClass="w-full mdlg:w-auto">
						Done
					</SofaButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity, MemberEntity } from '@modules/organizations'
export default defineComponent({
	props: {
		classInst: {
			type: ClassEntity,
			required: true,
		},
		teachers: {
			type: Array as PropType<MemberEntity[]>,
			required: true,
		},
	},
	setup() {
		const { id: userId } = useAuth()

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
		return { emptyLessonContent, userId }
	},
})
</script>
