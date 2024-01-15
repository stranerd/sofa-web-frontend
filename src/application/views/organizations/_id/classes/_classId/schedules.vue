<template>
	<ClassLayout>
		<template #default>
			<div class="w-full bg-white rounded-2xl shadow-custom">
				<SofaHeaderText customClass="p-4 hidden mdlg:block">{{ 'Schedule' }}</SofaHeaderText>
				<div class="h-[1px] w-full bg-lightGray" />

				<div class="w-full p-4">
					<div class="w-full flex flex-col gap-2 items-center justify-center bg-lightGray p-8">
						<SofaImageLoader
							customClass="w-[64px] h-[64px] flex items-center justify-center rounded-custom !object-contain"
							photoUrl="/images/calendar.png">
						</SofaImageLoader>
						<SofaNormalText customClass="font-bold"> There’s nothing here </SofaNormalText>
						<SofaNormalText color="text-grayColor text-center"> There are no live sessions scheduled </SofaNormalText>
					</div>
				</div>
			</div>
		</template>
	</ClassLayout>
</template>

<script setup lang="ts">
import ClassLayout from '@app/components/class/ClassLayout.vue'
</script>
