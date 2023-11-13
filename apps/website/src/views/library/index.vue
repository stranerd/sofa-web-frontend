<template>
	<LibraryLayout title="Library" :index="true" />
</template>

<script lang="ts">
import LibraryLayout from "@/components/library/LibraryLayout.vue"
import { Logic } from 'sofa-logic'
import { defineComponent } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
	components: { LibraryLayout },
	middlewares: {},
	name: "LibraryPage",
	setup () {
		useMeta({
			title: "Library",
		})

		if (Logic.Common.isLarge) Logic.Common.GoToRoute("/library/quizzes")
	},
})
</script>