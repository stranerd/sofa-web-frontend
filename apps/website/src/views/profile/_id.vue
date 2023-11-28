<template>
  <expanded-layout :hasBottomBar="false">
    <div
      class="w-full flex mdlg:!hidden flex-row items-center z-[100] gap-3 justify-between bg-white py-4 px-4 sticky top-0 left-0">
      <sofa-icon :customClass="'h-[15px]'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        {{ singleUser.bio.name.full }}</sofa-normal-text>
      <div>
        <sofa-icon :customClass="'h-[15px] invisible'" :name="'back-arrow'" />
      </div>
    </div>

    <div class="w-full flex flex-col bg-primaryPurple mdlg:!shadow-custom mdlg:rounded-[16px]">
      <div class="w-full flex flex-col h-[140px]"></div>

      <div class="w-full flex flex-col mdlg:px-5 px-4 pt-3 gap-6 bg-white mdlg:!rounded-b-[16px]">
        <div class="w-full flex mdlg:flex-row flex-col justify-between items-start mdlg:gap-0 gap-4">
          <div class="flex flex-row gap-3 items-start">
            <div class="flex flex-row items-start gap-3">
              <sofa-avatar :photoUrl="singleUser.bio.photo?.link || ''" :size="'110'" :customClass="' -mt-[60%]'" />
            </div>

            <div class="flex flex-col">
              <div class="flex flex-row items-center gap-2">
                <sofa-header-text :customClass="'!font-bold'">
                  {{ singleUser.bio.name.full }}
                </sofa-header-text>
                <sofa-icon :name="'verify'" :customClass="'h-[16px]'" v-if="singleUser.roles.isVerified" />
                <sofa-icon :name="'tutor-bagde'" :customClass="'h-[18px]'" v-if="singleUser.type?.type == 'teacher'" />
              </div>
              <div class="flex flex-row gap-3 items-center">
                <sofa-normal-text>
                  {{ capitalize(singleUser.type?.type || "student") }}
                </sofa-normal-text>
                <!-- <span class="h-[5px] w-[5px] rounded-full bg-[#141618]"> </span>
                <sofa-normal-text> Tutor </sofa-normal-text> -->
              </div>
            </div>
          </div>

          <div
            class="flex mdlg:flex-row flex-col mdlg:gap-4 mdlg:justify-end items-start gap-3 mdlg:items-center md:!w-auto w-full">
            <div class="flex flex-row items-center mdlg:gap-4 gap-16 justify-start mdlg:justify-start md:!w-auto w-full">
              <template v-for="(item, index) in profileAttributes" :key="index">
                <div class="flex mdlg:flex-row mdlg:gap-2 flex-col gap-1 items-center" v-if="item.show">
                  <sofa-icon :name="item.icon" :customClass="item.iconSize" />
                  <div class="flex flex-col gap-1 items-start">
                    <sofa-normal-text>
                      {{ item.title }}
                    </sofa-normal-text>
                    <sofa-header-text :customClass="'!font-bold'">
                      {{ item.value }}
                    </sofa-header-text>
                  </div>
                </div>
              </template>
            </div>

            <sofa-button :padding="'px-6 py-2'" v-if="singleUser.type?.type == 'organization'" @click="
              singleUser.type?.type == 'organization'
                ? showJoinOrganization()
                : null
              ">
              {{ singleUser.type?.type == "organization" ? "Join" : "Follow" }}
            </sofa-button>
          </div>
        </div>

        <div class="w-full flex flex-row gap-6 items-center">
          <template v-for="(item, index) in tabItems" :key="index">
            <sofa-normal-text :customClass="`!font-semibold pb-2 !relative cursor-pointer`" :color="selectedTab == item.id ? 'text-primaryPurple' : 'text-[#141618]'
              " @click="selectedTab = item.id" v-if="item.show">
              {{ item.name }}
              <div v-if="selectedTab == item.id"
                class="w-full h-[3px] bg-primaryPurple absolute bottom-0 left-0 rounded-t-[3px]"></div>
            </sofa-normal-text>
          </template>
        </div>
      </div>
    </div>

    <!-- Content sections -->
    <template v-if="selectedTab == 'content'">
      <div class="w-full flex flex-col gap-3">
        <!-- Search -->

        <div class="w-full flex flex-col mdlg:px-0 px-4 pt-4" v-if="userHasResources">
          <div class="w-full px-4 py-1 bg-white custom-border flex flex-row gap-1 items-center justify-start">
            <div class="w-full flex flex-row items-center gap-1">
              <div class="pl-2">
                <sofa-icon :name="'search-black'" :custom-class="'h-[17px]'" />
              </div>
              <sofa-text-field :customClass="'!border-none w-full flex-grow'" :placeholder="'Search'"
                v-model="searchQuery" :defaultValue="searchQuery" @onEnter="handleSearch">
              </sofa-text-field>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col mdlg:!gap-4 gap-3 mdlg:!pl-0 pl-4 z-40">
          <div :class="`w-full flex flex-row items-center justify-between mdlg:pr-0 pr-4 mdlg:pt-0 ${userHasResources ? '' : 'pt-4'
            }`">
            <sofa-normal-text :customClass="'!font-bold'">
              Resources
            </sofa-normal-text>

            <sofa-normal-text :color="'text-primaryPink'" :custom-class="'cursor-pointer'" @click="
              Logic.Common.GoToRoute(
                `/marketplace/search?userId=${singleUser.id}&userName=${singleUser.bio.name.full}`
              )
              ">
              View all
            </sofa-normal-text>
          </div>

          <div v-if="userMaterials.length" class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide">
            <div
              class="mdlg:!w-full mdlg:!grid mdlg:!grid-cols-5 mdlg:!gap-4 mdlg:!px-0 flex flex-row gap-3 py-0 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4">
              <sofa-item-card :content="content"
                custom-class="!col-span-1 mdlg:!w-auto w-[220px] !border-none !shadow-itemBox bg-white rounded-[16px] cursor-pointer"
                v-for="(content, index) in userMaterials" :key="index" @click="
                  Logic.Common.GoToRoute(
                    '/marketplace/' +
                    content.id +
                    `?type=${content.labels.main.toLowerCase()}`
                  )
                  "></sofa-item-card>
            </div>
          </div>

          <template v-else>
            <div class="w-full flex flex-col gap-3 pr-4 mdlg:pr-0">
              <sofa-empty-state :title="`${singleUser.bio.name.full} has no published materials yet`"
                :subTitle="'Discover thousands of other materials on SOFA marketplace and save them here for easy access'"
                :actionLabel="'Marketplace'" :action="() => {
                  Logic.Common.GoToRoute('/marketplace')
                }
                  " />
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- About sections -->

    <!-- For student/teacher -->
    <template v-if="selectedTab == 'about'">
      <div class="w-full flex flex-col gap-4 mdlg:px-0 mdlg:py-0 py-5 px-4">
        <div class="w-full flex shadow-custom px-6 py-6 rounded-[16px] bg-white flex-col gap-2">
          <sofa-normal-text :customClass="'!font-bold'"> Bio </sofa-normal-text>
          <sofa-normal-text :custom-class="'!text-left'">
            {{ singleUser.bio.description }}
          </sofa-normal-text>
        </div>

        <div class="w-full flex shadow-custom px-6 py-6 rounded-[16px] bg-white flex-col gap-2">
          <sofa-normal-text :customClass="'!font-bold'">
            Links
          </sofa-normal-text>
          <div class="w-full flex flex-row gap-5 items-center">
            <template v-if="!hasAtleastASocialLink">
              <sofa-normal-text :color="'text-grayColor'">
                No social links
              </sofa-normal-text>
            </template>
            <template v-else>
              <template v-for="(item, index) in profileLinks" :key="index">
                <a :href="item.link" target="_blank" :class="`${item.show ? '' : 'opacity-40'}`" v-if="item.show">
                  <sofa-icon :name="item.icon" :customClass="`${item.iconSize} cursor-pointer `" />
                </a>
              </template>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Ratings section -->
    <template v-if="selectedTab == 'ratings'">
      <div class="w-full flex flex-col mdlg:px-0 px-4 mdlg:py-0 py-5">
        <sofa-content-ratings :data="userRatings" :hasWhiteBox="true" />
      </div>
    </template>

    <sofa-modal v-if="showModal" :close="() => {
      showModal = false
    }
      ">
      <div class="mdlg:!w-[40%] lg:!w-[35%] mdlg:!h-full w-full h-auto md:w-full flex flex-col items-center relative"
        @click.stop="() => {
          //
        }
          ">
        <div
          class="bg-white w-full flex flex-col lg:!px-6 md:!gap-5 gap-3 py-0 relative lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-0 md:!px-0 mdlg:!rounded-[16px] rounded-t-[16px] items-center justify-center">
          <div class="w-full hidden flex-col gap-3 justify-center items-center mdlg:!flex">
            <sofa-header-text :customClass="'text-xl'">
              {{ modalSetup.title }}
            </sofa-header-text>
          </div>

          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 mdlg:!hidden py-2 border-[#F1F6FA] border-b-[1px] px-4">
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              {{ modalSetup.title }}
            </sofa-normal-text>
            <sofa-icon :customClass="'h-[19px]'" :name="'circle-close'" @click="showModal = false" />
          </div>

          <div class="w-full flex flex-col gap-5 mdlg:!px-0 px-4">
            <sofa-text-field v-if="modalSetup.type == 'join_organization'"
              :custom-class="'custom-border !bg-lightGrayVaraint !placeholder:text-grayColor '" :padding="'px-3 py-3'"
              type="text" :name="'Join code'" ref="join_code" :placeholder="'Enter Join Code'"
              :borderColor="'border-transparent'" :rules="[Logic.Form.RequiredRule]" v-model="joinCode">
            </sofa-text-field>
          </div>

          <div
            class="w-full md:flex flex-row justify-between items-center grid grid-cols-2 md:gap-0 gap-3 mdlg:!px-0 px-4 mdlg:!py-0 py-4">
            <div class="md:!w-auto col-span-1 md:!flex flex-col hidden">
              <sofa-button :textColor="'text-grayColor'" :bgColor="'bg-white'" :padding="'px-4 py-1'"
                :customClass="`border-[2px] border-gray-100 md:!min-w-[100px] md:!w-auto w-full`"
                @click="showModal = false">
                Cancel
              </sofa-button>
            </div>

            <div class="md:!w-auto col-span-2 flex flex-col">
              <sofa-button :textColor="'text-white'" :bgColor="'bg-primaryBlue'" :padding="'px-4 md:!py-1 py-3'"
                :customClass="`border-[2px] border-transparent md:!min-w-[100px] md:!w-auto w-full`"
                @click="modalSetup.action()">
                Continue
              </sofa-button>
            </div>
          </div>
        </div>
      </div>
    </sofa-modal>
  </expanded-layout>
</template>

<script lang="ts">
import { scrollToTop } from "@/composables"
import { createCourseData, createQuizData } from "@/composables/library"
import { profileLinks } from "@/composables/profile"
import { Conditions, Logic, QueryParams } from "sofa-logic"
import {
  SofaAvatar,
  SofaButton,
  SofaContentRatings,
  SofaEmptyState,
  SofaHeaderText,
  SofaIcon,
  SofaItemCard,
  SofaModal,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components"
import {
  capitalize,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue"
import { useMeta } from "vue-meta"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaIcon,
    SofaHeaderText,
    SofaButton,
    SofaAvatar,
    SofaTextField,
    SofaItemCard,
    SofaContentRatings,
    SofaEmptyState,
    SofaModal,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "SingleUser",
        method: "GetUser",
        params: [],
        useRouteId: true,
        ignoreProperty: true,
      },
    ],
  },
  name: "PublicProfilePage",
  setup () {
    useMeta({
      title: "Public Profile",
    })

    const userHasResources = ref(false)

    const showModal = ref(false)
    const modalSetup = reactive({
      title: "",
      type: "",
      action: () => {
        //
      },
    })
    const joinCode = ref("")
    const singleUser = ref(Logic.Users.SingleUser)
    const allCourses = ref(Logic.Study.AllCourses)
    const allQuizzes = ref(Logic.Study.AllQuzzies)
    const userMaterials = ref<any[]>([])

    const hasAtleastASocialLink = ref(false)

    const selectedTab = ref("content")

    const searchQuery = ref("")

    const tabItems = [
      {
        id: "content",
        name: "Content",
        show: true,
      },
      {
        id: "about",
        name: "About",
        show: true,
      },
      {
        id: "ratings",
        name: "Ratings",
        show: true,
      },
    ]

    const profileAttributes = reactive([
      {
        title: "Quizzes",
        icon: "profile-quiz",
        iconSize: "h-[40px]",
        value: "34",
        show: true,
      },
      {
        title: "Courses",
        icon: "profile-course",
        iconSize: "h-[40px]",
        value: "18",
        show: true,
      },
      {
        title: "Sessions",
        icon: "profile-sessions",
        iconSize: "h-[40px]",
        value: "14",
        show: true,
      },
      {
        title: "Followers",
        icon: "profile-followers",
        iconSize: "h-[40px]",
        value: "1.1k",
        show: false,
      },
    ])

    const handleSearch = () => {
      //
    }

    const userRatings = {
      total: 4,
      label: "24 ratings",
      totalCount: 24,
      stats: {
        "5": 3,
        "4": 21,
        "3": 0,
        "2": 0,
        "1": 0,
      },
      reviews: [
        {
          user: {
            name: "Blessing J.",
            photoUrl: "/images/desdemona.png",
          },
          rating: 4,
          review:
            "This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing",
        },
        {
          user: {
            name: "Blessing J.",
            photoUrl: "/images/desdemona.png",
          },
          rating: 4,
          review:
            "This is truly amazing. Help me understand how I should approach o’chem. Thank you for sharing",
        },
      ],
    }

    const setMaterials = () => {
      userMaterials.value.length = 0
      allCourses.value?.results?.forEach((course) => {
        userMaterials.value.push(createCourseData(course))
      })
      allQuizzes.value?.results?.forEach((quiz) => {
        userMaterials.value.push(createQuizData(quiz))
      })

      if (
        allCourses.value?.results.length ||
        allQuizzes.value?.results.length
      ) {
        userHasResources.value = true
      }
    }

    const fetchMaterials = () => {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })

      const query: QueryParams = {
        ...(searchQuery.value ? {
          search: {
            value: searchQuery.value,
            fields: ["title"],
          },
        } : {}),
        where: [
          {
            field: "user.id",
            value: singleUser.value.id,
            condition: Conditions.eq,
          },
          {
            field: "status",
            value: "published",
            condition: Conditions.eq,
          },
        ],
        limit: 20,
        sort: [
          {
            field: "createdAt",
            desc: true,
          },
        ],
      }

      const allRequests: Promise<any>[] = []

      // course search request
      allRequests.push(
        Logic.Study.GetCourses(query).catch()
      )

      // quiz search request
      allRequests.push(
        Logic.Study.GetQuizzes({
          ...query,
          where: [...query.where, {
            field: "courseId",
            value: null,
            condition: Conditions.eq,
          }]
        }).catch()
      )

      Promise.all(allRequests)
        .then(() => {
          Logic.Common.hideLoader()
        })
        .catch((error) => {
          console.log(error)
        })
    }

    watch([allCourses, allQuizzes], () => {
      setMaterials()
    })

    watch(searchQuery, () => {
      fetchMaterials()
    })

    watch(singleUser, () => {
      if (singleUser.value) setProfileData()
    })

    const setProfileData = () => {
      profileAttributes[0].value = singleUser.value.account.meta.publishedQuizzes.toString()
      profileAttributes[1].value = singleUser.value.account.meta.publishedCourses.toString()
      profileAttributes[2].show = false

      if (singleUser.value?.type?.type == "organization") {
        profileAttributes[3].title = "Students"
        profileAttributes[3].value = singleUser.value.account.meta.students.toString()
      } else {
        profileAttributes[3].value = singleUser.value.account.meta.connects.toString()
      }

      tabItems[2].show = false


      // social media link
      singleUser.value.socials.forEach((item) => {
        const profileLink = profileLinks.find((profileitem) => {
          return item.ref == profileitem.ref
        })

        if (profileLink) {
          profileLink.show = item.link ? true : false
          profileLink.link = item.link
          if (item.link) hasAtleastASocialLink.value = true
        }
      })
    }

    const showJoinOrganization = () => {
      modalSetup.title = `Join ${singleUser.value.bio.name.full}`
      modalSetup.type = "join_organization"
      modalSetup.action = () => {
        if (joinCode.value) {
          Logic.Users.RequestToJoinOrganization(
            singleUser.value.id,
            joinCode.value
          ).then((data) => {
            if (data) {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: "Your join request has been sent.",
                type: "success",
              })
              showModal.value = false
            } else {
              Logic.Common.showLoader({
                show: true,
                loading: false,
                message: "Unable to send join request. Invalid join code",
                type: "error",
              })
            }
          })
        }
      }
      showModal.value = true
    }

    onMounted(() => {
      Logic.Study.watchProperty("AllCourses", allCourses)
      Logic.Study.watchProperty("AllQuzzies", allQuizzes)
      Logic.Users.watchProperty("SingleUser", singleUser)
      if (
        allCourses.value?.results.length ||
        allQuizzes.value?.results.length
      ) {
        userHasResources.value = true
      }
      if (singleUser.value) {
        setProfileData()
        fetchMaterials()
        scrollToTop()
      }
    })

    return {
      tabItems,
      Logic,
      selectedTab,
      profileAttributes,
      profileLinks,
      searchQuery,
      userRatings,
      singleUser,
      allCourses,
      userMaterials,
      showModal,
      modalSetup,
      joinCode,
      hasAtleastASocialLink,
      userHasResources,
      handleSearch,
      capitalize,
      showJoinOrganization,
    }
  },
})
</script>
