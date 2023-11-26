<template>
  <div
    :class="`w-full flex flex-col gap-2 h-full relative bg-white mdlg:!rounded-[16px] mdlg:!overflow-y-auto overflow-y-auto  custom-border ${customClass}`">
    <div :class="`w-full flex flex-col gap-2 ${padding} relative`">
      <div
        class="w-full flex mdlg:!flex md:!flex-row mdlg:!flex-none flex-col relative mdlg:!items-start h-auto items-start justify-start gap-3 mdlg:space-x-3">
        <div :class="` ${hasPadding ? 'mdlg:!w-[25%]' : 'mdlg:!w-[33%]'} w-full h-full mdlg:!absolute top-0 left-0`">
          <sofa-image-loader :customClass="'mdlg:!w-full w-full mdlg:!h-full h-[200px] custom-border relative'"
            :photoUrl="content.image">
            <div class="flex flex-row gap-2 items-center justify-end absolute bottom-0 left-0 w-full px-2 py-2"
              v-if="content.price > 0 && !itemIsPurchased">
              <sofa-badge :customClass="'!bg-[#141618] !bg-opacity-50 !text-white !px-4 !py-2 custom-border'">
                {{
                  content.price > 0
                  ? `${Logic.Common.convertToMoney(
                    content.price,
                    false,
                    "ngn"
                  )}`
                  : "Start"
                }}
              </sofa-badge>
            </div>
          </sofa-image-loader>
        </div>
        <div :class="`flex flex-col gap-2 flex-grow   ${hasPadding
              ? 'mdlg:!w-[75%] mdlg:!pl-[25%]'
              : 'mdlg:!w-[67%] mdlg:!pl-[33%]'
            }`">
          <div class="w-full flex flex-row items-center justify-between">
            <sofa-header-text :content="content.title" />

            <div class="mdlg:!flex flex-row items-center justify-end gap-4 hidden">
              <sofa-icon :name="'flag'" :customClass="'h-[16px] cursor-pointer '" @click="actions.report()" />
              <sofa-icon :name="'share'" :customClass="'h-[16px] cursor-pointer'" @click="actions.share()" />
              <sofa-icon :name="'save'" :customClass="'h-[16px] cursor-pointer'" @click="actions.save()" />
            </div>
          </div>
          <sofa-normal-text :customClass="'text-left'">
            {{ content.info }}
          </sofa-normal-text>
          <div class="flex flex-row gap-2 items-center">
            <sofa-normal-text :color="content.labels.color == 'pink'
              ? 'text-primaryPurplePink'
              : 'text-primaryPurple'
              ">
              {{ content.labels.main }}
            </sofa-normal-text>
            <span :class="`h-[5px] w-[5px] rounded-full ${content.labels.color == 'pink'
              ? 'bg-primaryPurplePink'
              : 'bg-primaryPurple'
              }`">
            </span>
            <sofa-normal-text :color="content.labels.color == 'pink'
              ? 'text-primaryPurplePink'
              : 'text-primaryPurple'
              ">{{ content.labels.sub }}</sofa-normal-text>
          </div>

          <div class="w-full flex flex-row gap-2 items-center" v-if="!isMinimal">
            <div class="flex flex-row gap-1 items-center">
              <sofa-ratings :count="content.ratings.avg" :size="'h-[14px] mdlg:!h-[15px]'" />
              <sofa-normal-text>
                {{ content.ratings.avg }}
              </sofa-normal-text>
              <sofa-normal-text :color="'text-grayColor pl-2'">
                ({{ content.ratings.label }})
              </sofa-normal-text>
            </div>
          </div>

          <div class="w-full flex flex-row items-center gap-2 justify-between">
            <div class="flex flex-row items-center gap-2">
              <div class="gap-2 flex flex-row items-center" v-if="!isMinimal">
                <sofa-avatar :size="'20'" :photoUrl="content.user.photoUrl" :bgColor="'bg-grayColor'">
                  <sofa-icon :customClass="'h-[12px]'" :name="'user'" v-if="!content.user.photoUrl" />
                </sofa-avatar>
                <sofa-normal-text>
                  {{ content.user.name }}
                </sofa-normal-text>
              </div>

              <span :class="`h-[5px] w-[5px] rounded-full bg-bodyBlack`" v-if="!isMinimal">
              </span>

              <sofa-normal-text>
                {{ content.lastUpdated }}
              </sofa-normal-text>
            </div>

            <div class="md:!flex hidden flex-col" v-if="showBuyButton && type == 'course'">
              <sofa-button v-if="!itemIsPurchased" :padding="'px-6 py-1'" :customClass="`${content.status == 'published' ? '' : 'bg-opacity-50'
                }`" @click="
    buyAction && content.status == 'published'
      ? buyAction()
      : null
    ">
                {{
                  content.price > 0
                  ? `Buy ${Logic.Common.convertToMoney(
                    content.price,
                    false,
                    "ngn"
                  )}`
                  : "Start"
                }}
              </sofa-button>
              <sofa-button v-else :padding="'px-6 py-1'" :customClass="'w-auto'"
                @click="Logic.Common.GoToRoute('/course/' + content.id)">
                Go to course
              </sofa-button>
            </div>
            <div class="md:!flex hidden flex-col" v-if="type == 'quiz'">
              <sofa-button :padding="'px-6 py-1'" @click="
                itemIsPurchased
                  ? openQuiz()
                  : Logic.Common.GoToRoute(
                    `/marketplace/${content.id}?type=course`
                  )
                ">
                {{ itemIsPurchased ? "Start" : "Go to course" }}
              </sofa-button>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-row gap-3 items-center py-2 flex-nowrap overflow-x-auto scrollbar-hide">
        <div class="px-4 py-1 border-[1px] custom-border border-grayColor" v-for="(tag, index) in content.tags"
          :key="index">
          <sofa-normal-text :color="'text-grayColor'" :customClass="'!whitespace-nowrap'">{{ tag }}</sofa-normal-text>
        </div>
      </div>
    </div>

    <div :class="`w-full flex flex-row gap-4 items-center border-b-[1px] border-[#F1F6FA] mdlg:!relative sticky mdlg:!pr-5 pr-4 top-0 left-0 z-50 bg-white pt-3 mdlg:!pt-0  ${hasPadding ? 'px-4' : ''
      }`">
      <sofa-normal-text :color="selectedTab == tab.key ? 'text-bodyBlack' : 'text-grayColor'" :customClass="`!font-semibold cursor-pointer pb-2  ${selectedTab == tab.key && !isMinimal
        ? 'border-b-[2px] border-bodyBlack'
        : ''
        }`" v-for="(tab, index) in tabs" @click="selectedTab = tab.key" :key="index">
        {{ tab.name }}
      </sofa-normal-text>
    </div>

    <div :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''
      }  mdlg:!overflow-y-auto overflow-y-visible py-2 relative`" v-if="selectedTab == 'content'">
      <sofa-content :data="content.content" :itemIsPurchased="itemIsPurchased" />
    </div>

    <div :class="`w-full flex flex-col h-full  rounded-b-[16px]  ${hasPadding ? 'px-4' : ''
      }  mdlg:!overflow-y-auto overflow-y-auto py-2 relative`" v-if="selectedTab == 'questions'">
      <div class="w-full flex flex-col gap-3 h-full overflow-y-auto" v-if="itemIsPurchased">
        <div class="w-full bg-backgroundGray px-4 py-4 flex flex-col gap-2 custom-border"
          v-for="(question, index) in content.questions" :key="index">
          <div class="flex flex-row items-center gap-2">
            <sofa-normal-text :color="'text-grayColor'" :content="question.type" />

            <span class="w-[5px] h-[5px] rounded-full bg-grayColor" />

            <sofa-normal-text :color="'text-grayColor'" :content="question.duration" />
          </div>

          <sofa-normal-text :customClass="'text-left !font-bold'" :content="question.content" />

          <!-- <sofa-normal-text :customClass="'text-left'" :content="question.answer" /> -->
        </div>
      </div>

      <div class="w-full flex flex-col gap-3 pb-4" v-if="!itemIsPurchased">
        <sofa-empty-state :title="'You have no access'" :subTitle="'Purchase the course it is in to use'"
          :actionLabel="'Go to course'" :action="() => {
            Logic.Common.GoToRoute(
              `/marketplace/${content.courseId}?type=course`
            )
          }
            " :icon="{
    name: 'lock-white',
    size: 'h-[28px]',
  }" />
      </div>

      <div v-if="type == 'quiz'"
        class="w-full flex flex-row items-center justify-center mdlg:!pt-3 mdlg:!relative fixed bottom-0 mdlg:!pb-0 mdlg:hidden pt-4 pb-4 mdlg:!px-0 px-4 z-[50] bg-white left-0 mdlg:!bottom-auto mdlg:!left-auto">
        <div class="md:!w-auto w-full flex flex-col">
          <sofa-button :padding="'md:!py-1 py-3 px-4'" :customClass="'md:!w-auto w-full'" @click="
            itemIsPurchased
              ? openQuiz()
              : Logic.Common.GoToRoute(
                `/marketplace/${content.courseId}?type=course`
              )
            ">
            {{ itemIsPurchased ? "Start" : "Go to course" }}
          </sofa-button>
        </div>
      </div>
    </div>

    <div :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''
      } mdlg:!overflow-y-auto overflow-y-visible py-2 relative`" v-if="selectedTab == 'ratings'">
      <sofa-content-ratings :data="content.ratings" />
    </div>

    <div :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''
      } mdlg:!overflow-y-auto overflow-y-visible py-2 relative pb-4`" v-if="selectedTab == 'creator'">
      <div class="w-full bg-[#F1F6FA] custom-border px-4 py-4 flex flex-row gap-4 mdlg:!items-center items-start">
        <div>
          <sofa-avatar :photoUrl="content.user.photoUrl" :size="'150'" :customClass="'hidden mdlg:!inline-block'" />

          <sofa-avatar :photoUrl="content.user.photoUrl" :size="'100'" :customClass="'mdlg:!hidden '" />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex flex-row gap-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">{{
              content.user.name
            }}</sofa-normal-text>
            <sofa-icon :customClass="'h-[16px]'" :name="'verify'" />
          </div>

          <sofa-normal-text>
            {{ content.user.role }}
          </sofa-normal-text>

          <!-- <div class="w-full flex flex-row py-3 pb-4">
            <sofa-button :padding="'px-5 py-1'" :customClass="'!font-semibold'"
              >Follow</sofa-button
            >
          </div> -->

          <div class="w-full flex flex-row items-center gap-4 pt-3">
            <div class="flex flex-row gap-2 items-center">
              <sofa-icon :customClass="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-quiz'" />
              <div class="flex flex-col gap-1 items-start justify-start">
                <sofa-normal-text> Quizzes </sofa-normal-text>
                <sofa-normal-text :customClass="'!font-bold mdlg:!text-base'">
                  {{ content.user.stats.quizzes }}
                </sofa-normal-text>
              </div>
            </div>

            <div class="flex flex-row gap-2 items-center">
              <sofa-icon :customClass="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-course'" />
              <div class="flex flex-col gap-1 items-start justify-start">
                <sofa-normal-text> Courses </sofa-normal-text>
                <sofa-normal-text :customClass="'!font-bold mdlg:!text-base'">
                  {{ content.user.stats.courses }}
                </sofa-normal-text>
              </div>
            </div>

            <div class="flex flex-row gap-2 items-center">
              <sofa-icon :customClass="'h-[40px] hidden mdlg:!inline-block'" :name="'profile-followers'" />
              <div class="flex flex-col gap-1 items-start justify-start">
                <sofa-normal-text> Followers </sofa-normal-text>
                <sofa-normal-text :customClass="'!font-bold mdlg:!text-base'">
                  {{ content.user.stats.followers }}
                </sofa-normal-text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="w-full !h-[100px]"></div> -->
    </div>

    <div :class="`w-full flex flex-col rounded-b-[16px] ${hasPadding ? 'px-4' : ''
      } mdlg:!overflow-y-auto overflow-y-visible py-2 relative pb-4`"
      v-if="selectedTab == 'similar_courses' && type == 'course'">
      <div
        class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 flex-nowrap overflow-x-auto scrollbar-hide"
        v-if="similarContents?.length">
        <div
          class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!gap-4 flex flex-row gap-3 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
          <sofa-activity-card v-for="(activity, index) in similarContents" :key="index" :activity="activity"
            :customClass="'!bg-[#F1F6FA] cursor-pointer'"
            @click="Logic.Common.GoToRoute(`/marketplace/${activity.id}`)" />
        </div>
      </div>
      <template v-else>
        <div class="w-full flex flex-col gap-3">
          <sofa-empty-state :title="'No similar course found'"
            :subTitle="'Discover thousands of materials to buy, created by verified experts'" :actionLabel="'Marketplace'"
            :action="() => {
              Logic.Common.GoToRoute('/marketplace')
            }
              " />
        </div>
      </template>

      <!-- <div class="w-full !h-[100px]"></div> -->
    </div>

    <div v-if="false"
      class="w-full px-4 py-4 mdlg:!rounded-b-[16px] mdlg:!absolute fixed bottom-0 left-0 bg-white flex mdlg:!flex-row flex-col items-center justify-between z-50">
      <sofa-button :bgColor="'bg-white'" :textColor="'text-grayColor'" :padding="'px-5 py-2'"
        :customClass="'border-[1px] border-gray-200 mdlg:!inline-block hidden'" @click="close()">
        Exit
      </sofa-button>

      <sofa-button :padding="'px-5 py-2'" :customClass="'mdlg:!inline-block hidden '">
        Start
      </sofa-button>

      <div class="w-full mdlg:!hidden">
        <sofa-button :padding="'px-5 py-2'" :customClass="'mdlg:!hidden !w-full'">
          Start
        </sofa-button>
      </div>
    </div>
  </div>

  <!-- Smaller screen purchase buttons -->
  <div class="md:!hidden flex flex-col w-full fixed left-0 bottom-0 bg-white px-4 py-4"
    v-if="showBuyButton && type == 'course'">
    <sofa-button :padding="'px-6 py-3'" v-if="!itemIsPurchased" :customClass="`${content.status == 'published' ? '' : 'bg-opacity-50'
      } w-full`" @click="buyAction && content.status == 'published' ? buyAction() : null">
      {{
        content.price > 0
        ? `Buy ${Logic.Common.convertToMoney(content.price, false, "ngn")}`
        : "Start"
      }}
    </sofa-button>
    <sofa-button v-else :padding="'px-6 py-3'" :customClass="'w-full'"
      @click="Logic.Common.GoToRoute('/course/' + content.id)">
      Go to course
    </sofa-button>
  </div>
</template>
<script lang="ts">
import { Logic } from "sofa-logic"
import { defineComponent, onMounted, ref, toRef, watch } from "vue"
import SofaActivityCard from "../SofaActivityCard"
import SofaAvatar from "../SofaAvatar"
import SofaBadge from "../SofaBadge"
import SofaButton from "../SofaButton"
import SofaContent from "../SofaContent"
import SofaContentRatings from "../SofaContentRatings"
import SofaEmptyState from "../SofaEmptyState"
import SofaIcon from "../SofaIcon"
import SofaIconCard from "../SofaIconCard"
import SofaImageLoader from "../SofaImageLoader"
import SofaModal from "../SofaModal"
import SofaRatings from "../SofaRatings"
import { SofaHeaderText, SofaNormalText } from "../SofaTypography"

export default defineComponent({
  components: {
    SofaIcon,
    SofaImageLoader,
    SofaNormalText,
    SofaBadge,
    SofaButton,
    SofaHeaderText,
    SofaRatings,
    SofaAvatar,
    SofaContent,
    SofaContentRatings,
    SofaActivityCard,
    SofaModal,
    SofaIconCard,
    SofaEmptyState,
  },
  props: {
    customClass: {
      type: String,
      default: "",
    },
    content: {
      type: Object as () => any,
    },
    close: {
      type: Function,
      required: false,
    },
    padding: {
      type: String,
      default: "px-3 pt-3 mdlg:!px-4 mdlg:!pt-4",
    },
    hasPadding: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "course",
    },
    contentId: {
      type: String,
      default: "",
    },
    showBuyButton: {
      type: Boolean,
      default: false,
    },
    buyAction: {
      type: Function,
    },
    itemIsPurchased: {
      type: Boolean,
      default: false,
    },
    isMinimal: {
      type: Boolean,
      default: false,
    },
    similarContents: {
      type: Array as () => any[],
    },
    otherTasks: {
      type: Array as () => any[],
      required: false,
      default: []
    },
    actions: {
      type: Object as () => {
        report: Function
        share: Function
        save: Function
      },
    },
    openQuiz: {
      type: Function,
    },
  },
  name: "SofaContentDetails",
  setup (props) {
    const selectedTab = ref("content")

    const tabs = ref([])

    const typeRef = toRef(props, "type")

    const setContent = () => {
      tabs.value.length = 0

      if (props.type == "quiz") {
        tabs.value.push({
          name: "Questions",
          key: "questions",
        })

        selectedTab.value = "questions"
      } else {
        tabs.value.push({
          name: "Content",
          key: "content",
        })

        selectedTab.value = "content"
      }

      if (!props.isMinimal) {
        tabs.value.push(
          {
            name: "Ratings",
            key: "ratings",
          }
          // {
          //   name: "Creator",
          //   key: "creator",
          // }
        )
      }

      if (props.type == "course") {
        tabs.value.push({
          name: "Similar courses",
          key: "similar_courses",
        })
      }
    }

    watch(typeRef, () => {
      setContent()
    })

    onMounted(() => {
      setContent()
    })

    return {
      Logic,
      selectedTab,
      tabs,
    }
  },
})
</script>
