<template>
  <dashboard-layout :middleSessionWidth="'lg:w-[78%] mdlg:w-[75%]'" :topbarOptions="{
    title: 'Library',
  }">
    <template v-slot:left-session>
      <div class="w-full shadow-custom bg-white rounded-[16px] flex flex-col py-4 px-3 gap-2">
        <div :class="`w-full flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${selectedFilter == item.id ? 'bg-[#E5F2FD]' : ''
          }`" v-for="(item, index) in libraryTypeList" :key="index" @click="selectedFilter = item.id">
          <sofa-icon :name="item.icon" :custom-class="'h-[17px]'" />
          <sofa-normal-text :custom-class="` ${selectedFilter == item.id ? '!font-bold' : ''}`">
            {{ item.title }}
          </sofa-normal-text>
        </div>

        <!-- Folders -->

        <div class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2">
          <sofa-normal-text :customClass="'!font-bold'">Folders</sofa-normal-text>

          <sofa-normal-text :color="'text-primaryPink'" :customClass="'cursor-pointer'"
            @click="addFolder()">Add</sofa-normal-text>
        </div>

        <!-- <div
          class="w-full flex flex-row items-center gap-3 px-3 py-3 cursor-pointer relative"
          @click="addFolder()"
        >
          <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
          <sofa-normal-text :color="'text-grayColor'"
            >Add new folder</sofa-normal-text
          >
        </div> -->

        <div :class="`w-full flex flex-row items-center justify-start gap-3 px-3 py-3 relative rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${selectedFilter == item.id ? 'bg-[#E5F2FD]' : ''
          }`" v-for="(item, index) in folders" :key="index" @mouseenter="item.hover = true"
          @mouseleave="item.hover = false" @click="!addFolderIsActive ? (selectedFilter = item.id) : null">
          <sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />

          <sofa-custom-input v-if="item.edit" :custom-class="` ${selectedFilter == item.id ? '!font-bold' : ''
            } lg:text-sm mdlg:text-[12px] text-xs w-full  cursor-text !bg-white`" :updateValue="item.name" @blur="
    item.edit = false
  handleFolderNameBlur();
  " :placeholder="'Folder name'" @onContentChange="(content) => {
  item.name = content
  currentFolder.name = content
  currentFolder.id = item.id
}
  ">
          </sofa-custom-input>
          <sofa-normal-text v-else :custom-class="` ${selectedFilter == item.id ? '!font-bold' : ''}`">
            {{ item.name }}
          </sofa-normal-text>

          <div v-if="item.hover && !item.edit"
            class="absolute right-0 top-0 h-full px-3 justify-center bg-[#E5F2FD] rounded-r-[8px] flex flex-row gap-2 items-center">
            <sofa-icon @click.stop="item.edit = true" :customClass="'h-[15px] cursor-pointer'" :name="'edit-gray'" />
            <sofa-icon :customClass="'h-[15px] cursor-pointer'" :name="'trash-gray'" @click.stop="
              selectedFolderId = item.id
            showDeleteFolder = true;
            " />
          </div>
        </div>

        <!-- Organizations -->

        <template v-if="allOrganizations.length">
          <div class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2">
            <sofa-normal-text :customClass="'!font-bold'">Organizations</sofa-normal-text>
          </div>
          <div :class="`w-full flex flex-row items-center justify-start gap-3 px-4 py-3 rounded-[8px] hover:bg-[#E5F2FD] cursor-pointer ${selectedFilter == item.id ? 'bg-[#E5F2FD]' : ''
            }`" v-for="(item, index) in allOrganizations" :key="index" @click="selectedFilter = item.id">
            <sofa-icon :name="'organization'" :custom-class="'h-[20px]'" />
            <sofa-normal-text :custom-class="` ${selectedFilter == item.id ? '!font-bold' : ''
              }`">
              {{ item.name }}
            </sofa-normal-text>
          </div>
        </template>
      </div>
    </template>

    <template v-slot:middle-session>
      <div class="w-full flex flex-col gap-5 mdlg:!pl-3 mdlg:!pr-7">
        <div class="w-full mdlg:!flex hidden flex-row gap-2 justify-between items-center" v-if="libraryTypeList.filter((item) => item.id == selectedFilter)[0]
          ?.options.length || !allContentCategories.includes(selectedFilter)
          ">
          <div class="w-full flex flex-row gap-3 items-center">
            <template v-if="allContentCategories.includes(selectedFilter)">
              <span :class="`px-6 py-2  ${item.id == selectedItemId ? 'bg-primaryPurple' : 'bg-white'
                } custom-border flex flex-row items-center justify-center gap-1  cursor-pointer `" v-for="(item, index) in libraryTypeList.filter(
    (item) => item.id == selectedFilter
  )[0].options" :key="index" @click="selectedItemId = item.id">
                <sofa-normal-text :color="`${item.id == selectedItemId ? 'text-white' : 'text-deepGray'
                  } `" :custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
              </span>
            </template>
            <template v-else>
              <span :class="`px-6 py-2  ${item.id == selectedFolderFilter
                ? 'bg-primaryPurple'
                : 'bg-white'
                } custom-border flex flex-row items-center justify-center gap-1  cursor-pointer `"
                v-for="(item, index) in folderFilterOption" :key="index" @click="selectedFolderFilter = item.id">
                <sofa-normal-text :color="`${item.id == selectedFolderFilter
                  ? 'text-white'
                  : 'text-deepGray'
                  } `" :custom-class="'!font-semibold'">{{ item.name }}</sofa-normal-text>
              </span>
            </template>
          </div>
        </div>

        <div class="w-full mdlg:!flex hidden flex-col gap-4"
          v-if="selectedFilter != 'in-progress' && selectedFilter != 'results'">
          <template v-if="allContentCategories.includes(selectedFilter)">
            <template v-if="selectedFilter == 'quizzes'">
              <template v-if="currentQuizData.length">
                <sofa-activity-card v-for="(activity, index) in currentQuizData" :key="index" :activity="activity"
                  :custom-class="'mdlg:!bg-white shadow-custom !cursor-pointer'" :has-extra="true" @click="openQuiz(activity)">
                  <template v-slot:extra>
                    <div class="relative flex flex-row z-10 justify-end" :tabindex="Math.random() * 100"
                      @blur="activity.showMore = false">
                      <sofa-icon :name="'more-options-horizontal'"
                        :customClass="'h-[6px] hidden mdlg:!inline-block !cursor-pointer'"
                        @click.stop="showMoreOptionHandler(activity)" />
                      <div
                        class="absolute top-[80%] right-0 min-w-[300px] custom-border shadow-custom h-auto !bg-white flex flex-col !z-50"
                        v-if="activity.showMore">
                        <div class="w-full flex flex-row items-center gap-2 px-4 py-3 hover:bg-[#E5F2FD] custom-border"
                          v-for="(item, index) in moreOptions.filter((o) =>
                            o.show()
                          )" :key="index" @click.stop="item.action()">
                          <sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
                          <sofa-normal-text>
                            {{ item.title }}
                          </sofa-normal-text>
                        </div>
                      </div>
                    </div>
                    <span class="invisible">
                      <sofa-icon name="edit-gray" :customClass="'h-[20px]'" />
                    </span>
                  </template>
                </sofa-activity-card>
              </template>
              <sofa-empty-state v-else :title="'You have no quizzes here'"
                :subTitle="'Discover thousands of quizzes and save them here for easy access'" :actionLabel="'Explore'"
                :action="() => {
                  Logic.Common.GoToRoute('/marketplace')
                }
                  " />
            </template>

            <template v-if="selectedFilter == 'courses'">
              <template v-if="currentCourseData.length">
                <sofa-activity-card v-for="(activity, index) in currentCourseData" :key="index" :activity="activity"
                  :has-extra="true" :custom-class="'!bg-white shadow-custom cursor-pointer'"
                  @click="openCourse(activity)">
                  <template v-slot:extra>
                    <div class="relative" :tabindex="Math.random() * 100" @blur="activity.showMore = false">
                      <sofa-icon :name="'more-options-horizontal'"
                        :customClass="'h-[6px] hidden mdlg:!inline-block !cursor-pointer'"
                        @click.stop="showMoreOptionHandler(activity)" />
                      <div
                        class="absolute top-[80%] right-0 min-w-[300px] custom-border shadow-custom h-auto !bg-white flex flex-col"
                        v-if="activity.showMore && selectedItem?.id === activity.id
                          ">
                        <div class="w-full flex flex-row items-center gap-2 px-4 py-3 hover:bg-[#E5F2FD] custom-border"
                          v-for="(item, index) in moreOptions.filter((o) =>
                            o.show()
                          )" :key="index" @click.stop="item.action()">
                          <sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
                          <sofa-normal-text>
                            {{ item.title }}
                          </sofa-normal-text>
                        </div>
                      </div>
                    </div>

                    <span class="invisible">
                      <sofa-icon name="edit-gray" :customClass="'h-[20px]'" />
                    </span>
                  </template>
                </sofa-activity-card>
              </template>
              <sofa-empty-state v-else :title="'You have no courses here'"
                :subTitle="'Discover thousands of courses and save them here for easy access'" :actionLabel="'Explore'"
                :action="() => {
                  Logic.Common.GoToRoute('/marketplace')
                }
                  " />
            </template>

            <template v-if="selectedFilter == 'purchased'">
              <template v-if="currentPurchasedData.length">
                <sofa-activity-card v-for="(activity, index) in currentPurchasedData" :key="index" :activity="activity"
                  :has-extra="true" :custom-class="'!bg-white shadow-custom cursor-pointer'" @click="
                    activity.type === 'quiz'
                      ? openQuiz(activity)
                      : openCourse(activity)
                    ">
                  <template v-slot:extra>
                    <div class="relative" :tabindex="Math.random() * 100" @blur="activity.showMore = false">
                      <sofa-icon :name="'more-options-horizontal'"
                        :customClass="'h-[6px] hidden mdlg:!inline-block !cursor-pointer'"
                        @click.stop="showMoreOptionHandler(activity)" />
                      <div
                        class="absolute top-[80%] right-0 min-w-[300px] custom-border shadow-custom h-auto !bg-white flex flex-col"
                        v-if="activity.showMore && selectedItem?.id === activity.id
                          ">
                        <div class="w-full flex flex-row items-center gap-2 px-4 py-3 hover:bg-[#E5F2FD] custom-border"
                          v-for="(item, index) in moreOptions.filter((o) =>
                            o.show()
                          )" :key="index" @click.stop="item.action()">
                          <sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
                          <sofa-normal-text>
                            {{ item.title }}
                          </sofa-normal-text>
                        </div>
                      </div>
                    </div>

                    <span class="invisible">
                      <sofa-icon name="edit-gray" :customClass="'h-[20px]'" />
                    </span>
                  </template>
                </sofa-activity-card>
              </template>
              <sofa-empty-state v-else :title="'You have not bought anything'"
                :subTitle="'Discover thousands of materials to buy, created by verified experts'"
                :actionLabel="'Marketplace'" :action="() => {
                  Logic.Common.GoToRoute('/marketplace')
                }
                  " />
            </template>
          </template>
          <template v-else>
            <template v-if="selectedFolderItems.length">
              <sofa-activity-card v-for="(activity, index) in selectedFolderItems" :key="index" :activity="activity"
                :custom-class="'!bg-white shadow-custom cursor-pointer'" @click="
                  activity.type === 'quiz'
                    ? openQuiz(activity)
                    : openCourse(activity)
                  ">
              </sofa-activity-card>
            </template>
            <sofa-empty-state v-else :title="'There are no items in this folder'"
              :subTitle="'Save quiz and courses to this folder and you will see them here'" />
          </template>
        </div>

        <div class="w-full grid-cols-2 gap-4 mdlg:!grid hidden" v-else>
          <template v-if="selectedFilter == 'in-progress'">
            <template v-if="currentInProgressItem.length">
              <sofa-progress-item-card v-for="(content, index) in currentInProgressItem" :key="index" :content="content"
                :custom-class="'!bg-white shadow-custom cursor-pointer'" @click="content.action()" />
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
          <template v-if="selectedFilter == 'results'">
            <template v-if="currentResultItems.length">
              <sofa-progress-item-card v-for="(content, index) in currentResultItems" :key="index" :content="content"
                :custom-class="'!bg-white shadow-custom cursor-pointer'" @click="content.action()" />
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

        <!-- Content for mobile screens -->
        <div class="w-full flex flex-col gap-4 px-4 mdlg:!hidden">
          <div class="w-full bg-white flex flex-col shadow-custom custom-border px-3">
            <div
              :class="`w-full flex flex-row items-center justify-start gap-3 px-3 py-4  border-b-[1px] border-[#F1F6FA]`"
              v-for="(item, index) in libraryTypeList" :key="index" @click="Logic.Common.GoToRoute(item.routePath)">
              <sofa-icon :name="item.icon" :custom-class="'h-[16px]'" />
              <sofa-normal-text>
                {{ item.title }}
              </sofa-normal-text>
            </div>
          </div>

          <div class="w-full flex flex-col gap-2">
            <div class="w-full flex flex-row items-center justify-between px-2 mt-3 mb-2">
              <sofa-normal-text :customClass="'!font-bold'">Folders</sofa-normal-text>

              <sofa-normal-text :color="'text-primaryPink'" @click="addFolder()">Add</sofa-normal-text>
            </div>

            <div
              :class="`w-full flex flex-row items-center relative justify-between gap-3 p-4 custom-border bg-white shadow-custom`"
              v-for="(item, index) in folders" :key="index" @click="!item.edit ? goToFolder(item.id) : null">
              <div class="flex flex-row items-center gap-3 w-full">
                <sofa-icon :name="'folder'" :custom-class="'h-[16px]'" />
                <sofa-custom-input v-if="item.edit"
                  :custom-class="`lg:text-sm mdlg:text-[12px] text-xs w-full !py-1 !bg-backgroundGray rounded cursor-text `"
                  :updateValue="item.name" @blur="
                    item.edit = false
                  handleFolderNameBlur();
                  " :placeholder="'Folder name'" @onContentChange="(content) => {
  item.name = content
  currentFolder.name = content
  currentFolder.id = item.id
}
  ">
                </sofa-custom-input>
                <sofa-normal-text v-else>
                  {{ item.name }}
                </sofa-normal-text>
              </div>

              <div v-if="!item.edit"
                class="h-full justify-center flex flex-row gap-2 items-center">
                <sofa-icon @click.stop="item.edit = true" :customClass="'h-[15px] cursor-pointer'" :name="'edit-gray'" />
                <sofa-icon :customClass="'h-[15px] cursor-pointer'" :name="'trash-gray'" @click.stop="
                  selectedFolderId = item.id
                showDeleteFolder = true;
                " />
              </div>
            </div>
          </div>
        </div>

        <div class="w-full h-[130px]"></div>
      </div>

      <sofa-delete-prompt v-if="showDeleteFolder" :title="'Are you sure?'"
        :subTitle="`This action is permanent. All items in the folder will be deleted`" :close="() => {
          showDeleteFolder = false
        }
          " :buttons="[
    {
      label: 'No',
      isClose: true,
      action: () => {
        showDeleteFolder = false
      },
    },
    {
      label: 'Yes, delete',
      isClose: false,
      action: () => {
        deleteFolder(selectedFolderId)
      },
    },
  ]" />
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"

