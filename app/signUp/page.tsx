'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()
    const handleSubmit = async () => { 
        // Handle sign-up logic here, such as form validation and API calls to create a new user account.
        // For example, you might want to check if the password and confirmPassword match, and then send a request to your backend API to create the user.
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
        try {
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (res.ok) {
            // Registration successful, redirect to login page or home page
            router.push("/signIn")
        } else {
            // Handle registration error, such as displaying an error message
            setError(data.message || "Registration failed")
        }
        } catch (error) {
            setError("An error occurred while signing up")
        }
    }
  return ( <>
    <div className='w-full flex-col h-[90vh] flex items-center justify-center'>
    <h2 className='text-2xl font-bold'>Create an account</h2>
    <p className='text-gray py-2'>Sign Up to get Started</p>
    <div className='max-w-lg w-full flex flex-col gap-2 px-4'>
    <label className='font-bold' htmlFor="email">Email</label>
    <input
      type="email"
      id="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
    />
    <label className='font-bold mt-4' htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
    />
    <label className='font-bold mt-4' htmlFor="confirmPassword">Confirm Password</label>
    <input
      type="password"
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      className='border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-black'
    />
    <button onClick={handleSubmit} className='w-full mt-4 bg-black text-white py-3 rounded-2xl'>Sign Up</button>
    </div>

    </div>
    </>
  )
}

export default SignUp