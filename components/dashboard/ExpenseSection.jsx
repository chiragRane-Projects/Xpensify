"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

const ExpenseSection = () => {
  const { data: session, status } = useSession()
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)) 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [weekFilter, setWeekFilter] = useState('current')

  // Fetch expenses when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchExpenses()
    }
  }, [status])

  // Filter expenses when weekFilter or expenses change
  useEffect(() => {
    filterExpenses()
  }, [weekFilter, expenses])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expense')
      const data = await response.json()
      if (response.ok) {
        setExpenses(data.expenses || [])
      } else {
        toast.error(data.error || 'Failed to fetch expenses')
      }
    } catch (error) {
      toast.error('Error fetching expenses')
      console.error('Fetch expenses error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (!description.trim()) {
      toast.error('Please enter a description')
      return
    }
    if (!date) {
      toast.error('Please select a date')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), description, date }),
      })
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setAmount('')
        setDescription('')
        setDate(new Date().toISOString().slice(0, 10)) // Reset to today
        await fetchExpenses() // Refresh expenses
      } else {
        toast.error(data.error || 'Failed to save expense')
      }
    } catch (error) {
      toast.error('Error saving expense')
      console.error('Save expense error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get start and end of a week (Monday to Sunday)
  const getWeekRange = (weeksBack = 0) => {
    const now = new Date()
    // Adjust to Monday of the target week
    const day = now.getDay() || 7 // Convert Sunday (0) to 7
    const daysToMonday = day - 1
    const start = new Date(now)
    start.setDate(now.getDate() - daysToMonday - weeksBack * 7)
    start.setHours(0, 0, 0, 0) // Start of day

    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    end.setHours(23, 59, 59, 999) // End of day

    return { start, end }
  }

  const filterExpenses = () => {
    let weekRange
    if (weekFilter === 'current') {
      weekRange = getWeekRange(0)
    } else {
      const weeksBack = parseInt(weekFilter)
      weekRange = getWeekRange(weeksBack)
    }

    const filtered = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= weekRange.start && expenseDate <= weekRange.end
    })

    setFilteredExpenses(filtered)
  }

  // Format date for display (e.g., "27 May 2025")
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      const options = { day: '2-digit', month: 'short', year: 'numeric' }
      return date.toLocaleDateString('en-IN', options).replace(/,/, '')
    } catch {
      return dateStr // Fallback
    }
  }

  // Week filter options
  const weekOptions = [
    { value: 'current', label: 'This Week' },
    { value: '1', label: 'Last Week' },
    { value: '2', label: '2 Weeks Ago' },
    { value: '3', label: '3 Weeks Ago' },
    { value: '4', label: '4 Weeks Ago' },
  ]

  if (status === 'unauthenticated') {
    return (
      <motion.div
        className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-white to-cyan-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900 text-lg md:text-xl text-center">
          Please sign in to manage your expenses.
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
        Track Your Expenses
      </motion.h2>

      {/* Expense Form */}
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
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-[family-name:var(--font-geist-sans)] text-cyan-900 bg-white border-cyan-300 focus:border-cyan-500 rounded-lg text-base"
            aria-label="Expense amount in Indian Rupees"
            min="0"
            step="0.01"
            disabled={isSubmitting || status === 'loading'}
          />
          <Input
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="font-[family-name:var(--font-geist-sans)] text-cyan-900 bg-white border-cyan-300 focus:border-cyan-500 rounded-lg text-base"
            aria-label="Expense description"
            disabled={isSubmitting || status === 'loading'}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="font-[family-name:var(--font-geist-sans)] text-cyan-900 bg-white border-cyan-300 focus:border-cyan-500 rounded-lg text-base"
            aria-label="Expense date"
            disabled={isSubmitting || status === 'loading'}
          />
          <Button
            type="submit"
            disabled={isSubmitting || status === 'loading'}
            className="bg-cyan-600 text-white font-[family-name:var(--font-geist-sans)] font-medium py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Add Expense'}
          </Button>
        </div>
      </motion.form>

      {/* Filter and Expense Cards */}
      <motion.div
        className="w-full max-w-5xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-[family-name:var(--font-geist-sans)] font-medium text-lg md:text-xl text-cyan-900">
            Your Expenses
          </h3>
          <Select value={weekFilter} onValueChange={setWeekFilter}>
            <SelectTrigger className="w-[180px] bg-background/95 border-cyan-300 text-cyan-900 rounded-lg">
              <SelectValue placeholder="Filter by week" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 border-cyan-200">
              {weekOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="font-[family-name:var(--font-geist-sans)] text-cyan-900 hover:bg-cyan-100"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpenses.length === 0 ? (
            <motion.p
              className="font-[family-name:var(--font-geist-sans)] text-cyan-700 text-center text-base md:text-lg col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              No expenses for the selected week. Add one above!
            </motion.p>
          ) : (
            filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense?._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              >
                <Card className="bg-background/95 backdrop-blur-md text-cyan-900 p-6 rounded-xl shadow-xl border border-cyan-200/50 hover:border-cyan-600/70 transition-all duration-300">
                  <CardTitle className="font-[family-name:var(--font-geist-sans)] font-medium text-lg mb-2">
                    ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </CardTitle>
                  <CardDescription className="font-[family-name:var(--font-geist-sans)] font-normal text-base">
                    <p>{expense.description}</p>
                    <p className="text-sm mt-1">{formatDate(expense.date)}</p>
                  </CardDescription>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ExpenseSection
