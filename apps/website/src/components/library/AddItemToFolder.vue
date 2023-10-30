<template>
  <!-- create item action -->
  <sofa-modal :close="() => {
      close ? close() : null
    }
    ">
    <div
      class="mdlg:!w-[60%] lg:!w-[50%] w-full mdlg:!h-[80%] md:!h-[70%] overflow-y-hidden md:w-[70%] h-[90%] flex flex-col items-center relative"
      @click.stop="() => {
          //
        }
        ">
      <div
        class="bg-white w-full flex flex-col h-full overflow-y-auto lg:!px-6 md:!gap-4 relative gap-3 lg:!py-0 mdlg:!px-6 mdlg:!py-0 md:!py-0 py-0 md:!px-4 md:!rounded-[16px] rounded-t-[16px]">
        <div
          class="w-full hidden flex-col gap-2 justify-center items-center md:flex sticky top-0 left-0 pt-4 bg-white z-50"
          v-if="Logic.Common.mediaQuery() != 'sm'">
          <sofa-header-text :customClass="'text-xl'">
            Add item to folder
          </sofa-header-text>

          <div class="w-full grid grid-cols-2 gap-3 pt-2">
            <sofa-normal-text :color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'
              " :customClass="`!font-semibold cursor-pointer pb-2 col-span-1 items-center justify-center ${selectedTab == tab.key
      ? 'border-b-[2px] border-primaryPurple'
      : ''
    }`" v-for="(tab, index) in tabs" @click="selectedTab = tab.key" :key="index">
              {{ tab.name }}
            </sofa-normal-text>
          </div>
        </div>

        <div
          class="w-full flex flex-col justify-between items-center sticky top-0 left-0 bg-white z-50 md:!hidden pt-3 border-[#F1F6FA] border-b-[1px] px-4">
          <div class="w-full grid grid-cols-2 gap-3 pt-2">
            <sofa-normal-text :color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'
              " :customClass="`!font-semibold cursor-pointer pb-2 col-span-1 items-center justify-center ${selectedTab == tab.key
      ? 'border-b-[2px] border-primaryPurple'
      : ''
    }`" v-for="(tab, index) in tabs" @click="selectedTab = tab.key" :key="index">
              {{ tab.name }}
            </sofa-normal-text>
          </div>
        </div>

        <div class="w-full flex flex-col gap-3 md:!px-0 px-4">
          <template v-if="selectedData.length">
            <sofa-activity-card v-for="(activity, index) in selectedData" :key="index" :activity="activity"
              :isWrapped="true" :custom-class="'!bg-backgroundGray !shadow-none cursor-pointer'" :centralizeExtras="true"
              @click="
                selectedItems[selectedTab].filter((item) => item == activity.id)
                  .length
                  ? (selectedItems[selectedTab] = selectedItems[
                    selectedTab
                  ].filter((item) => item != activity.id))
                  : selectedItems[selectedTab].push(activity.id)
                " :has-extra="true">
              <template v-slot:extra>
                <span class="pr-3">
                  <sofa-icon :name="selectedItems[selectedTab].filter(
                    (item) => item == activity.id
                  ).length
                      ? 'selected'
                      : `not-selected`
                    " :customClass="'md:!h-[23px] h-[20px] !cursor-pointer '" />
                </span>
              </template>
            </sofa-activity-card>
          </template>
          <sofa-empty-state v-else :title="`There are no ${selectedTab == 'quiz' ? 'Quizzes' : 'Courses'
            } here`"
            :subTitle="`You have no ${selectedTab} in your library. Discover thousands of materials to buy, created by verified experts`"
            :actionLabel="'Marketplace'" :action="() => {
                Logic.Common.GoToRoute('/marketplace')
              }
              " />

          <div class="h-[90px]"></div>
        </div>

        <div
          class="w-full flex flex-row items-center justify-between z-[50] bg-white md:!absolute fixed bottom-0 left-0 py-4 md:!px-4 px-4">
          <sofa-button :padding="'px-5 py-2'" :bgColor="'bg-white'" :textColor="'text-grayColor'"
            :customClass="'border-[1px] border-gray-100 hidden md:!inline-block'" @click.prevent="close ? close() : null">
            Exit
          </sofa-button>

          <div class="md:!w-auto w-full">
            <sofa-button :padding="'px-5 py-3 md:!py-2'" :customClass="'mdlg:!w-auto w-full'"
              @click="handleSaveItemToFolder()">
              {{
                currentFolderItems.course.length ||
                currentFolderItems.quiz.length
                ? "Update"
                : "Add"
              }}
            </sofa-button>
          </div>
        </div>
      </div>
    </div>
  </sofa-modal>
</template>
<script lang="ts">
import { saveItemsToFolder } from "@/composables/library"
import { Logic } from "sofa-logic"
import { ResourceType } from "sofa-logic/src/logic/types/domains/study"
import {
  SofaActivityCard,
  SofaButton,
  SofaEmptyState,
  SofaHeaderText,
  SofaIcon,
  SofaModal,
  SofaNormalText,
} from "sofa-ui-components"
import { capitalize, defineComponent, onMounted, ref, watch } from "vue"

export default defineComponent({
  components: {
    SofaModal,
    SofaHeaderText,
    SofaNormalText,
    SofaButton,
    SofaActivityCard,
    SofaEmptyState,
    SofaIcon,
  },
  props: {
    close: {
      type: Function,
    },
    data: {
      type: Object as () => ResourceType[],
    },
    folderId: {
      type: String,
      default: "",
    },
    currentFolderItems: {
      type: Object as () => {
        quiz: string[]
        course: string[]
      },
    },
  },
  setup (props) {
    const selectedTab = ref("course")

    const tabs = ref([])

    const selectedItems = ref<{
      quiz: string[]
      course: string[]
    }>({
      quiz: [],
      course: [],
    })

    const selectedData = ref<ResourceType[]>([])

    const setSelectedData = () => {
      selectedData.value.length = 0
      selectedData.value = props.data.filter((item) => {
        return item.labels.main.includes(capitalize(selectedTab.value))
      })
    }

    onMounted(() => {
      setSelectedData()
      if (props.currentFolderItems) {
        selectedItems.value = props.currentFolderItems
      }
    })

    watch(selectedTab, () => {
      setSelectedData()
    })

    tabs.value.push(
      {
        name: "Course",
        key: "course",
      },
      {
        name: "Quiz",
        key: "quiz",
      }
    )

    const handleSaveItemToFolder = () => {
      if (selectedItems.value.course.length) {
        saveItemsToFolder(
          props.folderId,
          "courses",
          selectedItems.value.course,
          true
        )
      }

      if (selectedItems.value.quiz.length) {
        saveItemsToFolder(
          props.folderId,
          "quizzes",
          selectedItems.value.quiz,
          true
        )
      }
      props.close ? props.close() : null
    }

    return {
      selectedTab,
      tabs,
      Logic,
      selectedData,
      selectedItems,
      handleSaveItemToFolder,
    }
  },
})
</script>
