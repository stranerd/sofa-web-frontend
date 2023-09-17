<template>
  <expanded-layout :hasBottomBar="false">
    <div class="mdlg:!flex hidden flex-row justify-between items-center w-full">
      <sofa-normal-text
        :color="'text-grayColor w-full flex flex-row justify-start space-x-1'"
      >
        <span class="cursor-pointer" @click="Logic.Common.goBack()">{{
          "Marketplace "
        }}</span>
        <span> / {{ contentDetails.title }}</span>
      </sofa-normal-text>
    </div>
    <div
      class="w-full flex mdlg:!hidden flex-row items-center z-[999] space-x-3 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
    >
      <sofa-icon
        :customClass="'h-[15px]'"
        :name="'back-arrow'"
        @click="Logic.Common.goBack()"
      />
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        {{
          contentType == "course" ? "Course details" : "Quiz details"
        }}</sofa-normal-text
      >
      <div>
        <sofa-icon :customClass="'h-[15px] invisible'" :name="'back-arrow'" />
      </div>
    </div>
    <div
      class="w-full bg-white rounded-[16px] h-auto max-h-full flex flex-row space-y-3"
    >
      <sofa-content-details
        :content="contentDetails"
        :customClass="'!rounded-none'"
        :showBuyButton="true"
        :buyAction="buyCourse"
        :itemIsPurchased="PurchasedItems.includes(contentDetails.id)"
        :similarContents="similarContents"
        :type="contentType"
      />
    </div>

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
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaNormalText,
  SofaContentDetails,
  SofaIcon,
  SofaModal,
  SofaHeaderText,
  SofaButton,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import { createCourseData } from "@/composables/library";

