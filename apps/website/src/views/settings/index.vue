<template>
  <expanded-layout
    :hasBottomBar="false"
    layoutStyle="mdlg:!w-[75%] lg:!w-[60%] w-full pt-0  mdlg:!pt-0 lg:!pt-0"
  >
    <div
      class="w-full flex mdlg:!hidden flex-row items-center space-x-3 z-50 justify-between bg-backgroundGray py-4 px-4 sticky top-0 left-0"
    >
      <sofa-icon
        :customClass="'h-[15px]'"
        :name="'back-arrow'"
        @click="Logic.Common.goBack()"
      />
      <sofa-normal-text :customClass="'!font-bold !text-base'">
        Settings</sofa-normal-text
      >
      <div class="invisible">Hello</div>
    </div>
    <div class="w-full grid grid-cols-12 gap-5">
      <div
        class="mdlg:!col-span-3 mdlg:!flex col-span-full flex-col relative mdlg:!px-0 px-4"
      >
        <div
          class="w-full bg-white rounded-[16px] sticky lg:!top-[8%] mdlg:!top-[10%] py-4 px-4 shadow-custom mdlg:!flex hidden flex-col space-y-4"
        >
          <div
            class="w-full flex-col space-y-2 items-start"
            v-for="(option, index) in settingOptions"
            :key="index"
          >
            <sofa-header-text :size="'xl'" :customClass="'text-left px-2'" :content="option.title" />

            <div class="w-full flex flex-col items-start space-y-1">
              <template
                v-for="(optionItem, index) in option.subPages"
                :key="index"
              >
                <div
                  :class="`w-full flex flex-col items-start py-2 px-2 cursor-pointer rounded-[8px] hover:bg-[#E2F3FD] ${
                    selectedItem == optionItem.id ? 'bg-[#E2F3FD]' : ''
                  }`"
                  @click="showItem(optionItem.id)"
                  v-if="optionItem.show"
                >
                  <sofa-normal-text
                    :customClass="`${
                      selectedItem == optionItem.id ? 'font-semibold' : ''
                    }`"
                  >
                    {{ optionItem.title }}
                  </sofa-normal-text>
                </div>
              </template>
            </div>
          </div>
          <div>
            <div
              @click="showLogout = true"
              class="w-full flex flex-col items-start py-2 px-2 cursor-pointer rounded-[8px] hover:bg-[#E2F3FD]"
            >
              <sofa-normal-text :color="'text-primaryRed'">
                Logout
              </sofa-normal-text>
            </div>

            <div
              @click="showDeleteAccount = true"
              class="w-full flex flex-col items-start py-2 px-2 cursor-pointer rounded-[8px] hover:bg-[#E2F3FD]"
            >
              <sofa-normal-text :color="'text-primaryRed'">
                Delete account
              </sofa-normal-text>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col space-y-3 mdlg:!hidden">
          <div
            class="w-full flex-col space-y-2 items-start bg-white px-2 py-2 custom-border shadow-custom"
            v-for="(option, index) in settingOptions"
            :key="index"
          >
            <div class="w-full flex flex-col items-start space-y-1">
              <template
                v-for="(optionItem, index) in option.subPages"
                :key="index"
              >
                <div
                  :class="`w-full flex flex-col items-start py-2 px-2 cursor-pointer rounded-[8px] ${
                    index != option.subPages.length - 1
                      ? 'border-b-[1px]  border-[#F1F6FA] rounded-none'
                      : ''
                  }`"
                  @click="showItem(optionItem.id)"
                  v-if="optionItem.show"
                >
                  <sofa-normal-text
                    :customClass="`${
                      selectedItem == optionItem.id ? 'font-semibold' : ''
                    }`"
                  >
                    {{ optionItem.title }}
                  </sofa-normal-text>
                </div>
              </template>
            </div>
          </div>

          <div class="w-full"></div>

          <div
            class="w-full !border-t-[2px] border-[#E1E6EB] pt-4 flex flex-col space-y-3"
          >
            <div
              @click="showLogout = true"
              class="w-full flex-col space-y-2 items-start bg-white px-4 py-4 custom-border shadow-custom"
            >
              <sofa-normal-text :color="'text-primaryRed'">
                Logout
              </sofa-normal-text>
            </div>
            <div
              @click="showDeleteAccount = true"
              class="w-full flex-col space-y-2 items-start bg-white px-4 py-4 custom-border shadow-custom"
            >
              <sofa-normal-text :color="'text-primaryRed'">
                Delete account
              </sofa-normal-text>
            </div>
          </div>
        </div>
      </div>
      <div class="mdlg:!col-span-9 hidden mdlg:!flex flex-col">
        <setting-profile v-if="selectedItem == 'profile'" />
        <setting-wallet v-if="selectedItem == 'wallet'" />
        <setting-subscription v-if="selectedItem == 'subscription'" />

        <template v-if="selectedItem == 'notifications'">
          <div
            class="w-full flex flex-row justify-between items-center space-x-4 bg-white rounded-[16px] px-4 py-4 shadow-custom"
          >
            <sofa-normal-text :customClass="'!font-bold'"
              >Push notifications</sofa-normal-text
            >
            <div
              class="!w-auto cursor-pointer"
              @click="
                notificationIsOn
                  ? (notificationIsOn = false)
                  : (notificationIsOn = true)
              "
            >
              <sofa-icon
                :customClass="'h-[22px]'"
                :name="notificationIsOn ? 'toggle-on' : 'toggle-off'"
              />
            </div>
          </div>
        </template>

        <template v-if="selectedItem == 'security'">
          <setting-security />
        </template>

        <setting-contact v-if="selectedItem == 'contact_us'" />

        <setting-students v-if="selectedItem == 'students'" />

        <setting-organizations v-if="selectedItem == 'organizations'" />
      </div>
    </div>

    <sofa-delete-prompt
      v-if="showLogout"
      :title="'Are you sure you want to logout?'"
      :subTitle="``"
      :close="
        () => {
          showLogout = false;
        }
      "
      :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => {
            showLogout = false;
          },
        },
        {
          label: 'Yes, log me out',
          isClose: false,
          action: () => {
            Logic.Auth.SignOut();
          },
        },
      ]"
    />

    <sofa-delete-prompt
      v-if="showDeleteAccount"
      :title="'Are you sure?'"
      :subTitle="`This action is permanent. All your learning resources and setups will be lost`"
      :close="
        () => {
          showDeleteAccount = false;
        }
      "
      :buttons="[
        {
          label: 'No',
          isClose: true,
          action: () => {
            showDeleteAccount = false;
          },
        },
        {
          label: 'Yes, delete account',
          isClose: false,
          action: () => {
            Logic.Auth.DeleteUserAccount();
          },
        },
      ]"
    />
  </expanded-layout>
</template>

<script lang="ts">
import SettingContact from "@/components/settings/contact.vue"
import SettingOrganizations from "@/components/settings/organizations.vue"
import SettingProfile from "@/components/settings/profile.vue"
import SettingSecurity from "@/components/settings/security.vue"
import SettingStudents from "@/components/settings/students.vue"
import SettingSubscription from "@/components/settings/subscription.vue"
import SettingWallet from "@/components/settings/wallet.vue"
import { Logic } from "sofa-logic"
import { Conditions } from "sofa-logic/src/logic/types/domains/common"
import {
SofaDeletePrompt,
SofaHeaderText,
SofaIcon,
SofaNormalText,
} from "sofa-ui-components"
import { defineComponent, onMounted, ref } from "vue"
import { useMeta } from "vue-meta"
import { useRoute } from "vue-router"

export default defineComponent({
  components: {
    SofaNormalText,
    SofaHeaderText,
    SettingProfile,
    SettingWallet,
    SettingSubscription,
    SettingSecurity,
    SettingContact,
    SofaIcon,
    SettingStudents,
    SettingOrganizations,
    SofaDeletePrompt,
  },
  middlewares: {
    fetchRules: [
      {
        domain: "Users",
        property: "UserProfile",
        method: "GetUserProfile",
        params: [],
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
        property: "AllTransactions",
        method: "GetTransactions",
        params: [
          {
            limit: 10,
            where: [
              {
                field: "userId",
                condition: Conditions.eq,
                value: Logic.Auth.AuthUser?.id,
              },
            ],
            sort: [
              {
                field: "createdAt",
                desc: false,
              },
            ],
          },
        ],
        requireAuth: true,
        ignoreProperty: false,
      },
      {
        domain: "Payment",
        property: "AllPlans",
        method: "GetPlans",
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
  name: "SettingsIndexPage",
  setup() {
    useMeta({
      title: "Settings",
    });

    const AllPlans = ref(Logic.Payment.AllPlans);
    const UserProfile = ref(Logic.Users.UserProfile);
    const showLogout = ref(false);
    const showDeleteAccount = ref(false);
    const notificationIsOn = ref(false);

    const route = useRoute();

    const selectedItem = ref("profile");

    onMounted(() => {
      Logic.Payment.watchProperty("AllPlans", AllPlans);

      if (UserProfile.value?.type.type == "organization") {
        Logic.Users.GetOrganizationMembers(Logic.Auth.AuthUser.id, {
          limit: 20,
        }).then(() => {
          Logic.Common.hideLoader();
        });
      }
      if (route.query?.tab) {
        selectedItem.value = route.query.tab.toString();
      }
    });

    const settingOptions = [
      {
        title: "Account",
        subPages: [
          {
            title: "Profile",
            routePath: "#",
            id: "profile",
            show: true,
          },
          {
            title: "Students",
            routePath: "#",
            id: "students",
            show: UserProfile.value.type?.type == "organization"
          },
          {
            title: "Organizations",
            routePath: "#",
            id: "organizations",
            show: UserProfile.value.type?.type == "student"
          },
          {
            title: "Verification",
            routePath: "#",
            id: "verification",
            show: !Logic.Users.UserProfile.roles.isVerified,
          },
          {
            title: "Tutor Application",
            routePath: "#",
            id: "tutor-application",
            show: UserProfile.value.type.type == "teacher",
          },
        ],
      },
      {
        title: "Billing",
        subPages: [
          {
            title: "Wallet",
            routePath: "#",
            id: "wallet",
            show: true,
          },
          {
            title: "Subscription",
            routePath: "#",
            id: "subscription",
            show: true,
          },
        ],
      },
      {
        title: "Preferences",
        subPages: [
          {
            title: "Notifications",
            routePath: "#",
            id: "notifications",
            show: true,
          },
          {
            title: "Security",
            routePath: "#",
            id: "security",
            show: true,
          },
        ],
      },
      {
        title: "Support",
        subPages: [
          {
            title: "Contact us",
            routePath: "#",
            id: "contact_us",
            show: true,
          },
        ],
      },
    ];

    const showItem = (id: string) => {
      if (id === "tutor-application") return Logic.Common.GoToRoute("/verification/tutor");
      else if (id == "verification") return Logic.Common.GoToRoute("/verification");
      if (Logic.Common.mediaQuery() == "sm" || Logic.Common.mediaQuery() == "md" ) {
        Logic.Common.GoToRoute("/settings/" + id);
      }
      selectedItem.value = id;
    };

    return {
      settingOptions,
      selectedItem,
      Logic,
      AllPlans,
      showLogout,
      showDeleteAccount,
      notificationIsOn,
      showItem,
    };
  },
});
</script>
