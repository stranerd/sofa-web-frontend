<template>
  <global-layout>
    <dashboard-layout>
      <template v-slot:left-session>
        <div
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
        >
          <div class="w-full flex flex-row items-center space-x-3">
            <sofa-avatar
              :size="'84'"
              :bgColor="'bg-grayColor'"
              :photoUrl="
                UserProfile.bio.photo ? UserProfile.bio?.photo.link : ''
              "
              @click="
                Logic.Users.AcceptOrRejectTutorRequest(
                  '64e3c356f7effac4fa134904',
                  true
                )
              "
            >
              <sofa-icon :customClass="'h-[45px]'" :name="'user'" />
            </sofa-avatar>

            <div class="flex flex-col space-y-1">
              <sofa-header-text :customClass="'!text-base !font-bold'">{{
                UserProfile.bio.name?.full
              }}</sofa-header-text>
              <sofa-normal-text :customClass="'capitalize'">{{
                Logic.Users.getUserType()
              }}</sofa-normal-text>

              <sofa-normal-text
                :color="'text-primaryPink'"
                :customClass="'cursor-pointer'"
                @click="
                  Logic.Common.GoToRoute(`/profile/${Logic.Auth.AuthUser.id}`)
                "
              >
                View profile
              </sofa-normal-text>
            </div>
          </div>

          <div
            class="w-full grid grid-cols-2 gap-3"
            v-if="Logic.Users.getUserType() == 'student'"
          >
            <div
              class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row space-x-3 justify-start items-center"
            >
              <sofa-icon :customClass="'h-[40px]'" :name="'xp-points'" />
              <div class="flex flex-col items-start justify-center">
                <sofa-normal-text :customClass="'font-bold'"
                  >{{
                    Logic.Common.convertToMoney(
                      UserProfile.account.rankings.overall.value,
                      false,
                      ""
                    )
                  }}
                  xp</sofa-normal-text
                >
                <sofa-normal-text :color="'text-bodyBlack'"
                  >Point</sofa-normal-text
                >
              </div>
            </div>
            <div
              class="py-3 px-3 rounded-tl-[16px] rounded-br-[16px] rounded-tr-[8px] rounded-bl-[8px] bg-ligthGray col-span-1 flex flex-row space-x-3 justify-start items-center"
            >
              <sofa-icon :customClass="'h-[40px]'" :name="'streak-new'" />
              <div class="flex flex-col items-start justify-center">
                <sofa-normal-text :customClass="'font-bold'"
                  >{{ UserProfile.account.streak.count }} days</sofa-normal-text
                >
                <sofa-normal-text :color="'text-bodyBlack'"
                  >Streak</sofa-normal-text
                >
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="!Logic.Users.UserProfile.roles.isVerified"
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-3"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              {{ "Get verified" }}
            </sofa-normal-text>
            <sofa-icon :name="'verify'" :custom-class="'h-[16px]'" />
          </div>
          <sofa-normal-text>
            Join the elite that create the highest quality study materials,
            reach more audience, and sell on marketplace.
          </sofa-normal-text>

          <sofa-button
            :has-double-layer="false"
            padding="py-2 px-6"
            @click="Logic.Common.GoToRoute('/verification')"
          >
            Apply here
          </sofa-button>
        </div>

        <div
          v-if="
            Logic.Users.UserProfile.type?.type === 'teacher' &&
            Logic.Users.UserProfile.tutor.topics.length === 0
          "
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-3"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Apply to teach subjects
            </sofa-normal-text>
            <sofa-icon :name="'tutor-bagde'" :custom-class="'h-[16px]'" />
          </div>
          <sofa-normal-text>
            As a teacher, you need to pass a test on a subject before you can be
            recommended to teach the subject to others. Complete your test after
            this application and we will reach out to you with your result.
          </sofa-normal-text>

          <sofa-button
            :has-double-layer="false"
            padding="py-2 px-6"
            @click="Logic.Common.GoToRoute('/verification/tutor')"
          >
            Apply here
          </sofa-button>
        </div>
      </template>

      <template v-slot:middle-session>
        <div
          v-if="
            (!Logic.Users.CheckUserTaskState('profile_setup') ||
              !Logic.Users.CheckUserTaskState('phone_setup') ||
              !Logic.Users.CheckUserTaskState('education_setup')) &&
            Logic.Users.getUserType() != 'organization'
          "
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 mdlg:!pt-4 pt-3 mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Complete your account setup
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          >
            <div
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-icon-card
                :data="item"
                v-for="(item, index) in profileSteps"
                :key="index"
                @click="item.action ? item.action() : null"
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

        <div
          v-if="
            !Logic.Users.CheckUserTaskState('create_course') ||
            !Logic.Users.CheckUserTaskState('create_quiz')
          "
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Create study materials
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          >
            <div
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-icon-card
                :data="item"
                v-for="(item, index) in studyMaterialsSteps"
                :key="index"
                @click="item.action ? item.action() : null"
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

        <div
          v-if="Logic.Users.getUserType() == 'student'"
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col mdlg:!space-y-4 space-y-1"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Take on some tasks
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          >
            <div
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-icon-card
                :data="item"
                v-for="(item, index) in takeOnTasks"
                :key="index"
                @click="item.action ? item.action() : null"
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

        <div
          v-if="recentChats.length"
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] mdlg:!hidden flex flex-col mdlg:!space-y-4 space-y-1"
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Recent chats
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row flex-nowrap overflow-x-auto scrollbar-hide"
          >
            <div
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-icon-card
                :data="item"
                v-for="(item, index) in recentChats"
                :key="index"
                @click="Logic.Common.GoToRoute('/chat?id=' + item.id)"
              >
                <template v-slot:title>
                  <div class="w-full flex flex-row items-center space-x-2">
                    <sofa-normal-text
                      :customClass="'!line-clamp-1 font-bold text-left'"
                    >
                      {{ item.title }}
                    </sofa-normal-text>
                    <!-- <span class="h-[5px] w-[5px] rounded-full bg-[#78828c]">
                    </span>
                    <sofa-normal-text>{{ item.date }}</sofa-normal-text> -->
                  </div>
                </template>
              </sofa-icon-card>
            </div>
          </div>
        </div>

        <div
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col space-y-4"
        >
          <div
            class="w-full flex flex-row space-x-2 items-center justify-between"
          >
            <sofa-normal-text :customClass="'!font-bold'">
              Suggested for you
            </sofa-normal-text>

            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>

          <div
            class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <div
              v-if="homeContents.suggested.length"
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-activity-card
                v-for="(activity, index) in homeContents.suggested"
                :key="index"
                :activity="activity"
                :custom-class="'cursor-pointer'"
                @click="
                  Logic.Common.GoToRoute(
                    '/marketplace/' +
                      activity.id +
                      `?type=${activity.labels.main.toLowerCase()}`
                  )
                "
                :has-bookmark="true"
                :bookmark-action="
                  () => {
                    showSaveToFolder = true;
                    selectedFolderMaterailToAdd = activity;
                  }
                "
              />
            </div>
            <template v-else>
              <div class="w-full flex flex-col space-y-3 mdlg:pr-0 pr-4">
                <sofa-empty-state
                  :title="'No suggested materials'"
                  :subTitle="'We could not find any suggested materials'"
                  :custom-class="'!h-[230px]'"
                />
              </div>
            </template>
          </div>

          <div class="w-full" v-if="homeContents.suggested.length">
            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>
        </div>

        <div
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col space-y-4"
        >
          <div
            class="w-full flex flex-row space-x-2 items-center justify-between"
          >
            <sofa-normal-text :customClass="'!font-bold'">
              Recent study materials
            </sofa-normal-text>

            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>

          <div
            class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <div
              v-if="homeContents.recent.length"
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-activity-card
                v-for="(activity, index) in homeContents.recent"
                :key="index"
                :activity="activity"
                :custom-class="'cursor-pointer'"
                @click="
                  Logic.Common.GoToRoute(
                    '/marketplace/' +
                      activity.id +
                      `?type=${activity.labels.main.toLowerCase()}`
                  )
                "
                :has-bookmark="true"
                :bookmark-action="
                  () => {
                    showSaveToFolder = true;
                    selectedFolderMaterailToAdd = activity;
                  }
                "
              />
            </div>
            <template v-else>
              <div class="w-full flex flex-col space-y-3 mdlg:pr-0 pr-4">
                <sofa-empty-state
                  :title="'No recent materials'"
                  :subTitle="'We could not find any recent materials'"
                  :custom-class="'!h-[230px]'"
                />
              </div>
            </template>
          </div>

          <div class="w-full" v-if="homeContents.recent.length">
            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>
        </div>

        <div
          v-if="homeContents.my_org.length"
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col space-y-4"
        >
          <div
            class="w-full flex flex-row space-x-2 items-center justify-between"
          >
            <sofa-normal-text :customClass="'!font-bold'">
              From your organizations
            </sofa-normal-text>

            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer mdlg:hidden"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>

          <div
            class="lg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
          >
            <div
              v-if="homeContents.my_org.length"
              class="mdlg:!w-full mdlg:!flex mdlg:!flex-col mdlg:!space-y-4 flex flex-row space-x-3 mdlg:!space-x-0 mdlg:px-0 py-2 mdlg:!py-0 mdlg:pt-0 mdlg:!pr-0 pr-4"
            >
              <sofa-activity-card
                v-for="(activity, index) in homeContents.my_org"
                :key="index"
                :custom-class="'cursor-pointer'"
                :activity="activity"
                @click="
                  Logic.Common.GoToRoute(
                    '/marketplace/' +
                      activity.id +
                      `?type=${activity.labels.main.toLowerCase()}`
                  )
                "
                :has-bookmark="true"
                :bookmark-action="
                  () => {
                    showSaveToFolder = true;
                    selectedFolderMaterailToAdd = activity;
                  }
                "
              />
            </div>
            <template v-else>
              <div class="w-full flex flex-col space-y-3 mdlg:pr-0 pr-4">
                <sofa-empty-state
                  :title="'No result found'"
                  :subTitle="'We could not find any material from your organizations'"
                  :custom-class="'!h-[350px]'"
                />
              </div>
            </template>
          </div>

          <div class="w-full" v-if="homeContents.my_org.length">
            <div
              class="pr-4 mdlg:!pr-0 cursor-pointer hidden mdlg:block"
              @click="Logic.Common.GoToRoute(`/marketplace`)"
            >
              <sofa-normal-text :color="'text-primaryPink'"
                >View all</sofa-normal-text
              >
            </div>
          </div>
        </div>

        <div
          class="w-full mdlg:shadow-custom mdlg:!px-4 pl-4 mdlg:!py-4 py-1 lg:!bg-white mdlg:!bg-white bg-transparent rounded-[16px] flex flex-col space-y-4"
        >
          <div
            class="w-full mdlg:!flex hidden flex-col space-y-3 justify-center items-center py-9 px-6 rounded-[8px] bg-primaryPurple"
          >
            <sofa-icon :customClass="'h-[28px]'" :name="'white-search'" />
            <div
              class="w-full flex flex-col space-y-2 justify-center items-center py-2"
            >
              <sofa-normal-text
                :color="'text-white'"
                :custom-class="'!font-bold'"
                >Discover more</sofa-normal-text
              >
              <sofa-normal-text
                :color="'text-white'"
                :custom-class="'w-full flex flex-row items-center justify-center !font-semibold'"
                >There are lots of quizzes and courses that you can learn from,
                so start searching!</sofa-normal-text
              >
            </div>
            <sofa-button
              :custom-class="'!whitespace-nowrap'"
              :bgColor="'bg-white'"
              padding="py-1 px-3"
              :textColor="'text-[#141618]'"
              @click="Logic.Common.GoToRoute('/marketplace')"
              >Explore more
            </sofa-button>
          </div>
        </div>

        <div class="h-[100px]"></div>

        <!-- Content details modal -->
        <sofa-modal
          v-if="showAccountSetup"
          :close="
            () => {
              showAccountSetup = false;
            }
          "
          :customClass="'hidden md:!flex'"
          :can-close="false"
        >
          <div
            class="mdlg:!w-[50%] lg:!w-[50%] mdlg:!h-full h-[95%] md:w-[70%] flex flex-col items-center relative"
            @click.stop="
              () => {
                //
              }
            "
          >
            <div
              class="bg-white w-full flex flex-col lg:!px-6 space-y-4 lg:!py-6 mdlg:!px-6 mdlg:!py-6 py-4 px-4 rounded-[16px] items-center justify-center"
            >
              <sofa-header-text :customClass="'text-xl'"
                >Set up your account</sofa-header-text
              >

              <account-setup />
            </div>
          </div>
        </sofa-modal>

        <!-- Customize AI -->
        <customize-bot
          :close="
            () => {
              showCustomizeAI = false;
            }
          "
          v-if="showCustomizeAI"
        />
      </template>

      <template v-slot:right-session>
        <div
          v-if="Logic.Users.getUserType() != 'teacher'"
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
        >
          <template v-if="Logic.Users.getUserType() == 'student'">
            <div class="w-full flex flex-row items-center space-x-3">
              <div
                :style="`background-image: url('${
                  UserProfile.ai.photo
                    ? UserProfile.ai.photo.link
                    : '/images/icons/robot.svg'
                }')`"
                class="w-[84px] h-[84px] flex flex-row items-center justify-center bg-cover bg-center rounded-full"
              ></div>

              <div class="flex flex-col space-y-1">
                <sofa-header-text :customClass="'!text-base !font-bold'">{{
                  UserProfile.ai.name
                }}</sofa-header-text>
                <sofa-normal-text>{{
                  UserProfile.ai.tagline
                }}</sofa-normal-text>
                <sofa-normal-text
                  :color="'text-primaryPink'"
                  :customClass="'cursor-pointer'"
                  @click="showCustomizeAI = true"
                  >Customise</sofa-normal-text
                >
              </div>
            </div>

            <sofa-text-field
              placeholder="What can I do for you?"
              :padding="'px-3 py-3'"
              :custom-class="'border-[1px]'"
              v-model="newChatMessage"
            >
              <template v-slot:inner-suffix>
                <sofa-icon
                  :name="'send'"
                  :customClass="'h-[19px] cursor-pointer'"
                  @click="startConversation()"
                />
              </template>
            </sofa-text-field>

            <div class="w-full flex flex-row items-center space-x-2">
              <sofa-badge
                :color="'gray'"
                :isInverted="true"
                :customClass="'py-2 px-4 cursor-pointer'"
                @click="Logic.Common.GoToRoute('/quiz/create')"
                >Create a quiz</sofa-badge
              >
              <sofa-badge
                :color="'gray'"
                :isInverted="true"
                :customClass="'py-2 px-4 cursor-pointer'"
                @click="Logic.Common.GoToRoute('/course/create')"
                >Create a course</sofa-badge
              >
            </div>
          </template>
          <template v-if="Logic.Users.getUserType() == 'organization'">
            <div class="w-full flex flex-row items-center justify-between">
              <sofa-normal-text :custom-class="'!font-bold'">
                Your students
              </sofa-normal-text>
              <div
                class="flex flex-row space-x-2 items-center cursor-pointer"
                @click="Logic.Common.GoToRoute('/settings?tab=students')"
              >
                <sofa-normal-text :custom-class="'!text-grayColor'">
                  Add
                </sofa-normal-text>
                <sofa-icon :name="'add-gray'" :custom-class="'h-[20px]'" />
              </div>
            </div>

            <template v-if="allStudents.length">
              <div class="w-full flex flex-col space-y-4">
                <div
                  class="w-full flex flex-row items-center justify-between"
                  v-for="(item, index) in allStudents"
                  :key="index"
                >
                  <div class="flex flex-row items-center space-x-2">
                    <sofa-avatar
                      :photoUrl="item.profile_url || ''"
                      :size="'26'"
                      :bgColor="'bg-grayColor'"
                    >
                      <sofa-icon :name="'user'" :customClass="'h-[15px]'" />
                    </sofa-avatar>

                    <sofa-normal-text :customClass="'text-left'">
                      {{ item.name }}
                    </sofa-normal-text>
                  </div>
                </div>

                <div class="w-full flex flex-row items-center justify-start">
                  <sofa-normal-text
                    :color="'text-primaryPink'"
                    :custom-class="'cursor-pointer'"
                    @click="Logic.Common.GoToRoute('/settings?tab=students')"
                  >
                    View all
                  </sofa-normal-text>
                </div>
              </div>
            </template>
            <sofa-empty-state
              v-else
              :title="'No students'"
              :subTitle="'Your students have free access all contents you create'"
              :actionLabel="'Add students'"
              :action="
                () => {
                  Logic.Common.GoToRoute('/settings?tab=students');
                }
              "
            />
          </template>
        </div>

        <div
          class="w-full shadow-custom px-4 py-4 bg-white rounded-[16px] flex flex-col space-y-4"
          v-if="
            (chatList.length && Logic.Users.getUserType() == 'student') ||
            Logic.Users.getUserType() == 'teacher'
          "
        >
          <div class="w-full flex flex-row space-x-2 items-center">
            <sofa-normal-text :customClass="'!font-bold'">
              Recent chats
            </sofa-normal-text>
          </div>

          <template v-if="chatList.length">
            <!-- Chat list -->
            <chat-list-component :extra-style="'pt-0'" />

            <div class="w-full">
              <router-link to="/chat">
                <sofa-normal-text :color="'text-primaryPink'"
                  >See all</sofa-normal-text
                >
              </router-link>
            </div>
          </template>
          <template v-else>
            <sofa-empty-state
              :title="'No chat'"
              :subTitle="'Your active chats will show up here'"
              :actionLabel="''"
            />
          </template>
        </div>
      </template>
    </dashboard-layout>
  </global-layout>
