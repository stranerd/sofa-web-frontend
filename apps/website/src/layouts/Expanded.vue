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
    v-if="hasTopBar"
    :custom-class="'hidden mdlg:!flex'"
  ></sofa-top-bar>
  <div
    :class="`w-full flex flex-col flex-grow items-center justify-center h-full ${
      Logic.Common.isNativeApp
        ? '!font-lexend !bg-backgroundGray overflow-y-auto'
        : ''
    } `"
  >
    <div
      :class="`h-full pb-4 flex-grow text-center relative px-0  mdlg:px-0 mdlg:!space-y-5 flex flex-col  items-center  lg:text-sm mdlg:text-[12px] text-xs ${layoutStyle}`"
      :style="`background-image: url(${bgImage})`"
    >
      <slot />
      <div class="h-[120px] mdlg:!hidden" v-if="bottomPadding"></div>
    </div>
  </div>
  <sofa-bottom-bar
    :tab-is-active="tabIsActive"
    v-if="hasBottomBar"
    :showAddItem="handleShowAddItem"
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
      },
      default: () => {
        return {
          type: "main",
          title: "",
          actions: [],
        };
      },
    },
    layoutStyle: {
      type: String,
      default: "mdlg:!w-[85%] lg:!w-[75%] w-full pt-0  mdlg:!pt-6",
    },
    hasTopBar: {
      type: Boolean,
      default: true,
    },
    hasBottomBar: {
      type: Boolean,
      default: true,
    },
    bottomPadding: {
      type: Boolean,
      default: true,
    },
    bgImage: {
      type: String,
      default: "",
    },
  },
  name: "ExpandedLayout",
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
      // {
      //   name: "Explore",
      //   path: "/explore",
      //   icon: "explore",
      //   routeTag: "explore",
      //   icon_size: "h-[19px]",
      // },
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
      Logic,
      tabTitle,
      loaderSetup,
      tabs,
      showAddItem,
      handleShowAddItem,
      tabIsActive,
      goBack,
      goToRoute,
    };
  },
});
</script>
