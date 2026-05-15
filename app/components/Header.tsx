"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import React from 'react'
import { Menu } from "lucide-react"
import Image from 'next/image'

const Header = () => {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {}
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b border-border z-50 flex items-center justify-between px-3 sm:px-4">
      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="p-2 hover:bg-accent rounded-full transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
          <Image
            src="https://ik.imagekit.io/saadkamal/logo_nbSjlUO1b.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-full w-8 h-8"
            priority
            quality={75}
          />
          <span className="font-semibold text-lg sm:text-xl">vido</span>
        </Link>
      </div>

      {/* Right: Auth buttons */}
      <div className="flex items-center gap-2">
        <Link href="/signIn">
          <button className="inline-flex items-center justify-center text-sm font-medium h-8 rounded-md px-3 hover:bg-accent hover:text-accent-foreground transition-all">
            Sign In
          </button>
        </Link>
        <Link href="/signUp">
          <button className="inline-flex items-center justify-center text-sm font-medium h-8 rounded-md px-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
            Sign Up
          </button>
        </Link>
      </div>
    </header>
  )
}

export default Header