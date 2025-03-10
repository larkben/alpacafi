'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getTokensList } from '../lib/configs'
import { AiOutlineUser } from "react-icons/ai"
import { getAlephiumLoanConfig } from '../lib/configs';
import { useWallet } from '@alephium/web3-react'
import { AcceptLoanService, LiquidateLoanService, CancelLoanService, ForfeitLoanService } from '../services/loan.services'
import Timer from './Timer'
import ShareLoanButton from './ShareLoanButton'

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

const LoanModal = ({ 
  isOpen, 
  onClose, 
  loan,
  tokenPrices,
  isPricesLoading,
  ansProfile
}) => {
  const { signer } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const displayTokenAmount = formatNumber(loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals))
  const displayCollateralAmount = formatNumber(loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralToken).decimals))

  const usdTokenAmount = !isPricesLoading && tokenPrices[loan.tokenRequested] ? 
    formatNumber((loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals)) * tokenPrices[loan.tokenRequested]) : '...'
    
  const usdCollateralAmount = !isPricesLoading && tokenPrices[loan.collateralToken] ? 
    formatNumber((loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralToken).decimals)) * tokenPrices[loan.collateralToken]) : '...'

  const collateralRatio = tokenPrices[loan.collateralToken] && tokenPrices[loan.tokenRequested] 
  ? ((loan.collateralAmount / Math.pow(10, getTokenInfo(loan.collateralToken).decimals)) * tokenPrices[loan.collateralToken]) / 
    ((loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals)) * tokenPrices[loan.tokenRequested]) * 100
  : 0

  const getRiskLevel = (ratio) => {
    const numericRatio = parseFloat(ratio)
    if (numericRatio < 150) return 'liquidation'
    if (numericRatio < 200) return 'high'
    if (numericRatio < 300) return 'aggressive'
    if (numericRatio < 400) return 'moderate'
    return 'conservative'
  }
  
  const riskLevel = getRiskLevel(collateralRatio)

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleForfeit = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
    try {
      const result = await ForfeitLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id
      )
      window.addTransactionToast('Forfeiting Loan', result.txId)

      onClose()
    } catch (err) {
      console.error("Error forfeiting loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
    try {
      const result = await CancelLoanService(
        signer,
        config.loanFactoryContractId,
        loan.id
      )
      window.addTransactionToast('Cancelling Loan', result.txId)

      onClose()
    } catch (err) {
      console.error("Error cancelling loan:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptLoan = async () => {
    if (!signer) {
      setError('Please connect your wallet')
      return
    }

    setIsLoading(true)
    setError(null)
    const config = getAlephiumLoanConfig();
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
    const config = getAlephiumLoanConfig();
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
    const wallet = useWallet()
    const endTime = new Date(loan.endDate).getTime()
    const now = new Date().getTime()
    const isExpired = now >= endTime
    const isLiquidatable = (parseFloat(loan.collateralRatio) <= 150 && loan.canLiquidate) || (isExpired && loan.canLiquidate)
    const isActive = loan.status === 'active'
    const isPending = loan.status === 'pending'
    const isBorrower = loan.borrower === wallet?.account?.address

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

    if (isExpired && isActive) {
      return (
        <button 
          onClick={handleForfeit}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-400/20 
            hover:from-orange-500/30 hover:via-orange-500/40 hover:to-orange-400/30
            border border-orange-500/20 hover:border-orange-500/30 
            transition-all duration-300 ease-out
            text-orange-400 hover:text-orange-300 font-medium 
            shadow-lg shadow-orange-900/20 hover:shadow-orange-900/30
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Forfeit Loan</span>
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

    if (isPending) {
      return (
        <button 
          onClick={handleAcceptLoan}
          disabled={isLoading || isBorrower}
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
          ) : isBorrower ? (
            <>
              <span>You can't accept your own loan</span>
              <svg className="w-5 h-5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
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

    if (isPending && isBorrower) {
      return (
        <button 
          onClick={handleCancelLoan}
          disabled={isLoading}
          className="w-full group px-6 py-4 rounded-xl bg-gradient-to-r from-gray-500/20 via-gray-500/30 to-gray-400/20 
            hover:from-gray-500/30 hover:via-gray-500/40 hover:to-gray-400/30
            border border-gray-500/20 hover:border-gray-500/30 
            transition-all duration-300 ease-out
            text-gray-400 hover:text-gray-300 font-medium 
            shadow-lg shadow-gray-900/20 hover:shadow-gray-900/30
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Cancel Loan</span>
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" />
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center overflow-y-auto"
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
            className="relative my-4 mx-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl w-full max-w-2xl overflow-hidden border border-gray-700/50"
          >
            <div className="border-b border-gray-700/50 p-4 md:p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-semibold text-white">Loan Details</h3>
                <div className="flex items-center gap-2">
                  <ShareLoanButton 
                    loanId={loan.id}
                    loanData={{
                      ...loan,
                      active: loan.status === 'active',
                      endDate: loan.status === 'active' 
                        ? new Date(new Date(loan.acceptedAt).getTime() + parseInt(loan.duration)).toISOString()
                        : null
                    }}
                    requestedTokenInfo={getTokenInfo(loan.tokenRequested)}
                    collateralTokenInfo={getTokenInfo(loan.collateralToken)}
                    displayLoanAmount={displayTokenAmount}
                    displayCollateralAmount={displayCollateralAmount}
                    loanValueUSD={usdTokenAmount}
                    collateralValueUSD={usdCollateralAmount}
                    collateralRatio={collateralRatio}
                    riskLevel={riskLevel}
                    ansProfile={ansProfile}
                    formatDuration={(duration) => {
                      const minutes = duration / (60 * 1000);
                      const hours = minutes / 60;
                      const days = hours / 24;
                      const months = days / 30;
                      
                      if (months >= 1) return `${Math.floor(months)} month${Math.floor(months) !== 1 ? 's' : ''}`;
                      if (days >= 1) return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''}`;
                      if (hours >= 1) return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
                      return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`;
                    }}
                    shortenAddress={shortenAddress}
                  />
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
            </div>

            <div className="p-4 md:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {loan.lender && loan.lender !== DEFAULT_ADDRESS && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 md:p-4">
                    <span className="block text-sm text-gray-400 mb-3">Lender</span>
                    <div className="flex items-center gap-3">
                      {ansProfile?.lender?.imgUri ? (
                        <img 
                          src={ansProfile.lender.imgUri} 
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
                          {ansProfile?.lender?.name || shortenAddress(loan.lender)}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {shortenAddress(loan.lender)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {loan.borrower && loan.borrower !== DEFAULT_ADDRESS && (
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 md:p-4">
                    <span className="block text-sm text-gray-400 mb-3">Borrower</span>
                    <div className="flex items-center gap-3">
                      {ansProfile?.borrower?.imgUri ? (
                        <img 
                          src={ansProfile.borrower.imgUri} 
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
                          {ansProfile?.borrower?.name || shortenAddress(loan.borrower)}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {shortenAddress(loan.borrower)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Amount</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 md:px-4 md:py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.tokenRequested).logoURI}
                        alt={getTokenInfo(loan.tokenRequested).symbol}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                      />
                      <span className="text-xl md:text-2xl font-semibold text-white">
                        {displayTokenAmount}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.tokenRequested).symbol}
                      </span>
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-gray-500">
                      ≈ ${usdTokenAmount}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-300 mb-2">Collateral</span>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-xl px-3 py-2 md:px-4 md:py-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={getTokenInfo(loan.collateralToken).logoURI}
                        alt={getTokenInfo(loan.collateralToken).symbol}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full"
                      />
                      <span className="text-xl md:text-2xl font-semibold text-white">
                        {displayCollateralAmount}
                      </span>
                      <span className="text-gray-400">
                        {getTokenInfo(loan.collateralToken).symbol}
                      </span>
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-gray-500">
                      ≈ ${usdCollateralAmount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 md:p-4">
                  {loan.acceptedAt === loan.createdAt ? (
                  <>
                  <span className="text-xs text-gray-400 block mb-1">Term</span>
                  <span className="font-medium">
                    {(() => {
                      const minutes = loan.duration / (60 * 1000);
                      const hours = minutes / 60;
                      const days = hours / 24;
                      const months = days / 30;
                      
                      if (months >= 1) return `${Math.floor(months)} month${Math.floor(months) !== 1 ? 's' : ''}`;
                      if (days >= 1) return `${Math.floor(days)} day${Math.floor(days) !== 1 ? 's' : ''}`;
                      if (hours >= 1) return `${Math.floor(hours)} hour${Math.floor(hours) !== 1 ? 's' : ''}`;
                      return `${Math.floor(minutes)} minute${Math.floor(minutes) !== 1 ? 's' : ''}`;
                    })()}
                  </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs md:text-sm text-gray-400 block mb-1">Time Left</span>
                    <span className="text-base md:text-lg font-medium text-white">
                      <Timer createdAt={loan.acceptedAt} duration={loan.duration} />
                    </span>
                  </>
                )}
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 md:p-4">
                  <span className="text-xs md:text-sm text-gray-400 block mb-1">Interest</span>
                  <span className="text-base md:text-lg font-medium text-green-400 flex items-center">
                    {(loan.interest / 100).toFixed(2)}%
                    <div className="relative">
                      <span 
                        className="ml-2 text-xs text-gray-300 bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center cursor-help"
                        onMouseEnter={() => setIsTooltipVisible(true)}
                        onMouseLeave={() => setIsTooltipVisible(false)}
                      >
                        i
                      </span>
                      {isTooltipVisible && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-800 text-white text-xs rounded-md shadow-lg z-10 min-w-[200px]">
                          <div className="font-medium text-gray-300 mb-2">Interest Value</div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <img 
                                src={getTokenInfo(loan.tokenRequested).logoURI} 
                                alt={getTokenInfo(loan.tokenRequested).symbol}
                                className="w-5 h-5 mr-2 rounded-full"
                              />
                              <span className="font-medium">
                                {formatNumber((loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals)) * (loan.interest / 10000))} {getTokenInfo(loan.tokenRequested).symbol}
                              </span>
                            </div>
                            {!isPricesLoading && tokenPrices[loan.tokenRequested] && (
                              <span className="text-gray-400 ml-2">
                                ≈ ${formatNumber(((loan.tokenAmount / Math.pow(10, getTokenInfo(loan.tokenRequested).decimals)) * (loan.interest / 10000)) * tokenPrices[loan.tokenRequested])}
                              </span>
                            )}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                        </div>
                      )}
                    </div>
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">
                    APR: {(() => {
                      const durationInYears = parseInt(loan.duration) / (365 * 24 * 60 * 60 * 1000);
                      const apr = (loan.interest / 100) * (1 / durationInYears);
                      return apr.toFixed(2) + '%';
                    })()}
                  </span>
                </div>
                <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-3 md:p-4">
                  <span className="text-xs md:text-sm text-gray-400 block mb-1">Collateral Ratio</span>
                  <span className={`text-base md:text-lg font-medium ${getCollateralRatioColor(collateralRatio)}`}>
                    {collateralRatio.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 p-3 md:p-4 bg-gray-900/50 rounded-xl border border-gray-800">
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
                  <div className="mb-4 p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
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