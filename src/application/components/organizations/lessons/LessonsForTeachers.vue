<template>
	<div class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div v-if="lessons.length === 0">
			<SofaHeaderText content="Lessons" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img :src="emptyLessonContent.imageURL" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No lessons" />
			</div>
		</div>
		<div v-else>
			<SofaHeaderText content="Lessons" />
			<div class="h-[1px] w-full bg-lightGray" />
			<div class="flex flex-wrap items-center gap-3 mt-6">
				<SofaButton
					v-for="lesson in lessons"
					:key="lesson.id"
					:customClass="
						selectedLesson.id === lesson.id
							? 'bg-primaryPurple !text-white !shadow-none'
							: 'bg-white border border-darkLightGray !text-deepGray !shadow-none'
					"
					padding="py-3 px-4"
					@click="selectedLesson = lesson">
					{{ lesson.title }}
				</SofaButton>
			</div>
			<div class="flex flex-col mdlg:flex-row mdlg:items-center gap-6 p-4 md:p-6 rounded-custom">
				<div class="bg-lightGray w-[241px] h-[241px] flex items-center justify-center rounded-custom">
					<img :src="emptyLessonContent.imageURL" class="w-[144px] h-[144px]" />
				</div>
				<div class="flex flex-col items-start gap-1">
					<SofaHeaderText :content="`Set up your ${selectedLesson.title} curriculum`" size="xl" />
					<div class="flex flex-col gap-2 py-2">
						<div v-for="(content, index) in emptyLessonContent.contents" :key="index" class="flex mdlg:items-center gap-1">
							<SofaIcon customClass="h-[16px]" name="checkmark-circle" />
							<SofaNormalText :content="content" color="text-grayColor" />
						</div>
					</div>
					<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-4 px-6"> Get started </SofaButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import { useModals } from '@app/composables/core/modals'
import { useRoute } from 'vue-router'
import { useAuth } from '@app/composables/auth/auth'
import { ClassEntity } from '@modules/organizations'
import { MemberEntity } from '@modules/organizations'
import { SelectOption } from 'sofa-logic'
export default defineComponent({
	props: {
		classObj: {
			type: ClassEntity,
			required: true,
		},
		teachers: {
			type: Array as PropType<MemberEntity[]>,
			required: true,
		},
	},
	setup(props) {
		const { id: userId } = useAuth()
		const route = useRoute()
		const organizationId = route.params.organizationId as string
		const classId = route.params.classId as string
		const searchQuery = ref('')
		const openLessonDetails = (val: any) => {
			useModals().organizations.lessonDetails.open({
				organizationId,
				classId,
				userId: userId.value,
				lesson: val,
				teachers: props.teachers,
			})
		}
		const teachersOptions = computed((): SelectOption[] => {
			return props.teachers.map((teacher: MemberEntity) => {
				return { key: teacher?.user?.id || '', value: teacher.user?.bio.name.full || '' }
			})
		})
		const openCreateClassModal = () => {
			useModals().organizations.createLesson.open({ organizationId, classId, userId: userId.value, teachers: teachersOptions.value })
		}
		const lessons = computed(() => {
			return props.classObj.lessons
		})
		const selectedLesson = ref(lessons.value[0])
		const emptyLessonContent = {
			imageURL: '/images/no-lessons.png',
			title: '',
			contents: [
				'Give each topic a section.',
				'Add live sessions under sections.',
				'Add study materials under sections.',
				'Preview and publish your curriculum.',
			],
		}
		return { openLessonDetails, searchQuery, openCreateClassModal, teachersOptions, emptyLessonContent, lessons, selectedLesson }
	},
})
</script>