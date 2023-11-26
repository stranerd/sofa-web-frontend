import { capitalize } from 'vue'
import { Logic } from '..'
import { $api } from '../../services'
import { AuthResponse, AuthUser } from '../types/domains/auth'
import {
  SignInInput,
  SignUpInput,
  UpdateUserProfileInput,
  UpdateUserRoleInput,
} from '../types/forms/auth'
import {
  AppleAuthInput,
  GoogleAuthInput,
  ResetPasswordWithTokenInput,
  UpdatePasswordInput,
  UpdatePhoneInput,
  VerifyWithTokenInput,
} from './../types/forms/auth'
import Common from './Common'

export default class Auth extends Common {
  private redirectToName = 'redirect-to'
  private authTokensStorageName = 'AuthTokens'

  public AuthUser: AuthUser | undefined = undefined
  public RefreshIsActive = false

  // input data
  public UpdateUserProfileForm: UpdateUserProfileInput | undefined
  public UpdateUserRolesForm: UpdateUserRoleInput | undefined
  public SignUpForm: SignUpInput | undefined
  public SignInForm: SignInInput | undefined
  public VerifyWithTokenForm: VerifyWithTokenInput | undefined
  public ResetPasswordWithTokenForm: ResetPasswordWithTokenInput | undefined
  public UpdatePasswordForm: UpdatePasswordInput | undefined
  public GoogleSignInForm: GoogleAuthInput | undefined
  public AppleSignInForm: AppleAuthInput | undefined
  public SendPhoneVerificationForm: UpdatePhoneInput | undefined

  async getRedirectToRoute () {
    const value = localStorage.getItem(this.redirectToName)
    if (value) localStorage.removeItem(value)
    return value
  }

  async setRedirectToRoute (value: string) {
    localStorage.setItem(this.redirectToName, value)
  }

  private RedirectUser = async () => {
    if (!Logic.Auth.AuthUser.isEmailVerified) {
      await this.SendVerificationEmail()
      await Logic.Common.GoToRoute('/auth/verify-email')
    } else {
      await Logic.Users.GetUserProfile()
      await this.DetectVerification()
    }
  }

  public DetectVerification = async () => {
    if (Logic.Users.UserProfile?.type) {
      if (window.location.pathname.startsWith('/auth')) {
        await Logic.Common.GoToRoute((await this.getRedirectToRoute()) ?? '/')
      }
    } else {
      await Logic.Common.GoToRoute('/onboarding')
    }
  }

  public SetTokens = (AuthData: AuthResponse) => {
    localStorage.setItem(
      this.authTokensStorageName,
      JSON.stringify({
        accessToken: AuthData.accessToken,
        refreshToken: AuthData.refreshToken,
      })
    )
  }

  public GetTokens = async () : Promise<Omit<AuthResponse, 'user'> | undefined> => {
    const savedTokens = localStorage.getItem(this.authTokensStorageName)
	  return savedTokens ? JSON.parse(savedTokens) : undefined
  }

  public GetAuthUser = () => {
    return $api.auth.user.getAuthUser().then((response) => {
      this.AuthUser = response.data
      return response.data
    })
  }

  public DeleteUserAccount = () => {
    return $api.auth.user
      .deleteUserAccount()
      .then(async (response) => {
        await this.DeleteTokens()
        window.location.href = '/auth/login'
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
  }

  public async DeleteTokens () {
    localStorage.removeItem(this.authTokensStorageName)
  }

  public UpdateUserProfile = (
    formIsValid: boolean,
    uploadProgress: Function,
    showLoader = true,
  ) => {
    if (formIsValid && this.UpdateUserProfileForm) {
      if (showLoader) {
        Logic.Common.showLoader({
          loading: true,
          show: false,
        })
      }

      return $api.auth.user
        .updateUserProfile(this.UpdateUserProfileForm, uploadProgress)
        .then((response) => {
          this.AuthUser = response.data
          Logic.Users.GetUserProfile()
          Logic.Common.hideLoader()
          return response.data
        })
        .catch((error) => {
          Logic.Common.hideLoader()
          // error handler
        })
    }
  }

  public UpdateUserRoles = (formIsValid: boolean) => {
    if (formIsValid && this.UpdateUserRolesForm) {
      $api.auth.user
        .updateUserRoles(this.UpdateUserRolesForm)
        .then((response) => {
          // do something
        })
        .catch((error) => {
          // error handler
        })
    }
  }

  public SetSuperAdminRole = () => {
    return $api.auth.user
      .setSuperAdminRoles()
      .then((response) => {
        //
      })
      .catch((error) => {
        //
      })
  }

  public SignOut = () => {
    $api.auth.user
      .signOut()
      .then(async (response) => {
        await this.DeleteTokens()
        window.location.assign('/auth/login')
      })
      .catch((error) => {
        //
      })
  }

  public SendVerificationEmail = () => {
    return $api.auth.email
      .sendVerificationMail()
      .then((response) => {})
      .then((error) => {})
  }

  public SignUp = (SignUpForm: SignUpInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.email
      .signUp(SignUpForm)
      .then((response) => {
        Logic.Auth.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public SignIn = (SignInForm: SignInInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.email
      .signIn(SignInForm)
      .then((response) => {
        Logic.Auth.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public GoogleSignIn = (GoogleSignInForm: GoogleAuthInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.identities
      .googleSignIn(GoogleSignInForm)
      .then((response) => {
        this.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public AppleSignIn = (AppleSignInForm: AppleAuthInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.identities
      .appleSignIn(AppleSignInForm)
      .then((response) => {
        this.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public VerifyEmailWithToken = (VerifyEmailWithToken: VerifyWithTokenInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.email
      .verifyEmail(this.VerifyWithTokenForm)
      .then((response) => {
        this.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public RefreshAuthToken = () => {
    return $api.auth.token
      .exchangeToken()
      .then((response) => {
        this.AuthUser = response.data.user
        this.SetTokens(response.data)
        return response.data
      })
  }

  public SendPasswordResetMail = (email: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.passwords
      .sendResetPasswordMail({ email })
      .then((response) => {
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public ResetPasswordWithToken = (ResetPasswordWithTokenForm: ResetPasswordWithTokenInput) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.passwords
      .resetPassword(ResetPasswordWithTokenForm)
      .then((response) => {
        Logic.Auth.AuthUser = response.data.user
        Logic.Common.hideLoader()
        return response.data
      })
  }

  public UpdatePassword = (formIsValid: boolean) => {
    if (formIsValid && this.UpdatePasswordForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.passwords
        .updatePassword(this.UpdatePasswordForm)
        .then((response) => {
          return response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public SendPhoneVerification = (formIsValid: boolean) => {
    if (formIsValid && this.SendPhoneVerificationForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.phone
        .sendVerifyPhone(this.SendPhoneVerificationForm)
        .finally(() => {
          Logic.Common.hideLoader()
        })
    }
  }

  public VerifyPhone = (token: string) => {
    Logic.Common.showLoader({
      loading: true,
      show: false,
    })
    return $api.auth.phone
      .verifyPhone({ token })
      .then((response) => {
        this.AuthUser = response.data.user
        Logic.Users.GetUserProfile()
        this.SetTokens(response.data)
      })
      .finally(() => {
        Logic.Common.hideLoader()
      })
  }
}
