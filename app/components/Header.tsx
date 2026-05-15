"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import React, { useState } from 'react'
import { Menu, X, Upload } from 'lucide-react'
import Image from 'next/image'

const Header = () => {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try { await signOut() } catch {}
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14">
      {/* Glass bar */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md border-b border-white/[0.06]" />

      <div className="relative h-full flex items-center justify-between px-4 sm:px-6 max-w-screen-xl mx-auto">

        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
              <Image
                src="https://ik.imagekit.io/saadkamal/logo_nbSjlUO1b.png"
                alt="vido logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span
              className="text-white font-black text-lg tracking-tighter"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.04em' }}
            >
              vido
            </span>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/upload">
                <button className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg h-8 px-3 transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  Upload
                </button>
              </Link>

              <div className="flex items-center gap-2 pl-1">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-[11px] font-bold text-white ring-1 ring-white/10">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs font-medium text-white/40 hover:text-white/80 transition-colors hidden sm:block"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/signIn">
                <button className="h-8 px-3 rounded-lg text-xs font-semibold text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
                  Sign in
                </button>
              </Link>
              <Link href="/signUp">
                <button className="h-8 px-4 rounded-lg text-xs font-bold bg-white text-black hover:bg-white/90 transition-all">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-black/95 backdrop-blur-md border-b border-white/[0.06] py-3 px-4 flex flex-col gap-1 sm:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.06] transition-all">
            Home
          </Link>
          <Link href="/upload" onClick={() => setMenuOpen(false)} className="text-sm text-white/70 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.06] transition-all flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" /> Upload
          </Link>
          {session && (
            <button onClick={handleSignOut} className="text-left text-sm text-white/40 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.06] transition-all">
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Header