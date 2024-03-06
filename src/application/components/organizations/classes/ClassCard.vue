<template>
	<router-link :to="classInst.pageLink" class="shadow-custom rounded-custom p-4 relative">
		<div class="flex items-center gap-2 mdlg:gap-4 w-full">
			<SofaImageLoader
				:photoUrl="classInst.picture"
				customClass="!h-[100px] !w-[150px] mdlg:!h-[115px] w-full mdlg:!w-[200px] bg-grayColor rounded-custom relative">
			</SofaImageLoader>
			<div class="flex flex-col gap-2 relative h-full w-full">
				<SofaNormalText class="!font-bold truncate" :content="classInst.title" />
				<div class="flex items-center gap-2">
					<SofaNormalText color="text-grayColor">
						{{ classInst.lessons.length }} {{ pluralize(classInst.lessons.length, 'lesson', 'lessons') }}
					</SofaNormalText>
					<div class="w-[5px] h-[5px] bg-grayColor rounded-[50%]"></div>
					<SofaNormalText color="text-grayColor">
						{{ classInst.members.students.length }} {{ pluralize(classInst.members.students.length, 'student', 'students') }}
					</SofaNormalText>
				</div>
				<SofaNormalText color="text-grayColor" size="lg" class="font-bold">
					{{ Logic.Common.formatPrice(classInst.price.amount, classInst.price.currency) }}
				</SofaNormalText>
			</div>

			<div v-if="showOptionsIcon" class="absolute right-0 top-0 p-3 bg-white rounded-tr-lg">
				<SofaIcon name="more-options-horizontal" class="h-[6px]" @click.stop.prevent="moreOptionsHandler" />
			</div>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { pluralize } from 'valleyed'
import { useModals } from '@app/composables/core/modals'
import { ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'

const props = withDefaults(
	defineProps<{
		classInst: ClassEntity
		showOptionsIcon?: boolean // Notice the '?' making it optional
	}>(),
	{
		showOptionsIcon: true,
	},
)

const moreOptionsHandler = (e: Event) => useModals().organizations.classCardMoreOptions.open({ classInst: props.classInst }, e)
</script>
