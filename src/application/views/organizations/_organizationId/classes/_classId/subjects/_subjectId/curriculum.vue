<template>
	<ClassLessonLayout v-model="lesson" v-model:classInst="classInst">
		<template #post-tabs>
			<div class="flex items-center ml-auto py-1">
				<SofaButton v-if="canEdit" bgColor="bg-primaryBlue" textColor="text-white" padding="px-6 py-3" class="mr-2">
					Edit curriculum
				</SofaButton>
				<SofaText
					v-for="(tab, i) in tabs"
					:key="tab.value"
					as="a"
					size="sub"
					class="px-4 py-2 font-semibold flex items-center gap-1 text-grayColor border border-current"
					:class="{
						'!text-primaryPurple': currentView === tab.value,
						'rounded-l-lg': i === 0,
						'rounded-r-lg': i === tabs.length - 1,
					}"
					@click="currentView = tab.value">
					<span>{{ tab.label }}</span>
					<SofaIcon :name="tab.icon" class="fill-current h-[18px]" />
				</SofaText>
			</div>
		</template>
		<template #default="{ classInst: cls, lesson: ls }">
			<div class="flex flex-col px-4 pt-4 mdlg:py-4 gap-4 h-full mdlg:bg-white mdlg:rounded-b-2xl">
				<div v-if="!$screen.desktop" class="flex items-center justify-end">
					<SofaButton v-if="canEdit" bgColor="bg-primaryBlue" textColor="text-white" padding="px-6 py-3" class="mr-auto">
						Edit curriculum
					</SofaButton>
					<SofaText
						v-for="(tab, i) in tabs"
						:key="tab.value"
						as="a"
						size="sub"
						class="px-4 py-2 font-semibold flex items-center gap-1 text-grayColor border border-current"
						:class="{
							'!text-primaryPurple': currentView === tab.value,
							'rounded-l-lg': i === 0,
							'rounded-r-lg': i === tabs.length - 1,
						}"
						@click="currentView = tab.value">
						<span>{{ tab.label }}</span>
						<SofaIcon :name="tab.icon" class="fill-current h-[18px]" />
					</SofaText>
				</div>
				<div class="grow overflow-y-auto">
					<LessonCurriculum :classInst="cls" :lesson="ls" :view="currentView" :curriculum="ls.curriculum" />
				</div>
			</div>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ClassEntity, ClassLesson, CurriculumView } from '@modules/organizations'
import { useAuth } from '@app/composables/auth/auth'

const lesson = ref<ClassLesson | null>(null)
const classInst = ref<ClassEntity | null>(null)

const { user } = useAuth()
const currentView = ref(CurriculumView.list)

const tabs = [
	{ label: 'List', value: CurriculumView.list, icon: 'list_view' },
	{ label: 'Grid', value: CurriculumView.grid, icon: 'grid_view' },
] as const

const canEdit = computed(() => {
	if (!user.value || !classInst.value || !lesson.value) return false
	return classInst.value.isAdmin(user.value) || lesson.value.users.teachers.includes(user.value.id)
})
</script>
