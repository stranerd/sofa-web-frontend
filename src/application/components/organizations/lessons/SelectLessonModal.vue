<template>
	<div class="p-4 flex flex-col gap-4 h-full">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeading content="Add subject" size="title" />
			<SofaIcon class="mdlg:hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<div class="flex flex-col max-h-full overflow-y-auto border border-lightGray">
			<SofaCheckbox
				v-for="(lesson, index) in classInst.lessons"
				:key="lesson.id"
				v-model="selected"
				:value="lesson.id"
				class="pr-4"
				rotate
				:class="{ 'bg-lightGray': index % 2 === 0 }">
				<LessonCard :lesson="lesson" :classInst="classInst" :index="index" hideStats />
			</SofaCheckbox>
		</div>
		<div class="flex items-center justify-between mt-auto">
			<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" class="hidden mdlg:block" @click="close">
				Cancel
			</SofaButton>
			<SofaButton bgColor="bg-primaryBlue" textColor="text-white" padding="py-3 px-6" class="w-full mdlg:w-auto" @click="submit">
				Add
			</SofaButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useJoinLesson } from '@app/composables/organizations/lessons'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
	close: () => void
}>()

const { id } = useAuth()
const { joinLesson } = useJoinLesson()

const original = props.classInst.lessons.filter((l) => l.users.students.includes(id.value)).map((l) => l.id)
const selected = ref(original)

const submit = async () => {
	const saved = await joinLesson(props.classInst, original, selected.value)
	if (saved) props.close()
}
</script>
