import { Logic } from 'sofa-logic'
import { SignInInput, SignUpInput } from 'sofa-logic/src/logic/types/forms/auth'
import { reactive, ref } from 'vue'

const registerForm = reactive<SignUpInput>({
  email: '',
  name: {
    first: '',
    last: '',
  },
  password: '',
  organization_name: '',
  description: '',
})

const loginForm = reactive<SignInInput>({
  email: '',
  password: '',
})


const termsAccepted = ref(false)

const SignUp = (formComp: any, accountType = 'student') => {
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

  if (accountType == 'organization' && registerForm.description == '') {
    return
  }

  if (accountType == 'organization') {
    const fullNameArray = registerForm.organization_name.split(' ')
    Logic.Auth.SignUpForm.name.first = fullNameArray[0]
    Logic.Auth.SignUpForm.name.last = fullNameArray[1] ? fullNameArray[1] : ''
  }

  if (termsAccepted.value) {
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
  } else {
    // show error
    Logic.Common.showLoader({
      show: true,
      message: 'Please accept the terms and conditions',
      type: 'warning',
    })
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
