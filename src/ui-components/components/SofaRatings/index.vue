<template>
	<a :class="`flex items-center gap-1 ${customClass}`">
		<sofa-icon :name="`${ratings >= 1 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 1)" />
		<sofa-icon :name="`${ratings >= 2 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 2)" />
		<sofa-icon :name="`${ratings >= 3 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 3)" />
		<sofa-icon :name="`${ratings >= 4 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 4)" />
		<sofa-icon :name="`${ratings >= 5 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 5)" />
	</a>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import SofaIcon from '../SofaIcon'

const props = withDefaults(
	defineProps<{
		count: number
		customClass: string
		readonly: boolean
		size: string
	}>(),
	{
		count: 5,
		customClass: '',
		readonly: true,
		size: 'h-[13px] mdlg:!h-[17px]',
	},
)

const model = defineModel<number>({ default: 0 })

const ratings = ref(0)
onMounted(() => {
	if (props.count) ratings.value = Math.round(props.count)
})
watch(ratings, () => {
	model.value = ratings.value
})
</script>
