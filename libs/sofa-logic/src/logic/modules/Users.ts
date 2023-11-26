import { Logic } from '..'
import { $api } from '../../services'
import { QueryParams } from '../types/common'
import { User } from '../types/domains/auth'
import { Country, Paginated } from '../types/domains/common'
import {
  SingleUser,
  TutorRequest,
  UserVerification,
} from '../types/domains/users'
import {
  CreateVerificationInput,
  CustomizeAIInput,
  OrganizationMember,
  UpdateUserAspirantInput,
  UpdateUserCollegeInput,
  UpdateUserTeacherInput,
  VerificationStatusInput,
} from '../types/forms/users'
import {
  CreateTutorRequestForm,
  UpdateUserLocationInput,
  UpdateUserSocialInput,
} from './../types/forms/users'
import Common from './Common'

export default class Users extends Common {
  public AllUsers: Paginated<User> | undefined
  public SingleUser: SingleUser | undefined
  public Verification: UserVerification | undefined
  public Verifications: Paginated<UserVerification> | undefined
  public UserProfile: SingleUser | undefined
  public AllorganizationMembers: Paginated<OrganizationMember> | undefined
  public organizationMember: OrganizationMember | undefined
  public Countries: Country[] | undefined
  public AllTutorRequests: Paginated<TutorRequest> | undefined
  public SingleTutorRequest: TutorRequest | undefined

  // form inputs
  public CustomizeAIForm: CustomizeAIInput | undefined
  public UpdateUserForm:
    | UpdateUserCollegeInput
    | UpdateUserTeacherInput
    | UpdateUserAspirantInput
    | undefined
  public CreateVerificationForm: CreateVerificationInput | undefined
  public UpdateUserVerificationForm: VerificationStatusInput | undefined
  public UpdateUserLocationForm: UpdateUserLocationInput | undefined
  public CreateTutorRequestForm: CreateTutorRequestForm | undefined
  public UpdateUserSocialForm: UpdateUserSocialInput | undefined

  public getUserType = () => {
    return Logic.Users.UserProfile?.type?.type ?? 'student'
  }

  public get isTeacher () {
    return this.getUserType() === 'teacher'
  }

  public get isStudent () {
    return this.getUserType() === 'student'
  }

  public get isOrg () {
    return this.getUserType() === 'organization'
  }

  public CheckUserTaskState = (
    task:
      | 'profile_setup'
      | 'education_setup'
      | 'phone_setup'
      | 'create_quiz'
      | 'create_course'
      | 'learn_quiz'
      | 'quiz_flashcard'
      | 'quiz_game',
  ) => {
    if (task == 'profile_setup') {
      return this.UserProfile.bio?.name?.first
    }

    if (task == 'education_setup') {
      return this.UserProfile.type
    }

    if (task == 'phone_setup') {
      return Logic.Auth.AuthUser.phone
    }

    if (task == 'create_quiz') {
      return this.UserProfile.account.meta.quizzes
    }

    if (task == 'create_course') {
      return this.UserProfile.account.meta.courses
    }

    if (task == 'learn_quiz') {
      return localStorage.getItem('quiz_action_practice')
    }

    if (task == 'quiz_flashcard') {
      return localStorage.getItem('quiz_action_flashcard')
    }

    if (task == 'quiz_game') {
      return localStorage.getItem('quiz_action_game')
    }
  }

  public GetUsers = (filters: QueryParams, updateItems = true) => {
    return $api.users.users.fetch(filters).then((response) => {
      if (updateItems) {
        this.AllUsers = response.data
      }
      return response.data.results as SingleUser[]
    })
  }

  public GetUser = (id: string) => {
    return $api.users.users.get(id).then((response) => {
      this.SingleUser = response.data
      return this.SingleUser
    })
  }

  public GetTutorRequest = (id: string) => {
    return $api.users.tutor_request.get(id).then((response) => {
      this.SingleTutorRequest = response.data
    })
  }

  public GetTutorRequests = (filters: QueryParams, isPersonal: boolean) => {
    return $api.users.tutor_request.fetch(filters).then((response) => {
      this.AllTutorRequests = response.data
      if (isPersonal) {
        this.SingleTutorRequest = this.AllTutorRequests.results.length
          ? this.AllTutorRequests.results[0]
          : undefined
      }
    })
  }

  public GetOrganizationMembers = (
    organizationUserId: string,
    filters: QueryParams = {},
  ) => {
    return $api.users.organization
      .getOrganizationMembers(organizationUserId, filters)
      .then((response) => {
        this.AllorganizationMembers = response.data
        return response.data.results
      })
  }

  public GetOrganizationMember = (
    organizationUserId: string,
    studentEmail: string,
  ) => {
    return $api.users.organization
      .getOrganizationMember(organizationUserId, studentEmail)
      .then((response) => {
        this.organizationMember = response.data
      })
  }

  public GetVerifications = (filters: QueryParams) => {
    return $api.users.verifications.fetch(filters).then((response) => {
      this.Verifications = response.data
    })
  }

  public GetVerification = (id: string) => {
    return $api.users.verifications.get(id).then((response) => {
      this.Verification = response.data
    })
  }

  public GetUserProfile = (id = Logic.Auth.AuthUser.id) => {
    return $api.users.users.get(id).then((response) => {
      this.UserProfile = response.data
      return this.UserProfile
    })
  }

  public GetCountries = () => {
    return $api.users.verifications.getCountriesAndStates().then((response) => {
      this.Countries = response.data.data
    })
  }

  public CustomizeAI = (formIsValid: boolean) => {
    if (formIsValid && this.CustomizeAIForm) {
      return $api.users.users
        .customizeUserAI(this.CustomizeAIForm)
        .then((response) => {
          this.SingleUser = response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public UpdateUser = (formIsValid: boolean, useLoader: boolean) => {
    if (formIsValid && this.UpdateUserForm) {
      if (useLoader) {
        Logic.Common.showLoader({
          loading: true,
          show: false,
        })
      }

      return $api.users.users
        .updateUser(this.UpdateUserForm)
        .then((response) => {
          this.SingleUser = response.data
          this.GetUserProfile()
          if (useLoader) {
            Logic.Common.hideLoader()
          }
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public UpdateOrganizationCode = (code: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.users.users
      .updateOrganizationCode(code)
      .then((response) => {
        this.SingleUser = response.data
        this.GetUserProfile()

        Logic.Common.hideLoader()
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  public UpdateUserLocation = () => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.users.users
      .updateUserLocation(this.UpdateUserLocationForm)
      .then((response) => {
        this.SingleUser = response.data
        this.GetUserProfile()
        Logic.Common.hideLoader()
        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  public UpdateUserSocial = () => {
    return $api.users.users
      .updateUserSocial(this.UpdateUserSocialForm)
      .then((response) => {
        this.SingleUser = response.data
        this.GetUserProfile()

        return response.data
      })
      .catch((error) => {
        throw error
      })
  }

  public CreateVerification = async (formIsValid: boolean, useLoader = true) => {
    if (formIsValid && this.CreateVerificationForm) {
      if (useLoader) {
        Logic.Common.showLoader({
          loading: true,
          show: false,
        })
      }

      return $api.users.verifications
        .createVerification(this.CreateVerificationForm)
        .then((response) => {
          this.Verification = response.data
          if (useLoader) {
            Logic.Common.hideLoader()
          }
        })
        .catch((error) => {
          Logic.Common.hideLoader()
          Logic.Common.showError(error.response.data[0].message)
        })
    }
  }

  public UpdateUserVerification = (formIsValid: boolean) => {
    if (formIsValid && this.UpdateUserVerificationForm) {
      return $api.users.verifications
        .updateUserVerification(this.UpdateUserVerificationForm)
        .then((response) => {
          //
        })
        .catch((error) => {
          //
        })
    }
  }

  public CreateTutorRequest = () => {
    if (this.CreateTutorRequestForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.users.tutor_request
        .post(null, this.CreateTutorRequestForm, () => {})
        .then((response) => {
          this.SingleTutorRequest = response.data
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public AcceptOrRejectTutorRequest = (requestId: string, status: boolean) => {
    return $api.users.tutor_request
      .acceptOrRejectTutorRequest(requestId, status)
      .then((response) => {
        return response.data
      })
  }

  public AddOrganizationMembers = (
    organizationUserId: string,
    studentEmails: string[],
  ) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.users.organization
      .addOrganizationMembers(organizationUserId, studentEmails)
      .then((response) => {
        Logic.Users.GetOrganizationMembers(organizationUserId)
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public RequestToJoinOrganization = (
    organizationUserId: string,
    code: string,
  ) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })

    return $api.users.organization
      .requestToJoinOrganization(organizationUserId, code)
      .then((response) => {
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public LeaveOrganization = (organizationUserId: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })

    return $api.users.organization
      .leaveOrganization(organizationUserId)
      .then((response) => {
        Logic.Users.GetUserProfile()
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public SendFeedbackMessage = (message: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.users.meta
      .sendMessage(message)
      .then((response) => {
        Logic.Common.hideLoader()

        Logic.Common.showLoader({
          show: true,
          message: 'Your feedback was sent successfully',
          type: 'success',
        })

        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }

  public RemoveOrganizationMember = (
    organizationUserId: string,
    studentEmail: string,
  ) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.users.organization
      .removeOrganizationMember(organizationUserId, studentEmail)
      .then((response) => {
        Logic.Users.GetOrganizationMembers(organizationUserId)
        Logic.Common.hideLoader()
        return response.data
      })
      .catch(() => {
        Logic.Common.hideLoader()
      })
  }
}
