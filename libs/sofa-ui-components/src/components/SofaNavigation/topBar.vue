<template>
  <div
    :class="` flex-row items-center w-full lg:text-sm mdlg:text-[12px] text-xs  z-[8999] gap-2 px-3 mdlg:px-4 sticky  top-0 mdlg:!bg-white  lg:!bg-white bg-backgroundGray justify-between mdlg:!shadow-custom lg:!shadow-custom ${customClass}`">
    <template v-if="type == 'main'">
      <div class="mdlg:!hidden lg:!hidden flex flex-row items-center justify-between w-full">
        <sofa-avatar :size="'32'" :bgColor="'bg-grayColor'" :photoUrl="UserProfile?.bio?.photo ? UserProfile?.bio?.photo.link : ''
          " @click="Logic.Common.GoToRoute('/settings')">
          <sofa-icon :customClass="'h-[23px]'" :name="'user'" />
        </sofa-avatar>

        <div class="py-4 cursor-pointer flex flex-row items-center justify-center">
          <img src="/images/logo.svg" class="h-[24px]" v-if="!title" />
          <sofa-normal-text :customClass="'!font-bold !text-base'">{{
            title
          }}</sofa-normal-text>
        </div>

        <div class="w-[30px] h-[30px] flex flex-row items-center justify-center" @click="showNotification = true">
          <sofa-icon :customClass="'h-[22px]'" :name="'bell'" />
        </div>
      </div>
      <div class="hidden flex-row gap-ems-center justify-start flex-grow mdlg:!flex lg:!flex">
        <div class="py-4 pr-3 cursor-pointer" @click="Logic.Common.GoToRoute('/')">
          <img src="/images/logo.svg" class="h-[26px]" />
        </div>

        <div :class="`py-4 flex flex-row items-center justify-center gap-rsor-pointer ${tabIsActive(tab.routeTag)
          ? 'border-b-[2px] border-primaryPurple'
          : ''
          }`" @click="Logic.Common.GoToRoute(tab.path)" v-for="(tab, index) in tabs" :key="index">
          <sofa-icon :customClass="tab.icon_size" :name="tabIsActive(tab.routeTag) ? `${tab.icon}-active` : tab.icon" />
          <sofa-normal-text :customClass="'font-bold'" :color="tabIsActive(tab.routeTag) ? 'text-primaryPurple' : 'text-darkBody'
            ">
            {{ tab.name }}
          </sofa-normal-text>
        </div>

        <div class="bg-ligthGray w-[30%] py-2 rounded-[24px] flex flex-row items-center gap--4">
          <sofa-icon :customClass="'h-[15px]'" :name="'search'"></sofa-icon>
          <sofa-text-field customClass="bg-transparent text-bodyBlack placeholder-[#78828C] w-full focus:outline-none"
            placeholder="Search " :padding="'px-1 py-0'" v-model="searchQuery" @onEnter="initiateSearch" />
        </div>
      </div>

      <div class="hidden mdlg:!flex lg:!flex flex-row items-center gap-
        <sofa-button :padding="'px-4 py-1'" @click=" showAddItem()">Create</sofa-button>
        <div class="flex flex-col relative" tabindex="10" @blur="showNotification = false">
          <div
            class="w-[36px] h-[36px] flex flex-row items-center justify-center border-[1px] border-[#E1E6EB] rounded-full cursor-pointer"
            @click="showNotification = true">
            <sofa-icon :customClass="'h-[16px]'" :name="'bell'" />
          </div>
          <div v-if="showNotification"
            class="w-[400px] min-h-[250px] max-h-[400px] bg-white shadow-custom custom-border pb-3 px-4 absolute top-[140%] right-0 z-[99999999] hidden mdlg:flex flex-col">
            <notification :close="() => {
              showNotification = false
            }
              " />
          </div>
        </div>

        <sofa-avatar :size="'36'" :bgColor="'bg-grayColor'" :photoUrl="UserProfile?.bio?.photo ? UserProfile?.bio?.photo.link : ''
          " :customClass="'!cursor-pointer'" @click="Logic.Common.GoToRoute('/settings')">
          <sofa-icon :customClass="'h-[23px]'" :name="'user'" />
        </sofa-avatar>
      </div>
    </template>

    <template v-if="type == 'subpage'">
      <div class="flex flex-row gap-ems-center">
        <sofa-icon :customClass="'h-[12px] cursor-pointer'" :name="'back-arrow'" @click="Logic.Common.goBack()" />
        <sofa-header-text :customClass="'!font-bold py-4'" :content="title" />
        <div class="flex flex-row gap-ems-center" v-if="badges.length">
          <sofa-badge :color="item.color" v-for="(item, index) in badges" :key="index">
            {{ item.text }}
          </sofa-badge>
        </div>
      </div>

      <div class="md:!flex hidden flex-row items-center gap-
        <template v-for=" (action, index) in subpageActions" :key="index">
        <template v-if="action.isIcon">
          <div class="flex flex-row gap-rder-r-[1px] border-[#E1E6EB] items-center pr-3 cursor-pointer">
            <div class="flex flex-row gap-ems-center" v-for="(icon, index) in action.data" :key="index"
              @click="icon.handler()">
              <sofa-icon :name="icon.icon" :customClass="icon.size" />

              <sofa-normal-text>
                {{ icon.name }}
              </sofa-normal-text>
            </div>
          </div>
        </template>
        <template v-else>
          <sofa-button v-if="!action.IsOutlined" :padding="'px-4 py-1'" :customClass="'!font-semibold'"
            @click="action.handler()">{{ action.name }}</sofa-button>
          <sofa-button :bgColor="'bg-white'" :textColor="'text-grayColor'"
            :custom-class="'!font-semibold !border-[2px]!border-grayColor border-[1px] border-gray-200'"
            @click="action.handler()" v-else :padding="'px-4 py-1'">{{ action.name }}</sofa-button>
        </template>
    </template>
  </div>
</template>

<!-- Notification modal -->
<sofa-modal v-if="showNotification" :close="
        () => {
          showNotification = false;
        }
      " :custom-class="'mdlg:!hidden'">
  <div
    class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full w-full h-auto max-h-[80%] md:w-[70%] flex flex-col items-center relative"
    @click.stop="
          () => {
            //
          }
        ">
    <div
      class="bg-white w-full flex flex-col lg:!px-6 md:!gap-4 gap-3 px-4 pb-5 md:!rounded-[16px] rounded-t-[16px] items-center justify-center">
      <notification :close="
              () => {
                showNotification = false;
              }
            " />
    </div>
  </div>
</sofa-modal>
</div></template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"
import { Logic } from "../../composable"
import { Conditions } from "../../types/domains/common"
import { SingleUser } from "../../types/domains/users"
import SofaAvatar from "../SofaAvatar"
import SofaBadge from "../SofaBadge"
import SofaButton from "../SofaButton"
import { SofaTextField } from "../SofaForm"
import SofaIcon from "../SofaIcon/index.vue"
import SofaModal from "../SofaModal"
import { SofaHeaderText } from "../SofaTypography"
import SofaNormalText from "../SofaTypography/normalText.vue"
import notification from "./notification.vue"

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaAvatar,
    SofaButton,
    SofaHeaderText,
    SofaModal,
    notification,
    SofaTextField,
    SofaBadge,
  },
  props: {
    goBack: {
      type: Function,
      required: true,
    },
    goToRoute: {
      type: Function,
      required: true,
    },
    tabIsActive: {
      type: Function,
      required: true,
    },
    subpageActions: {
      type: Array as () => any[],
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    tabs: {
      type: Array as () => any[],
      default: [],
    },
    type: {
      type: String,
      default: "main",
    },
    customClass: {
      type: String,
      default: "flex",
    },
    showAddItem: {
      type: Function,
      required: true,
    },
    badges: {
      type: Array as () => {
        text: string
        color: string
      }[],
      default: [],
    },
  },
  name: "SofaTopBar",
  setup (props, ctx) {
    const UserProfile = ref<SingleUser>(Logic.Users.UserProfile)

    const showNotification = ref(false)

    const searchQuery = ref("")

    onMounted(() => {
      Logic.Users.watchProperty("UserProfile", UserProfile)

      // get user notifications
      Logic.Notifications.GetNotifications({
        where: [
          {
            field: "userId",
            condition: Conditions.eq,
            value: Logic.Auth.AuthUser?.id,
          },
        ],
      })
    })

    const initiateSearch = () => {
      if (searchQuery.value.length > 1) {
        Logic.Common.GoToRoute(`/marketplace/search?q=` + searchQuery.value)
      }
    }
    return {
      Logic,
      UserProfile,
      showNotification,
      searchQuery,
      initiateSearch,
    }
  },
})
</script>
