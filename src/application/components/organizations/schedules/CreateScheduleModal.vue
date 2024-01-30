<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Add live schedule" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Add live schedule" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>

		<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">
			Submit
		</SofaButton>
	</form>
</template>

<script lang="ts" setup>
import { useCreateSchedule } from '@app/composables/organizations/schedules'
import { ClassEntity, ClassLesson, ScheduleEntity } from '@modules/organizations'

const props = defineProps<{
	close: () => void
	afterSubmit?: (schedule: ScheduleEntity) => void
	classInst: ClassEntity
	lesson: ClassLesson
}>()

const { factory, createSchedule } = useCreateSchedule(props.classInst, props.lesson)

const submit = async () => {
	const schedule = await createSchedule()
	if (!schedule) return
	props.afterSubmit?.(schedule)
	props.close()
}
</script>
