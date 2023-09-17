<template>
  <expanded-layout layoutStyle="!w-full">
    <div
      class="w-full mdlg:!flex hidden flex-col space-y-5 py-8 pb-14 bg-primaryPurple justify-center items-center"
    >
      <sofa-header-text
        color="!text-white"
        size="xl"
        :customClass="'!font-extrabold'"
        >All contents made by verified creators</sofa-header-text
      >

      <div class="w-[48%] flex flex-row items-center justify-center">
        <sofa-normal-text
          color="!text-white"
          :customClass="'w-full text-center flex items-center justify-center'"
          >Everything here is carefully reviewed to ensure the highest quality
          and accuracy. By purchasing from our marketplace, you can have
          confidence in the credibility of the creators and the value of the
          materials.</sofa-normal-text
        >
      </div>

      <div class="w-[40%] flex flex-col pt-4">
        <div
          class="w-full shadow-custom px-4 py-1 bg-white custom-border flex flex-row space-x-3 items-center justify-between"
        >
          <div class="flex flex-row space-x-2 items-center flex-grow">
            <sofa-icon
              :name="'filter'"
              :customClass="'h-[15px] cursor-pointer'"
              @click="Logic.Common.GoToRoute('/marketplace/search')"
            />
            <sofa-normal-text
              :customClass="'pr-2 border-r-[1px] border-[#E1E6EB] cursor-pointer'"
              @click="Logic.Common.GoToRoute('/marketplace/search')"
              >Filter</sofa-normal-text
            >
            <sofa-text-field
              :customClass="'!border-none w-full'"
              :placeholder="'Search for anything'"
              v-model="searchQueryLg"
              @onEnter="handleSearchLg"
            >
            </sofa-text-field>
          </div>

          <div class="w-[20px] cursor-pointer" @click="handleSearchLg">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Small screen search -->
    <div
      class="w-full px-4 flex mdlg:!hidden flex-col sticky top-0 left-0 py-4 bg-backgroundGray z-[9999]"
    >
      <div
        class="w-full shadow-custom px-4 py-1 bg-white custom-border flex flex-row space-x-1 items-center justify-start"
      >
        <div
          class="flex flex-row space-x-2 items-center flex-grow"
          @click="Logic.Common.GoToRoute('/marketplace/search')"
        >
          <sofa-icon :name="'filter'" :customClass="'h-[15px]'" />
        </div>
        <div class="w-full flex flex-row items-center space-x-1">
          <div class="pl-2">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
          <sofa-text-field
            :customClass="'!border-none w-full flex-grow'"
            :placeholder="'Search'"
            v-model="searchQueryLg"
            :defaultValue="defaultValue"
            @onEnter="handleSearchLg"
          >
          </sofa-text-field>
        </div>
      </div>
    </div>

    <div
      class="mdlg:!w-[85%] lg:!w-[75%] w-full flex flex-col space-y-6 md:!space-y-7 mdlg:!px-0 px-0"
    >
      <!-- Textbook, note, past questions -->
      <div
        v-if="false"
        class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide mdlg:!pl-0 pl-4"
      >
        <div
          class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-3 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
        >
          <sofa-image-loader
            :photoUrl="item.image"
            custom-class="col-span-1 mdlg:!w-auto w-[290px] relative custom-border mdlg:!h-[230px] h-[190px] cursor-pointer"
            v-for="(item, index) in mainCards"
            :key="index"
            @click="Logic.Common.GoToRoute(item.routePath)"
          >
            <div
              class="w-full h-full absolute top-0 custom-border left-0 bg-black bg-opacity-40 z-10"
            ></div>
            <div
              class="absolute left-0 bottom-0 flex flex-row items-center z-40 justify-between w-full py-3 px-4 bg-black bg-opacity-50 rounded-br-[16px] rounded-bl-[8px]"
            >
              <sofa-normal-text :color="'text-white !font-bold'">
                {{ item.text }}
              </sofa-normal-text>
              <sofa-icon
                :customClass="'h-[14px]'"
                :name="'arrow-right-white'"
              />
            </div>
          </sofa-image-loader>
        </div>
      </div>

      <div
        class="w-full flex flex-col mdlg:!space-y-4 space-y-3 mdlg:!pl-0 pl-4 z-40"
      >
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Latest
          </sofa-normal-text>

          <sofa-normal-text
            :color="'text-primaryPink'"
            :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)"
          >
            View all
          </sofa-normal-text>
        </div>

        <div
          v-if="marketplaceContents.lastest.length"
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-item-card
              :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.lastest"
              :key="index"
              @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                    content.id +
                    `?type=${content.labels.main.toLowerCase()}`
                )
              "
            ></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col space-y-3">
            <sofa-empty-state
              :title="'No result found'"
              :subTitle="'We could not find any lastest material'"
            />
          </div>
        </template>
      </div>

      <div
        class="w-full flex flex-col mdlg:!space-y-4 space-y-3 mdlg:!pl-0 pl-4 z-40"
      >
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Highest rated
          </sofa-normal-text>

          <sofa-normal-text
            :color="'text-primaryPink'"
            :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)"
          >
            View all
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          v-if="marketplaceContents.rated.length"
        >
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-item-card
              :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.rated"
              :key="index"
              @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                    content.id +
                    `?type=${content.labels.main.toLowerCase()}`
                )
              "
            ></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col space-y-3">
            <sofa-empty-state
              :title="'No result found'"
              :subTitle="'We could not find any highes rated materials'"
            />
          </div>
        </template>
      </div>

      <div
        class="w-full flex flex-col mdlg:!space-y-4 space-y-3 mdlg:!pl-0 pl-4 z-40"
      >
        <div
          class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4"
        >
          <sofa-normal-text :customClass="'!font-bold'">
            Most popular
          </sofa-normal-text>

          <sofa-normal-text
            :color="'text-primaryPink'"
            :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)"
          >
            View all
          </sofa-normal-text>
        </div>

        <div
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          v-if="marketplaceContents.popular.length"
        >
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row space-x-3 mdlg:!space-x-0 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <sofa-item-card
              :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.popular"
              :key="index"
              @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                    content.id +
                    `?type=${content.labels.main.toLowerCase()}`
                )
              "
            ></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col space-y-3">
            <sofa-empty-state
              :title="'No result found'"
              :subTitle="'We could not find most popular materials'"
            />
          </div>
        </template>
      </div>

      <div class="h-[100px]"></div>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaItemCard,
  SofaTextField,
  SofaHeaderText,
  SofaEmptyState,
  SofaImageLoader,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import {
  AllCourses,
  mainCards,
  marketplaceContents,
  MarketplaceMaterials,
  notesContents,
  pastQuestionContents,
  search,
  sectionTags,
  setMarketplaceMaterials,
  textbookContents,
} from "@/composables/marketplace";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaItemCard,
    SofaTextField,
    SofaHeaderText,
    SofaEmptyState,
    SofaImageLoader,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "MarketplaceMaterials",
        method: "GetMarketplaceMaterials",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
        silentUpdate: true,
      },
      {
        domain: "Study",
        property: "AllTopics",
        method: "GetTopics",
        params: [],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "AllOtherTags",
        method: "GetOtherTags",
        params: [],
        requireAuth: true,
      },
    ],
  },
  name: "MarketPlaceIndexPage",
  setup() {
    useMeta({
      title: "Marketplace",
    });

    const showFilter = ref(false);

    const searchQuery = ref("");

    const searchQueryLg = ref("");

    const selectedOptions = ref([]);

    const defaultValue = ref("");

    onMounted(() => {
      scrollToTop();
      Logic.Study.watchProperty("AllCourses", AllCourses);
      Logic.Study.watchProperty("MarketplaceMaterials", MarketplaceMaterials);
      setMarketplaceMaterials(5);
    });

    watch(MarketplaceMaterials, () => {
      setMarketplaceMaterials();
    });

    watch(defaultValue, () => {
      if (defaultValue.value) {
        setTimeout(() => {
          defaultValue.value = "";
        }, 1000);
      }
    });

    const handleSearchLg = () => {
      if (searchQueryLg.value) {
        Logic.Common.GoToRoute(`/marketplace/search?q=` + searchQueryLg.value);
      }
    };

    return {
      moment,
      notesContents,
      pastQuestionContents,
      textbookContents,
      Logic,
      showFilter,
      selectedOptions,
      searchQuery,
      defaultValue,
      searchQueryLg,
      mainCards,
      sectionTags,
      marketplaceContents,
      handleSearchLg,
      search,
    };
  },
});
</script>