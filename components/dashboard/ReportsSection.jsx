"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import * as XLSX from 'xlsx'

const ReportsSection = () => {
  const { data: session, status } = useSession()
  const [budget, setBudget] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [chartData, setChartData] = useState([])

  // Fetch data when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchBudget()
      fetchExpenses()
    }
  }, [status])

  const fetchBudget = async () => {
    try {
      const response = await fetch('/api/budget')
      const data = await response.json()
      if (response.ok) {
        setBudget(data.budget)
      } else {
        toast.error(data.error || 'Failed to fetch budget')
      }
    } catch (error) {
      toast.error('Error fetching budget')
      console.error('Fetch budget error:', error)
    }
  }

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

  // Prepare chart data when expenses change
  useEffect(() => {
    const dailyExpenses = {}
    expenses.forEach((expense) => {
      const date = new Date(expense.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      })
      if (!dailyExpenses[date]) {
        dailyExpenses[date] = { date, amount: 0, descriptions: [] }
      }
      dailyExpenses[date].amount += expense.amount
      dailyExpenses[date].descriptions.push(expense.description)
    })
    setChartData(Object.values(dailyExpenses))
  }, [expenses])

  // Calculate remaining budget
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = budget ? budget.amount - totalExpenses : 0

  // Format date for display (e.g., "27 May 2025")
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).replace(/,/, '')
    } catch {
      return dateStr
    }
  }

  // Export expenses to Excel
  const exportToExcel = () => {
    const exportData = expenses.map((expense) => ({
      Date: formatDate(expense.date),
      Amount: expense.amount,
      Description: expense.description,
    }))
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses')
    XLSX.write_file(workbook, 'Xpensify_Expenses.xlsx')
  }

  // Custom Tooltip for BarChart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background/95 backdrop-blur-md border border-cyan-200 p-3 rounded-lg shadow-lg">
          <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900 font-medium">{label}</p>
          <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900">
            Total: ₹{data.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900 mt-1">
            Expenses: {data.descriptions.join(', ')}
          </p>
        </div>
      )
    }
    return null
  }

  if (status === 'unauthenticated') {
    return (
      <motion.div
        className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-white to-cyan-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-[family-name:var(--font-geist-sans)] text-cyan-900 text-lg md:text-xl text-center">
          Please sign in to view reports.
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
        Financial Reports
      </motion.h2>

      {/* Bar Graph: Daily Expenses */}
      <motion.div
        className="w-full max-w-5xl mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="font-[family-name:var(--font-geist-sans)] font-medium text-lg md:text-xl text-cyan-900 mb-4">
          Daily Expense Breakdown
        </h3>
        <Card className="bg-background/95 backdrop-blur-md p-6 rounded-xl shadow-xl border border-cyan-200/50">
          {chartData.length === 0 ? (
            <p className="font-[family-name:var(--font-geist-sans)] text-cyan-700 text-center">
              No expenses to display.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#0e7490" />
                <YAxis stroke="#0e7490" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </motion.div>

      {/* Remaining Budget */}
      <motion.div
        className="w-full max-w-5xl mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="font-[family-name:var(--font-geist-sans)] font-medium text-lg md:text-xl text-cyan-900 mb-4">
          Budget Overview
        </h3>
        <Card className="bg-background/95 backdrop-blur-md p-6 rounded-xl shadow-xl border border-cyan-200/50 flex flex-col items-center">
          <CardTitle className="font-[family-name:var(--font-geist-sans)] font-medium text-lg text-cyan-900 mb-2">
            Remaining Budget for {budget?.month || 'May 2025'}
          </CardTitle>
          <CardDescription className="font-[family-name:var(--font-geist-sans)] font-normal text-2xl text-cyan-900">
            ₹{remainingBudget.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </CardDescription>
          <p className="font-[family-name:var(--font-geist-sans)] text-cyan-700 text-sm mt-2">
            Total Budget: ₹{(budget?.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            {' '} | Total Expenses: ₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </motion.div>

      {/* Export to Excel */}
      <motion.div
        className="w-full max-w-5xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <h3 className="font-[family-name:var(--font-geist-sans)] font-medium text-lg md:text-xl text-cyan-900 mb-4">
          Export Expenses
        </h3>
        <Button
          onClick={exportToExcel}
          disabled={expenses.length === 0 || status === 'loading'}
          className="bg-cyan-600 text-white font-[family-name:var(--font-geist-sans)] font-medium py-3 rounded-lg hover:bg-cyan-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Export to Excel
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default ReportsSection