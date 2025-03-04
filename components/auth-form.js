'use client'

import Link from 'next/link'
import { useFormState } from 'react-dom'
import { signup } from '@/actions/auth-actions'

export default function AuthForm() {
  const [formState, formAction] = useFormState(signup, {})
  return (
    <form id='auth-form' action={formAction}>
      <div>
        <img src='/images/auth-icon.jpg' alt='A lock icon' />
      </div>
      <div className='form-group'>
        <label htmlFor='email'>Email</label>
        <input type='email' name='email' id='email' />
        {formState.errors?.email && (
          <p className='form-errors'>{formState.errors.email}</p>
        )}
      </div>
      <div className='form-group'>
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' />
        {formState.errors?.password && (
          <p className='form-errors'>{formState.errors.password}</p>
        )}
      </div>
      <p>
        <button type='submit'>Create Account</button>
      </p>
      <p>
        <Link href='/'>Login with existing account.</Link>
      </p>
    </form>
  )
}
