<template>
	<form class="flex flex-col gap-4 mdlg:p-6 p-4" @submit.prevent="submit">
		<div class="w-full hidden flex-col gap-2 justify-center items-center md:flex">
			<SofaHeaderText class="!text-xl" content="Add live schedule" />
		</div>

		<div class="w-full flex justify-between items-center md:hidden">
			<SofaNormalText class="!font-bold" content="Add live schedule" />
			<SofaIcon class="h-[19px]" name="circle-close" @click="close" />
		</div>
		<SofaTextField
			v-model="factory.title"
			customClass="rounded-custom !bg-lightGray"
			type="text"
			placeholder="Session Title"
			:error="factory.errors.title"
			borderColor="border-transparent" />
		<SofaTextarea
			v-model="factory.description"
			:error="factory.errors.description"
			textAreaStyle="h-[90px] rounded-custom !bg-lightGray md:p-4 p-3 resize-none"
			placeholder="Session description" />
		<div class="flex flex-col gap-4 mdlg:flex-row mdlg:items-center justify-between">
			<SofaTextField
				v-model="factory.date"
				:error="factory.errors.timeDate"
				customClass="w-full mdlg:w-[200px] rounded-custom !bg-lightGray"
				type="date"
				placeholder="Date"
				borderColor="border-transparent" />
			<div class="flex items-center gap-4 justify-between">
				<SofaTextField
					v-model="factory.start"
					:error="factory.errors.timeStart"
					customClass="w-full mdlg:w-[200px] rounded-custom !bg-lightGray"
					type="time"
					placeholder="From"
					borderColor="border-transparent" />
				<SofaIcon class="h-[16px]" name="arrow-right-white" customClass="!fill-darkLightGray" />
				<SofaTextField
					v-model="factory.end"
					:error="factory.errors.timeEnd"
					customClass="w-full mdlg:!w-[200px] rounded-custom !bg-lightGray"
					type="time"
					placeholder="To"
					borderColor="border-transparent" />
			</div>
		</div>
		<div class="flex items-center justify-between">
			<SofaButton bgColor="bg-grayColor" textColor="text-white" padding="py-3 px-6" customClass="hidden mdlg:block" @click="close">
				Cancel
			</SofaButton>
			<SofaButton :disabled="!factory.valid" type="submit" padding="px-5 py-3" class="self-center w-full mdlg:w-auto">
				Create
			</SofaButton>
		</div>
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
