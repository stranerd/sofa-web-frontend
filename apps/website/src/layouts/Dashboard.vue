<template>
  <sofa-top-bar
    :go-back="goBack"
    :go-to-route="goToRoute"
    :tab-is-active="tabIsActive"
    :tabs="tabs"
    :subpage-actions="topbarOptions.actions"
    :title="topbarOptions.title"
    :type="topbarOptions.type"
    :showAddItem="handleShowAddItem"
    :custom-class="`${hideSmNavigator.top ? 'hidden mdlg:!flex' : 'flex'}`"
    :badges="topbarOptions.badges"
  ></sofa-top-bar>
  <div
    :class="` ${
      wrapLayout
        ? 'mdlg:!fixed pb-5 px-4'
        : 'fixed mdlg:!fixed hidden px-4 py-4'
    } mdlg:!top-0 mdlg:!pt-[80px] mdlg:!left-0 h-full lg:!w-[22%] mdlg:!w-[25%] mdlg:flex w-full mdlg:!px-5 mdlg:!py-5  flex-col space-y-5 overscroll-y-auto scrollbar-hide`"
  >
    <slot name="left-session" />
  </div>
  <div
    :class="`h-full overflow-y-auto z-10 ${middleSessionWidth}  ${
      wrapLayout ? 'pb-6' : 'pb-4'
    }   flex-grow ${bgColor} text-center mdlg:!pt-6 relative ${
      wrapLayout ? 'px-4' : 'px-0'
    }  mdlg:px-0 mdlg:ml-[25%] lg:ml-[22%] ${
      hideSmNavigator.bottom
        ? ' mdlg:!gap-0'
        : 'lg:!gap-5 mdlg:!gap-5'
    } gap-2 flex flex-col lg:text-sm mdlg:text-[12px] text-xs`"
  >
    <slot name="middle-session" />
    <div class="h-[120px] mdlg:!hidden" v-if="!wrapLayout"></div>
  </div>

  <div
    :class="` ${
      wrapLayout
        ? 'mdlg:!fixed pb-5 px-4'
        : 'fixed mdlg:!fixed hidden px-4 py-4'
    } mdlg:!top-0 mdlg:!right-0 mdlg:!pt-[80px] h-full lg:w-[22%] mdlg:w-[25%] mdlg:!flex  mdlg:!px-5 mdlg:!py-5 flex-col overflow-y-auto scrollbar-hide space-y-5`"
  >
    <slot name="right-session" />
  </div>
  <sofa-bottom-bar
    :tab-is-active="tabIsActive"
    :showAddItem="handleShowAddItem"
    v-if="!hideSmNavigator.bottom"
  />
  <add-material-modal
    v-if="showAddItem"
    :close="
      () => {
        showAddItem = false;
      }
    "
  />
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SofaTopBar, SofaBottomBar } from "sofa-ui-components";
import { handleShowAddItem, showAddItem, tabTitle } from "../composables";
import AddMaterialModal from "@/components/common/AddMaterialModal.vue";
import { Logic } from "sofa-logic";

export default defineComponent({
  components: {
    SofaTopBar,
    SofaBottomBar,
    AddMaterialModal,
  },
  props: {
    topbarOptions: {
      type: Object as () => {
        type: string;
        title: string;
        actions: any[];
        badges: {
          text: string;
          color: string;
        }[];
      },
      default: () => {
        return {
          type: "main",
          title: "",
          actions: [],
          badges: [],
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
      default: "lg:w-[56%]  mdlg:w-[50%] mdlg:!pb-0",
    },
    wrapLayout: {
      type: Boolean,
      default: false,
    },
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
        name: "Library",
        path: "/library",
        icon: "library",
        routeTag: "library",
        icon_size: "h-[18px]",
      },
      // {
      //   name: "Analytics",
      //   path: "/analytics",
      //   icon: "analytics",
      //   routeTag: "analytics",
      //   icon_size: "h-[18px]",
      // },
      {
        name: "Marketplace",
        path: "/marketplace",
        icon: "marketplace",
        routeTag: "marketplace",
        icon_size: "h-[18px]",
      },
    ]);

    onMounted(() => {
      tabs.value = tabs.value.filter((item) => {
        if (
          Logic.Users.getUserType() == "organization" &&
          item.icon == "chat"
        ) {
          return false;
        } else {
          return true;
        }
      });
    });

    return {
      tabIsActive,
      goBack,
      goToRoute,
      tabTitle,
      loaderSetup,
      tabs,
      showAddItem,
      handleShowAddItem,
    };
  },
});
</script>
