<template>
  <expanded-layout
    :layoutStyle="'!w-full !justify-between !flex !flex-col !h-screen !px-0 !py-0 !overflow-y-hidden'"
    :hasTopBar="false"
    :hasBottomBar="false"
    :bottomPadding="false"
  >
    <template v-if="state != 'lobby' && state != 'leaderboard'">
      <div
        :class="`py-8 w-full md:!flex hidden flex-row items-center justify-center sticky top-0 left-0 bg-white ${
          answerState == 'wrong' ? '!bg-primaryRed' : ''
        } ${answerState == 'correct' ? '!bg-primaryGreen' : ''} ${
          state != 'preview' ? '' : 'invisible'
        }
  ${answerState == 'time_up' ? '!bg-primaryRed' : ''}
  `"
        style="box-shadow: 0px 4px 4px rgba(8, 0, 24, 0.05)"
      >
        <div
          class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex flex-row items-center space-x-3 justify-between"
        >
          <template v-if="!answerState">
            <div
              v-if="state == 'completed' || state == 'other_modes'"
              class="flex flex-row items-center"
            >
              <sofa-header-text :size="'xl'">
                {{ mobileTitle }}
              </sofa-header-text>
            </div>
            <div
              class="w-full relative h-[14px] bg-[#E1E6EB] rounded-[8px]"
              v-else
            >
              <div
                class="absolute top-0 left-0 h-full bg-primaryGreen rounded-[8px]"
                :style="`width: calc(${
                  ((currentQuestionIndex + 1) / questions.length) * 90
                }% + 10%);`"
              >
                <span
                  class="w-[60px] h-[40px] z-[33344444] top-[-15px] text-white flex items-center justify-center rounded-[32px] absolute right-0 bg-primaryGreen !font-semibold"
                >
                  {{ currentQuestionIndex + 1 }}/{{ questions.length }}
                </span>
              </div>
            </div>

            <sofa-normal-text
              :color="'text-grayColor'"
              :customClass="'!text-base cursor-pointer'"
              @click="Logic.Common.goBack()"
            >
              Exit
            </sofa-normal-text>
          </template>
          <template v-else>
            <template v-if="answerState == 'pending'">
              <div
                class="w-full relative h-[14px] bg-primaryGreen rounded-[8px]"
              >
                <div
                  class="absolute top-0 left-0 h-full bg-[#E1E6EB] rounded-[8px]"
                  :style="`width: calc( ${
                    ((questions[currentQuestionIndex].timeLimit -
                      questions[currentQuestionIndex].currentTime) /
                      questions[currentQuestionIndex].timeLimit) *
                    95
                  }% + 5%);`"
                >
                  <span
                    class="w-[60px] h-[40px] z-[33344444] top-[-15px] text-white flex items-center justify-center rounded-[32px] absolute right-0 bg-primaryGreen !font-semibold"
                  >
                    {{ questions[currentQuestionIndex].currentTime }}
                  </span>
                </div>
              </div>
            </template>
            <template v-if="answerState == 'time_up'">
              <div class="flex flex-row items-center space-x-2">
                <sofa-icon
                  :customClass="'h-[22px]'"
                  :name="`${'white-wrong'}`"
                />
                <sofa-header-text :size="'xl'" :color="'text-white'">
                  Time up!
                </sofa-header-text>
              </div>
            </template>
            <template v-if="answerState == 'wrong' || answerState == 'correct'">
              <div class="flex flex-row items-center space-x-2">
                <sofa-icon
                  :customClass="'h-[22px]'"
                  :name="`${
                    answerState == 'wrong' ? 'white-checkbox' : 'white-wrong'
                  }`"
                />
                <sofa-header-text :size="'xl'" :color="'text-white'">
                  {{ capitalize(answerState) }}!
                </sofa-header-text>
              </div>

              <div class="flex flex-row space-x-3">
                <sofa-button
                  :bgColor="'bg-white'"
                  :textColor="'text-white'"
                  :customClass="` ${
                    answerState == 'wrong'
                      ? '!bg-primaryRed'
                      : '!bg-primaryGreen'
                  } !border-[2px] !border-white`"
                  :hasDoubleLayer="true"
                  :hasDarkLayer="false"
                  v-if="mode != 'game'"
                >
                  Explanation
                </sofa-button>

                <sofa-button
                  :bgColor="'bg-white'"
                  :textColor="` ${
                    answerState == 'wrong'
                      ? '!text-primaryRed'
                      : '!text-primaryGreen'
                  }  `"
                  :customClass="'!border-[2px] !border-gray-100'"
                  :hasDoubleLayer="true"
                  @click="handleRightButton()"
                >
                  Continue
                </sofa-button>
              </div>
            </template>
          </template>
        </div>
      </div>

      <!-- Top bar for smaller screens -->
      <div
        :class="`w-full flex flex-row md:!hidden justify-between items-center z-50 bg-backgroundGray px-4 py-4 sticky top-0 left-0 ${
          answerState == 'wrong' ? '!bg-primaryRed' : ''
        } ${answerState == 'correct' ? '!bg-primaryGreen' : ''}
  ${answerState == 'time_up' ? '!bg-primaryRed' : ''}`"
      >
        <template v-if="!answerState">
          <sofa-icon
            :customClass="'h-[19px]'"
            :name="'circle-close'"
            @click="Logic.Common.goBack()"
          />

          <sofa-normal-text :customClass="'!font-bold !text-sm !line-clamp-1'">
            {{ mobileTitle }}
          </sofa-normal-text>

          <div
            :class="`flex flex-row items-center space-x-3 ${
              state != 'completed' && state != 'other_modes'
                ? 'visible'
                : 'invisible'
            }`"
          >
            <sofa-normal-text>
              {{ currentQuestionIndex + 1 }}/{{
                questions.length
              }}</sofa-normal-text
            >
          </div>
        </template>
        <template v-else>
          <template v-if="answerState == 'pending'">
            <div class="w-full relative h-[14px] bg-primaryGreen rounded-[8px]">
              <div
                class="absolute top-0 left-0 h-full bg-[#E1E6EB] rounded-[8px]"
                :style="`width: calc( ${
                  ((questions[currentQuestionIndex].timeLimit -
                    questions[currentQuestionIndex].currentTime) /
                    questions[currentQuestionIndex].timeLimit) *
                  90
                }% + 10%);`"
              >
                <span
                  class="w-[40px] h-[30px] z-[33344444] top-[-10px] text-white flex items-center justify-center rounded-[16px] absolute right-0 bg-primaryGreen !font-semibold"
                >
                  {{ questions[currentQuestionIndex].currentTime }}
                </span>
              </div>
            </div>
          </template>
          <template v-if="answerState == 'time_up'">
            <div class="flex flex-row items-center space-x-2">
              <sofa-icon :customClass="'h-[22px]'" :name="`${'white-wrong'}`" />
              <sofa-header-text :size="'xl'" :color="'text-white'">
                Time up!
              </sofa-header-text>
            </div>
          </template>

          <template v-if="answerState == 'wrong' || answerState == 'correct'">
            <div class="flex flex-row items-center space-x-2">
              <sofa-icon
                :customClass="'h-[22px]'"
                :name="`${
                  answerState == 'wrong' ? 'white-checkbox' : 'white-wrong'
                }`"
              />
              <sofa-header-text :color="'text-white'">
                {{ capitalize(answerState) }}!
              </sofa-header-text>
            </div>

            <div class="flex flex-row space-x-3" v-if="mode != 'game'">
              <sofa-button
                :bgColor="'bg-white'"
                :textColor="'text-white'"
                :customClass="` ${
                  answerState == 'wrong' ? '!bg-primaryRed' : '!bg-primaryGreen'
                } !border-[2px] !border-white`"
                :hasDoubleLayer="true"
                :hasDarkLayer="false"
              >
                Explanation
              </sofa-button>
            </div>
          </template>
        </template>
      </div>
    </template>

    <sofa-swiper
      :free-mode="false"
      :show-pagination="false"
      :space-between="0"
      :slide-per-view="'1'"
      custom-class="!w-full !h-full flex-grow"
      :swiper-class="'!h-full '"
      v-model="currentQuestionIndex"
      :current-slide-position="questionIndex"
      :enabled="enabledSwiper"
      ref="swiperInstance"
    >
      <swiper-slide
        class="!h-full !flex !items-center !justify-center !flex-col !relative"
        v-for="(question, index) in questions"
        :key="index"
      >
        <template v-if="state != 'lobby' && state != 'leaderboard'">
          <template v-if="state != 'other_modes'">
            <flashcard
              v-if="mode == 'flashcard'"
              :questionData="question"
              :mode="mode"
              :state="state"
            />

            <template v-else>
              <quiz-questions
                :questionData="question"
                :state="state"
                :questionIndex="index"
                :currentIndex="currentQuestionIndex"
                :mode="mode"
                @OnAnswerSelected="handleAnswerSelected"
                :answerState="answerState"
                :quiz-title="SingleQuiz.title"
              />
            </template>
          </template>

          <div
            v-else
            class="w-full h-[80%] flex flex-col items-center space-y-2 justify-center"
          >
            <div
              class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full flex flex-col space-y-4 md:!px-0 px-4"
            >
              <template v-for="(item, index) in otherTasks" :key="index">
                <sofa-icon-card
                  :data="item"
                  v-if="item.key != mode"
                  @click="item.action ? item.action() : null"
                  :customClass="'!bg-white !w-full'"
                >
                  <template v-slot:title>
                    <sofa-normal-text :customClass="'!font-bold'">
                      {{ item.title }}
                    </sofa-normal-text>
                  </template>
                </sofa-icon-card>
              </template>
            </div>
          </div>
        </template>

        <template v-else>
          <div
            class="w-full h-full bg-primaryPurple flex flex-col items-center"
          >
            <div
              :class="`lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] h-full w-full relative flex flex-col space-y-4 ${
                state == 'leaderboard' ? 'item-center justify-center' : ''
              } py-4 px-4 md:!px-0 md:!py-6`"
            >
              <!-- lobby -->
              <div
                class="w-full custom-border bg-white px-3 py-3 flex flex-row space-x-3"
                v-if="state == 'lobby'"
              >
                <sofa-image-loader
                  :customClass="'md:!h-[90px] h-[80px] w-[120px] md:!w-[170px] custom-border'"
                  :photoUrl="SingleQuiz.photo?.link"
                />
                <div class="w-full flex flex-col h-full space-y-2">
                  <div
                    class="w-full flex flex-row items-center justify-between"
                  >
                    <sofa-header-text
                      :size="'xl'"
                      :customClass="'text-left !line-clamp-1'"
                    >
                      {{ SingleQuiz.title }}
                    </sofa-header-text>
                    <div
                      class="flex flex-row space-x-3 items-center"
                      v-if="userIsGameHost()"
                    >
                      <sofa-icon
                        :customClass="'h-[16px] cursor-pointer'"
                        :name="'copy'"
                        @click="copyGameLink()"
                      />
                      <sofa-icon
                        :customClass="'h-[16px] cursor-pointer'"
                        :name="'share'"
                        @click="shareGameLink()"
                      />
                    </div>
                  </div>
                  <div class="flex flex-row space-x-2 items-center">
                    <sofa-normal-text :color="'text-primaryPurple'">
                      Game
                    </sofa-normal-text>
                    <span
                      :class="`h-[5px] w-[5px] rounded-full bg-primaryPurple`"
                    >
                    </span>
                    <sofa-normal-text :color="'text-primaryPurple'">{{
                      `${SingleGame.questions.length} question${
                        SingleGame.questions.length > 1 ? "s" : ""
                      }`
                    }}</sofa-normal-text>
                  </div>
                  <div
                    class="w-full flex flex-row items-start space-x-2 flex-nowrap"
                  >
                    <sofa-avatar
                      :size="'20'"
                      :photoUrl="SingleGame.user.bio.photo?.link"
                    >
                    </sofa-avatar>
                    <sofa-normal-text :color="'text-grayColor'">
                      Hosted by
                      <span class="!font-semibold pl-1 text-bodyBlack">
                        {{ SingleGame.user.bio.name.full }}</span
                      >
                    </sofa-normal-text>
                  </div>
                </div>
              </div>

              <div
                class="w-full flex flex-col space-y-2 py-2 items-center justify-center"
              >
                <sofa-header-text
                  :customClass="'md:!text-3xl text-xl'"
                  :color="'text-white'"
                >
                  {{ state == "lobby" ? "Lobby" : "Scoreboard" }}
                </sofa-header-text>
                <sofa-normal-text :color="'text-white'" v-if="state == 'lobby'">
                  {{
                    userIsGameHost()
                      ? "Start game when enough players have joined"
                      : "Waiting for host to start game"
                  }}
                </sofa-normal-text>
                <sofa-normal-text
                  :color="'text-white'"
                  v-if="state == 'leaderboard'"
                >
                  {{
                    SingleGame.status == "started"
                      ? "Game is still ongoing; Wait for the game to end to see your score"
                      : "Game has ended"
                  }}
                </sofa-normal-text>
              </div>

              <div
                :class="`w-full h-auto md:!max-h-[80%] max-h-[70%]  overflow-y-auto flex flex-col space-y-3 `"
              >
                <!-- Lobby list -->
                <template v-if="GameParticipants.length && state == 'lobby'">
                  <div
                    v-for="(user, index) in GameParticipants"
                    :key="index"
                    :class="`w-full flex flex-col items-center justify-center py-3 px-3 custom-border border-[2px] border-white ${
                      userIsGameHost(user.id) ? 'bg-white' : 'bg-transparent'
                    }`"
                  >
                    <sofa-normal-text
                      :color="
                        userIsGameHost(user.id)
                          ? 'text-[#141618]'
                          : 'text-white'
                      "
                      :customClass="'!font-semibold'"
                      >{{
                        userIsGameHost(user.id) ? "You" : user.bio.name.full
                      }}
                    </sofa-normal-text>
                  </div>
                  <div
                    v-if="GameParticipants.length == 0"
                    class="w-full flex flex-col items-center justify-center py-3 px-3 custom-border border-[2px] border-white"
                  >
                    <sofa-normal-text :color="'text-white'"
                      >No player has joined</sofa-normal-text
                    >
                  </div>
                </template>

                <!-- Scoreboard -->

                <template
                  v-if="scoreBoardParticipants.length && state == 'leaderboard'"
                >
                  <div
                    v-for="(user, index) in scoreBoardParticipants"
                    :key="index"
                    :class="`w-full flex flex-row items-center justify-between py-3 px-3 custom-border border-[2px] bg-transparent border-white`"
                  >
                    <div class="flex flex-row space-x-3 items-center">
                      <sofa-normal-text
                        :color="'text-white'"
                        :customClass="'!font-semibold'"
                        >{{ index + 1 }}
                      </sofa-normal-text>
                      <sofa-normal-text
                        :color="'text-white'"
                        :customClass="'!font-semibold'"
                        >{{ user.user.bio.name.full }}
                      </sofa-normal-text>
                    </div>

                    <sofa-normal-text
                      :color="'text-white'"
                      :customClass="'!font-semibold'"
                      >{{ `${user.score} points` }}
                    </sofa-normal-text>
                  </div>
                </template>
              </div>

              <div
                :class="`absolute bottom-0 left-0 flex-row md:!flex grid grid-cols-2 md:!gap-0 gap-3 ${
                  state == 'leaderboard' ? 'justify-end' : 'justify-between'
                }  py-4 w-full mdlg:!px-0 px-4 z-20 bg-primaryPurple`"
                v-if="userIsGameHost() || state == 'leaderboard'"
              >
                <template v-if="state == 'lobby'">
                  <div class="flex flex-col md:!w-auto col-span-1">
                    <sofa-button
                      :bgColor="'bg-white'"
                      :hasDarkLayer="false"
                      :customClass="'!bg-primaryPurple !border-[2px] !border-white md:!w-auto w-full'"
                      :textColor="'text-white'"
                      :padding="'px-5 py-2'"
                      @click="Logic.Common.goBack()"
                    >
                      Cancle
                    </sofa-button>
                  </div>

                  <div class="flex flex-col md:!w-auto col-span-1">
                    <sofa-button
                      :bgColor="'bg-white'"
                      :customClass="'!bg-white !border-[2px] !border-white  md:!w-auto w-full'"
                      :textColor="'text-primaryPurple '"
                      :padding="'px-5 py-2'"
                      @click="startGame()"
                    >
                      Start
                    </sofa-button>
                  </div>
                </template>

                <template v-if="state == 'leaderboard'">
                  <div
                    class="flex flex-col md:!w-full w-full col-span-2 justify-center items-center pb-3"
                  >
                    <sofa-button
                      :bgColor="'bg-white'"
                      :hasDarkLayer="false"
                      :customClass="' !border-[2px] !border-gray-200 md:!w-auto w-full'"
                      :textColor="'text-primaryPurple'"
                      :padding="'px-5 py-2'"
                      @click="Logic.Common.goBack()"
                    >
                      Continue
                    </sofa-button>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </swiper-slide>
    </sofa-swiper>

    <template v-if="state != 'lobby' && state != 'leaderboard'">
      <!-- Bottom bar -->
      <div
        :class="`md:!py-5 py-4 w-full sticky flex flex-row items-center justify-center bottom-0 left-0 md:!bg-white bg-backgroundGray ${
          answerState && mode == 'practice' ? 'md:!invisible' : ''
        }   ${state != 'preview' ? '' : 'invisible'}
            ${
              !(buttonLabels.left.label || !buttonLabels.right.label) ||
              mode != 'game'
                ? ''
                : '!invisible'
            }
            `"
        style="box-shadow: 0px -4px 4px rgba(8, 0, 24, 0.05)"
      >
        <div
          class="lg:!w-[50%] mdlg:!w-[70%] md:!w-[80%] w-full md:!flex hidden flex-row items-center justify-between"
        >
          <sofa-button
            :customClass="`!font-semibold`"
            :visible="buttonLabels.left.label != ''"
            :padding="'px-6 py-2'"
            :bgColor="buttonLabels.left.bgColor"
            :textColor="buttonLabels.left.textColor"
            @click="handleLeftButton()"
          >
            {{ buttonLabels.left.label }}
          </sofa-button>

          <span
            :class="`px-4 py-2 rounded-[8px] bg-[#F2F5F8] !font-semibold text-grayColor ${
              state != 'question' ? 'invisible' : ''
            } `"
          >
            {{ currentQuestionIndex + 1 }}/{{ questions.length }}
          </span>

          <sofa-button
            :customClass="`!font-semibold ${
              buttonLabels.right.label ? '' : '!invisible'
            }`"
            :padding="'px-6 py-2'"
            :bgColor="buttonLabels.right.bgColor"
            :textColor="buttonLabels.right.textColor"
            @click="handleRightButton()"
          >
            {{ buttonLabels.right.label }}
          </sofa-button>
        </div>
        <div class="w-full grid grid-cols-2 gap-3 px-4 md:!hidden">
          <div class="col-span-1 flex flex-col" v-if="buttonLabels.smIsDoubled">
            <sofa-button
              :customClass="`w-full`"
              :padding="'py-3'"
              v-if="buttonLabels.left.label"
              :bgColor="buttonLabels.left.bgColor"
              :textColor="buttonLabels.left.textColor"
              @click="handleLeftButton()"
              >{{ buttonLabels.left.label }}</sofa-button
            >
          </div>

          <div
            :class="`${
              buttonLabels.smIsDoubled ? 'col-span-1' : 'col-span-2'
            } flex flex-col`"
          >
            <sofa-button
              :customClass="'w-full'"
              :padding="'py-3'"
              v-if="buttonLabels.right.label"
              :bgColor="buttonLabels.right.bgColor"
              :textColor="buttonLabels.right.textColor"
              @click="handleRightButton()"
              >{{ buttonLabels.right.label }}</sofa-button
            >
          </div>
        </div>
      </div>
    </template>

    <!-- Info modal -->
    <sofa-modal
      v-if="showInfoModal"
      :close="
        () => {
          showInfoModal = false;
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
          class="bg-white w-full flex flex-col lg:!px-6 md:!space-y-4 space-y-3 lg:!py-6 mdlg:!px-6 mdlg:!py-6 md:!py-4 md:!px-4 md:!rounded-[16px] rounded-t-[16px] items-center justify-center"
        >
          <div
            class="w-full hidden flex-col space-y-2 justify-center items-center md:flex"
          >
            <sofa-header-text :customClass="'text-xl'">{{
              infoModalData.title
            }}</sofa-header-text>
            <sofa-normal-text v-if="infoModalData.sub"
              >{{ infoModalData.sub }}
            </sofa-normal-text>
          </div>

          <div
            class="w-full flex flex-row justify-between items-center sticky top-0 left-0 md:!hidden pb-2 border-[#F1F6FA] border-b-[1px] px-4"
          >
            <sofa-normal-text :customClass="'!font-bold !text-base'">
              {{ infoModalData.title }}
            </sofa-normal-text>
            <sofa-icon
              :customClass="'h-[19px]'"
              :name="'circle-close'"
              @click="showInfoModal = false"
            />
          </div>

          <div
            class="w-full flex flex-col px-4 md:!hidden"
            v-if="infoModalData.sub"
          >
            <sofa-normal-text>{{ infoModalData.sub }} </sofa-normal-text>
          </div>

          <div class="w-full flex flex-col pb-4 md:!pb-0 px-4 md:!px-0">
            <info-modal
              :close="
                () => {
                  showInfoModal = false;
                }
              "
              :mode="mode"
            />
          </div>
        </div>
      </div>
    </sofa-modal>
  </expanded-layout>
</template>

<script lang="ts">
import {
  capitalize,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import { useMeta } from "vue-meta";
import moment from "moment";
import { scrollToTop } from "@/composables";
import {
  SofaNormalText,
  SofaSwiper,
  SofaIcon,
  SofaButton,
  SofaModal,
  SofaHeaderText,
  SofaIconCard,
  SofaImageLoader,
  SofaAvatar,
} from "sofa-ui-components";
import { Logic } from "sofa-logic";
import { SwiperSlide } from "swiper/vue";
import QuizQuestions from "@/components/quizzes/Questions.vue";
import InfoModal from "@/components/quizzes/InfoModal.vue";
import Flashcard from "@/components/quizzes/Flashcard.vue";
import {
  AllQuestions,
  answerState,
  buttonLabels,
  currentQuestionIndex,
  enabledSwiper,
  GameParticipants,
  goToNextSlide,
  handleAnswerSelected,
  handleLeftButton,
  handleRightButton,
  infoModalData,
  mobileTitle,
  mode,
  otherTasks,
  questionIndex,
  questions,
  setQuestions,
  setViewMode,
  showInfoModal,
  showQuestion,
  SingleGame,
  SingleQuiz,
  specialQuestionTypes,
  state,
  swiperInstance,
  swiperKey,
  userIsGameHost,
  copyGameLink,
  shareGameLink,
  startGame,
  listenToGame,
  setScoreboardParticipants,
  scoreBoardParticipants,
} from "@/composables/quiz";

const fetchRules = [];

if (!window.location.href.includes("game")) {
  fetchRules.push({
    domain: "Study",
    property: "AllQuestions",
    method: "GetQuestions",
    params: [],
    useRouteId: true,
    requireAuth: true,
    ignoreProperty: true,
  });
}

fetchRules.push(
  {
    domain: "Study",
    property: "SingleQuiz",
    method: "GetQuiz",
    params: [],
    useRouteId: true,
    ignoreProperty: true,
  },
  {
    domain: "Plays",
    property: "SingleGame",
    method: "GetGame",
    params: [],
    useRouteQuery: true,
    queries: ["gameId"],
    requireAuth: true,
    ignoreProperty: true,
  }
);

export default defineComponent({
  components: {
    SofaNormalText,
    SofaSwiper,
    SwiperSlide,
    SofaIcon,
    SofaButton,
    QuizQuestions,
    SofaModal,
    InfoModal,
    SofaHeaderText,
    Flashcard,
    SofaIconCard,
    SofaImageLoader,
    SofaAvatar,
  },
  middlewares: {
    fetchRules,
  },
  name: "QuizPage",
  setup() {
    useMeta({
      title: "Quiz",
    });

    const showScrollBar = ref(false);
    watch(currentQuestionIndex, () => {
      questionIndex.value = currentQuestionIndex.value;

      const thisQuestion = questions[currentQuestionIndex.value];

      if (specialQuestionTypes.includes(thisQuestion.options.type)) {
        enabledSwiper.value = false;
        swiperInstance.value.swiperInstance.enabled = false;
        swiperInstance.value.swiperInstance.update();
      }

      showQuestion(questionIndex.value);
    });

    onMounted(() => {
      scrollToTop();
      Logic.Study.watchProperty("SingleQuiz", SingleQuiz);
      Logic.Study.watchProperty("AllQuestions", AllQuestions);
      Logic.Plays.watchProperty("SingleGame", SingleGame);
      Logic.Plays.watchProperty("GameParticipants", GameParticipants);
      setViewMode();
      setQuestions();
      showQuestion(0);
      mobileTitle.value = SingleQuiz.value.title;

      if (
        mode.value == "practice" ||
        mode.value == "test" ||
        mode.value == "flashcard"
      ) {
        if (Logic.Study.SingleCourse) {
          localStorage.setItem(
            `course_${Logic.Study.SingleCourse.id}_material_${SingleQuiz.value.id}`,
            "done"
          );
        }
        localStorage.setItem(`quiz_action_${mode.value}`, "done");
      }

      // listen to game
      if (mode.value == "game") {
        listenToGame();
        setScoreboardParticipants();
      }
    });

    onUnmounted(() => {
      Logic.Study.SingleQuiz = undefined;
      Logic.Study.AllQuestions = undefined;
      questions.length = 0;
    });

    watch(SingleGame, () => {
      setScoreboardParticipants();
    });

    return {
      moment,
      Logic,
      questions,
      state,
      currentQuestionIndex,
      enabledSwiper,
      swiperInstance,
      swiperKey,
      questionIndex,
      goToNextSlide,
      mobileTitle,
      mode,
      showInfoModal,
      buttonLabels,
      handleLeftButton,
      handleRightButton,
      otherTasks,
      infoModalData,
      handleAnswerSelected,
      answerState,
      capitalize,
      SingleQuiz,
      SingleGame,
      GameParticipants,
      showScrollBar,
      scoreBoardParticipants,
      userIsGameHost,
      copyGameLink,
      shareGameLink,
      startGame,
    };
  },
});
</script>
