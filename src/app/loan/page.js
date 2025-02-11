'use client'

import { Navbar } from '../../components/navbar'
import { Footer } from '../../components/footer'
import LoanCard from '../../components/LoanCard'
import { useState, useEffect, useCallback, useRef } from 'react'
import CreateLoanModal from '../../components/CreateLoanModal'
import { motion } from 'framer-motion'
import { getBackendUrl, getTokensList } from '../../lib/configs'
import { HiViewGrid } from 'react-icons/hi'
import Matter from 'matter-js'
import LoanBubble from '../../components/LoanBubble'
import { RiBubbleChartLine } from "react-icons/ri";


export default function LoanPage() {
  const [activeFilter, setActiveFilter] = useState('pending')
  const backendUrl = getBackendUrl();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  })
  const [tokenPrices, setTokenPrices] = useState({})
  const [rawLoans, setRawLoans] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const containerRef = useRef(null)
  const [engine, setEngine] = useState(null)
  const [runner, setRunner] = useState(null)

  const fetchTokenPrices = useCallback(async () => {
    try {
      const tokensList = getTokensList()
      const prices = {}
      
      for (const token of tokensList) {
        const response = await fetch(`${backendUrl}/api/market-data?assetId=${token.id}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        prices[token.id] = data.priceUSD
      }
      
      setTokenPrices(prices)
    } catch (error) {
      console.error('Error fetching token prices:', error)
    }
  }, [backendUrl])

  useEffect(() => {
    fetchTokenPrices()
    // Refresh prices every minute
    const interval = setInterval(fetchTokenPrices, 60000)
    return () => clearInterval(interval)
  }, [fetchTokenPrices])

  const fetchLoans = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const limit = 12
      const skip = (page - 1) * limit
      const url = `${backendUrl}/api/loans?limit=${limit}&skip=${skip}`

      const response = await fetch(url)
      const data = await response.json()
      
      setRawLoans(data.loans)

      const transformedLoans = data.loans
        .map(loan => {
          const createdAtTimestamp = new Date(loan.createdAt).getTime()
          const endDate = createdAtTimestamp + Number(loan.duration)
          const isTerminated = Date.now() > endDate

          const collateralValueUSD = (loan.collateralAmount * tokenPrices[loan.collateralToken]) || 0
          const loanValueUSD = (loan.tokenAmount * tokenPrices[loan.tokenRequested]) || 0
          const collateralRatio = loanValueUSD > 0 ? (collateralValueUSD / loanValueUSD) * 100 : 0

          return {
            value: loan.tokenAmount,
            currency: loan.tokenRequested,
            collateralAmount: loan.collateralAmount,
            collateralCurrency: loan.collateralToken,
            term: Number(loan.duration) / (30 * 24 * 60 * 60 * 1000),
            interest: Number(loan.interest),
            lender: loan.loanee,
            borrower: loan.creator,
            status: isTerminated ? 'terminated' : (loan.active ? 'active' : 'pending'),
            id: loan.id,
            liquidation: loan.liquidation,
            canLiquidate: loan.canLiquidate,
            collateralRatio: collateralRatio,
            collateralValueUSD,
            loanValueUSD,
            createdAt: loan.createdAt,
            duration: loan.duration
          }
        })
        .filter(loan => loan.status !== 'terminated')
        .filter(loan => {
          if (activeFilter === 'all loans') return true;
          if (activeFilter === 'active') return loan.status === 'active';
          if (activeFilter === 'pending') return loan.status === 'pending';
          if (activeFilter === 'high apr') return loan.interest >= 15;
          if (activeFilter === 'low risk') return loan.collateralRatio >= 400;
          return true;
        })
        .filter(loan => loan.collateralRatio >= 150)

      setLoans(transformedLoans)
      setPagination({
        currentPage: data.page,
        totalPages: Math.ceil(transformedLoans.length / limit),
        total: transformedLoans.length
      })
    } catch (error) {
      console.error('Error fetching loans:', error)
    } finally {
      setLoading(false)
    }
  }, [activeFilter, tokenPrices, backendUrl])

  useEffect(() => {
    fetchLoans(1)
  }, [fetchLoans])

  useEffect(() => {
    if (viewMode !== 'bubble') return

    if (engine) {
      Matter.Engine.clear(engine)
      Matter.World.clear(engine.world)
      if (runner) {
        Matter.Runner.stop(runner)
      }
      setEngine(null)
      setRunner(null)
    }
    
    const engineInstance = Matter.Engine.create({
      gravity: { x: 0, y: 0 },
      enableSleeping: false
    })

    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect()

      const walls = [
        Matter.Bodies.rectangle(bounds.width / 2, -10, bounds.width, 20, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(bounds.width / 2, bounds.height + 10, bounds.width, 20, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(-10, bounds.height / 2, 20, bounds.height, { 
          isStatic: true,
          render: { visible: false }
        }),
        Matter.Bodies.rectangle(bounds.width + 10, bounds.height / 2, 20, bounds.height, { 
          isStatic: true,
          render: { visible: false }
        })
      ]

      Matter.World.add(engineInstance.world, walls)

      const runnerInstance = Matter.Runner.create()
      Matter.Runner.run(runnerInstance, engineInstance)

      setEngine(engineInstance)
      setRunner(runnerInstance)
    }

    return () => {
      if (engine) {
        Matter.Engine.clear(engine)
        Matter.World.clear(engine.world)
        if (runner) {
          Matter.Runner.stop(runner)
        }
      }
    }
  }, [activeFilter, viewMode, loans])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <Navbar />
      
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12 flex-grow"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex justify-between items-center"
        >
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Loans
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400 text-lg"
            >
              Browse available loans and lending opportunities
            </motion.p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/20 to-green-400/10 
            hover:from-green-500/20 hover:via-green-500/30 hover:to-green-400/20 
            border border-green-500/20 hover:border-green-500/30 
            transition-all duration-300 ease-out
            text-green-400 hover:text-green-300 font-medium 
            shadow-lg shadow-green-900/20 hover:shadow-green-900/30
            flex items-center gap-3"
          >
            <span className="relative">
              <span className="block w-2 h-2 rounded-full bg-green-400 group-hover:animate-ping absolute -left-4 top-1/2 -translate-y-1/2"></span>
              <span className="block w-2 h-2 rounded-full bg-green-400 absolute -left-4 top-1/2 -translate-y-1/2"></span>
              Create Loan
            </span>
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
          </button>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { label: 'Total Loans', value: rawLoans.length },
            { label: 'Active Loans', value: rawLoans.filter(l => l.active).length },
            { 
              label: 'Average Interest', 
              value: `${(rawLoans.reduce((acc, curr) => acc + Number(curr.interest), 0) / (rawLoans.length || 1)).toFixed(2)}%` 
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 rounded-xl p-6 text-center backdrop-blur-sm border border-gray-700/50"
            >
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-between items-center mb-8">
          <motion.div className="flex flex-wrap gap-4">
            {['All Loans', 'Active', 'Pending', 'High APR', 'Low Risk'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all
                  ${activeFilter === filter.toLowerCase()
                    ? 'bg-green-500/20 text-green-400 border border-green-500/20'
                    : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:border-gray-600/50'
                  }`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>

          <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HiViewGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('bubble')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'bubble' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <RiBubbleChartLine className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          viewMode === 'grid' ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {loans.map((loan, index) => (
                <motion.div key={loan.id} variants={itemVariants}>
                  <LoanCard {...loan} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div 
              key="bubble-container"
              ref={containerRef}
              className="relative h-[600px] w-full rounded-xl bg-gray-800/20 backdrop-blur-sm border border-gray-700/50 overflow-hidden"
            >
              {engine && loans.map((loan) => (
                <LoanBubble 
                  key={loan.id} 
                  {...loan} 
                  containerRef={containerRef}
                  engine={engine}
                />
              ))}
            </div>
          )
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <nav className="flex gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchLoans(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-6 py-2 text-sm bg-gray-800/50 text-white rounded-full border border-gray-700/50 
                hover:border-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchLoans(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loans.length === 0}
              className="px-6 py-2 text-sm bg-gray-800/50 text-white rounded-full border border-gray-700/50 
                hover:border-gray-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </motion.button>
          </nav>
        </motion.div>

        <CreateLoanModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </motion.main>

      <Footer />
    </div>
  )
}
