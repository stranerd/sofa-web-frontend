<template>
  <expanded-layout
    layoutStyle="mdlg:!w-[90%] lg:!w-[77%] w-full pt-0 h-full   mdlg:!pt-[20px] lg:!pt-[20px]"
    :hasBottomBar="false"
  >
    <!-- Display for larger screens -->
    <div
      class="w-full mdlg:grid grid-cols-11 gap-4 flex-grow"
      v-if="Logic.Common.mediaQuery() != 'sm'"
    >
      <div
        class="mdlg:col-span-3 flex flex-col col-span-full lg:max-h-[600px] mdlg:max-h-[600px]"
      >
        <div
          class="w-full shadow-custom bg-white rounded-[16px] h-full flex flex-col pb-4"
        >
          <div
            class="flex flex-col h-full overflow-y-auto relative scrollbar-thumb-gray-300 scrollbar-track-gray-100 mdlg:!scrollbar-thin"
          >
            <div
              class="w-full px-4 py-4 sticky top-0 left-0 bg-white z-30 rounded-t-[16px] flex flex-row items-start"
            >
              <sofa-header-text
                :customClass="'!font-bold !text-left !line-clamp-1'"
              >
                {{ SingleCourse?.title }}
              </sofa-header-text>
            </div>

            <sofa-course-content
              @OnMaterialSelected="handleItemSelected"
              :lockContent="!PurchasedItems.includes(SingleCourse?.id)"
              v-model="selectedMaterial"
            />
          </div>
        </div>
      </div>
      <div
        :class="`mdlg:col-span-8 flex flex-col col-span-full ${
          selectedMaterial?.type == 'document' ? 'h-full' : 'h-fit'
        } `"
      >
        <CourseContent
          :buyCourse="buyCourse"
          :PurchasedItems="PurchasedItems"
          :selected-material="selectedMaterial"
          :show-study-mode="
            () => {
              showStudyMode = true;
            }
          "
          :single-course="SingleCourse"
        />
      </div>
    </div>

    <div
      class="w-full flex flex-col space-y-2 fixed top-0 left-0 h-full bg-white mdlg:hidden overflow-y-auto"
    >
      <!-- Top bar for smaller screens -->
      <div
        class="w-full flex flex-row mdlg:!hidden justify-between items-center z-[99999999] bg-white px-4 py-4 sticky top-0 left-0 overflow-y-auto"
      >
        <sofa-icon
          :customClass="'h-[15px]'"
          :name="'back-arrow'"
          @click="handleMobileGoback()"
        />
      </div>

      <!-- Content for smaller screens -->
      <div
        class="w-full flex flex-col space-y-2 overflow-y-auto relative flex-grow"
      >
        <template v-if="!showCourseContent">
          <div
            class="w-full flex flex-col space-y-2 px-4 pb-3 items-start justify-start sticky top-0 left-0"
          >
            <sofa-header-text :custom-class="'!font-bold !text-xl !text-left'">
              {{ SingleCourse.title }}
            </sofa-header-text>
            <sofa-normal-text :custom-class="'text-left'">
              {{ SingleCourse.description }}
            </sofa-normal-text>
          </div>

          <sofa-course-content
            @OnMaterialSelected="handleItemSelected"
            :lockContent="!PurchasedItems.includes(SingleCourse?.id)"
            v-model="selectedMaterial"
            @onCourseContentSet="handleCourseContentSet"
          />
        </template>

        <template v-else>
          <div class="flex flex-col w-full">
            <div
              :class="`w-full flex flex-col col-span-full  ${
                selectedMaterial?.type == 'document' ? 'h-full' : 'h-fit'
              } `"
            >
              <CourseContent
                :buyCourse="buyCourse"
                :PurchasedItems="PurchasedItems"
                :selected-material="selectedMaterial"
                :show-study-mode="
                  () => {
                    showStudyMode = true;
                  }
                "
                :single-course="SingleCourse"
              />
            </div>
          </div>
        </template>
      </div>

      <!-- Course content slider -->
      <div
        class="absolute bottom-0 left-0 pl-4 py-4 bg-white drop-shadow-2xl rounded-t-[16px] flex flex-col space-y-2 items-center justify-center w-full"
        v-if="selectedMaterial && showCourseContent"
      >
        <sofa-normal-text :custom-class="'!font-bold'">
          {{ SingleCourse.title }}
        </sofa-normal-text>
        <div
          class="w-full flex flex-row space-x-3 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
        >
          <div
            class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
          >
            <template v-for="(section, index) in courseContents" :key="index">
              <template
                v-for="(item, itemIndex) in section.materials"
                :key="itemIndex"
              >
                <div
                  class="w-[280px] custom-border px-3 py-3 bg-primaryPurple flex flex-col space-y-1"
                  @click="selectItem(item)"
                >
                  <sofa-normal-text
                    :color="'!text-white'"
                    :customClass="'!text-left'"
                  >
                    {{ section.name }} - {{ item.name }}
                  </sofa-normal-text>

                  <div class="w-full flex flex-row items-center space-x-2">
                    <sofa-icon
                      :name="`${item.type}-white`"
                      :customClass="'h-[15px]'"
                    />
                    <sofa-normal-text
                      :color="'!text-white'"
                      :customClass="'!text-left'"
                    >
                      {{ item.type.split("-")[0] }}
                    </sofa-normal-text>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Small screen course info -->

    <sofa-modal
      v-if="showCourseInfo"
      :close="
        () => {
          showCourseInfo = false;
        }
      "
    >
      <div
        class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-[80%] md:w-[70%] flex flex-col items-center relative"
        @click.stop="
          () => {
            //
          }
        "
      >
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-5 space-y-3 overflow-y-auto h-full lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full flex flex-row justify-between items-center sticky bg-white z-40 top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              Course details
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showCourseInfo = false"
            />
          </div>

          <sofa-course-summary :data="SingleCourse" />
        </div>
      </div>
    </sofa-modal>

    <!-- Study mode for quiz -->
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
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-5 space-y-3 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full hidden flex-col space-y-1 justify-center items-center md:flex"
          >
            <sofa-header-text :customClass="'text-xl'">
              Choose Study Mode
            </sofa-header-text>
            <sofa-normal-text>
              Complete at least one to make progress
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden py-2 pt-3 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              Choose Study Mode
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showStudyMode = false"
            />
          </div>

          <div
            class="w-full flex flex-col space-y-3 mdlg:!px-0 px-4 mdlg:!pb-0 pb-4"
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
          </div>
        </div>
      </div>
    </sofa-modal>

    <!--  Payment modal -->
    <sofa-modal
      v-if="showMakePaymentModal"
      :close="
        () => {
          showMakePaymentModal = false;
        }
      "
    >
      <div
        class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative"
        @click.stop="
          () => {
            //
          }
        "
      >
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-5 space-y-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full hidden flex-col space-y-3 justify-center items-center mdlg:!flex"
          >
            <sofa-header-text :customClass="'text-xl'">
              Choose payment method
            </sofa-header-text>
          </div>

          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              Choose payment method
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showMakePaymentModal = false"
            />
          </div>

          <div class="w-full flex flex-col space-y-3 mdlg:!px-0 px-4">
            <!-- Wallet -->
            <div
              :class="`w-full flex flex-row items-center space-x-3 px-3 py-3  bg-[#F1F6FA] ${
                selectedMethodId == 'payWithWallet'
                  ? 'border-primaryBlue  border-[2px]'
                  : ''
              }  custom-border cursor-pointer `"
              @click="selectedMethodId = 'payWithWallet'"
            >
              <sofa-icon :customClass="'h-[20px]'" :name="'wallet'" />
              <sofa-normal-text>
                Wallet (<span class="!font-semibold">{{
                  Logic.Common.convertToMoney(
                    UserWallet.balance.amount,
                    true,
                    "ngn"
                  )
                }}</span
                >)
              </sofa-normal-text>
            </div>

            <!-- Pay online -->

            <div
              class="w-full flex flex-row items-center space-x-3 px-3 py-3 cursor-pointer"
              @click="Logic.Payment.initialPayment()"
            >
              <sofa-icon :customClass="'h-[18px]'" :name="'add-card'" />
              <sofa-normal-text :color="'text-grayColor'"
                >Add credit or debit card</sofa-normal-text
              >
            </div>

            <div
              :class="`w-full flex flex-row items-center space-x-3 px-3 py-3 bg-[#F1F6FA]  ${
                selectedMethodId == method.id
                  ? 'border-primaryBlue border-[2px]'
                  : ''
              }  custom-border cursor-pointer `"
              @click="selectedMethodId = method.id"
              v-for="(method, index) in PaymentMethods.results"
              :key="index"
            >
              <sofa-icon :customClass="'h-[20px]'" :name="'card'" />
              <sofa-normal-text>
                **** **** **** {{ method.data.last4Digits }}
              </sofa-normal-text>
            </div>
          </div>

          <div
            class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4"
          >
            <div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
              <sofa-button
                :textColor="'text-grayColor'"
                :bgColor="'bg-white'"
                :padding="'px-4 py-1'"
                :customClass="`border-[2px] border-gray-100 md:!min-w-[100px] md:!w-auto w-full`"
                @click="showMakePaymentModal = false"
              >
                Exit
              </sofa-button>
            </div>

            <div class="md:!w-auto col-span-2 flex flex-col">
              <sofa-button
                :textColor="'text-white'"
                :bgColor="'bg-primaryBlue'"
                :padding="'px-4 md:!py-1 py-3'"
                :customClass="`border-[2px] border-transparent md:!min-w-[100px] md:!w-auto w-full`"
                @click="buyCourse()"
              >
                Make payment
              </sofa-button>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>
  </expanded-layout>
</template>
<script lang="ts">
import { Logic } from "sofa-logic";
import { defineComponent, onMounted, reactive, ref } from "vue";
import {
  SofaNormalText,
  SofaIcon,
  SofaCourseSummary,
  SofaCourseContent,
  SofaModal,
  SofaHeaderText,
  SofaIconCard,
  SofaButton,
} from "sofa-ui-components";
import { useMeta } from "vue-meta";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import CourseContent from "@/components/courses/content.vue";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaIcon,
    SofaCourseSummary,
    SofaCourseContent,
    SofaModal,
    SofaHeaderText,
    SofaIconCard,
    SofaButton,
    CourseContent,
  },
  name: "CourseDetailsPage",
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "SingleCourse",
        method: "GetCourse",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
      },
      {
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "PurchasedItems",
        method: "GetUserPurchases",
        params: [false],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "UserWallet",
        method: "GetUserWallet",
        params: [],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "PaymentMethods",
        method: "GetPaymentMethods",
        params: [
          {
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
    ],
  },
  setup() {
    useMeta({
      mobileTitle: "Course Details",
    });

    const SingleCourse = ref(Logic.Study.SingleCourse);

    const mobileTitle = ref(Logic.Study.SingleCourse.title);

    const UserWallet = ref(Logic.Payment.UserWallet);
    const PaymentMethods = ref(Logic.Payment.PaymentMethods);
    const PurchasedItems = ref(Logic.Payment.PurchasedItems);
    const selectedMethodId = ref("");
    const showMakePaymentModal = ref(false);

    const showStudyMode = ref(false);

    const selectedMaterial = ref<any>();

    const showCourseContent = ref(false);

    const courseContents = reactive<any[]>([]);

    const showCourseInfo = ref(false);

    const handleItemSelected = (data: any) => {
      if (data) {
        selectedMaterial.value = data;

        if (Logic.Common.mediaQuery() == "sm") {
          showCourseContent.value = true;
        } else {
          if (!data.isMounted) {
            showCourseContent.value = false;
          }
        }
      }
    };

    const selectItem = (material: any) => {
      if (PurchasedItems.value.includes(SingleCourse.value?.id)) {
        selectedMaterial.value = {
          id: material.id,
          data: material.data,
          details: material.details,
          type: material.type.split("-")[0],
          name: material.name,
        };
      }
    };

    const handleMobileGoback = () => {
      if (showCourseContent.value) {
        showCourseContent.value = false;
      } else {
        Logic.Common.goBack();
      }
    };

    const otherTasks = [
      {
        title: "Practice",
        subTitle: "Interactive and comfortable learning",
        icon: "learn-quiz",
        iconSize: "h-[46px]",
        key: "practice",
        isDone: false,
      },
      {
        title: "Test",
        subTitle: "Evaluate your level of knowledge",
        icon: "test",
        iconSize: "h-[46px]",
        key: "test",
        isDone: false,
      },
      {
        title: "Flashcards",
        subTitle: "Digital cards to memorize answers",
        icon: "study-flashcard",
        iconSize: "h-[46px]",
        key: "flashcard",
        isDone: false,
      },
    ];

    const goToStudyMode = (type: string) => {
      if (type != "assignment" && type != "game") {
        Logic.Common.GoToRoute(
          `/quiz/${selectedMaterial.value.data?.id}?mode=${type}`
        );
      }
    };

    const buyCourse = () => {
      if (Logic.Common.loaderSetup.loading) return;

      if (SingleCourse.value.price.amount > 0 && selectedMethodId.value == "") {
        showMakePaymentModal.value = true;
        return;
      }

      Logic.Payment.MakePurchaseForm = {
        id: SingleCourse.value.id,
        methodId: selectedMethodId.value,
        type: "courses",
      };

      Logic.Payment.MakePurchase().then((data) => {
        if (data) {
          showMakePaymentModal.value = false;
          Logic.Payment.GetUserPurchases(false);
          Logic.Study.GetCourse(SingleCourse.value.id);
        }
      });
    };

    const handleCourseContentSet = (data) => {
      courseContents.length = 0;
      courseContents.push(...data);
    };

    onMounted(() => {
      Logic.Payment.watchProperty("PaymentMethods", PaymentMethods);
      Logic.Payment.watchProperty("PurchasedItems", PurchasedItems);
      Logic.Payment.watchProperty("UserWallet", UserWallet);
      Logic.Study.watchProperty("SingleCourse", SingleCourse);
    });

    return {
      Logic,
      SingleCourse,
      handleMobileGoback,
      mobileTitle,
      selectedMaterial,
      handleItemSelected,
      showCourseContent,
      showCourseInfo,
      showStudyMode,
      otherTasks,
      goToStudyMode,
      buyCourse,
      PaymentMethods,
      showMakePaymentModal,
      selectedMethodId,
      PurchasedItems,
      UserWallet,
      courseContents,
      handleCourseContentSet,
      selectItem,
    };
  },
});
</script>