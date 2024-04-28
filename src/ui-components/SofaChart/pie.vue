<template>
	<div class="w-full h-[180px] relative">
		<div class="w-full h-full absolute top-0 left-0 flex items-center justify-center">
			<SofaHeading size="title2" :class="textStyle">
				<slot />
			</SofaHeading>
		</div>
		<canvas :id="`pieChart${randomIndex}`" class="w-full z-40 absolute h-full" />
	</div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch, markRaw } from 'vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default defineComponent({
	name: 'SofaPieChart',
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
