<template>
	<router-link :to="classObj.pageLink" class="bg-white shadow-custom rounded-custom p-4 relative">
		<div class="flex items-center gap-2 mdlg:gap-4 w-full">
			<SofaImageLoader
				:photoUrl="classObj.picture"
				customClass="!h-[100px] !w-[150px] mdlg:!h-[115px] w-full mdlg:!w-[200px] bg-grayColor rounded-custom relative">
			</SofaImageLoader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<SofaNormalText class="!font-bold truncate" :content="classObj.title" />
				<div class="flex items-center gap-2">
					<SofaNormalText color="text-grayColor">
						{{ classObj.lessons.length }} {{ pluralize(classObj.lessons.length, 'lesson', 'lessons') }}
					</SofaNormalText>
					<div class="w-[5px] h-[5px] bg-grayColor rounded-[50%]"></div>
					<SofaNormalText color="text-grayColor">
						{{ classObj.members.students.length }} {{ pluralize(classObj.members.students.length, 'student', 'students') }}
					</SofaNormalText>
				</div>
				<SofaNormalText color="text-grayColor" size="lg" class="font-bold">
					{{ Logic.Common.formatPrice(classObj.price.amount, classObj.price.currency) }}
				</SofaNormalText>
			</div>

			<div class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<SofaIcon name="more-options-horizontal" class="h-[6px]" @click.stop="moreOptionsHandler" />
			</div>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { useModals } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'
import { pluralize } from 'valleyed'
import { Logic } from 'sofa-logic'

const props = defineProps<{ classObj: ClassEntity }>()

const moreOptionsHandler = (e: Event) => useModals().organizations.classCardMoreOptions.open({ classInst: props.classObj }, e)
</script>
