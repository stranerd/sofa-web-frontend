<template>
  <div
    class="w-full h-full flex flex-row fixed top-0 left-0 bg-white items-center justify-center"
  >
    <div
      class="bg-white w-full lg:!w-[45%] mdlg:!w-[50%] h-full flex flex-col items-center justify-center mdlg:!pt-9 md:!pt-9 pt-0"
    >
      <slot />
    </div>

    <div
      class="bg-primaryPurple hidden mdlg:!flex flex-col lg:!w-[55%] mdlg:!w-[50%] h-full items-center justify-center pt-9"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {},
  name: "AuthLayout",
  setup() {
    //
  },
});
</script>
