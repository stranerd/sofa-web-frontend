<template>
	<ClassLessonLayout v-model="lesson" v-model:classInst="classInst" title="Edit" roundedTabs>
		<template v-if="classInst && canEditCurr" #post-tabs>
			<div class="flex gap-2 items-center ml-auto py-1">
				<SofaButton color="gray" padding="px-6 py-3" @click="cancel"> Cancel </SofaButton>
				<SofaButton padding="px-6 py-3" @click="save"> Save </SofaButton>
			</div>
		</template>
		<template v-if="canEditCurr" #default="{ classInst: cls, lesson: ls }">
			<div class="flex flex-col px-4 pt-4 mdlg:px-0 gap-4 h-full">
				<div v-if="!$screen.desktop" class="flex gap-2 items-center justify-end">
					<SofaButton color="gray" padding="px-6 py-3" @click="cancel"> Cancel </SofaButton>
					<SofaButton padding="px-6 py-3" @click="save"> Save </SofaButton>
				</div>
				<div class="grow overflow-y-auto">
					<LessonCurriculum
						:classInst="cls"
						:lesson="ls"
						:factory="factory"
						:view="CurriculumView.list"
						:curriculum="factory.factories" />
				</div>
			</div>
		</template>
	</ClassLessonLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ClassEntity, ClassLesson, CurriculumView } from '@modules/organizations'
import { useAuth } from '@app/composables/auth/auth'
import { useUpdateCurriculum } from '@app/composables/organizations/lessons'

const lesson = ref<ClassLesson | null>(null)
const classInst = ref<ClassEntity | null>(null)

const { user } = useAuth()
const router = useRouter()

const { factory, updateCurriculum } = useUpdateCurriculum(lesson)

const canEditCurr = computed(() => {
	if (!user.value || !lesson.value) return false
	return lesson.value.users.teachers.includes(user.value.id)
})

const cancel = async () => {
	if (!classInst.value || !lesson.value) return
	await router.replace(`${classInst.value.pageLink}/courses/${lesson.value.id}`)
}

const save = async () => {
	if (!classInst.value) return
	await updateCurriculum(classInst.value)
}
</script>
