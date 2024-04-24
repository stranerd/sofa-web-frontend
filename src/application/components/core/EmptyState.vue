<template>
	<div class="w-full flex flex-col justify-center items-center p-20 rounded-2xl text-deepGray bg-white mdlg:bg-lightGray">
		<SofaImageLoader :photoUrl="`/empty/${image}.png`" class="h-[180px] mb-4" />
		<SofaHeading :content="title" />
		<SofaText :content="sub" size="sub" class="text-grayColor mb-4" />
		<div class="flex gap-3 justify-center items-center font-semibold">
			<SofaButton
				v-if="primary"
				:hasShadow="false"
				bgColor="bg-primaryBlue"
				padding="py-4 px-6"
				textColor="text-white"
				class="border border-primaryBlue"
				@click="primary.action()">
				{{ primary.label }}
			</SofaButton>
			<SofaButton
				v-if="secondary"
				bgColor="bg-transparent"
				:hasShadow="false"
				padding="py-4 px-6"
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
	image: 'classes' | 'study-materials'
	title: string
	sub: string
	primary?: ButtonConfig
	secondary?: ButtonConfig
}>()
</script>
