<template>
	<div class="w-full h-[180px] relative">
		<div class="w-full h-full absolute top-0 left-0 flex flex-row items-center justify-center">
			<SofaHeaderText size="xl" color="text-current" :class="textStyle">
				<slot />
			</SofaHeaderText>
		</div>
		<canvas :id="`pieChart${randomIndex}`" class="w-full z-40 absolute h-full"></canvas>
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch, markRaw } from 'vue'
import { Chart, registerables } from 'chart.js'
import { SofaHeaderText } from '../SofaTypography'
Chart.register(...registerables)

export default defineComponent({
	name: 'SofaPieChart',
	components: { SofaHeaderText },
	props: {
		textStyle: {
			type: String,
			default: '',
		},
		cutoutPercentage: {
			type: String,
			default: '90%',
		},
		data: {
			type: Object as () => any,
			default: null,
		},
	},
	setup(props) {
		const randomIndex = Math.random()

		const pieChart = ref()

		const dataRef = toRef(props, 'data')

		onMounted(() => {
			const ctx: any = document.getElementById('pieChart' + randomIndex)

			if (ctx && props.data) {
				pieChart.value = markRaw(
					new Chart(ctx, {
						type: 'doughnut',
						data: props.data,
						options: {
							responsive: true,
							maintainAspectRatio: false,
							cutout: props.cutoutPercentage,
							borderColor: 'transparent',
							plugins: {
								legend: {
									display: false,
								},
								tooltip: {
									backgroundColor: 'whitesmoke',
									bodyColor: '#294940',
									titleColor: '#294940',
								},
							},
						},
					}),
				)
			}
		})

		watch(dataRef, () => {
			pieChart.value?.update()
		})

		return { randomIndex }
	},
})
</script>
