'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBackendUrl, getTokensList } from '../lib/configs'
import { ANS } from '@alph-name-service/ans-sdk'
import { AiOutlineUser } from "react-icons/ai"
import { getAlephiumLoanConfig } from '../lib/configs';
import { useWallet } from '@alephium/web3-react'
import { AcceptLoanService, LiquidateLoanService } from '../services/loan.services'

const getCollateralRatioColor = (ratio) => {
  const numericRatio = parseInt(ratio)
  if (numericRatio >= 150) return 'text-green-400'
  if (numericRatio >= 120) return 'text-yellow-400'
  if (numericRatio >= 100) return 'text-orange-400'
  return 'text-red-400'
}

const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(value)
}

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList()
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const DEFAULT_ADDRESS = 'tgx7VNFoP9DJiFMFgXXtafQZkUvyEdDHT9ryamHJYrjq'

const shortenAddress = (address) => {
  if (!address || address === DEFAULT_ADDRESS) return "No borrower yet"
  return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
}

const LoanModal = ({ isOpen, onClose, loan }) => {
  const { signer } = useWallet()
  const [lenderAnsName, setLenderAnsName] = useState('')
  const [lenderAnsUri, setLenderAnsUri] = useState('')
  const [borrowerAnsName, setBorrowerAnsName] = useState('')
  const [borrowerAnsUri, setBorrowerAnsUri] = useState('')
  const [tokenPrices, setTokenPrices] = useState({})
  const config = getAlephiumLoanConfig();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const backendUrl = getBackendUrl()

  const displayTokenAmount = formatNumber(loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals))
  const displayCollateralAmount = formatNumber(loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralToken).decimals))

  const usdTokenAmount = tokenPrices[loan.tokenRequested] ? 
    formatNumber((loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals)) * tokenPrices[loan.tokenRequested]) : '...'
  const usdCollateralAmount = tokenPrices[loan.collateralToken] ? 
    formatNumber((loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralToken).decimals)) * tokenPrices[loan.collateralToken]) : '...'

  const collateralRatio = ((loan.collateralAmount / loan.tokenAmount) * 100).toFixed(0)

  const getRiskLevel = (ratio) => {
    const numericRatio = parseFloat(ratio)
    if (numericRatio < 150) return 'liquidation'
    if (numericRatio < 200) return 'high'
    if (numericRatio < 300) return 'aggressive'
    if (numericRatio < 400) return 'moderate'
    return 'conservative'
  }

  const riskLevel = getRiskLevel(collateralRatio)

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const ans = new ANS('mainnet', false, config.defaultNodeUrl, config.defaultExplorerUrl);
        
        if (loan.lender) {
          const lenderProfile = await ans.getProfile(loan.lender)
        


          if (lenderProfile?.name) {
            setLenderAnsName(lenderProfile.name)
          }


          if (lenderProfile?.imgUri) {
            setLenderAnsUri(lenderProfile.imgUri)
          }
        }

        if (loan.borrower && loan.borrower !== DEFAULT_ADDRESS && loan.borrower !== loan.lender) {
          const borrowerProfile = await ans.getProfile(loan.borrower)


          if (borrowerProfile?.name) {
            setBorrowerAnsName(borrowerProfile.name)
          }


          if (borrowerProfile?.imgUri) {
            setBorrowerAnsUri(borrowerProfile.imgUri)
          }

        }
      } catch (error) {
        console.error('Error fetching ANS profiles:', error)
      }
    }

    if (isOpen) {
      getProfiles()
    }
  }, [isOpen, loan])

  useEffect(() => {
    const fetchTokenPrices = async () => {
      try {
        const tokens = [loan.tokenRequested, loan.collateralToken]
        const prices = {}
        
        for (const token of tokens) {
          const response = await fetch(`${backendUrl}/api/market-data?assetId=${token}`)
          const data = await response.json()
          prices[token] = data.priceUSD
        }
        
        setTokenPrices(prices)
      } catch (error) {
        console.error('Error fetching token prices:', error)
      }
    }

    if (isOpen) {
      fetchTokenPrices()
    }
  }, [isOpen, loan.tokenRequested, loan.collateralToken, backendUrl])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleAcceptLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await AcceptLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id,
        loan.tokenRequested,
        loan.tokenAmount
      )
      window.addTransactionToast('Accepting Loan', result.txId)

      onClose()
    } catch (err) {
      console.error("Error accepting loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLiquidate = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await LiquidateLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id
      )
      window.addTransactionToast('Liquidating Loan', result.txId)
      
      onClose()
    } catch (err) {
      console.error("Error liquidating loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderActionButton = () => {
    const isLiquidatable = (parseFloat(collateralRatio) <= 150)
    
    if (isLiquidatable) {
      return (
        <button 
          onClick={handleLiquidate}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-400/20 
            hover:from-red-500/30 hover:via-red-500/40 hover:to-red-400/30
            border border-red-500/20 hover:border-red-500/30 
            transition-all duration-300 ease-out
            text-red-400 hover:text-red-300 font-medium 
            shadow-lg shadow-red-900/20 hover:shadow-red-900/30
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Liquidate Loan</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      )
    }

    if (loan.status === 'pending') {
    return (
      <button 
        onClick={handleAcceptLoan}
        disabled={isLoading}
        className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-400/20 
          hover:from-green-500/30 hover:via-green-500/40 hover:to-green-400/30
          border border-green-500/20 hover:border-green-500/30 
          transition-all duration-300 ease-out
          text-green-400 hover:text-green-300 font-medium 
          shadow-lg shadow-green-900/20 hover:shadow-green-900/30
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Accept Loan</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    )
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ 
              scale: 0.95, 
              opacity: 0, 
              y: -20,
              transition: { duration: 0.15 }
            }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl max-w-2xl w-full mx-4 overflow-hidden border border-gray-700/50"
          >
            <div className="border-b border-gray-700/50 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-white">Loan Details</h3>
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/30 p-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {loan.lender && loan.lender !== DEFAULT_ADDRESS && loan.lender !== loan.borrower && (
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="block text-sm text-gray-400 mb-3">Lender</span>
                  <div className="flex items-center gap-3">
                    {lenderAnsUri ? (
                      <img 
                        src={lenderAnsUri} 
                        className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                        alt="" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                        <AiOutlineUser className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-[15px] text-white">
                        {lenderAnsName || "Unnamed"}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {shortenAddress(loan.lender)}
                      </p>
                    </div>
                  </div>
                </div>
                )}

                {loan.borrower && loan.borrower !== DEFAULT_ADDRESS && loan.borrower !== loan.lender && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                    <span className="block text-sm text-gray-400 mb-3">Borrower</span>
                    <div className="flex items-center gap-3">
                      {borrowerAnsUri ? (
                        <img 
                          src={borrowerAnsUri} 
                          className="w-10 h-10 rounded-xl border-2 border-gray-700/50 shadow-lg" 
                          alt="" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl border-2 border-gray-700/50 bg-gray-800 flex items-center justify-center">
                          <AiOutlineUser className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-[15px] text-white">
                          {borrowerAnsName || "Unnamed"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {shortenAddress(loan.borrower)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Amount</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.tokenRequested).logoURI}
                        alt={getTokenInfo(loan.tokenRequested).symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-2xl font-semibold text-white">
                        {displayTokenAmount}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.tokenRequested).symbol}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ≈ ${usdTokenAmount}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Collateral</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.collateralToken).logoURI}
                        alt={getTokenInfo(loan.collateralToken).symbol}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-2xl font-semibold text-white">
                        {displayCollateralAmount}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.collateralToken).symbol}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ≈ ${usdCollateralAmount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Term</span>
                  <span className="text-lg font-medium text-white">
                    {loan.duration} months
                  </span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Interest</span>
                  <span className="text-lg font-medium text-green-400">
                    {loan.interest}%
                  </span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                  <span className="text-sm text-gray-400 block mb-1">Collateral Ratio</span>
                  <span className={`text-lg font-medium ${getCollateralRatioColor(collateralRatio)}`}>
                    {collateralRatio}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Level</span>
                  <div className="flex items-center gap-2">
                    <motion.span className={`font-medium ${
                      riskLevel === 'conservative' ? 'text-green-500' :
                      riskLevel === 'moderate' ? 'text-yellow-500' :
                      riskLevel === 'aggressive' ? 'text-orange-500' :
                      riskLevel === 'high' ? 'text-red-500' :
                      'text-red-600'
                    }`}>
                      {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                    </motion.span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex">
                    <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                    <div className="w-[33%] h-full border-r border-gray-700/50"></div>
                    <div className="w-[34%] h-full"></div>
                  </div>

                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(() => {
                          const ratio = parseFloat(collateralRatio);
                          if (ratio <= 150) return 0;
                          if (ratio <= 200) return ((ratio - 150) / 50) * 33;
                          if (ratio <= 300) return 33 + ((ratio - 200) / 100) * 33;
                          if (ratio <= 400) return 66 + ((ratio - 300) / 100) * 34;
                          return 100;
                        })()}%`,
                        transition: { duration: 0.5, ease: "easeOut" }
                      }}
                      className={`h-full transition-all duration-300 ${
                        riskLevel === 'conservative' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        riskLevel === 'moderate' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        riskLevel === 'aggressive' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                        riskLevel === 'high' ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        'bg-gradient-to-r from-red-700 to-red-600'
                      }`}
                    />
                  </div>

                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between text-xs mt-1 px-1"
                  >
                    <span className="text-red-500">150%</span>
                    <span className="text-orange-500">200%</span>
                    <span className="text-yellow-500">300%</span>
                    <span className="text-green-500">400%+</span>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-2 mt-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-gray-400">
                    Minimum collateral ratio: 150%. Lower ratios risk liquidation.
                  </span>
                </motion.div>
              </div>

              <div className="pt-2">
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}
                
                {renderActionButton()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoanModal 