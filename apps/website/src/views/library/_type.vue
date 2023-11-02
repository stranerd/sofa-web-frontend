<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center gap-3 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0 z-[9999]">
        <sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
        <sofa-normal-text :customClass="'!font-bold !text-base'">
          {{ pageTitle }}</sofa-normal-text>
        <div></div>
      </div>
      <div class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide pl-4 py-2">
        <div class="w-full flex flex-row gap-3 items-center pr-4 mdlg:!pr-0">
          <span :class="`px-6 py-2  ${selectedItemId == item.id ? 'bg-primaryPurple' : 'bg-white'
            } custom-border flex flex-row items-center justify-center gap-1  cursor-pointer`"
            v-for="(item, index) in mainFilters" :key="index" @click="selectedItemId = item.id">
            <sofa-normal-text :color="`${selectedItemId == item.id ? 'text-white' : 'text-deepGray'
              } `" :custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
          </span>
        </div>
      </div>

      <div class="w-full grid grid-cols-1 gap-4 px-4 pt-3">
        <template v-if="filterType == 'in-progress'">
          <template v-if="currentInProgressItem.length">
            <sofa-progress-item-card v-for="(content, index) in currentInProgressItem" :key="index" :content="content"
              :custom-class="'!bg-white shadow-custom '" />
          </template>
          <div v-else class="col-span-full flex flex-col">
            <sofa-empty-state :title="'You have no item in progress'"
              :subTitle="'Discover thousands of materials to buy, created by verified experts'"
              :actionLabel="'Marketplace'" :action="() => {
                Logic.Common.GoToRoute('/marketplace')
              }
                " />
          </div>
        </template>
        <template v-if="filterType == 'results'">
          <template v-if="currentResultItems.length">
            <sofa-progress-item-card v-for="(content, index) in currentResultItems" :key="index" :content="content"
              :custom-class="'!bg-white shadow-custom '" />
          </template>
          <div v-else class="col-span-full flex flex-col">
            <sofa-empty-state :title="'You have no practice item here'"
              :subTitle="'Discover thousands of materials to buy, created by verified experts'"
              :actionLabel="'Marketplace'" :action="() => {
                Logic.Common.GoToRoute('/marketplace')
              }
                " />
          </div>
        </template>
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue"
import { useMeta } from "vue-meta"
import { scrollToTop } from "@/composables"
import {
  SofaIcon,
  SofaNormalText,
  SofaProgressItemCard,
  SofaEmptyState,
} from "sofa-ui-components"
import { Logic } from "sofa-logic"
import {
  AllGames,
  AllTests,
  currentInProgressItem,
  currentResultItems,
  filterItem,
  GameAndTestQuizzes,
  selectedItemId,
  setInProgressItems,
  setResultItems,
} from "@/composables/library"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaProgressItemCard,
    SofaEmptyState,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Plays",
        property: "AllGames",
        method: "GetGames",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Plays",
        property: "AllTests",
        method: "GetTests",
        params: [
          {
            where: [
              {
                field: "user.id",
                value: Logic.Auth.AuthUser?.id,
                condition: Conditions.eq,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
    ],
  },
  name: "LibraryContentPage",
  setup () {
    useMeta({
      title: "Library Content",
    })

    const pageTitle = ref("")

    const mainFilters = reactive([])

    const filterType = ref("")

    onMounted(async () => {
      scrollToTop()

      const type = Logic.Common.route.params?.type.toString()

      filterType.value = type

      mainFilters.length = 0

      if (type == "in-progress") {
        pageTitle.value = "In progress"
        selectedItemId.value = "in_progress-all"
        mainFilters.push(
          {
            name: "All",
            active: true,
            id: "in_progress-all",
          },
          {
            name: "Tests",
            active: false,
            id: "in_progress-tests",
          },
          {
            name: "Games",
            active: false,
            id: "in_progress-games",
          }
        )
      } else if (type == "results") {
        pageTitle.value = "Results"
        selectedItemId.value = "results-all"
        mainFilters.push(
          {
            name: "All",
            active: true,
            id: "results-all",
          },
          {
            name: "Tests",
            active: false,
            id: "results-tests",
          },
          {
            name: "Games",
            active: false,
            id: "results-games",
          }
        )
      }

      Logic.Plays.watchProperty("AllTests", AllTests)
      Logic.Plays.watchProperty("AllGames", AllGames)
      Logic.Plays.watchProperty("GameAndTestQuizzes", GameAndTestQuizzes)

      await Logic.Plays.GetGameAndTestQuizzes()
    })

    watch(AllTests, () => {
      setResultItems()
      setInProgressItems()
    })

    watch(AllGames, () => {
      setResultItems()
      setInProgressItems()
    })

    watch(GameAndTestQuizzes, () => {
      setResultItems()
      setInProgressItems()
    })

    watch(selectedItemId, () => {
      filterItem()
    })

    return {
      Logic,
      mainFilters,
      currentInProgressItem,
      currentResultItems,
      pageTitle,
      filterType,
      selectedItemId,
    }
  },
})
</script>
