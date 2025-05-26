"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'


const DigitalClock = () => {
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      const seconds = now.getSeconds().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="text-cyan-500 font-orbitron font-bold text-xl md:text-3xl"
      initial={{ scale: 1, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {time || '00:00:00'}
    </motion.div>
  )
}

const HeroSection = () => {
  return (
    <motion.div
      className="min-h-[500px] bg-gradient-to-br from-white to-cyan-200 flex flex-col p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between">
        <DigitalClock />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <motion.h2
          className="font-bold text-4xl md:text-5xl text-cyan-900"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ textShadow: "0 2px 4px rgba(6, 182, 212, 0.3)" }}
        >
          XPENSIFY
        </motion.h2>
        <motion.p
          className="font-light text-lg md:text-xl text-gray-400 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ textShadow: "0 1px 2px rgba(6, 182, 212, 0.2)" }}
        >
          Manage your expenses and increase your savings
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/login">
            <Button
              className="bg-cyan-600 cursor-pointer text-white font-semibold text-lg px-6 py-3 rounded-xl hover:bg-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Button>
          </Link>
          
          <p className='text-sm font-light text-gray-500 mt-6'>Developed with 🎧 and ☕ by Chirag Vaibhav Rane</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HeroSection