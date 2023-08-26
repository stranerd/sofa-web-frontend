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
            :custom-class="'!bg-white shadow-custom cursor-pointer'"
            @click="Logic.Common.GoToRoute('/course/' + activity.id)"
            :isWrapped="true"
            :hasEdit="true"
            :editAction="
              () => {
                Logic.Common.GoToRoute(activity.routePath);
              }
            "
          />
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
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import { ResourceType } from "sofa-logic/src/logic/types/domains/study";

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaActivityCard,
    SofaEmptyState,
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
    };
  },
});
</script>
