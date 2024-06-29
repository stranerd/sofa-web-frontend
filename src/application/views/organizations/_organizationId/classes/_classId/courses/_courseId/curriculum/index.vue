<template>
	<ClassLessonLayout v-model="lesson" v-model:classInst="classInst" title="Curriculum" roundedTabs>
		<template v-if="lesson?.curriculum.length" #post-tabs>
			<div class="flex items-center ml-auto py-1">
				<SofaButton
					v-if="canEditLesson"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					padding="px-6 py-3"
					class="mr-2"
					@click="editLesson">
					Edit lesson
				</SofaButton>
				<SofaButton
					v-if="canEditCurr"
					bgColor="bg-primaryBlue"
					textColor="text-white"
					padding="px-6 py-3"
					class="mr-2"
					@click="editCurr">
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
			<div class="flex flex-col px-4 pt-4 mdlg:px-0 gap-4 h-full mdlg:bg-white mdlg:rounded-b-2xl">
				<EmptyState
					v-if="!ls.curriculum.length"
					image="live"
					title="There is nothing here"
					sub="Curriculum has not been set yet"
					class="bg-white"
					:primary="canEditCurr ? { label: 'Add curriculum', action: editCurr } : undefined" />
				<template v-else>
					<div v-if="!$screen.desktop" class="flex items-center justify-end">
						<SofaButton
							v-if="canEditLesson"
							bgColor="bg-primaryBlue"
							textColor="text-white"
							padding="px-6 py-3"
							class="mr-2"
							@click="editLesson">
							Edit lesson
						</SofaButton>
						<SofaButton
							v-if="canEditCurr"
							bgColor="bg-primaryBlue"
							textColor="text-white"
							padding="px-6 py-3"
							class="mr-2"
							@click="editCurr">
							Edit curriculum
						</SofaButton>
						<span class="flex-1" />
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
						<LessonCurriculum
							:classInst="cls"
							:lesson="ls"
							:view="currentView"
							:curriculum="ls.curriculum"
							:onClick="
								(item) => {
									$router.push({
										path: `${cls.pageLink}/courses/${ls.id}/study`,
										query: { sectionIndex: item.sectionIndex, itemIndex: item.itemIndex },
									})
								}
							" />
					</div>
				</template>
			</div>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useModals } from '@app/composables/core/modals'
import { useRouter } from '@app/composables/core/routes'
import { ClassEntity, ClassLesson, CurriculumView } from '@modules/organizations'

const router = useRouter()
const lesson = ref<ClassLesson | null>(null)
const classInst = ref<ClassEntity | null>(null)

const { user } = useAuth()
const currentView = ref(CurriculumView.list)

const tabs = [
	{ label: 'List', value: CurriculumView.list, icon: 'list_view' },
	{ label: 'Grid', value: CurriculumView.grid, icon: 'grid_view' },
] as const

const canEditLesson = computed(() => {
	if (!user.value || !classInst.value) return false
	return classInst.value.isAdmin(user.value)
})

const canEditCurr = computed(() => {
	if (!user.value || !lesson.value) return false
	return lesson.value.users.teachers.includes(user.value.id)
})

const editLesson = async () => {
	if (!classInst.value || !lesson.value) return
	useModals().organizations.editLesson.open({ classInst: classInst.value, lesson: lesson.value })
}

const editCurr = async () => {
	if (!classInst.value || !lesson.value) return
	await router.push(`${classInst.value.pageLink}/courses/${lesson.value.id}/curriculum/edit`)
}
</script>
