<template>
	<router-link :to="classInst.explorePageLink" class="bg-white flex gap-2 w-full p-3 rounded-custom h-auto items-start">
		<SofaImageLoader
			class="flex-shrink-0 w-[80px] mdlg:w-[128px] h-[60px] mdlg:h-[96px] rounded-custom"
			:photoUrl="classInst.picture" />
		<div class="flex flex-col gap-2">
			<SofaNormalText class="!font-bold truncate" :content="classInst.title" />
			<div class="flex gap-2 items-center">
				<SofaIcon name="lessons" class="fill-current w-[16px]" />
				<SofaNormalText class="truncate" :content="classInst.lessons.map((lesson) => lesson.title).join(' | ')" />
			</div>

			<SofaNormalText color="text-grayColor" size="lg" class="font-bold">
				{{ Logic.Common.formatPrice(classInst.price.amount, classInst.price.currency) }}/month
			</SofaNormalText>
		</div>
	</router-link>
</template>

<script lang="ts" setup>
import { ClassEntity } from '@modules/organizations'
import { Logic } from 'sofa-logic'

defineProps<{
	classInst: ClassEntity
}>()
</script>
