<template>
  <div :class="`${customClass} w-full `">
    <canvas :id="`barChart${randomIndex}`" class="w-full !h-[310px]"></canvas>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default defineComponent({
  props: {
    bgColor: {
      type: String,
      default: "bg-primaryOrange",
    },
    textColor: {
      type: String,
      default: "text-darkGray",
    },
    customClass: {
      type: String,
      default: "",
    },
    padding: {
      type: String,
      default: "py-2 px-4 ",
    },
    data: {
      type: Array as () => {
        date: string;
        amount: number;
      }[],
    },
    data2: {
      type: Array as () => {
        date: string;
        amount: number;
      }[],
    },
  },
  name: "SofaBarChart",
  setup(props) {
    const randomIndex = Math.random();

    onMounted(() => {
      if (props.data) {
        const ctx: any = document.getElementById("barChart" + randomIndex);

        const labels = props.data.map((eachItem) => eachItem.date);

        const data: any[] = [];

        if (props.data) {
          const amountData = props.data.map((eachItem) => eachItem.amount);

          data.push({
            data: amountData,
            borderColor: "rgb(131, 175, 155)",
            backgroundColor: "rgb(131, 175, 155)",
            borderWidth: 2,
            borderRadius: Number.MAX_VALUE,
            borderSkipped: false,
            barPercentage: 0.4,
          });
        }

        if (props.data2) {
          const amountData = props.data2.map((eachItem) => eachItem.amount);

          data.push({
            data: amountData,
            borderColor: "rgb(255, 200, 141)",
            backgroundColor: "rgb(255, 200, 141)",
            borderWidth: 2,
            borderRadius: Number.MAX_VALUE,
            borderSkipped: false,
            barPercentage: 0.4,
          });
        }

        if (ctx) {
          new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: data,
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  border: {
                    display: false,
                  },
                  // ticks: {
                  //   display: false,
                  // },
                },
                x: {
                  border: {
                    display: false,
                  },
                  grid: {
                    display: false,
                  },
                },
              },
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
      }
    });

    return {
      randomIndex,
    };
  },
});
</script>
