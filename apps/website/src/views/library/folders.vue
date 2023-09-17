<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center space-x-3 justify-between z-50 bg-backgroundGray py-4 px-4 sticky top-0 left-0"
      >
        <sofa-icon
          :customClass="'h-[15px]'"
          :name="'back-arrow'"
          @click="Logic.Common.goBack()"
        />
        <sofa-normal-text :customClass="'!font-bold !text-base !line-clamp-1'">
          {{ SingleFolder?.title }}</sofa-normal-text
        >
        <div>
          <sofa-icon
            :customClass="'h-[20px]'"
            :name="'circle-add'"
            @click="showAddItemToFolder = true"
          />
        </div>
      </div>
      <div
        class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 space-x-3"
      >
        <span
          :class="`px-6 py-2  ${
            item.id == selectedFolderFilter ? 'bg-primaryPurple' : 'bg-white'
          } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer `"
          v-for="(item, index) in folderFilterOption"
          :key="index"
          @click="selectedFolderFilter = item.id"
        >
          <sofa-normal-text
            :color="`${
              item.id == selectedFolderFilter ? 'text-white' : 'text-deepGray'
            } `"
            :custom-class="'!font-semibold'"
            >{{ item.name }}</sofa-normal-text
          >
        </span>
      </div>

      <div class="w-full flex flex-col space-y-3 px-4 pt-3">
        <template v-if="selectedFolderItems.length">
          <sofa-activity-card
            v-for="(activity, index) in selectedFolderItems"
            :key="index"
            :activity="activity"
            :custom-class="'!bg-white shadow-custom cursor-pointer'"
            :isWrapped="true"
            @click="
              activity.labels.main.toLocaleLowerCase().includes('quiz')
                ? openQuiz(activity.id)
                : Logic.Common.GoToRoute('/course/' + activity.id)
            "
          >
          </sofa-activity-card>
        </template>
        <sofa-empty-state
          v-else
          :title="'There are no items in this folder'"
          :subTitle="'Add quiz and courses from your library to this folder'"
          :actionLabel="'Add item'"
          :action="
            () => {
              showAddItemToFolder = true;
            }
          "
        />
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>

    <add-item-to-folder
      v-if="showAddItemToFolder"
      :close="
        () => {
          showAddItemToFolder = false;
        }
      "
      :data="FolderOptions"
      :folderId="selectedFilter"
      :currentFolderItems="currentFolderItems"
    />
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import { useMeta } from "vue-meta";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaEmptyState,
  SofaActivityCard,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import {
  AllCourses,
  AllFolders,
  AllQuzzies,
  currentFolderItems,
  filterItem,
  folderFilterOption,
  FolderOptions,
  libraryTypeList,
  PurchasedCourses,
  selectedFilter,
  selectedFolderFilter,
  selectedFolderItems,
  setCourses,
  setFolderItems,
  setFolders,
  setPurchasedData,
  setQuizzes,
  showAddItemToFolder,
  openQuiz,
  SingleFolder,
} from "@/composables/library";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import AddItemToFolder from "@/components/library/AddItemToFolder.vue";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaActivityCard,
    AddItemToFolder,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "AllQuzzies",
        method: "GetQuizzes",
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
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [
          {
            where: [
              {
                field: "type",
                value: "topics",
                condition: "eq",
              },
            ],
          },
        ],
        requireAuth: true,
      },
      {
        domain: "Study",
        property: "AllCourses",
        method: "GetCourses",
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
        domain: "Study",
        property: "AllFolders",
        method: "GetFolders",
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
        domain: "Payment",
        property: "PurchasedItems",
        method: "GetUserPurchases",
        params: [true],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Study",
        property: "SingleFolder",
        method: "GetFolder",
        params: [],
        useRouteQuery: true,
        queries: ["filter"],
        requireAuth: true,
        ignoreProperty: true,
      },
    ],
  },
  name: "LibraryFoldersPage",
  setup() {
    useMeta({
      title: "Folder",
    });

    onMounted(() => {
      selectedFolderFilter.value = "all";
      selectedFilter.value = SingleFolder.value?.id;
      Logic.Study.watchProperty("AllQuzzies", AllQuzzies);
      Logic.Study.watchProperty("AllCourses", AllCourses);
      Logic.Study.watchProperty("PurchasedCourses", PurchasedCourses);
      Logic.Study.watchProperty("AllFolders", AllFolders);
      Logic.Study.watchProperty("SingleFolder", SingleFolder);
      scrollToTop();
      setQuizzes();
      setCourses();
      setPurchasedData();
      setFolders();
      setFolderItems();
      filterItem();
    });

    watch(SingleFolder, () => {
      setFolderItems();
      filterItem();
    });

    watch(selectedFolderFilter, () => {
      filterItem();
    });

    return {
      Logic,
      libraryTypeList,
      selectedFolderFilter,
      folderFilterOption,
      SingleFolder,
      selectedFolderItems,
      openQuiz,
      showAddItemToFolder,
      FolderOptions,
      selectedFilter,
      currentFolderItems,
    };
  },
});
</script>
