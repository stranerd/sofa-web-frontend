<template>
	<ClassLayout>
		<template #default="{ classObj }">
			<div class="w-full mdlg:bg-white mdlg:rounded-2xl mdlg:shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'About' }}</SofaHeaderText>
				<div class="hidden h-[1px] w-full bg-lightGray mdlg:block" />
				<div class="flex flex-col gap-4 p-0 mdlg:p-4">
					<SofaImageLoader
						customClass="block mdlg:hidden w-full h-[233px] flex items-center justify-center relative bg-grayColor rounded-custom !object-contain"
						:photoUrl="classObj?.picture">
					</SofaImageLoader>
					<!-- About class Info -->
					<div
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText customClass="text-grayColor"> Name </SofaNormalText>
						<SofaNormalText customClass="font-bold">{{ classObj?.title }}</SofaNormalText>
					</div>
					<div
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText customClass="text-grayColor"> Description </SofaNormalText>
						<SofaNormalText customClass="font-bold">{{ classObj?.description }}</SofaNormalText>
					</div>
					<div
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText customClass="text-grayColor"> Created </SofaNormalText>
						<SofaNormalText customClass="font-bold">{{
							classObj?.createdAt ? formatCreatedAt(classObj.createdAt) : 'N/A'
						}}</SofaNormalText>
					</div>
					<div
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText customClass="text-grayColor"> Lessons </SofaNormalText>
						<SofaNormalText customClass="font-bold">{{ classObj?.lessons.length }}</SofaNormalText>
					</div>
					<div
						class="flex flex-col gap-2 bg-white rounded-2xl shadow-custom p-4 mdlg:bg-transparent mdlg:rounded-none mdlg:shadow-none mdlg:p-0">
						<SofaNormalText customClass="text-grayColor"> Students </SofaNormalText>
						<SofaNormalText customClass="font-bold">{{ classObj?.members.students.length }}</SofaNormalText>
					</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script setup lang="ts">
import ClassLayout from '@app/components/class/ClassLayout.vue'
import { formatCreatedAt } from '@app/composables/core/time'
</script>
