<template>
	<div class="p-4 flex flex-col gap-4 mdlg:gap-6 mdlg:bg-white mdlg:rounded-b-2xl mdlg:shadow-custom">
		<EmptyState
			v-if="!users.length"
			:image="isStudent ? 'students' : 'teachers'"
			:title="isStudent ? 'No students in this class' : 'No teachers in this class'"
			class="bg-white"
			:sub="isStudent ? 'Students that enroll in this class will appear here' : 'Teachers assigned to this class will appear here'" />

		<template v-else>
			<div v-if="isStudent" class="flex items-center gap-2">
				<SofaButton
					v-for="tab in enrollmentTabs"
					:key="tab.value"
					:bgColor="selectedEnrollmentTab === tab.value ? 'bg-primaryBlue border-primaryBlue' : 'bg-white border-darkLightGray'"
					:textColor="selectedEnrollmentTab === tab.value ? 'text-white' : 'text-grayColor'"
					class="border"
					padding="px-4 py-3 mdlg:px-6"
					@click="selectedEnrollmentTab = tab.value">
					{{ tab.label }}
				</SofaButton>
			</div>

			<SofaInput v-if="!$screen.desktop" v-model="searchQuery" placeholder="Search" type="search" class="bg-white" padding="p-3">
				<template #prefix>
					<SofaIcon name="search" class="h-[16px]" />
				</template>
			</SofaInput>

			<div class="w-full bg-white border border-lightGray p-0.5 mdlg:p-0 rounded-2xl">
				<SofaTable
					class="w-full"
					headClass="text-left font-normal text-grayColor"
					:rowClass="(_, i) => (i % 2 === 0 ? 'bg-lightGray' : '')"
					:fields="[
						{
							id: 'name',
							key: 'bio.name.full',
							label: isStudent ? 'Students' : 'Teachers',
							headerClass: 'w-full',
						},
						{
							id: 'enrollment',
							key: (user) => user.myOrgsIn.includes(classInst.organizationId),
							label: 'Enrollment',
							hide: !isStudent,
						},
						{
							key: (user) =>
								$utils.formatNumber(
									classInst.lessons.filter((lesson) =>
										lesson.users[isStudent ? 'students' : 'teachers'].includes(user.id),
									).length,
								),
							label: 'Subjects',
							class: 'text-center',
						},
						{
							key: (user) => $utils.formatNumber(classInst.getStudentTeachers(user.id).length),
							label: 'Teachers',
							hide: !isStudent,
							class: 'text-center',
						},
						{
							key: (user) => $utils.formatNumber(classInst.getTeacherStudents(user.id).length),
							label: 'Students',
							hide: isStudent,
							class: 'text-center',
						},
					]"
					:data="filteredUsers">
					<template #data-name="{ data: user }">
						<span class="flex items-center gap-2">
							<SofaAvatar :photoUrl="user.picture" :size="$screen.desktop ? 40 : 28" />
							<span>{{ user.publicName }}</span>
						</span>
					</template>
					<template #data-enrollment="{ value }">
						<span class="flex items-center gap-2" :class="value ? 'text-primaryPurplePink' : 'text-primaryPurple'">
							<SofaIcon :name="value ? 'offline-enrollment' : 'online-enrollment'" class="w-[18px] fill-current" />
							<span>{{ value ? 'Offline' : 'Online' }}</span>
						</span>
					</template>
				</SofaTable>
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ClassEntity } from '@modules/organizations'
import { useUsersInList } from '@app/composables/users/users'

const props = defineProps<{
	classInst: ClassEntity
	type: 'students' | 'teachers'
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })

const isStudent = computed(() => props.type === 'students')
const usersIds = computed(() => (isStudent.value ? props.classInst.members.students : props.classInst.teachers))
const { users } = useUsersInList(usersIds)
const filteredUsers = computed(() =>
	users.value.filter(
		(u) =>
			[
				selectedEnrollmentTab.value === 'all' && true,
				selectedEnrollmentTab.value === 'online' && !u.myOrgsIn.includes(props.classInst.organizationId),
				selectedEnrollmentTab.value === 'offline' && u.myOrgsIn.includes(props.classInst.organizationId),
			].some(Boolean) && u.search(searchQuery.value),
	),
)

const enrollmentTabs = [
	{ label: 'All', value: 'all' },
	{ label: 'Online', value: 'online' },
	{ label: 'Offline', value: 'offline' },
] as const
const selectedEnrollmentTab = ref<(typeof enrollmentTabs)[number]['value']>(enrollmentTabs[0].value)
</script>