</template>

<script lang="ts">
import ChatListComponent from "@/components/conversation/ChatList.vue";
import AccountSetup from "@/components/onboarding/AccountSetup.vue";
import CustomizeBot from "@/components/onboarding/CustomizeBot.vue";
import { scrollToTop } from "@/composables";
import {
  AllConversations,
  AllTutorRequests,
  chatList,
  setConversations,
} from "@/composables/conversation";
import {
  selectedFolderMaterailToAdd,
  showSaveToFolder,
} from "@/composables/library";
import {
  HomeMaterials,
  homeContents,
  sectionTags,
  setHomeMaterials,
} from "@/composables/marketplace";
import {
  allOrganizationMembers,
  allStudents,
  selectedMember,
  setOrganizationMembers,
  showAccountSetup,
  showCustomizeAI,
  showRemoveMember,
} from "@/composables/profile";
import moment from "moment";
import { Logic } from "sofa-logic";
import { Conditions } from "sofa-logic/src/logic/types/domains/common";
import {
  SofaActivityCard,
  SofaAvatar,
  SofaBadge,
  SofaButton,
  SofaEmptyState,
  SofaHeaderText,
  SofaIcon,
  SofaIconCard,
  SofaModal,
  SofaNormalText,
  SofaTextField,
} from "sofa-ui-components";
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useMeta } from "vue-meta";

const fetchRules = [];

fetchRules.push(
  {
    domain: "Users",
    property: "UserProfile",
    method: "GetUserProfile",
    params: [],
    requireAuth: true,
  },
  {
    domain: "Schools",
    property: "AllInstitutions",
    method: "GetInstitutions",
    params: [],
    requireAuth: true,
  },
  {
    domain: "Conversations",
    property: "AllConversations",
    method: "GetConversations",
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
    silentUpdate: true,
  },
  {
    domain: "Study",
    property: "HomeMaterials",
    method: "GetHomeMaterials",
    params: [],
    requireAuth: true,
    ignoreProperty: false,
    silentUpdate: true,
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
  {
    domain: "Users",
    property: "AllorganizationMembers",
    method: "GetOrganizationMembers",
    params: [
      Logic.Auth.AuthUser?.id,
      {
        limit: 10,
      },
    ],
    requireAuth: true,
    silentUpdate: false,
  }
);

if (Logic.Users.getUserType() == "teacher") {
  fetchRules.push({
    domain: "Conversations",
    property: "AllTutorRequests",
    method: "GetTutorRequests",
    params: [
      {
        where: [
          {
            field: "tutor.id",
            condition: Conditions.eq,
            value: Logic.Auth.AuthUser?.id,
          },
        ],
      },
      true,
    ],
    requireAuth: true,
  });
}
if (Logic.Users.getUserType() == "organization") {
  fetchRules.push({
    domain: "Users",
    property: "AllorganizationMembers",
    method: "GetOrganizationMembers",
    params: [
      Logic.Auth.AuthUser?.id,
      {
        limit: 10,
      },
    ],
    requireAuth: true,
    silentUpdate: false,
  });
}

export default defineComponent({
  components: {
    SofaIcon,
    SofaNormalText,
    SofaHeaderText,
    SofaButton,
    SofaBadge,
    SofaTextField,
    SofaActivityCard,
    SofaIconCard,
    SofaModal,
    AccountSetup,
    SofaAvatar,
    CustomizeBot,
    SofaEmptyState,
    ChatListComponent,
  },
  middlewares: {
    fetchRules,
  },
  name: "IndexPage",
  setup() {
    useMeta({
      title: "Home",
    });

    const UserProfile = ref(Logic.Users.UserProfile);

    const newChatMessage = ref("");

    const recentChats = reactive([]);

    const profileSteps = ref([]);

    const studyMaterialsSteps = ref([]);

    const takeOnTasks = ref([]);

    const setItems = () => {
      profileSteps.value.length = 0;

      profileSteps.value.push(
        {
          title: "Add profile",
          subTitle: "Picture, name and bio",
          icon: "add-profile",
          iconSize: "h-[46px]",
          isDone: Logic.Users.CheckUserTaskState("profile_setup"),
        },
        {
          title: "Add education",
          subTitle: "Level and school or exams",
          icon: "add-education",
          iconSize: "h-[46px]",
          isDone: Logic.Users.CheckUserTaskState("education_setup"),
        },
        {
          title: "Add phone",
          subTitle: "Enter your phone number",
          icon: "add-phone",
          iconSize: "h-[46px]",
          isDone: Logic.Users.CheckUserTaskState("phone_setup"),
          action: () => {
            showSetupProfile();
          },
        }
      );

      studyMaterialsSteps.value.length = 0;

      studyMaterialsSteps.value.push(
        {
          title: "Create a quiz",
          subTitle:
            "Build a customized quiz with different question types and study modes",
          icon: "pink-question",
          iconSize: "h-[46px]",
          isDone: Logic.Users.CheckUserTaskState("create_quiz"),
          action: () => {
            Logic.Common.GoToRoute("/quiz/create");
          },
        },
        {
          title: "Create a course",
          subTitle:
            "Develop and publish a series of educational material on a particular subject",
          icon: "orange-list",
          iconSize: "h-[46px]",
          isDone: Logic.Users.CheckUserTaskState("create_course"),
          action: () => {
            Logic.Common.GoToRoute("/course/create");
          },
        }
      );

      takeOnTasks.value.length = 0;
      takeOnTasks.value.push(
        {
          title: "Learn a quiz",
          subTitle: "Practice alone with a quiz",
          icon: "learn-quiz",
          isDone: Logic.Users.CheckUserTaskState("learn_quiz"),
          iconSize: "h-[46px]",
          action: () => {
            Logic.Common.GoToRoute("/marketplace");
          },
        },
        {
          title: "Study flashcards",
          subTitle: "Learn flashcards on a quiz",
          icon: "study-flashcard",
          isDone: Logic.Users.CheckUserTaskState("quiz_flashcard"),
          iconSize: "h-[46px]",
          action: () => {
            Logic.Common.GoToRoute("/marketplace");
          },
        },
        {
          title: "Play a quiz game ",
          subTitle: "Challenge your friends",
          icon: "play-quiz",
          isDone: Logic.Users.CheckUserTaskState("quiz_game"),
          iconSize: "h-[46px]",
          action: () => {
            Logic.Common.GoToRoute("/marketplace");
          },
        }
      );
    };

    const startConversation = () => {
      if (newChatMessage.value.length >= 2) {
        Logic.Common.GoToRoute("/chat?message=" + newChatMessage.value);
      }
    };

    const showSetupProfile = () => {
      if (Logic.Common.mediaQuery() == "sm") {
        Logic.Common.GoToRoute("/onboarding/account-setup");
      } else {
        showAccountSetup.value = true;
      }
    };

    const mountAction = () => {
      scrollToTop();
      setItems();
      setHomeMaterials(4);

      if (Logic.Users.getUserType() == "organization") {
        setOrganizationMembers();
      }

      if (Logic.Users.getUserType() == "teacher") {
        setConversations(-1, 3);
      }

      if (Logic.Users.getUserType() == "student") {
        setConversations(-1, 3);
      }
    };

    onMounted(() => {
      Logic.Users.watchProperty("UserProfile", UserProfile);
      Logic.Conversations.watchProperty("AllConversations", AllConversations);
      Logic.Conversations.watchProperty("AllTutorRequests", AllTutorRequests);
      Logic.Study.watchProperty("HomeMaterials", HomeMaterials);
      // set organization students

      mountAction();

      if (Logic.Users.getUserType() == "organization") {
        Logic.Users.watchProperty(
          "AllorganizationMembers",
          allOrganizationMembers
        );
      }
    });

    watch(UserProfile, () => {
      setItems();
    });

    watch(AllConversations, () => {
      if (Logic.Users.getUserType() == "student") {
        setConversations(-1, 3);
      }
    });

    watch(AllTutorRequests, () => {
      if (Logic.Users.getUserType() == "teacher") {
        setConversations(-1, 3);
      }
    });

    watch(allOrganizationMembers, () => {
      setOrganizationMembers();
    });

    watch(HomeMaterials, () => {
      setHomeMaterials(4);
    });

    return {
      moment,
      recentChats,
      Logic,
      profileSteps,
      studyMaterialsSteps,
      takeOnTasks,
      showAccountSetup,
      UserProfile,
      newChatMessage,
      homeContents,
      sectionTags,
      showCustomizeAI,
      allStudents,
      selectedMember,
      showRemoveMember,
      chatList,
      showSaveToFolder,
      selectedFolderMaterailToAdd,
      startConversation,
      showSetupProfile,
    };
  },
});
</script>
