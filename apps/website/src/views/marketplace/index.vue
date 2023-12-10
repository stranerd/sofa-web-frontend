<template>
  <expanded-layout layoutStyle="mdlg:pb-4">
    <div class="w-full mdlg:!flex hidden flex-col gap-5 py-8 pb-14 bg-primaryPurple justify-center items-center">
      <sofa-header-text color="!text-white" size="xl" :customClass="'!font-extrabold'">All contents made by verified
        creators</sofa-header-text>

      <div class="w-[48%] flex flex-row items-center justify-center">
        <sofa-normal-text color="!text-white"
          :customClass="'w-full text-center flex items-center justify-center'">Everything here is carefully reviewed to
          ensure the highest quality
          and accuracy. By purchasing from our marketplace, you can have
          confidence in the credibility of the creators and the value of the
          materials.</sofa-normal-text>
      </div>

      <div class="w-[40%] flex flex-col pt-4">
        <div
          class="w-full shadow-custom px-4 py-1 bg-white rounded-custom flex flex-row gap-3 items-center justify-between">
          <div class="flex flex-row gap-2 items-center flex-grow">
            <sofa-icon :name="'filter'" :customClass="'h-[15px] cursor-pointer'"
              @click="Logic.Common.GoToRoute('/marketplace/search')" />
            <sofa-normal-text :customClass="'pr-2 border-r border-[#E1E6EB] cursor-pointer'"
              @click="Logic.Common.GoToRoute('/marketplace/search')">Filter</sofa-normal-text>
            <sofa-text-field :customClass="'!border-none w-full'" :placeholder="'Search for anything'"
              v-model="searchQuery" @onEnter="handleSearch">
            </sofa-text-field>
          </div>

          <div class="w-[20px] cursor-pointer" @click="handleSearch">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
        </div>
      </div>
    </div>

    <!-- Small screen search -->
    <div class="w-full px-4 flex mdlg:!hidden flex-col sticky top-0 left-0 py-4 bg-backgroundGray z-[100]">
      <div class="w-full shadow-custom px-4 py-1 bg-white rounded-custom flex flex-row gap-1 items-center justify-start">
        <div class="flex flex-row gap-2 items-center flex-grow" @click="Logic.Common.GoToRoute('/marketplace/search')">
          <sofa-icon :name="'filter'" :customClass="'h-[15px]'" />
        </div>
        <div class="w-full flex flex-row items-center gap-1">
          <div class="pl-2">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
          <sofa-text-field :customClass="'!border-none w-full flex-grow'" :placeholder="'Search'" v-model="searchQuery"
            @onEnter="handleSearch" />
        </div>
      </div>
    </div>

    <div class="mdlg:!w-[85%] lg:!w-[75%] w-full flex flex-col gap-6 md:!gap-7 mdlg:!px-0 px-0">
      <!-- Textbook, note, past questions -->
      <div v-if="false" class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide mdlg:!pl-0 pl-4">
        <div
          class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-3 mdlg:!gap-4 mdlg:!px-0 flex flex-row gap-3 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
          <sofa-image-loader :photoUrl="item.image"
            custom-class="col-span-1 mdlg:!w-auto w-[290px] relative rounded-custom mdlg:!h-[230px] h-[190px] cursor-pointer"
            v-for="(item, index) in mainCards" :key="index" @click="Logic.Common.GoToRoute(item.routePath)">
            <div class="w-full h-full absolute top-0 rounded-custom left-0 bg-black bg-opacity-40 z-10"></div>
            <div
              class="absolute left-0 bottom-0 flex flex-row items-center z-40 justify-between w-full py-3 px-4 bg-black bg-opacity-50 rounded-br-[16px] rounded-bl-[8px]">
              <sofa-normal-text :color="'text-white !font-bold'">
                {{ item.text }}
              </sofa-normal-text>
              <sofa-icon :customClass="'h-[14px]'" :name="'arrow-right-white'" />
            </div>
          </sofa-image-loader>
        </div>
      </div>

      <div class="w-full flex flex-col mdlg:!gap-4 gap-3 mdlg:!pl-0 pl-4 z-40">
        <div class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4">
          <sofa-normal-text :customClass="'!font-bold'">
            Latest
          </sofa-normal-text>

          <sofa-normal-text :color="'text-primaryPink'" :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)">
            View all
          </sofa-normal-text>
        </div>

        <div v-if="marketplaceContents.lastest.length"
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row gap-3 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-item-card :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.lastest" :key="index" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  content.id +
                  `?type=${content.labels.main.toLowerCase()}`
                )
                " :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = content
  }
    "></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
            <sofa-empty-state :title="'No result found'" :subTitle="'We could not find any latest material'" />
          </div>
        </template>
      </div>

      <div class="w-full flex flex-col mdlg:!gap-4 gap-3 mdlg:!pl-0 pl-4 z-40">
        <div class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4">
          <sofa-normal-text :customClass="'!font-bold'">
            Highest rated
          </sofa-normal-text>

          <sofa-normal-text :color="'text-primaryPink'" :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)">
            View all
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          v-if="marketplaceContents.rated.length">
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row gap-3 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-item-card :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.rated" :key="index" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  content.id +
                  `?type=${content.labels.main.toLowerCase()}`
                )
                " :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = content
  }
    "></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
            <sofa-empty-state :title="'No result found'" :subTitle="'We could not find any materials'" />
          </div>
        </template>
      </div>

      <div class="w-full flex flex-col mdlg:!gap-4 gap-3 mdlg:!pl-0 pl-4 z-40">
        <div class="w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4">
          <sofa-normal-text :customClass="'!font-bold'">
            Most popular
          </sofa-normal-text>

          <sofa-normal-text :color="'text-primaryPink'" :custom-class="'cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/search`)">
            View all
          </sofa-normal-text>
        </div>

        <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          v-if="marketplaceContents.popular.length">
          <div
            class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row gap-3 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
            <sofa-item-card :content="content"
              custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
              v-for="(content, index) in marketplaceContents.popular" :key="index" @click="
                Logic.Common.GoToRoute(
                  '/marketplace/' +
                  content.id +
                  `?type=${content.labels.main.toLowerCase()}`
                )
                " :bookmark-action="() => {
    showSaveToFolder = true
    selectedFolderMaterailToAdd = content
  }
    "></sofa-item-card>
          </div>
        </div>

        <template v-else>
          <div class="w-full flex flex-col gap-3 mdlg:pr-0 pr-4">
            <sofa-empty-state :title="'No result found'" :subTitle="'We could not find any materials'" />
          </div>
        </template>
      </div>
    </div>
  </expanded-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"
