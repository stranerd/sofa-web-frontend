<template>
	<a :class="`flex items-center gap-1 ${customClass}`">
		<sofa-icon :name="`${ratings >= 1 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 1)" />
		<sofa-icon :name="`${ratings >= 2 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 2)" />
		<sofa-icon :name="`${ratings >= 3 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 3)" />
		<sofa-icon :name="`${ratings >= 4 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 4)" />
		<sofa-icon :name="`${ratings >= 5 ? 'star-full' : 'star'}`" :custom-class="size" @click="readonly ? '' : (ratings = 5)" />
	</a>
</template>
<script lang="ts">
import { onMounted, ref, watch } from 'vue'
import SofaIcon from '../SofaIcon'
export default {
	name: 'SofaRatings',
	components: {
		SofaIcon,
	},
	props: {
		count: {
			type: Number,
			default: 5,
		},
		customClass: {
			type: String,
			default: '',
		},
		readonly: {
			type: Boolean,
			default: true,
		},
		size: {
			type: String,
			default: 'h-[13px] mdlg:!h-[17px]',
		},
	},
	emits: ['update:modelValue'],
	setup(props: any, context: any) {
		const ratings = ref(0)
		onMounted(() => {
			if (props.count) {
				ratings.value = Math.round(props.count)
			}
		})
		watch(ratings, () => {
			context.emit('update:modelValue', ratings.value)
		})
		return {
			ratings,
		}
	},
}
</script>
