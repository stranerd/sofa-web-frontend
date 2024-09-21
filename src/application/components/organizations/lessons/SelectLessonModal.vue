<template>
	<div class="p-4 flex flex-col gap-4 h-full">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeading content="Add course" size="title" />
			<SofaIcon class="mdlg:hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<div class="flex flex-col gap-4 max-h-full overflow-y-auto">
			<LessonCard
				v-for="(lesson, index) in classInst.lessons"
				:key="lesson.id"
				:lesson="lesson"
				:classInst="classInst"
				:index="index"
				class="bg-lightGray rounded-2xl"
				:class="{ 'border border-primaryPurple': selected.includes(lesson.id) }"
				@click="toggleSelected(lesson.id)" />
		</div>
		<div class="flex items-center justify-between mt-auto">
			<SofaButton color="gray" padding="py-3 px-6" class="hidden mdlg:block" @click="close"> Cancel </SofaButton>
			<SofaButton padding="py-3 px-6" class="w-full mdlg:w-auto" @click="submit"> Add </SofaButton>
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

const toggleSelected = (id: string) => {
	if (selected.value.includes(id)) selected.value = selected.value.filter((s) => s !== id)
	else selected.value = selected.value.concat(id)
}

const submit = async () => {
	const saved = await joinLesson(props.classInst, original, selected.value)
	if (saved) props.close()
}
</script>
