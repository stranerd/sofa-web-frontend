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
          {{ SingleFolder?.title ?? "Not Found" }}</sofa-normal-text
        >
        <span />
      </div>
      <template v-if="SingleFolder">
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
                  ? openQuiz(activity)
                  : Logic.Common.GoToRoute('/course/' + activity.id)
              "
            >
            </sofa-activity-card>
          </template>
          <sofa-empty-state
            v-else
            :title="'There are no items in this folder'"
            :subTitle="'Save quiz and courses to this folder and you will see them here'"
          />
        </div>
      </template>
      <div v-else class="px-4">
        <sofa-empty-state :title="'Folder not found'" :subTitle="''" />
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>

    <!-- Study mode modal -->

    <sofa-modal
      v-if="showStudyMode"
      :close="
        () => {
          showStudyMode = false;
        }
      "
    >
      <div
        class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-auto md:w-[70%] flex flex-col items-center relative"
        @click.stop="
          () => {
            //
          }
        "
      >
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-4 space-y-1 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              {{
                selectedQuizMode == "game"
                  ? "Start quiz game"
                  : "Choose Study Mode"
              }}
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showStudyMode = false"
            />
          </div>

          <div
            class="w-full flex flex-col space-y-3 px-4 py-4"
            v-if="selectedQuizMode != 'game'"
          >
            <sofa-icon-card
              :data="item"
              v-for="(item, index) in otherTasks"
              :key="index"
              @click="goToStudyMode(item.key)"
              :customClass="'!bg-[#F1F6FA] !w-full !shadow-none'"
            >
              <template v-slot:title>
                <sofa-normal-text :customClass="'!font-bold'">
                  {{ item.title }}
                </sofa-normal-text>
              </template>
            </sofa-icon-card>

            <div class="w-full flex flex-col">
              <sofa-button
                :customClass="'w-full'"
                :padding="'py-3'"
                v-if="
                  Logic.Auth.AuthUser?.id ==
                  AllQuzzies.results.filter(
                    (item) => item.id == selectedQuizId
                  )[0].user.id
                "
                @click="
                  Logic.Common.GoToRoute(`/quiz/create?id=${selectedQuizId}`)
                "
                >Edit Quiz</sofa-button
              >
            </div>
          </div>

          <div class="w-full flex flex-col space-y-3 py-4 px-4" v-else>
            <div
              @click="
                userIsParticipating
                  ? (userIsParticipating = false)
                  : (userIsParticipating = true)
              "
              class="w-full custom-border py-4 px-4 bg-backgroundGray flex flex-row cursor-pointer items-center justify-between"
            >
              <sofa-normal-text>Participate</sofa-normal-text>
              <sofa-icon
                :customClass="'h-[22px] z-50'"
                :name="userIsParticipating ? 'toggle-on' : 'toggle-off'"
              />
            </div>

            <div class="w-full flex flex-col items-center justify-between pt-3">
              <div class="w-full flex flex-col">
                <sofa-button
                  :padding="'py-3'"
                  :customClass="'w-full'"
                  @click="createQuizGame(selectedQuizId)"
                >
                  Start
                </sofa-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>
  </sub-page-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables";
import {
  AllCourses,
  AllFolders,
  AllQuzzies,
  FolderOptions,
  PurchasedCourses,
  SingleFolder,
  currentFolderItems,
  filterItem,
  folderFilterOption,
  libraryTypeList,
  openQuiz,
  selectedFilter,
  selectedFolderFilter,
  selectedFolderItems,
  setCourses,
  setFolderItems,
  setFolders,
  setPurchasedData,
  setQuizzes,
  showStudyMode,
} from "@/composables/library";
import {
  createQuizGame,
  goToStudyMode,
  otherTasks,
  selectedQuizId,
  selectedQuizMode,
  userIsParticipating,
} from "@/composables/quiz";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import {
  SofaActivityCard,
  SofaEmptyState,
  SofaIcon,
  SofaNormalText,
  SofaModal,
  SofaButton,
  SofaIconCard,
} from "sofa-ui-components";
import { defineComponent, onMounted, watch } from "vue";
import { useMeta } from "vue-meta";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaEmptyState,
    SofaActivityCard,
    SofaModal,
    SofaButton,
    SofaIconCard,
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
      FolderOptions,
      selectedFilter,
      currentFolderItems,
      showStudyMode,
      selectedQuizMode,
      selectedQuizId,
      otherTasks,
      AllQuzzies,
      userIsParticipating,
      createQuizGame,
      openQuiz,
      goToStudyMode,
    };
  },
});
</script>
