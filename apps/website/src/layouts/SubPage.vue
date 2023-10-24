<template>
  <div
    :class="`w-full flex flex-col flex-grow items-center justify-center h-full ${
      Logic.Common.isNativeApp
        ? '!font-lexend !bg-backgroundGray overflow-y-auto'
        : ''
    }`"
  >
    <div
      :class="`h-full  flex-grow text-center relative mdlg:px-0 space-y-5 flex flex-col items-center  lg:text-sm mdlg:text-[12px] text-xs w-full`"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Logic } from "sofa-logic";
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";

import { tabTitle } from "../composables";

export default defineComponent({
  props: {},
  components: {},
  name: "SubPageLayout",
  setup() {
    const router = useRouter();

    const selectedTab = ref("");

    const tabIsActive = (tabName: string) => {
      const mainName = tabName;

      if (mainName == "base" && router.currentRoute.value.path == "/") {
        return true;
      } else if (
        mainName != "base" &&
        router.currentRoute.value.path.includes(mainName)
      ) {
        selectedTab.value = mainName;
        return true;
      }

      return false;
    };

    const goBack = () => {
      window.history.length > 1 ? router.go(-1) : router.push("/");
    };

    const goToRoute = (route: string) => {
      router.push(route);
    };

    const loaderSetup = ref<any>();

    return {
      tabTitle,
      loaderSetup,
      Logic,
      tabIsActive,
      goBack,
      goToRoute,
    };
  },
});
</script>
