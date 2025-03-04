'use server'

import { createAuthSession, destroySession } from '@/lib/auth'
import { hashUserPassword, verifyPassword } from '@/lib/hash'
import { createUser, getUserByEmail } from '@/lib/user'
import { redirect } from 'next/navigation'

export const signup = async (prevState, formData) => {
  const emailRegex =
    /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const passwordRegex = /^.{5,}$/

  const email = formData.get('email').trim()
  const password = formData.get('password').trim()

  const errors = {
    email: !emailRegex.test(email)
      ? 'Please, enter the valid email address'
      : undefined,
    password: !passwordRegex.test(password)
      ? 'Please, use at least 5 symbols'
      : undefined
  }

  if (Object.values(errors).every((error) => error === undefined)) {
    const hashedPssword = hashUserPassword(password)
    try {
      const userId = createUser(email, hashedPssword)
      await createAuthSession(userId)
      redirect('/training')
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return {
          errors: {
            email: 'Such email already exists'
          }
        }
      }
      throw error
    }
  } else {
    return {
      errors
    }
  }
}

export const login = async (prevState, formData) => {
  const email = formData.get('email').trim()
  const password = formData.get('password').trim()

  const existingUser = getUserByEmail(email)

  if (!existingUser) {
    return {
      errors: {
        email: 'Could not authenticate user. Please, check your email.'
      }
    }
  }

  const isValidPassword = verifyPassword(existingUser.password, password)

  if (!isValidPassword) {
    return {
      errors: {
        password: 'Could not authenticate user. Please, check your password.'
      }
    }
  }
  await createAuthSession(existingUser.id)
  redirect('/training')
}

export const auth = async (mode, prevState, formData) => {
  if (mode === 'login') {
    return login(prevState, formData)
  }

  return signup(prevState, formData)
}

export const logout = async () => {
  await destroySession()
  redirect('/')
}
