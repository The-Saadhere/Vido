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
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 pt-14"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="mb-8 text-center">
          <Link href="/">
            <span
              className="text-white font-black text-3xl tracking-tighter"
              style={{ letterSpacing: "-0.05em" }}
            >
              vido
            </span>
          </Link>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/20 font-semibold mt-2">
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-1.5"
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
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-semibold uppercase tracking-widest text-white/30"
                >
                  Password
                </label>
                <button className="text-[10px] text-white/25 hover:text-white/60 transition-colors font-mono">
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
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5 pr-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-400 font-mono">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-1 flex items-center justify-center gap-2 bg-white text-black font-bold text-sm py-2.5 rounded-xl hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-white/25 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signUp" className="text-white/60 hover:text-white transition-colors font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login