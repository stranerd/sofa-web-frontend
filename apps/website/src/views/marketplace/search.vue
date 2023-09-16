<template>
  <dashboard-layout
    :middleSessionWidth="'lg:w-[78%] mdlg:w-[78%]'"
    :hideSmNavigator="{
      bottom: true,
      top: true,
    }"
  >
    <template v-slot:left-session>
      <div
        class="w-full shadow-custom pb-6 bg-white custom-border relative flex flex-col h-full space-y-6 overflow-y-auto"
      >
        <div
          class="w-full flex flex-row items-center px-4 pt-4 bg-white sticky top-0 left-0 space-x-2 pb-3 border-b-[1px] border-[#F1F6FA]"
        >
          <sofa-icon :customClass="'h-[14px]'" :name="'filter'" />
          <sofa-normal-text :customClass="'!font-bold'"
            >Filter</sofa-normal-text
          >
        </div>

        <marketplace-filter v-model="selectedOptions" />
      </div>
    </template>

    <template v-slot:middle-session>
      <div
        class="w-full flex flex-col mdlg:!space-y-5 space-y-3 px-0 mdlg:!pr-7 relative"
      >
        <div
          class="w-full mdlg:!shadow-custom mdlg:!px-4 sticky mdlg:!relative top-0 px-4 left-0 mdlg:!top-auto mdlg:!left-auto z-30 mdlg:!py-1 pl-2 pr-4 py-4 pb-2 mdlg:!bg-white bg-backgroundGray mdlgcustom-border flex flex-row space-x-3 items-center mdlg:!justify-between justify-start"
        >
          <sofa-icon
            :customClass="'h-[15px] mdlg:!hidden pl-2'"
            :name="'back-arrow'"
            @click="Logic.Common.goBack()"
          />
          <div
            class="flex flex-row items-center flex-grow custom-border w-full px-3 mdlg:!px-0 mdlg:!bg-transparent md:!shadow-none shadow-custom bg-white"
          >
            <div class="w-[20px] mdlg:!hidden">
              <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
            </div>
            <sofa-text-field
              :customClass="'!border-none w-full'"
              :placeholder="'Search for anything'"
              :padding="'px-3 mdlg:!pl-0 py-3'"
              v-model="searchQuery"
              :defaultValue="defaultValue"
            >
            </sofa-text-field>
          </div>

          <div class="w-[20px] hidden mdlg:!inline-block">
            <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
          </div>
        </div>

        <div class="w-full flex flex-row space-x-3 items-center mdlg:px-0 pl-4">
          <span
            :class="`px-6 py-2  ${
              item.id == selectedFilterOption ? 'bg-primaryPurple' : 'bg-white'
            } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer `"
            v-for="(item, index) in filterOptions"
            :key="index"
            @click="selectedFilterOption = item.id"
          >
            <sofa-normal-text
              :color="`${
                item.id == selectedFilterOption ? 'text-white' : 'text-deepGray'
              } `"
              :custom-class="'!font-semibold'"
              >{{ item.name }}</sofa-normal-text
            >
          </span>
        </div>

        <!-- Course contents -->

        <div
          class="w-full flex flex-col space-y-3 mdlg:!pt-0 pt-0 mdlg:px-0 pl-4"
          v-if="
            selectedFilterOption == 'all' || selectedFilterOption == 'courses'
          "
        >
          <div
            class="w-full flex flex-col justify-start items-start"
            v-if="selectedFilterOption == 'all'"
          >
            <sofa-normal-text :customClass="'font-bold'">
              Courses
            </sofa-normal-text>
          </div>

          <template v-if="resourceContents.length">
            <div class="w-full flex flex-col space-y-3">
              <div
                class="w-full mdlg:!grid mdlg:grid-cols-4 lg:grid-cols-5 mdlg:!gap-4"
                v-if="
                  Logic.Common.mediaQuery() != 'sm' &&
                  Logic.Common.mediaQuery() != 'md'
                "
              >
                <sofa-item-card
                  :content="content"
                  custom-class="!col-span-1 !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
                  v-for="(content, index) in resourceContents"
                  :key="index"
                  @click="
                    Logic.Common.GoToRoute(
                      '/marketplace/' + content.id + '?type=course'
                    )
                  "
                ></sofa-item-card>
              </div>

              <div
                class="lg:!w-full mdlg:!hidden flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              >
                <div
                  class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 pr-4"
                >
                  <sofa-activity-card
                    v-for="(activity, index) in resourceContents"
                    :key="index"
                    :activity="activity"
                    :custom-class="'cursor-pointer'"
                    @click="
                      Logic.Common.GoToRoute(
                        '/marketplace/' + activity.id + '?type=course'
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="w-full flex flex-col space-y-3 md:!px-0 px-4">
              <sofa-empty-state
                :title="'No result found'"
                :subTitle="'We could not find any course that matches your search'"
                :actionLabel="'Clear search'"
                :action="
                  () => {
                    defaultValue = ' ';
                    search();
                  }
                "
              />
            </div>
          </template>
        </div>

        <!-- Quiz contents -->
        <div
          class="w-full flex flex-col space-y-3 mdlg:!pt-0 pt-0 mdlg:px-0 pl-4"
          v-if="
            selectedFilterOption == 'all' || selectedFilterOption == 'quizzes'
          "
        >
          <div
            class="w-full flex flex-col justify-start items-start"
            v-if="selectedFilterOption == 'all'"
          >
            <sofa-normal-text :customClass="'font-bold'">
              Quizzes
            </sofa-normal-text>
          </div>

          <template v-if="quizContents.length">
            <div class="w-full flex flex-col space-y-3">
              <div
                class="w-full mdlg:!grid mdlg:grid-cols-4 lg:grid-cols-5 mdlg:!gap-4"
                v-if="
                  Logic.Common.mediaQuery() != 'sm' &&
                  Logic.Common.mediaQuery() != 'md'
                "
              >
                <sofa-item-card
                  :content="content"
                  custom-class="!col-span-1 !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
                  v-for="(content, index) in quizContents"
                  :key="index"
                  @click="
                    Logic.Common.GoToRoute(
                      '/marketplace/' + content.id + '?type=quiz'
                    )
                  "
                ></sofa-item-card>
              </div>

              <div
                class="lg:!w-full mdlg:!hidden flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              >
                <div
                  class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 pr-4"
                >
                  <sofa-activity-card
                    v-for="(activity, index) in quizContents"
                    :key="index"
                    :activity="activity"
                    :custom-class="'cursor-pointer'"
                    @click="
                      Logic.Common.GoToRoute(
                        '/marketplace/' + activity.id + '?type=quiz'
                      )
                    "
                  />
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="w-full flex flex-col space-y-3 md:!px-0 px-4">
              <sofa-empty-state
                :title="'No result found'"
                :subTitle="'We could not find any quiz that matches your search'"
                :actionLabel="'Clear search'"
                :action="
                  () => {
                    defaultValue = ' ';
                    search();
                  }
                "
              />
            </div>
          </template>
        </div>

        <div class="w-full h-[100px]"></div>
      </div>
      <!-- Bottom filter for sm screens -->
      <div
        class="fixed bg-backgroundGray mdlg:!hidden bottom-0 left-0 px-4 py-4 flex flex-col w-full"
      >
        <div
          class="bg-primaryPurple custom-border py-3 flex flex-row items-center justify-center space-x-2"
          @click="showFilter = true"
        >
          <sofa-icon :customClass="'h-[14px]'" :name="'filter-white'" />
          <sofa-normal-text
            :customClass="'!font-semibold !text-sm'"
            :color="'text-white'"
            >Filter</sofa-normal-text
          >
          <span
            class="w-[24px] h-[24px] bg-white rounded-full flex items-center justify-center"
          >
            <sofa-normal-text :color="'text-primaryPurple'">{{
              selectedOptions.length
            }}</sofa-normal-text>
          </span>
        </div>
      </div>

      <sofa-modal
        v-if="showFilter"
        :close="
          () => {
            showFilter = false;
          }
        "
        :customClass="'mdlg:!hidden'"
      >
        <div
          :class="`mdlg:!w-[70%] mdlg:!hidden bg-white lg:!w-[60%] px-0 pt-0 h-[95%] max-h-[95%] w-full flex flex-col rounded-t-[16px] space-y-4  relative overflow-y-auto`"
          @click.stop="
            () => {
              //
            }
          "
        >
          <div
            class="w-full flex flex-row px-4 py-3 justify-between items-center bg-white sticky top-0 left-0 border-b-[1px] border-[#F1F6FA]"
          >
            <div class="flex flex-row items-center space-x-3">
              <sofa-icon :customClass="'h-[13px]'" :name="'filter'" />
              <sofa-normal-text :customClass="'!font-bold !text-base'">
                Filters
              </sofa-normal-text>
            </div>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showFilter = false"
            />
          </div>

          <marketplace-filter
            :close="
              () => {
                showFilter = false;
              }
            "
            :updateValue="selectedOptions"
            :searchQuery="searchQuery"
            v-model="selectedOptions"
          />
        </div>
      </sofa-modal>
    </template>
  </dashboard-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaTextField,
  SofaItemCard,
  SofaEmptyState,
  SofaActivityCard,
  SofaModal,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import MarketplaceFilter from "@/components/marketplace/Filter.vue";
import { search } from "@/composables/marketplace";
import { useRoute } from "vue-router";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import { createCourseData, createQuizData } from "@/composables/library";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaTextField,
    SofaItemCard,
    MarketplaceFilter,
    SofaEmptyState,
    SofaActivityCard,
    SofaModal,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "AllCourses",
        method: "GetCoursesWithQuery",
        params: [],
        requireAuth: true,
        ignoreProperty: true,
        useRouteQuery: true,
        queries: ["tagId", "q"],
      },
      {
        domain: "Study",
        property: "AllQuzzies",
        method: "GetQuizzesWithQuery",
        params: [],
        requireAuth: true,
        ignoreProperty: true,
        useRouteQuery: true,
        queries: ["tagId", "q"],
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
  name: "MarketplaceSearchPage",
  setup() {
    useMeta({
      title: "Search",
    });

    const AllCourses = ref(Logic.Study.AllCourses);

    const AllQuzzies = ref(Logic.Study.AllQuzzies);

    const searchQuery = ref("");

    const selectedOptions = ref([]);

    const defaultValue = ref("");

    const showFilter = ref(false);

    const selectedFilterOption = ref("all");

    const filterOptions = reactive([
      {
        name: "All",
        active: true,
        id: "all",
      },
      {
        name: "Courses",
        active: false,
        id: "courses",
      },
      {
        name: "Quizzes",
        active: false,
        id: "quizzes",
      },
    ]);

    const resourceContents = ref<
      {
        id: string;
        subject?: string;
        title?: string;
        image?: string;
        labels?: {
          main: string;
          sub: string;
          color: string;
        };
        username?: string;
        userPhoto: string;
        price?: number;
        createdAt: number;
      }[]
    >([]);

    const quizContents = ref<
      {
        id: string;
        subject?: string;
        title?: string;
        image?: string;
        labels?: {
          main: string;
          sub: string;
          color: string;
        };
        username?: string;
        userPhoto: string;
        price?: number;
        createdAt: number;
      }[]
    >([]);

    const setCourses = () => {
      resourceContents.value.length = 0;
      AllCourses.value.results.forEach((course) => {
        resourceContents.value.push(createCourseData(course));
      });
    };

    const setQuizzes = () => {
      quizContents.value.length = 0;
      AllQuzzies.value.results.forEach((quiz) => {
        quizContents.value.push(createQuizData(quiz));
      });
    };

    const setQuery = () => {
      const route = useRoute();

      if (route.query?.tagId) {
        selectedOptions.value.push({
          name: Logic.Study.GetTagName(route.query?.tagId.toString()),
          active: false,
          id: route.query?.tagId.toString(),
          query: {
            field: "tagIds",
            value: route.query?.tagId.toString(),
            condition: Conditions.in,
          },
        });
      }

      if (route.query?.userId) {
        selectedOptions.value.push({
          name: "",
          active: false,
          id: route.query?.userId.toString(),
          query: {
            field: "user.id",
            value: route.query?.userId.toString(),
            condition: Conditions.in,
          },
        });
      }

      if (route.query?.q) {
        if (route.query?.q != "nill") {
          defaultValue.value = route.query?.q.toString();
        }
      }
    };

    onMounted(() => {
      scrollToTop();
      Logic.Study.watchProperty("AllCourses", AllCourses);
      Logic.Study.watchProperty("AllQuzzies", AllQuzzies);
      setQuery();
      setCourses();
      setQuizzes();
    });

    watch(AllCourses, () => {
      setCourses();
    });

    watch(AllQuzzies, () => {
      setQuizzes();
    });

    watch(searchQuery, () => {
      const allQueries: any = {
        where: [
          {
            field: "status",
            value: "published",
            condition: Conditions.eq,
          },
        ],
      };

      selectedOptions.value.forEach((item) => {
        if (item.query) {
          allQueries.where.push(item.query);
        }
      });

      allQueries.search = {
        value: searchQuery.value,
        fields: ["title"],
      };

      Logic.Common.debounce(() => {
        if (searchQuery.value != "nill") {
          search(allQueries, true);
        }
      }, 500);
    });

    return {
      moment,
      resourceContents,
      Logic,
      searchQuery,
      selectedOptions,
      defaultValue,
      showFilter,
      quizContents,
      filterOptions,
      selectedFilterOption,
      search,
    };
  },
});
</script>
<style scoped>
.textarea[contenteditable]:empty::before {
  content: "Enter message";
  color: #78828c;
}
</style>
