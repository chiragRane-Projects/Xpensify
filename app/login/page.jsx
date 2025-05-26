"use client"

import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { signIn } from 'next-auth/react'

const LoginPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-white to-cyan-100">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="absolute text-sm text-cyan-700 font-medium mt-20 animate-pulse">
            Checking session...
          </span>
        </div>
      </div>
    );
  }
  

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white to-cyan-200 flex flex-col items-center justify-center p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="font-[family-name:var(--font-geist-sans)] font-medium text-3xl md:text-4xl text-cyan-900 mb-8 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(6, 182, 212, 0.3)" }}
      >
        Start Your Journey with Xpensify
      </motion.h2>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            className="w-full bg-background/95 backdrop-blur-md text-cyan-900 font-medium text-lg py-6 rounded-xl shadow-lg hover:bg-cyan-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => signIn("google")}
          >
            <FaGoogle className="text-xl" />
            Get Started with Google
          </Button>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button
            className="w-full bg-background/95 backdrop-blur-md text-cyan-900 font-medium text-lg py-6 rounded-xl shadow-lg hover:bg-cyan-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => signIn("github")}
          >
            <FaGithub className="text-xl" />
            Get Started with GitHub
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default LoginPage
