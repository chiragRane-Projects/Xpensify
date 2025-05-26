"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const BudgetSection = () => {
  const { data: session, status } = useSession()
  const [budgets, setBudgets] = useState([])
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Current month in YYYY-MM format for API
  const currentMonth = new Date().toISOString().slice(0, 7)

  // Fetch budgets when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchBudgets()
    }
  }, [status])

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budget')
      const data = await response.json()
      if (response.ok) {
        // Normalize API response: convert single budget to array
        const budgetList = data.budget ? (Array.isArray(data.budget) ? data.budget : [data.budget]) : []
        setBudgets(budgetList)
      } else {
        toast.error(data.error || 'Failed to fetch budgets')
      }
    } catch (error) {
      toast.error('Error fetching budgets')
      console.error('Fetch budgets error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), month: currentMonth }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setAmount('')
        await fetchBudgets() // Refresh budgets
      } else {
        toast.error(data.error || 'Failed to save budget')
      }
    } catch (error) {
      toast.error('Error saving budget')
      console.error('Save budget error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format month for display (e.g., "May 2025")
  const formatMonth = (month) => {
    try {
      const date = new Date(month)
      return date.toLocaleString('default', { month: 'long', year: 'numeric' })
    } catch {
      return month // Fallback to raw month if invalid
    }
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <motion.div
        className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-white to-cyan-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900 text-lg md:text-xl">
          Please sign in to manage your budgets.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="min-h-[500px] bg-gradient-to-br from-white to-cyan-200 px-6 py-12 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <motion.h2
        className="font-[family-name:var(--font-geist-sans)] font-medium text-2xl md:text-4xl text-cyan-900 mb-10 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ textShadow: '0 2px 4px rgba(6, 182, 212, 0.3)' }}
      >
        Manage Your Monthly Budgets
      </motion.h2>

      {/* Budget Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 bg-background/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-cyan-200/50">
          <Input
            type="number"
            placeholder="Enter budget amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-[family-name:var(--font-geist-sans)] text-cyan-900 bg-white border-cyan-300 focus:border-cyan-500 rounded-lg text-base"
            aria-label="Budget amount in Indian Rupees"
            min="0"
            step="0.01"
            disabled={isSubmitting || status === 'loading'}
          />
          <Button
            type="submit"
            disabled={isSubmitting || status === 'loading'}
            className="bg-cyan-600 text-white font-[family-name:var(--font-geist-sans)] font-medium py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Set Budget'}
          </Button>
        </div>
      </motion.form>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {budgets.length === 0 ? (
          <motion.p
            className="font-[family-name:var(--font-geist-sans)] text-cyan-700 text-center text-base md:text-lg col-span-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            No budgets set yet. Add one above!
          </motion.p>
        ) : (
          budgets.map((budget, index) => (
            <motion.div
              key={budget?._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            >
              <Card className="bg-background/95 backdrop-blur-md text-cyan-900 p-6 rounded-xl shadow-xl border border-cyan-200/50 hover:border-cyan-600/70 transition-all duration-300">
                <CardTitle className="font-[family-name:var(--font-geist-sans)] font-medium text-lg mb-2">
                  {formatMonth(budget.month)}
                </CardTitle>
                <CardDescription className="font-[family-name:var(--font-geist-sans)] font-normal text-base">
                  Budget: ₹{budget.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </CardDescription>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default BudgetSection