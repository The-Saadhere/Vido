"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { Menu, X, Upload } from 'lucide-react'
import Image from 'next/image'

const Header = () => {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)

  useEffect(() => {
    if (!showSignInPrompt) return;
    const t = setTimeout(() => setShowSignInPrompt(false), 3000);
    return () => clearTimeout(t);
  }, [showSignInPrompt]);

  const handleSignOut = async () => {
    try { await signOut() } catch {}
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <div className="absolute inset-0 bg-[#fafafa]/80 backdrop-blur-xl border-b border-[#e8e8e8]" />

      <div className="relative h-full flex items-center justify-between px-5 sm:px-8 max-w-[1200px] mx-auto">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#999] hover:text-[#111] hover:bg-[#f0f0f0] transition-all duration-200"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Vido home">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3d3d] to-[#ff7a18] shadow-sm ring-1 ring-[#f5d1d1] transition-transform duration-200 group-hover:scale-105">
              <div className="h-0 w-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-white ml-0.5" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[#111] text-[1.15rem] font-black tracking-[-0.06em]">vido</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff5a36]">play</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link href="/upload-video">
                <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#111] hover:bg-[#f0f0f0] rounded-full h-9 px-4 transition-all duration-200">
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </Link>

              <div className="flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-xs font-medium text-white">
                  {session.user?.name?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-[#999] hover:text-[#111] transition-colors duration-200 hidden sm:block"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowSignInPrompt(true)}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#666] hover:text-[#111] hover:bg-[#f0f0f0] rounded-full h-9 px-4 transition-all duration-200"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
              <Link href="/signIn">
                <button className="h-9 px-4 rounded-full text-sm font-medium text-[#666] hover:text-[#111] hover:bg-[#f0f0f0] transition-all duration-200">
                  Sign in
                </button>
              </Link>
              <Link href="/signUp">
                <button className="h-9 px-5 rounded-full text-sm font-medium bg-[#111] text-white hover:bg-[#333] transition-all duration-200">
                  Get started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {showSignInPrompt && (
        <div className="fixed top-20 right-6 z-50">
          <div className="rounded-lg bg-white border border-[#e8e8e8] px-4 py-2 shadow-md text-sm text-[#111]">
            Please sign in to upload videos.
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#fafafa]/95 backdrop-blur-xl border-b border-[#e8e8e8] py-3 px-5 flex flex-col gap-1 sm:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-[#666] hover:text-[#111] py-2.5 px-4 rounded-xl hover:bg-[#f0f0f0] transition-all duration-200">
            Home
          </Link>
          <Link href="/upload-video" onClick={() => setMenuOpen(false)} className="text-sm text-[#666] hover:text-[#111] py-2.5 px-4 rounded-xl hover:bg-[#f0f0f0] transition-all duration-200 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </Link>
          {session && (
            <button onClick={handleSignOut} className="text-left text-sm text-[#999] hover:text-[#111] py-2.5 px-4 rounded-xl hover:bg-[#f0f0f0] transition-all duration-200">
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  )
}

export default Header
