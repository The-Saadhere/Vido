"use client";
import  { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Login = () => {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    // successful login
    router.push("/");

  } catch (error) {
    setError("An error occurred while signing in");
  } finally {
    setLoading(false);
  }
};
if (session) {
  router.push("/")
}
  return (
    <>
    <div className='w-full flex-col h-[90vh] flex items-center justify-center'>
    <h2 className='text-2xl font-bold'>Welcome back</h2>
    <p className='text-gray py-2'>Please sign in to continue</p>
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
    <button onClick={()=>{handleLogin()}} className='w-full mt-4 bg-black text-white py-3 rounded-2xl'>{loading ? <div className='loading-spinner text-white'></div> : "Sign In"}</button>
    </div>

    </div>
    </>
  )
}

export default Login