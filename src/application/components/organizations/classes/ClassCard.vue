<template>
	<div class="bg-white shadow-custom rounded-custom p-4 relative">
		<div class="flex items-center gap-2 mdlg:gap-4 w-full">
			<sofa-image-loader
				:photo-url="classObj.picture"
				custom-class="!h-[100px] !w-[150px] mdlg:!h-[115px] w-full mdlg:!w-[200px] bg-grayColor rounded-custom relative">
			</sofa-image-loader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<sofa-normal-text class="!font-bold w-full text-left !line-clamp-1" :content="classObj.title" />
				<div class="flex items-center gap-2">
					<sofa-normal-text color="text-grayColor">
						{{ classObj.lessons.length }} {{ pluralize(classObj.lessons.length, 'lesson', 'lessons') }}
					</sofa-normal-text>
					<div class="w-[5px] h-[5px] bg-grayColor rounded-[50%]"></div>
					<sofa-normal-text color="text-grayColor">
						{{ classObj.members.students.length }} {{ pluralize(classObj.members.students.length, 'student', 'students') }}
					</sofa-normal-text>
				</div>
				<sofa-normal-text color="text-grayColor" size="lg" class="font-bold">
					{{ Logic.Common.formatPrice(classObj.price.amount, classObj.price.currency) }}
				</sofa-normal-text>
			</div>

			<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<sofa-icon name="more-options-horizontal" class="h-[6px]" @click.stop="moreOptionsHandler" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useOrganizationModal } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'
import { pluralize } from 'valleyed'
import { Logic } from 'sofa-logic'
import { defineProps } from 'vue'

const props = defineProps<{ classObj: ClassEntity }>()

const moreOptionsHandler = (e: Event) => useOrganizationModal().classCardMoreOptions.open({ classInst: props.classObj }, e)
</script>