import {
  AllCourses,
  AllFolders,
  AllFoldersCourses,
  AllFoldersQuizzes,
  AllGames,
  AllQuzzies,
  AllTests,
  FolderOptions,
  GameAndTestQuizzes,
  PurchasedCourses,
  RecentMaterials,
  SingleFolder,
  addFolder,
  addFolderIsActive,
  allContentCategories,
  currentCourseData,
  currentFolder,
  currentFolderItems,
  currentInProgressItem,
  currentPurchasedData,
  currentQuizData,
  currentResultItems,
  deleteFolder,
  filterItem,
  folderFilterOption,
  folders,
  handleFolderNameBlur,
  libraryTypeList,
  moreOptions,
  openCourse,
  openQuiz,
  selectedCourseFilter,
  selectedFilter,
  selectedFolderFilter,
  selectedFolderItems,
  selectedInProgressFilter,
  selectedItem,
  selectedItemId,
  selectedQuizFilter,
  selectedResultFilter,
  setCourses,
  setFolderItems,
  setFolders,
  setInProgressItems,
  setPurchasedData,
  setQuizzes,
  setRecentItems,
  setResultItems,
  showDeleteFolder,
  showMoreOptionHandler,
  showMoreOptions,
  showStudyMode,
  updateFolder,
} from "@/composables/library"
import { allOrganizations, setOrganizations } from "@/composables/profile"
import {
  createQuizGame,
  goToStudyMode,
  otherTasks,
  selectedQuizId,
  selectedQuizMode,
  userIsParticipating,
} from "@/composables/quiz"
import moment from "moment"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/common"
import {
  SofaActivityCard,
  SofaCustomInput,
  SofaDeletePrompt,
  SofaEmptyState,
  SofaIcon,
  SofaNormalText,
  SofaProgressItemCard
} from "sofa-ui-components"
import { defineComponent, onMounted, ref, watch } from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaActivityCard,
    SofaProgressItemCard,
    SofaEmptyState,
    SofaCustomInput,
    SofaDeletePrompt,
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
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "RecentMaterials",
        method: "GetRecentMaterials",
        params: [],
        requireAuth: true,
        ignoreProperty: true,
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
        ignoreProperty: true,
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
  name: "LibraryIndexPage",
  setup () {
    useMeta({
      title: "Library",
    })

    const selectedFolderId = ref("")

    const UserProfile = ref(Logic.Users.UserProfile)

    watch(AllFolders, () => {
      setFolders()
    })

    watch(UserProfile, () => {
      setOrganizations()
    })

    watch(AllQuzzies, () => {
      setQuizzes()
      filterItem()
    })

    watch(AllCourses, () => {
      setCourses()
      filterItem()
    })

    watch(RecentMaterials, () => {
      setRecentItems()
      filterItem()
    })

    watch(PurchasedCourses, () => {
      setPurchasedData()
      filterItem()
    })

    watch(selectedItemId, () => {
      filterItem()
    })

    watch(selectedFolderFilter, () => {
      filterItem()
    })

    watch(SingleFolder, () => {
      setFolderItems()
      filterItem()
    })

    watch(AllTests, () => {
      setResultItems()
      setInProgressItems()
    })

    watch(AllQuzzies, () => {
      setResultItems()
      setInProgressItems()
    })

    watch(GameAndTestQuizzes, () => {
      setResultItems()
      setInProgressItems()
    })

    const setSelectedFilter = () => {
      if (selectedFilter.value == "quizzes") {
        selectedItemId.value = "quiz-recent"
      } else if (selectedFilter.value == "courses") {
        selectedItemId.value = "course-recent"
      } else if (selectedFilter.value == "purchased") {
        selectedItemId.value = "purchased-all"
      } else if (selectedFilter.value == "in-progress") {
        selectedItemId.value = "in_progress-all"
      } else if (selectedFilter.value == "results") {
        selectedItemId.value = "results-all"
      }
    }

    watch(selectedFilter, () => {
      setSelectedFilter()

      Logic.Common.GoToRoute("/library?filter=" + selectedFilter.value)
    })

    const goToFolder = (folderId: string) => {
      if (!addFolderIsActive.value) {
        Logic.Common.GoToRoute("/library/folders?filter=" + folderId)
      }
    }

    onMounted(async () => {
      scrollToTop()
      if (Logic.Common.route.query.filter) {
        selectedFilter.value = Logic.Common.route.query.filter.toString()
      }
      Logic.Study.watchProperty("AllQuzzies", AllQuzzies)
      Logic.Study.watchProperty("AllCourses", AllCourses)
      Logic.Study.watchProperty("PurchasedCourses", PurchasedCourses)
      Logic.Study.watchProperty("AllFolders", AllFolders)
      Logic.Study.watchProperty("SingleFolder", SingleFolder)
      Logic.Study.watchProperty("UserProfile", UserProfile)
      Logic.Study.watchProperty("RecentMaterials", RecentMaterials)
      Logic.Study.watchProperty("AllFoldersQuizzes", AllFoldersQuizzes)
      Logic.Study.watchProperty("AllFoldersCourses", AllFoldersCourses)
      Logic.Plays.watchProperty("AllTests", AllTests)
      Logic.Plays.watchProperty("AllGames", AllGames)
      Logic.Plays.watchProperty("GameAndTestQuizzes", GameAndTestQuizzes)

      await Logic.Plays.GetGameAndTestQuizzes()

      setQuizzes()
      setCourses()
      setPurchasedData()
      setFolders()
      setFolderItems()
      filterItem()
      setResultItems()
      setInProgressItems()
      setOrganizations()
      setSelectedFilter()
    })

    return {
      moment,
      libraryTypeList,
      folders,
      Logic,
      selectedFilter,
      currentQuizData,
      currentCourseData,
      showStudyMode,
      otherTasks,
      selectedItem,
      selectedItemId,
      goToStudyMode,
      selectedQuizId,
      selectedQuizMode,
      userIsParticipating,
      createQuizGame,
      selectedQuizFilter,
      selectedCourseFilter,
      currentPurchasedData,
      addFolder,
      updateFolder,
      selectedFolderItems,
      allContentCategories,
      folderFilterOption,
      selectedFolderFilter,
      FolderOptions,
      openQuiz,
      openCourse,
      currentFolderItems,
      showDeleteFolder,
      deleteFolder,
      selectedFolderId,
      goToFolder,
      allOrganizations,
      moreOptions,
      showMoreOptions,
      showMoreOptionHandler,
      currentFolder,
      handleFolderNameBlur,
      addFolderIsActive,
      currentInProgressItem,
      currentResultItems,
      selectedResultFilter,
      selectedInProgressFilter,
    }
  },
})
</script>
<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Enter message";
  color: #78828c;
}
</style>
