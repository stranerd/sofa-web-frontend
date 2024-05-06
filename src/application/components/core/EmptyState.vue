<template>
	<div class="w-full h-full grow flex flex-col justify-center items-center px-[12.5%] py-[5%] gap-4 rounded-2xl">
		<SofaImageLoader :photoUrl="`/images/empty/${image}.png`" class="max-w-[30%]" />
		<div class="flex flex-col items-center text-center gap-1">
			<SofaHeading :content="title" size="mid" class="text-deepGray" />
			<SofaText v-for="text in Array.isArray(sub) ? sub : [sub]" :key="text" :content="text" size="sub" class="text-grayColor" />
		</div>
		<div class="flex gap-3 justify-center items-center font-semibold">
			<SofaButton
				v-if="primary"
				bgColor="bg-primaryBlue"
				padding="py-3 px-6"
				textColor="text-white"
				class="border border-primaryBlue"
				@click="primary.action()">
				{{ primary.label }}
			</SofaButton>
			<SofaButton
				v-if="secondary"
				bgColor="bg-transparent"
				padding="py-3 px-6"
				textColor="text-primaryBlue"
				class="border border-primaryBlue"
				@click="secondary.action()">
				{{ secondary.label }}
			</SofaButton>
		</div>
	</div>
</template>
<script lang="ts" setup>
type ButtonConfig = {
	action: () => void
	label: string
}

defineProps<{
	image: 'classes' | 'study-materials' | 'teachers' | 'students' | 'announcements' | 'live' | 'lessons'
	title: string
	sub: string | string[]
	primary?: ButtonConfig
	secondary?: ButtonConfig
}>()
</script>
