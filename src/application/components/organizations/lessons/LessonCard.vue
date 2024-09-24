<template>
	<component :is="as" class="w-full mdlg:flex-row-reverse p-4 flex items-center gap-4">
		<div class="flex flex-col gap-2 grow">
			<SofaHeading :content="lesson.title" size="mid" class="leading-none" />
			<div class="text-grayColor flex flex-col mdlg:flex-row gap-2 mdlg:gap-4 mdlg:items-center">
				<SofaText clamp class="gap-2 flex items-center">
					<SofaIcon name="course-material" class="fill-current h-[20px]" />
					<span>
						{{ $utils.formatNumber(lesson.curriculum.length) }}
						{{ $utils.pluralize(lesson.curriculum.length, 'material', 'materials') }}
					</span>
				</SofaText>
				<SofaText clamp class="gap-2 flex items-center">
					<SofaIcon name="tutor" class="fill-current h-[20px]" />
					<span>{{ teachers.map((teacher) => teacher.publicName).join(', ') }}</span>
				</SofaText>
				<SofaText clamp class="gap-2 flex items-center">
					<SofaIcon name="users" class="fill-current h-[20px]" />
					<span>
						{{ $utils.formatNumber(lesson.users.students.length) }}
						{{ $utils.pluralize(lesson.users.students.length, 'student', 'students') }}
					</span>
				</SofaText>
			</div>
		</div>
		<div class="flex flex-col">
			<SofaImageLoader :photoUrl="image" class="size-[56px] rounded" />
		</div>
	</component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUsersInList } from '@app/composables/users/users'
import { ClassEntity, ClassLesson } from '@modules/organizations'

const images = ['/images/lessons/1.png', '/images/lessons/2.png']

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		index: number
		lesson: ClassLesson
		as?: string
	}>(),
	{
		as: 'div',
	},
)

const teacherIds = computed(() => props.lesson.users.teachers)
const { users: teachers } = useUsersInList(teacherIds)

const image = computed(() => images[props.index % images.length])
</script>
