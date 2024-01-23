<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between mdlg:justify-center">
			<SofaHeaderText class="!font-bold !text-deepGray" content="Create a lesson" />
			<SofaIcon class="!block mdlg:!hidden h-[16px]" name="circle-close" @click="close" />
		</div>
		<form class="flex flex-col gap-8" @submit.prevent="createLesson">
			<SofaTextField
				v-model="factory.title"
				customClass="rounded-custom !bg-lightGray"
				type="text"
				placeholder="Enter subject name"
				:error="factory.errors.title"
				borderColor="border-transparent" />
			<SofaSelect
				v-model="factory.teacher"
				customClass="rounded-custom !bg-lightGray col-span-1"
				placeholder="Assign a teacher"
				:error="factory.errors.teacher"
				borderColor="border-transparent"
				:options="teachers" />
			<div class="flex items-center justify-between">
				<SofaButton
					bgColor="bg-grayColor"
					textColor="text-white"
					padding="py-3 px-6"
					customClass="hidden mdlg:block"
					@click="close">
					Cancel
				</SofaButton>
				<SofaButton
					bgColor="bg-primaryBlue"
					type="submit"
					textColor="text-white"
					padding="py-3 px-6"
					:disabled="!factory.isValid"
					customClass="w-full mdlg:w-auto">
					Save
				</SofaButton>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { useCreateLesson } from '@app/composables/organizations/lessons'
import { MemberEntity } from '@modules/organizations'
import { computed } from 'vue'

const props = defineProps<{
	organizationId: string
	classId: string
	teachers: MemberEntity[]
	close: () => void
}>()

const { factory, createLesson } = useCreateLesson(props.organizationId, props.classId)

const teachers = computed(() =>
	props.teachers.filter((t) => !!t.user).map((teacher) => ({ key: teacher.user?.id || '', value: teacher.user?.bio.publicName || '' })),
)
</script>
