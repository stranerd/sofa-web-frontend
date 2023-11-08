<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center gap-3 justify-between z-50 bg-backgroundGray py-4 px-4 sticky top-0 left-0">
        <sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
        <sofa-normal-text :customClass="'!font-bold !text-base'">
          Purchased</sofa-normal-text>
        <div></div>
      </div>
      <div>
        <div v-if="libraryTypeList[2].options.length > 1"
          class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 gap-3">
          <span :class="`px-6 py-2  ${item.id == selectedItemId ? 'bg-primaryPurple' : 'bg-white'
            } custom-border flex flex-row items-center justify-center gap-1  cursor-pointer `"
            v-for="(item, index) in libraryTypeList[2].options" :key="index" @click="selectedItemId = item.id">
            <sofa-normal-text :color="`${item.id == selectedItemId ? 'text-white' : 'text-deepGray'
              } `" :custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
          </span>
        </div>
      </div>

      <div class="w-full flex flex-col gap-3 px-4 pt-3">
        <template v-if="currentPurchasedData.length">
          <sofa-activity-card v-for="(activity, index) in currentPurchasedData" :key="index" :activity="activity"
            :custom-class="'!bg-white shadow-custom cursor-pointer'" :isWrapped="true"
            @click="Logic.Common.GoToRoute('/course/' + activity.id)">
          </sofa-activity-card>
        </template>
        <sofa-empty-state v-else :title="'You have not bought anything'"
          :subTitle="'Discover thousands of materials to buy, created by verified experts'" :actionLabel="'Marketplace'"
          :action="() => {
            Logic.Common.GoToRoute('/marketplace')
          }
            " />
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>
  </sub-page-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"
import {
  PurchasedCourses,
  currentPurchasedData,
  filterItem,
  libraryTypeList,
  selectedItemId,
  setPurchasedData,
} from "@/composables/library"
import { Logic } from "sofa-logic"
import {
  SofaActivityCard,
  SofaEmptyState,
  SofaIcon,
  SofaNormalText,
} from "sofa-ui-components"
import { defineComponent, onMounted, watch } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaActivityCard,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Payment",
        property: "PurchasedItems",
        method: "GetUserPurchases",
        params: [true],
        requireAuth: true,
        ignoreProperty: false,
      },
    ],
  },
  name: "LibraryPurchasedPage",
  setup () {
    useMeta({
      title: "Purchased",
    })

    onMounted(() => {
      selectedItemId.value = "purchased-all"
      scrollToTop()
      setPurchasedData()
      Logic.Study.watchProperty("PurchasedCourses", PurchasedCourses)
    })

    watch(PurchasedCourses, () => {
      setPurchasedData()
      filterItem()
    })

    watch(selectedItemId, () => {
      filterItem()
    })

    return {
      Logic,
      libraryTypeList,
      selectedItemId,
      currentPurchasedData,
    }
  },
})
</script>
