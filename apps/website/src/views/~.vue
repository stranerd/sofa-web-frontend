<template>
	<div />
</template>

<script lang="ts">
import { generateMiddlewares } from '@/middlewares'
import { defineComponent } from 'vue'

export default defineComponent({
	name: '404',
	beforeRouteEnter: generateMiddlewares([async () => '/']),
})
</script>
