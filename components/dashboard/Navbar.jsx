"use client"

import React from 'react'
import { useSession, signOut } from 'next-auth/react' // For user session
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar' // UI components
import { motion } from 'framer-motion' // For animations
import { Button } from '@/components/ui/button' // For logout button
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu' // For profile menu

const Navbar = () => {
  // Get user session data (name, image) from NextAuth
  const { data: session, status } = useSession()

  // Animation variants for reusability
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (delay) => ({ opacity: 1, x: 0, transition: { delay, duration: 0.5 } }),
  }

  return (
    // Navbar with frosted-glass effect and cyan border
    <motion.nav
      className="bg-background/95 backdrop-blur-md border-b border-cyan-200/50 px-6 py-4 flex items-center justify-between sticky top-0 z-50"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      {/* User greeting */}
      <motion.h1
        className="font-[family-name:var(--font-geist-sans)] font-medium text-xl md:text-2xl text-cyan-900"
        custom={0.2} // Delay for animation
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        style={{ textShadow: "0 1px 2px rgba(6, 182, 212, 0.2)" }}
      >
        {status === 'loading' ? (
          'Loading...' // Show while session is loading
        ) : session && session.user ? (
          `Welcome, ${session.user.name || 'User'}!` // Show user name
        ) : (
          'Welcome, Guest!' // Fallback for no session
        )}
      </motion.h1>

      {/* User avatar with dropdown menu */}
      <motion.div
        custom={0.4} // Delay for animation
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-10 w-10 border border-cyan-500/50 hover:border-cyan-600/70 transition-all duration-300 cursor-pointer">
              <AvatarImage
                src={session?.user?.image || ''} // User image from session
                alt={session?.user?.name || 'User Avatar'} // Accessible alt text
              />
              <AvatarFallback className="bg-cyan-100 text-cyan-900 font-[family-name:var(--font-geist-sans)] font-medium">
                {session?.user?.name
                  ? session.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase() // Dynamic initials
                  : 'CN'} {/* Fallback initials */}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background/95 backdrop-blur-md border-cyan-200/50"
          >
            {session?.user && (
              <DropdownMenuItem
                className="font-[family-name:var(--font-geist-sans)] font-normal text-cyan-900 hover:bg-cyan-100"
                onClick={() => signOut({ callbackUrl: '/' })} // Logout action
              >
                Sign Out
              </DropdownMenuItem>
            )}
            {!session && (
              <DropdownMenuItem
                className="font-[family-name:var(--font-geist-sans)] font-normal text-cyan-900 hover:bg-cyan-100"
                disabled
              >
                Guest
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar