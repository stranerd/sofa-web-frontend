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
  redirectToName = 'redirect-to'
  private authTokensStorageName = 'AuthTokens'

  public AuthUser: AuthUser | undefined = undefined
  public TokenRefreshWatcher: any = null
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
        await Logic.Common.GoToRoute(localStorage.getItem(this.redirectToName) ?? '/')
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
      // register auth watcher

      return response.data
    })
  }

  public DeleteUserAccount = () => {
    return $api.auth.user
      .deleteUserAccount()
      .then((response) => {
        localStorage.removeItem(this.authTokensStorageName)

        window.location.href = '/auth/login'
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
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
      .then((response) => {
        //

        localStorage.removeItem(this.authTokensStorageName)

        clearInterval(this.TokenRefreshWatcher)

        Logic.Common.GoToRoute('/auth/login')

        window.location.reload()
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

  public SignUp = (formIsValid: boolean) => {
    if (formIsValid && this.SignUpForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.email
        .signUp(this.SignUpForm)
        .then((response) => {
          Logic.Auth.AuthUser = response.data.user
          this.SetTokens(response.data)
          this.SendVerificationEmail()
          return response.data
        })
        .catch((error) => {
          // handle error

          throw error
        })
    }
  }

  public SignIn = (formIsValid: boolean) => {
    if (formIsValid && this.SignInForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.email
        .signIn(this.SignInForm)
        .then((response) => {
          Logic.Auth.AuthUser = response.data.user
          this.SetTokens(response.data)
          Logic.Common.hideLoader()
          this.RedirectUser()

          return response.data.user
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public GoogleSignIn = () => {
    if (this.GoogleSignInForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.identities
        .googleSignIn(this.GoogleSignInForm)
        .then((response) => {
          this.AuthUser = response.data.user
          this.SetTokens(response.data)
          this.RedirectUser()
          Logic.Common.hideLoader()

          return response.data.user
        })
        .catch((error) => {
          throw error
        })
    }
  }

  public AppleSignIn = () => {
    if (this.AppleSignInForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.identities
        .appleSignIn(this.AppleSignInForm)
        .then((response) => {
          this.AuthUser = response.data.user
          this.SetTokens(response.data)

          this.RedirectUser()
          Logic.Common.hideLoader()

          return response.data.user
        })
        .catch((error) => {
          //
        })
    }
  }

  public VerifyEmailWithToken = (formIsValid: boolean) => {
    if (formIsValid && this.VerifyWithTokenForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.email
        .verifyEmail(this.VerifyWithTokenForm)
        .then((response) => {
          this.AuthUser = response.data.user
          this.SetTokens(response.data)
          Logic.Common.hideLoader()
          Logic.Users.GetUserProfile()
          this.RedirectUser()

          return response.data.user
        })
        .catch((error) => {
          //
        })
    }
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
        Logic.Common.showLoader({
          show: true,
          message: 'A password reset token has been sent to your email',
          type: 'success',
        })
        return response.data
      })
      .catch((error) => {
        Logic.Common.showError(capitalize(error.response.data[0]?.message))
      })
  }

  public ResetPasswordWithToken = (formIsValid: boolean) => {
    if (formIsValid && this.ResetPasswordWithTokenForm) {
      Logic.Common.showLoader({
        loading: true,
        show: false,
      })
      return $api.auth.passwords
        .resetPassword(this.ResetPasswordWithTokenForm)
        .then((response) => {
          Logic.Auth.AuthUser = response.data.user
          this.SetTokens(response.data)
          Logic.Common.hideLoader()
          Logic.Users.GetUserProfile().then(() => {
            this.RedirectUser()
          })

          return response.data
        })
        .catch((error) => {
          Logic.Common.showError(capitalize(error.response.data[0]?.message))
        })
    }
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
