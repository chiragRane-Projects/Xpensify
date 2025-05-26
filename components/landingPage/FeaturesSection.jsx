"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardTitle, CardDescription } from '../ui/card'

const features = [
  {
    icon: "📊",
    title: "Monthly Budgeting",
    description: "Set monthly budgets and track spending to stay within your financial goals.",
  },
  {
    icon: "📈",
    title: "Visual Reports",
    description: "Access visually appealing reports and export them as Excel sheets for detailed analysis.",
  },
  {
    icon: "🛡️",
    title: "Data Safety",
    description: "Your data is protected with industry-standard encryption and security measures.",
  },
]

const FeaturesSection = () => {
  return (
    <div className="min-h-[500px] px-6 py-12 bg-gradient-to-br from-white to-sky-200 flex flex-col items-center">
      <motion.h2
        className="font-[family-name:var(--font-geist-sans)] font-medium text-2xl md:text-4xl text-sky-900 text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textShadow: "0 2px 4px rgba(14, 165, 233, 0.3)" }}
      >
        Features Xpensify Offers
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            <Card
              className="bg-white text-black p-6 rounded-2xl shadow-xl border border-sky-200/50 hover:border-sky-500/70 transition-all duration-300 flex flex-col items-center text-center h-full"
            >
              <span className="text-4xl mb-4">{feature.icon}</span>
              <CardTitle className="font-[family-name:var(--font-geist-sans)] font-medium text-xl mb-2">
                {feature.title}
              </CardTitle>
              <CardDescription className="font-[family-name:var(--font-geist-sans)] font-normal text-base text-sky-800">
                {feature.description}
              </CardDescription>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FeaturesSection