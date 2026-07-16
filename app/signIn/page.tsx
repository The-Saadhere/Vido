"use client";
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const router = useRouter()

  if (session) router.push("/")

  const handleLogin = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await signIn("credentials", { email, password, redirect: false })
      if (res?.error) {
        setError("Invalid email or password")
        return
      }
      router.push("/")
    } catch {
      setError("An error occurred while signing in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-5 pt-16">
      <div className="relative w-full max-w-[380px]">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#111]/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="mb-10 text-center">
          <Link href="/">
            <span className="text-[#111] font-semibold text-3xl tracking-tight">
              vido
            </span>
          </Link>
          <p className="text-xs text-[#999] mt-3 tracking-wide">
            Welcome back
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_0_0_1px_#e8e8e8,0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col gap-5">

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[#666] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#999] focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[#666]"
                >
                  Password
                </label>
                <button className="text-xs text-[#999] hover:text-[#666] transition-colors duration-200">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-[#fafafa] border border-[#e8e8e8] rounded-xl px-4 py-3 pr-11 text-sm text-[#111] placeholder:text-[#bbb] focus:outline-none focus:border-[#999] focus:bg-white transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#666] transition-colors duration-200"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-500">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-1 flex items-center justify-center gap-2 bg-[#111] text-white font-medium text-sm py-3 rounded-xl hover:bg-[#333] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-[#999] mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/signUp" className="text-[#111] hover:text-[#333] transition-colors duration-200 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
