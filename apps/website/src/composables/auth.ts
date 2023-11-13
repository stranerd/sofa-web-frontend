import { Logic } from 'sofa-logic'
import { SignInInput, SignUpInput } from 'sofa-logic/src/logic/types/forms/auth'
import { reactive, ref } from 'vue'

const registerForm = reactive<SignUpInput & { confirm_password: string }>({
  email: '',
  name: {
    first: '',
    last: '',
  },
  password: '',
  confirm_password: '',
  organization_name: '',
  description: '',
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
    description: registerForm.description,
  }

  const formState: boolean = formComp.validate()

  if (!termsAccepted.value) {
    Logic.Common.showLoader({
      show: true,
      message: 'Please accept the terms and conditions',
      type: 'warning',
    })
    return
  }

  Logic.Auth.SignUp(formState)
    .then((data) => {
      if (data) {
        Logic.Common.hideLoader()
        Logic.Common.GoToRoute('/auth/verify-email')
      }
    })
    .catch((error) => {
      Logic.Common.showValidationError(error, formComp)
    })
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
        // do something else
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
    Logic.Auth.VerifyEmailWithToken(true).then((response) => {
      if (response) {
        // do something else
      }
    })
  } else {
    // show error
  }
}

export {
    SignIn,
    SignUp,
    VerifyUserEmail, loginForm, registerForm, termsAccepted
}
