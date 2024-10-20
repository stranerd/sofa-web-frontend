<template>
	<FullLayout :hide="{ bottom: true, top: true, left: true, right: true }" bgColor="bg-white">
		<template #middle-session>
			<SofaModal v-if="$screen.desktop">
				<div class="flex flex-col p-6 gap-6 h-fit max-h-full overflow-y-auto">
					<div class="flex gap-4 items-center justify-between">
						<SofaIcon v-if="onBack" class="h-[15px]" name="arrow-left" @click="onBack" />
						<SofaHeading size="title">{{ title }}</SofaHeading>
						<span v-if="onBack" class="w-8" />
					</div>
					<slot />
				</div>
			</SofaModal>
			<template v-else>
				<div class="w-full flex items-center gap-3 justify-between p-4">
					<SofaIcon class="h-[15px]" name="arrow-left" @click="() => onBack?.() ?? $utils.goBack()" />
					<SofaHeading :content="title" />
					<span class="w-8" />
				</div>
				<div class="w-full h-fit max-h-full flex flex-col flex-1 px-4 pb-4 gap-4 overflow-y-auto">
					<slot />
				</div>
			</template>
		</template>
	</FullLayout>
</template>

<script setup lang="ts">
defineProps<{
	title: string
	onBack?: () => void
}>()
</script>
