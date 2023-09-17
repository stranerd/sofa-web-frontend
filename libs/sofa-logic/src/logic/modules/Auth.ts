import {
  AppleAuthInput,
  GoogleAuthInput,
  ResetPasswordWithTokenInput,
  UpdatePasswordInput,
  UpdatePhoneInput,
  VerifyWithTokenInput,
} from './../types/forms/auth'
import { $api } from '../../services'
import Common from './Common'
import { Logic } from '..'
import { AuthResponse, AuthUser } from '../types/domains/auth'
import {
  SignInInput,
  SignUpInput,
  UpdateUserProfileInput,
  UpdateUserRoleInput,
} from '../types/forms/auth'

export default class Auth extends Common {
  constructor() {
    super()
    this.AccessToken = localStorage.getItem('access_token')
    this.AuthUser = localStorage.getItem('auth_user')
      ? JSON.parse(localStorage.getItem('auth_user') || '{}')
      : undefined
  }

  public AccessToken: string | null = null
  public AuthUser: AuthUser | undefined = undefined

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

  private RedirectUser = () => {
    if (!Logic.Auth.AuthUser.isEmailVerified) {
      this.SendVerificationEmail()
      Logic.Common.GoToRoute('/auth/verify-email')
    } else {
      Logic.Common.GoToRoute('/')
    }
  }

  public DetectVerification = (showAccountSetup: any) => {
    if (
      Logic.Auth.AuthUser.name &&
      Logic.Auth.AuthUser.phone &&
      Logic.Users.UserProfile.type
    ) {
      //
    } else {
      if (Logic.Common.mediaQuery() == 'sm') {
        Logic.Common.GoToRoute('/onboarding/account-setup')
      } else {
        
        showAccountSetup.value = true
      }
    }
  }

  public SetTokens = (AuthData: AuthResponse) => {
    localStorage.setItem(
      'AuthTokens',
      JSON.stringify({
        accessToken: AuthData.accessToken,
        refreshToken: AuthData.refreshToken,
      }),
    )

    localStorage.setItem('auth_user', JSON.stringify(AuthData.user))
  }

  public GetAuthUser = () => {
    return $api.auth.user.getAuthUser().then((response) => {
      this.AuthUser = response.data
      return response.data
    })
  }

  public DeleteUserAccount = () => {
    return $api.auth.user.deleteUserAccount().then((response) => {
      return response.data
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
        Logic.Common.GoToRoute('/auth/login')
        window.location.reload()
        localStorage.removeItem('AuthTokens')
        localStorage.removeItem('auth_user')
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
          if (Logic.Common.mediaQuery() == 'sm') {
            Logic.Common.GoToRoute('/onboarding/account-setup')
          } else {
            Logic.Common.GoToRoute('/')
          }
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
      .then((error) => {
        //
      })
  }

  public SendPasswordResetMail = (email: string) => {
    return $api.auth.passwords
      .sendResetPasswordMail({ email })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        //
      })
  }

  public ResetPasswordWithToken = (formIsValid: boolean) => {
    if (formIsValid && this.ResetPasswordWithTokenForm) {
      return $api.auth.passwords
        .resetPassword(this.ResetPasswordWithTokenForm)
        .then((response) => {
          //
        })
        .catch((error) => {
          //
        })
    }
  }

  public UpdatePassword = (formIsValid: boolean) => {
    if (formIsValid && this.UpdatePasswordForm) {
      return $api.auth.passwords
        .updatePassword(this.UpdatePasswordForm)
        .then((response) => {
          //
        })
        .then((error) => {
          //
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
        .then((response) => {
          //
          Logic.Common.hideLoader()
        })
        .catch((error) => {
          Logic.Common.hideLoader()
          //
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
        Logic.Common.hideLoader()
      })
      .catch((error) => {
        //
        Logic.Common.hideLoader()
      })
  }
}
