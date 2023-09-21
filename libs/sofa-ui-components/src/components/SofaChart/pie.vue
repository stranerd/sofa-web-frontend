<template>
  <div :class="`${customClass} w-full h-[180px] relative `">
    <div
      class="w-full h-full absolute top-0 left-0 flex flex-row items-center justify-center"
    >
      <sofa-header-text size="xl" :customClass="textStyle">
        <slot />
      </sofa-header-text>
    </div>
    <canvas
      :id="`pieChart${randomIndex}`"
      class="w-full z-40 absolute h-full"
    ></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Chart, registerables } from "chart.js";
import { SofaHeaderText } from "../SofaTypography";
Chart.register(...registerables);

export default defineComponent({
  components: {
    SofaHeaderText,
  },
  props: {
    bgColor: {
      type: String,
      default: "bg-primaryOrange",
    },
    textStyle: {
      type: String,
      default: "",
    },
    customClass: {
      type: String,
      default: "",
    },
    padding: {
      type: String,
      default: "py-2 px-4 ",
    },
    cutoutPercentage: {
      type: String,
      default: "85%",
    },
    data: {
      type: Array as () => any,
    },
  },
  name: "SofaPieChart",
  setup(props) {
    const randomIndex = Math.random();

    const pieChart = ref();

    onMounted(() => {
      const ctx: any = document.getElementById("pieChart" + randomIndex);

      if (ctx && props.data) {
        pieChart.value = new Chart(ctx, {
          type: "doughnut",
          data: props.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: props.cutoutPercentage,
            borderColor: "transparent",
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "whitesmoke",
                bodyColor: "#294940",
                titleColor: "#294940",
              },
            },
          },
        });
      }
    });

    const updateChart = () => {
      pieChart.value?.update();
    };

    return {
      randomIndex,
      updateChart,
    };
  },
});
</script>
