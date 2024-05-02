<template>
	<component :is="as" class="w-full px-5 py-4 cursor-pointer flex items-center gap-4">
		<div class="flex items-center gap-2 grow">
			<SofaHeading :content="lesson.title" />
		</div>
		<template v-if="isAdmin">
			<SofaText class="text-grayColor mdlg:w-[250px] gap-2 flex items-center truncate">
				<SofaIcon name="tutor" class="fill-current" />
				<span>{{ teachers.map((teacher) => teacher.publicName).join(', ') }}</span>
			</SofaText>
			<SofaText class="text-grayColor mdlg:w-[120px] gap-2 flex items-center truncate">
				<SofaIcon name="users" class="fill-current" />
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
import { useAuth } from '@app/composables/auth/auth'
import { useUsersInList } from '@app/composables/users/users'
import { ClassEntity, ClassLesson } from '@modules/organizations'

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

const { user } = useAuth()
const teacherIds = computed(() => props.lesson.users.teachers)
const { users: teachers } = useUsersInList(teacherIds)

const isAdmin = computed(() => props.classInst.isAdmin(user.value!))
</script>
