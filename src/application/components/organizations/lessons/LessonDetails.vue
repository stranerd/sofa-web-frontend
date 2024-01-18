<template>
	<div class="p-4 flex flex-col gap-4">
		<div class="flex w-full items-center gap-2 justify-between">
			<SofaHeaderText class="!font-bold !text-deepGray" :content="lesson.title" />
			<div class="flex items-center gap-4">
				<SofaIcon class="h-[16px]" name="back-arrow" customClass="!fill-black" />
				<SofaIcon class="h-[16px]" name="arrow-right-white" customClass="!fill-black" />
				<div>
					<SofaIcon class="h-[16px]" name="circle-close" @click="close" />
				</div>
			</div>
		</div>
		<div class="flex items-center gap-6 border-b border-darkLightGray">
			<!-- <button class="pb-3" @click="changeTab('curriculum')">
				<SofaNormalText
					:customClass="
						selectedTab === 'curriculum'
							? 'text-primaryPurple pb-3 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Curriculum
				</SofaNormalText>
			</button> -->
			<button class="pb-3" @click="changeTab('teachers')">
				<SofaNormalText
					:customClass="
						selectedTab === 'teachers'
							? 'text-primaryPurple pb-4 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Teachers {{ lesson.teachers.length }}
				</SofaNormalText>
			</button>
			<button class="pb-3" @click="changeTab('students')">
				<SofaNormalText
					:customClass="
						selectedTab === 'students'
							? 'text-primaryPurple pb-4 border-b border-primaryPurple font-bold'
							: 'text-deepGray font-bold'
					">
					Students {{ lesson.students.length }}
				</SofaNormalText>
			</button>
		</div>
		<div v-if="selectedTab === 'teachers'" class="py-4 flex flex-col gap-4">
			<!-- <div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Teachers" />
			</div> -->
			<div v-for="i in 1" :key="i" class="flex items-center gap-3">
				<div>
					<SofaAvatar photoUrl="/images/freeman.png" customClass="!w-[32px] !h-[32px]" />
				</div>
				<SofaNormalText color="text-deepGray">{{ 'Adedeji Tewogbade' }}</SofaNormalText>
			</div>
		</div>
		<div v-if="selectedTab === 'students'" class="py-4 flex flex-col gap-4">
			<div class="flex flex-col items-center justify-center gap-2 bg-lightGray p-8">
				<img src="/images/no-lessons.png" class="w-[84px] h-[84px]" />
				<SofaNormalText customClass="font-bold" content="There’s nothing here" />
				<SofaNormalText color="text-grayColor text-center" content="No Students" />
			</div>
			<!-- <div v-for="i in 10" :key="i" class="flex items-center gap-3">
				<div>
					<SofaAvatar photoUrl="/images/freeman.png" customClass="!w-[32px] !h-[32px]" />
				</div>
				<SofaNormalText color="text-deepGray">{{ 'Adedeji Tewogbade' }}</SofaNormalText>
			</div> -->
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
defineProps<{
	organizationId: string
	classId: string
	userId: string
	close: () => void
	lesson: any
}>()

const selectedTab = ref('teachers')

const changeTab = (val: string) => {
	selectedTab.value = val
}
</script>
