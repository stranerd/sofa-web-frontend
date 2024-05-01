<template>
	<router-link :to="classInst.pageLink" class="bg-white flex flex-col gap-2 w-full p-3 rounded-custom h-auto">
		<SofaImageLoader class="w-full mdlg:h-[155px] h-[120px] rounded-custom" :photoUrl="classInst.picture" />
		<SofaNormalText class="!font-bold truncate" :content="classInst.title" />
		<div class="flex gap-2 items-center">
			<SofaNormalText
				color="text-grayColor"
				:content="`${classInst.lessons.length} ${$utils.pluralize(classInst.lessons.length, 'lesson', 'lessons')}`" />
			<span class="w-[5px] h-[5px] bg-grayColor rounded-full" />
			<SofaNormalText
				color="text-grayColor"
				:content="`${classInst.members.students.length} ${$utils.pluralize(classInst.members.students.length, 'student', 'students')}`" />
		</div>

		<SofaNormalText size="lg" class="font-bold">
			{{ $utils.formatPrice(classInst.price.amount, classInst.price.currency) }}/month
		</SofaNormalText>

		<div class="flex gap-2 items-center justify-between pt-1">
			<UserName :user="classInst.user" as="router-link" />
			<SofaIcon :name="isSaved ? 'bookmark-filled' : 'bookmark'" class="h-[18px]" @click.stop.prevent="saveClass" />
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { useSaveClass } from '@app/composables/organizations/classes-list'
import { ClassEntity } from '@modules/organizations'

const props = defineProps<{
	classInst: ClassEntity
}>()

const { saveClass, isSaved } = useSaveClass(props.classInst)
</script>
