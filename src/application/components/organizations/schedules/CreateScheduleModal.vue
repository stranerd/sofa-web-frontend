<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="createSchedule">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeading size="mid" content="Add live schedule" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaHeading content="Add live schedule" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<SofaInput v-model="factory.title" placeholder="Session Title" :error="factory.errors.title" />
		<SofaTextarea
			v-model="factory.description"
			:error="factory.errors.description"
			class="h-[90px] resize-none"
			placeholder="Session description" />
		<SofaSelect
			v-model="factory.lessonId"
			placeholder="Course"
			:options="lessons.map((lesson) => ({ value: lesson.title, key: lesson.id }))" />
		<div class="flex flex-col gap-4 mdlg:flex-row mdlg:items-center justify-between">
			<SofaInput
				v-model="factory.date"
				:error="factory.errors.timeDate"
				class="w-full mdlg:w-[200px]"
				type="date"
				placeholder="Date" />
			<div class="flex items-center gap-4 justify-between">
				<SofaInput
					v-model="factory.start"
					:error="factory.errors.timeStart"
					class="w-full mdlg:w-[200px]"
					type="time"
					placeholder="From" />
				<SofaIcon name="arrow-right" class="h-[16px] fill-darkLightGray" />
				<SofaInput
					v-model="factory.end"
					:error="factory.errors.timeEnd"
					class="w-full mdlg:w-[200px]"
					type="time"
					placeholder="To" />
			</div>
		</div>
		<div class="flex items-center justify-between">
			<SofaButton color="gray" padding="py-3 px-6" class="hidden mdlg:block" @click="close"> Cancel </SofaButton>
			<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">
				Create
			</SofaButton>
		</div>
	</form>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAuth } from '@app/composables/auth/auth'
import { useCreateSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	close: () => void
	classInst: ClassEntity
}>()

const { id, user } = useAuth()
const { factory, createSchedule } = useCreateSchedule(props.classInst)

const lessons = computed(() => {
	const isAdmin = user.value && props.classInst.isAdmin(user.value)
	const isTeacher = user.value && props.classInst.isTeacher(user.value)
	return props.classInst.lessons.filter((lesson) => {
		if (isAdmin) return true
		if (isTeacher) return lesson.users.teachers.includes(id.value)
		return false
	})
})
</script>
