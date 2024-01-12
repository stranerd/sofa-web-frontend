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
			<slot />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ClassEntity } from '@modules/organizations'
import { pluralize } from '@utils/commons'
import { Logic } from 'sofa-logic'
import { SofaImageLoader, SofaNormalText } from 'sofa-ui-components'
import { PropType, defineProps } from 'vue'

defineProps({
	classObj: {
		type: Object as PropType<ClassEntity>,
		required: true,
	},
})
</script>