export default defineComponent({
  components: {
    SofaNormalText,
    SofaContentDetails,
    SofaIcon,
    SofaModal,
    SofaHeaderText,
    SofaButton,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Study",
        property: "SingleCourse",
        method: "GetCourse",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
        condition: {
          routeSearchItem: "fullPath",
          searchQuery: "course",
        },
      },
      {
        domain: "Study",
        property: "SingleQuiz",
        method: "GetQuiz",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
        condition: {
          routeSearchItem: "fullPath",
          searchQuery: "quiz",
        },
      },
      {
        domain: "Study",
        property: "AllQuestions",
        method: "GetQuestions",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
        condition: {
          routeSearchItem: "fullPath",
          searchQuery: "quiz",
        },
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
        domain: "Study",
        property: "Tags",
        method: "GetTags",
        params: [],
        requireAuth: true,
        ignoreProperty: true,
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
  name: "MarketplaceInfoPage",
  setup() {
    useMeta({
      title: "Course Info",
    });

    const selectedTab = ref("start");

    const contentType = ref("course");

    const UserWallet = ref(Logic.Payment.UserWallet);

    const tabItems = [
      {
        id: "start",
        name: "Start",
      },
      {
        id: "questions",
        name: "Questions",
      },
      {
        id: "results",
        name: "Results",
      },
    ];

    const contentList = [
      {
        title: "Alkanes",
        content: "4 materials",
      },
    ];

    const SingleCourse = ref(Logic.Study.SingleCourse);
    const SingleCourseFiles = ref(Logic.Study.SingleCourseFiles);
    const SingleCourseQuizzes = ref(Logic.Study.SingleCourseQuizzes);

    const SingleQuiz = ref(Logic.Study.SingleQuiz);
    const AllQuestions = ref(Logic.Study.AllQuestions);

    const PaymentMethods = ref(Logic.Payment.PaymentMethods);
    const PurchasedItems = ref(Logic.Payment.PurchasedItems);

    const similarContents = ref<any[]>([]);

    const selectedMethodId = ref("");

    const showMakePaymentModal = ref(false);

    const contentDetails = reactive(Logic.Study.contentDetails);

    const setCourseData = () => {
      contentType.value = "course";
      contentDetails.id = SingleCourse.value.id;
      contentDetails.title = SingleCourse.value.title;
      contentDetails.price = SingleCourse.value.price.amount;
      contentDetails.status = SingleCourse.value.status;
      contentDetails.image = SingleCourse.value.photo
        ? SingleCourse.value.photo.link
        : "/images/default.png";
      contentDetails.info = SingleCourse.value.description;
      contentDetails.lastUpdated = `Last updated ${Logic.Common.momentInstance(
        SingleCourse.value.createdAt
      ).format("DD/MM/YYYY")}`;
      contentDetails.labels.color = `orange`;
      contentDetails.labels.main = `Course`;
      contentDetails.labels.sub = `${SingleCourse.value.sections.length} materials`;
      contentDetails.tags = SingleCourse.value.tagIds.map((id) => {
        return Logic.Study.GetTagName(id);
      });
      contentDetails.user.name = SingleCourse.value.user.bio.name.full;
      contentDetails.user.photoUrl = SingleCourse.value.user.bio.photo
        ? SingleCourse.value.user.bio.photo.link
        : "";

      contentDetails.content.materialsCount =
        SingleCourse.value.coursables.length;

      // set sections

      contentDetails.content.sections.length = 0;

      SingleCourse.value.sections.forEach((section, index) => {
        contentDetails.content.sections.push({
          title: section.label,
          opened: index == 0,
          data: [],
        });

        section.items.forEach((item) => {
          if (item.type == "quiz") {
            const quizData = SingleCourseQuizzes.value?.filter(
              (quiz) => quiz.id == item.id
            );
            if (quizData?.length) {
              contentDetails.content.sections[index].data.push({
                isLocked: true,
                sub: `${quizData[0].questions.length} question${
                  quizData[0].questions.length > 1 ? "s" : ""
                }`,
                title: quizData[0].title,
                type: "Quiz",
              });
            }
          } else {
            const fileData = SingleCourseFiles.value?.filter(
              (file) => file.id == item.id
            );

            if (fileData?.length) {
              if (fileData[0].type == "video") {
                contentDetails.content.sections[index].data.push({
                  isLocked: true,
                  sub: fileData[0].description,
                  title: fileData[0].title,
                  type: "Video",
                });
              } else {
                contentDetails.content.sections[index].data.push({
                  isLocked: true,
                  sub: fileData[0].description,
                  title: fileData[0].title,
                  type: "Document",
                });
              }
            }
          }
        });
      });
    };

    const setQuizData = () => {
      contentType.value = "quiz";
      contentDetails.id = SingleQuiz.value.courseId || SingleQuiz.value.id;
      contentDetails.title = SingleQuiz.value.title;
      contentDetails.price = 0;
      contentDetails.status = SingleQuiz.value.status;
      contentDetails.image = SingleQuiz.value.photo
        ? SingleQuiz.value.photo.link
        : "/images/default.png";
      contentDetails.info = SingleQuiz.value.description;
      contentDetails.lastUpdated = `Last updated ${Logic.Common.momentInstance(
        SingleQuiz.value.createdAt
      ).format("DD/MM/YYYY")}`;
      contentDetails.labels.sub = `${SingleQuiz.value.questions.length} questions`;
      contentDetails.labels.color = `pink`;
      contentDetails.labels.main = `Quiz`;
      contentDetails.tags = SingleQuiz.value.tagIds.map((id) => {
        return Logic.Study.GetTagName(id);
      });

      contentDetails.user.name = SingleQuiz.value.user?.bio.name.full;
      contentDetails.user.photoUrl = SingleQuiz.value.user.bio.photo
        ? SingleQuiz.value.user.bio.photo.link
        : "";

      contentDetails.questions.length = 0;
      AllQuestions.value?.results.forEach((question) => {
        contentDetails.questions.push({
          type: question.type,
          content: question.question,
          duration: Logic.Common.EquivalentsSecondsInString[question.timeLimit],
          answer: "",
        });
      });
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
          Logic.Common.GoToRoute("/course/" + SingleCourse.value.id);
        }
      });
    };

    const setSimilarContents = () => {
      Logic.Study.GetCourses(
        {
          where: [
            {
              field: "topicId",
              condition: Conditions.eq,
              value: SingleCourse.value.topicId,
            },
            {
              field: "status",
              condition: Conditions.eq,
              value: "published",
            },
            {
              field: "id",
              condition: Conditions.ne,
              value: SingleCourse.value.id,
            },
          ],
          limit: 3,
        },
        false
      ).then((courses) => {
        similarContents.value.length = 0;
        if (courses) {
          courses.results.forEach((course) => {
            similarContents.value.push(createCourseData(course));
          });
        }
      });
    };

    watch(SingleCourse, () => {
      if (SingleCourse.value) {
        scrollToTop();
        setCourseData();
        setSimilarContents();
      }
    });

    watch(SingleQuiz, () => {
      if (SingleQuiz.value) {
        scrollToTop();
        setQuizData();
      }
    });

    onMounted(() => {
      if (Logic.Common.route.query?.type?.toString()) {
        contentType.value = Logic.Common.route.query?.type?.toString();
      }
      Logic.Payment.watchProperty("PaymentMethods", PaymentMethods);
      Logic.Payment.watchProperty("PurchasedItems", PurchasedItems);
      Logic.Study.watchProperty("SingleCourse", SingleCourse);
      Logic.Study.watchProperty("SingleCourseFiles", SingleCourseFiles);
      Logic.Study.watchProperty("SingleCourseQuizzes", SingleCourseQuizzes);
      Logic.Payment.watchProperty("UserWallet", UserWallet);
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz);
      scrollToTop();

      if (contentType.value == "course") {
        setCourseData();
        setSimilarContents();
        // create course view
        Logic.Interactions.CreateViewForm = {
          entity: {
            id: SingleCourse.value.id,
            type: "courses",
          },
        };

        Logic.Interactions.CreateView(true);
      }

      if (contentType.value == "quiz") {
        setQuizData();
        Logic.Interactions.CreateViewForm = {
          entity: {
            id: SingleQuiz.value.id,
            type: "quizzes",
          },
        };

        Logic.Interactions.CreateView(true);
      }
    });

    return {
      moment,
      tabItems,
      Logic,
      selectedTab,
      contentList,
      contentDetails,
      PaymentMethods,
      showMakePaymentModal,
      selectedMethodId,
      PurchasedItems,
      UserWallet,
      similarContents,
      SingleQuiz,
      contentType,
      buyCourse,
    };
  },
});
</script>