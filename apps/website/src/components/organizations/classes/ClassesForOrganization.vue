<template>
	<div v-if="classes.length === 0" class="w-full shadow-custom bg-white text-bodyBlack rounded-2xl flex flex-col gap-4 p-4 mdlg:p-6">
		<div class="bg-lightGray flex flex-col items-center justify-center gap-2 p-4 md:p-6 rounded-custom">
			<img :src="emptyClassContent.imageURL" class="w-[59px] h-[64px]" />
			<SofaHeaderText>{{ 'Organization' }}</SofaHeaderText>
			<SofaNormalText color="text-grayColor" :content="emptyClassContent.content" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SofaHeaderText, SofaNormalText } from 'sofa-ui-components'

export default defineComponent({
	name: 'OrganizationClassesPage',
	components: { SofaHeaderText, SofaNormalText },
	setup() {
		const emptyClassContent = {
			imageURL: '/images/empty-class.png',
			title: 'You are not in any class',
			content: 'Contact your organization to add you to a class.',
		}

		const classes = []

		return {
			emptyClassContent,
			classes,
		}
	},
})
</script>
