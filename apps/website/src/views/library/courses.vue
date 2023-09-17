<template>
  <sub-page-layout>
    <div class="w-full h-full flex-grow flex flex-col justify-start relative">
      <div
        class="w-full flex flex-row items-center space-x-3 z-50 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
      >
        <sofa-icon
          :customClass="'h-[15px]'"
          :name="'back-arrow'"
          @click="Logic.Common.goBack()"
        />
        <sofa-normal-text :customClass="'!font-bold !text-base'">
          Courses</sofa-normal-text
        >
        <div></div>
      </div>
      <div
        class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide px-4 py-2 space-x-3"
      >
        <span
          :class="`px-6 py-2  ${
            item.id == selectedItemId ? 'bg-primaryPurple' : 'bg-white'
          } custom-border flex flex-row items-center justify-center space-x-1  cursor-pointer `"
          v-for="(item, index) in mainFilters"
          :key="index"
          @click="selectedItemId = item.id"
        >
          <sofa-normal-text
            :color="`${
              item.id == selectedItemId ? 'text-white' : 'text-deepGray'
            } `"
            :custom-class="'!font-semibold'"
            >{{ item.name }}</sofa-normal-text
          >
        </span>
      </div>

      <div class="w-full flex flex-col space-y-3 px-4 pt-3">
        <template v-if="currentCourseData.length">
          <sofa-activity-card
            v-for="(activity, index) in currentCourseData"
            :key="index"
            :activity="activity"
            :custom-class="'!bg-white shadow-custom cursor-pointer relative'"
            @click="Logic.Common.GoToRoute('/course/' + activity.id)"
            :isWrapped="true"
          >
            <div
              class="absolute right-0 top-0 py-3 px-3 bg-white rounded-tr-[8px]"
            >
              <sofa-icon
                :name="'more-options-horizontal'"
                :customClass="'h-[6px] '"
                @click.stop="showMoreOptionHandler(activity, 'course')"
              />
            </div>
          </sofa-activity-card>
        </template>

        <sofa-empty-state
          v-else
          :title="'You have no course here'"
          :subTitle="'Discover thousands of courses and save them here for easy access'"
          :actionLabel="'Explore'"
          :action="
            () => {
              Logic.Common.GoToRoute('/explore');
            }
          "
        />
      </div>

      <div class="w-full flex flex-row h-[100px]"></div>
    </div>

    <!-- More options -->
    <sofa-modal
      v-if="showMoreOptions"
      :close="
        () => {
          showMoreOptions = false;
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
              Options
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showMoreOptions = false"
            />
          </div>

          <div class="w-full flex flex-col space-y-3 px-4 py-4">
            <div
              class="w-full flex flex-row items-center space-x-2 py-3"
              v-for="(item, index) in moreOptions"
              :key="index"
              @click.stop="item.action()"
            >
              <sofa-icon :name="item.icon" :customClass="'h-[15px]'" />
              <sofa-normal-text>
                {{ item.title }}
              </sofa-normal-text>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>
  </sub-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import { scrollToTop } from "@/composables";
import {
  SofaIcon,
  SofaNormalText,
  SofaActivityCard,
  SofaEmptyState,
  SofaModal,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import { ResourceType } from "sofa-logic/src/logic/types/domains/study";
import {
  moreOptions,
  showMoreOptionHandler,
  showMoreOptions,
} from "@/composables/library";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaActivityCard,
    SofaEmptyState,
    SofaModal,
  },
  middlewares: {
    fetchRules: [
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
    ],
  },
  name: "LibraryCoursesPage",
  setup() {
    useMeta({
      title: "Courses",
    });

    const AllCourses = ref(Logic.Study.AllCourses);

    onMounted(() => {
      scrollToTop();
    });

    const selectedItemId = ref("course-recent");

    const mainFilters = reactive([
      {
        name: "Recent",
        active: true,
        id: "course-recent",
      },
      {
        name: "Saved",
        active: false,
        id: "course-saved",
      },
      {
        name: "Published",
        active: false,
        id: "course-published",
      },
      {
        name: "Draft",
        active: false,
        id: "course-draft",
      },
    ]);

    const courses = ref<ResourceType[]>([]);

    const currentCourseData = ref<ResourceType[]>([]);

    const setCourses = () => {
      courses.value.length = 0;

      AllCourses.value.results.forEach((course) => {
        courses.value.push({
          title: course.title,
          image: course.photo ? course.photo.link : "/images/default.png",
          labels: {
            color: "orange",
            main: "Course",
            sub: `${course.sections.length} topics`,
          },
          progress: 0,
          subject: Logic.Study.GetTagName(course.topicId),
          username:
            course.user?.id == Logic.Users.UserProfile?.id
              ? "You"
              : course.user.bio.name.full,

          routePath: "/course/create?id=" + course.id,
          id: course.id,
          status: course.status,
          showMore: false,
          ratings: course.ratings,
          type: 'course',
          userId: course.user.id,
        });
      });
    };

    const filterItem = () => {
      const status = selectedItemId.value.split("-")[1];

      if (status == "recent") {
        currentCourseData.value = courses.value;
      } else {
        currentCourseData.value = courses.value.filter(
          (course) => course.status == status
        );
      }
    };

    watch(selectedItemId, () => {
      filterItem();
    });

    onMounted(() => {
      scrollToTop();
      Logic.Study.watchProperty("AllCourses", AllCourses);
      setCourses();
      filterItem();
    });

    return {
      Logic,
      mainFilters,
      courses,
      selectedItemId,
      currentCourseData,
      showMoreOptions,
      moreOptions,
      showMoreOptionHandler,
    };
  },
});
</script>