import {
  selectedFolderMaterailToAdd,
  showSaveToFolder,
} from "@/composables/library"
import {
  AllCourses,
  MarketplaceMaterials,
  mainCards,
  marketplaceContents,
  notesContents,
  pastQuestionContents,
  sectionTags,
  setMarketplaceMaterials,
  textbookContents,
} from "@/composables/marketplace"
import { Logic } from "sofa-logic"
import {
  SofaEmptyState,
  SofaHeaderText,
  SofaIcon,
  SofaImageLoader,
  SofaItemCard,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref, watch } from "vue"
import { useMeta } from "vue-meta"

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
    ],
  },
  name: "MarketPlaceIndexPage",
  setup () {
    useMeta({
      title: "Marketplace",
    })

    const searchQuery = ref("")

    onMounted(() => {
      scrollToTop()
      Logic.Study.watchProperty("AllCourses", AllCourses)
      Logic.Study.watchProperty("MarketplaceMaterials", MarketplaceMaterials)
      setMarketplaceMaterials(5)
    })

    watch(MarketplaceMaterials, () => {
      setMarketplaceMaterials()
    })

    const handleSearch = () => {
      if (searchQuery.value) {
        Logic.Common.GoToRoute(`/marketplace/search?q=` + searchQuery.value)
      }
    }

    return {
      notesContents,
      pastQuestionContents,
      textbookContents,
      Logic,
      searchQuery,
      mainCards,
      sectionTags,
      marketplaceContents,
      showSaveToFolder,
      selectedFolderMaterailToAdd,
      handleSearch,
    }
  },
})
</script>
