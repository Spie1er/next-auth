'use server'

import { hashUserPassword } from '@/lib/hash'
import { createUser } from '@/lib/user'
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
      : undefined,
  }

  if (Object.values(errors).every((error) => error === undefined)) {
    const hashedPssword = hashUserPassword(password)
    try {
      createUser(email, hashedPssword)
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return {
          errors: {
            email: 'Such email already exists',
          },
        }
      }
      throw error
    }

    redirect('/training')
  } else {
    return {
      errors,
    }
  }
}
