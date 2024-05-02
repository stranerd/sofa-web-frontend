<template>
	<component :is="as" class="w-full p-4 mdlg:px-5 flex flex-col mdlg:flex-row mdlg:items-center gap-2 mdlg:gap-4">
		<div class="flex items-center gap-2 grow">
			<SofaImageLoader :photoUrl="image" class="size-[40px] rounded" />
			<SofaHeading :content="lesson.title" />
		</div>
		<template v-if="!hideStats">
			<SofaText class="text-grayColor mdlg:w-[250px] gap-2 flex items-center truncate">
				<SofaIcon name="tutor" class="fill-current h-[20px]" />
				<span>{{ teachers.map((teacher) => teacher.publicName).join(', ') }}</span>
			</SofaText>
			<SofaText class="text-grayColor mdlg:w-[120px] gap-2 flex items-center truncate">
				<SofaIcon name="users" class="fill-current h-[20px]" />
				<span>
					{{ $utils.formatNumber(lesson.users.students.length) }}
					{{ $utils.pluralize(lesson.users.students.length, 'student', 'students') }}
				</span>
			</SofaText>
		</template>
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
		hideStats?: boolean
		as?: string
	}>(),
	{
		hideStats: false,
		as: 'div',
	},
)

const teacherIds = computed(() => props.lesson.users.teachers)
const { users: teachers } = useUsersInList(teacherIds)

const image = computed(() => images[props.index % images.length])
</script>
