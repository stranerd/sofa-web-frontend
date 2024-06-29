<template>
	<ExpandedLayout
		:layoutStyle="`!justify-between ${isDark ? 'bg-deepGray text-white' : ''}`"
		:hide="{ top: true, bottom: true }"
		:bgImage="isDark ? '/images/plays-bg.svg' : undefined">
		<PlayRun :playId="$route.params.id as string" :type="type" />
	</ExpandedLayout>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from '@app/composables/core/routes'
import { PlayEntity, PlayTypes } from '@modules/plays'

export default defineComponent({
	name: 'PlaysTypeIdRunPage',
	routeConfig: {
		middlewares: [
			'isAuthenticated',
			async ({ to }) => {
				if (!Object.values(PlayTypes).includes(to.params.type as any)) return '/library'
			},
		],
	},
	setup() {
		useMeta({
			title: 'Run',
		})

		const route = useRoute()
		const type = route.params.type as PlayTypes
		const isDark = computed(() => PlayEntity.isDark(type))
		return { type, isDark }
	},
})
</script>
