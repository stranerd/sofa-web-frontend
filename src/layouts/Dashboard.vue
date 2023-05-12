<template>
  <sofa-top-bar
    :go-back="goBack"
    :go-to-route="goToRoute"
    :tab-is-active="tabIsActive"
    :tabs="tabs"
    :subpage-actions="topbarOptions.actions"
    :title="topbarOptions.title"
    :type="topbarOptions.type"
    :custom-class="`${hideSmNavigator.top ? 'hidden mdlg:!flex' : 'flex'}`"
  ></sofa-top-bar>
  <div
    class="fixed top-0 pt-[80px] left-0 h-full lg:w-[22%] mdlg:w-[25%] mdlg:flex hidden px-5 py-5 flex-col space-y-5 overscroll-y-auto scrollbar-hide"
  >
    <slot name="left-session" />
  </div>
  <div
    :class="`h-full ${middleSessionWidth} mdlg:!pb-0 pb-4 flex-grow ${bgColor} text-center mdlg:!pt-6 relative px-0 mdlg:px-0 mdlg:ml-[25%] lg:ml-[22%] ${
      hideSmNavigator.bottom
        ? ' mdlg:!space-y-0'
        : 'lg:!space-y-5 mdlg:!space-y-5'
    }  space-y-2 flex flex-col lg:text-sm mdlg:text-[12px] text-xs`"
  >
    <slot name="middle-session" />
    <div class="h-[120px] mdlg:!hidden"></div>
  </div>

  <div
    class="fixed top-0 right-0 pt-[80px] h-full lg:w-[22%] mdlg:w-[25%] mdlg:flex hidden px-5 py-5 flex-col overflow-y-auto scrollbar-hide space-y-5"
  >
    <slot name="right-session" />
  </div>
  <sofa-bottom-bar
    :tab-is-active="tabIsActive"
    v-if="!hideSmNavigator.bottom"
  />
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { SofaTopBar, SofaBottomBar } from "sofa-ui-components";
import { tabTitle } from "../composables";

export default defineComponent({
  props: {
    topbarOptions: {
      type: Object as () => {
        type: string;
        title: string;
        actions: any[];
      },
      default: () => {
        return {
          type: "main",
          title: "",
          actions: [],
        };
      },
    },
    hideSmNavigator: {
      type: Object as () => {
        top: boolean;
        bottom: boolean;
      },
      default: () => {
        return {
          top: false,
          bottom: false,
        };
      },
    },
    bgColor: {
      type: String,
      default: "",
    },
    middleSessionWidth: {
      type: String,
      default: "lg:w-[56%]  mdlg:w-[50%]",
    },
  },
  components: {
    SofaTopBar,
    SofaBottomBar,
  },
  name: "DashboardLayout",
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

    const tabs = ref<any[]>([
      {
        name: "Home",
        path: "/",
        icon: "home",
        routeTag: "base",
        icon_size: "h-[18px]",
      },
      {
        name: "Chat",
        path: "/chat",
        icon: "chat",
        routeTag: "chat",
        icon_size: "h-[18px]",
      },
      {
        name: "Explore",
        path: "/explore",
        icon: "explore",
        routeTag: "explore",
        icon_size: "h-[19px]",
      },
      {
        name: "Library",
        path: "/library",
        icon: "library",
        routeTag: "library",
        icon_size: "h-[18px]",
      },
      {
        name: "Analytics",
        path: "/analytics",
        icon: "analytics",
        routeTag: "analytics",
        icon_size: "h-[18px]",
      },
      {
        name: "Marketplace",
        path: "/marketplace",
        icon: "marketplace",
        routeTag: "marketplace",
        icon_size: "h-[18px]",
      },
    ]);

    return {
      tabIsActive,
      goBack,
      goToRoute,
      tabTitle,
      loaderSetup,
      tabs,
    };
  },
});
</script>
