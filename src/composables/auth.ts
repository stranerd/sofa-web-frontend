import { Logic } from 'sofa-logic'
import { SignInInput, SignUpInput } from 'sofa-logic/src/logic/types/forms/auth'
import { reactive, ref } from 'vue'
import { showAccountSetup } from './profile'

const registerForm = reactive<SignUpInput>({
  email: '',
  name: {
    first: '',
    last: '',
  },
  password: '',
})

const loginForm = reactive<SignInInput>({
  email: '',
  password: '',
})

const termsAccepted = ref(false)

const SignUp = (formComp: any) => {
  Logic.Auth.SignUpForm = {
    email: registerForm.email,
    name: {
      first: 'new',
      last: 'user',
    },
    password: registerForm.password,
    description: '',
  }

  const formState: boolean = formComp.validate()

  if (termsAccepted.value) {
    Logic.Auth.SignUp(formState).catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
  } else {
    // show error
  }
}

const SignIn = (formComp: any) => {
  Logic.Auth.SignInForm = {
    email: loginForm.email,
    password: loginForm.password,
  }

  const formState: boolean = formComp.validate()

  Logic.Auth.SignIn(formState)
    .then((data) => {
      if (data) {
        setTimeout(() => {
          if (Logic.Common.mediaQuery() == 'sm') {
            Logic.Common.GoToRoute('/onboarding/account-setup')
          } else {
            showAccountSetup.value = true
          }
        }, 600)
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
}

const VerifyUserEmail = (token: string) => {
  if (token) {
    Logic.Auth.VerifyWithTokenForm = {
      token,
    }
    Logic.Auth.VerifyEmailWithToken(true)
  } else {
    // show error
  }
}

export {
  registerForm,
  loginForm,
  termsAccepted,
  SignIn,
  SignUp,
  VerifyUserEmail,
}
