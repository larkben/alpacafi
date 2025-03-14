'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getTokensList } from '../lib/configs'
import LoanModal from './LoanModal'
import Matter from 'matter-js'
import { FaArrowLeft } from 'react-icons/fa'

const getTokenInfo = (tokenId) => {
  const tokens = getTokensList()
  return tokens.find(t => t.id === tokenId) || {
    symbol: 'Unknown',
    logoURI: '/tokens/unknown.png',
    decimals: 18
  }
}

const getStatusColor = (interest) => {
  const interestPercent = interest / 100;
  
  if (interestPercent < 5) return 'rgba(255, 0, 0, 0.2)';
  
  if (interestPercent >= 5 && interestPercent <= 15) return 'rgba(255, 165, 0, 0.2)';
  
  return 'rgba(57, 255, 20, 0.2)';
}

const getStatusSize = (interest) => {
  const interestPercent = interest / 100;
  
  if (interestPercent < 5) return 60;
  
  if (interestPercent >= 5 && interestPercent <= 15) return 90;
  
  return 120;
}

const calculateCollateralRatio = (tokenPrices, tokenAmount, tokenRequested, collateralAmount, collateralToken) => {
  if (!tokenPrices || !tokenPrices[tokenRequested] || !tokenPrices[collateralToken]) return 0

  const collateralValue = (collateralAmount / Math.pow(10, getTokenInfo(collateralToken).decimals)) * tokenPrices[collateralToken]
  const loanValue = (tokenAmount / Math.pow(10, getTokenInfo(tokenRequested).decimals)) * tokenPrices[tokenRequested]
  
  return (collateralValue / loanValue * 100).toFixed(0)
}

const LoanBubble = ({ 
  tokenAmount,
  tokenRequested,
  collateralAmount,
  collateralToken,
  duration,
  interest,
  lender,
  borrower,
  status,
  canLiquidate,
  id,
  containerRef,
  engine,
  tokenPrices,
  isPricesLoading,
  ansProfile,
  createdAt
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const bubbleRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const bodyRef = useRef(null)
  const frameRef = useRef()
  
  const bubbleSize = getStatusSize(interest)
  const bubbleColor = getStatusColor(interest)

  useEffect(() => {
    if (!containerRef?.current || !engine || !bubbleRef.current) return

    const container = containerRef.current
    const bounds = container.getBoundingClientRect()

    const startX = bounds.width / 2 + (Math.random() - 0.5) * (bounds.width / 2)
    const startY = bounds.height / 2 + (Math.random() - 0.5) * (bounds.height / 2)
    
    positionRef.current = { x: startX - bubbleSize / 2, y: startY - bubbleSize / 2 }
    if (bubbleRef.current) {
      bubbleRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`
    }

    const bubble = Matter.Bodies.circle(startX, startY, bubbleSize / 2, {
      restitution: 0.7,
      friction: 0.01,
      frictionAir: 0.001,
      mass: bubbleSize / 80,
      label: `loan-${id}`,
      collisionFilter: {
        group: 0,
        category: 0x0002,
        mask: 0xFFFFFFFF
      }
    })

    const angle = Math.random() * Math.PI * 2
    const forceMagnitude = 0.05
    const force = {
      x: Math.cos(angle) * forceMagnitude,
      y: Math.sin(angle) * forceMagnitude
    }
    
    Matter.Body.applyForce(bubble, bubble.position, force)
    Matter.World.add(engine.world, bubble)
    bodyRef.current = bubble

    const updatePosition = () => {
      if (!bodyRef.current || !bubbleRef.current) return

      const newX = bodyRef.current.position.x - bubbleSize / 2
      const newY = bodyRef.current.position.y - bubbleSize / 2

      if (Math.abs(newX - positionRef.current.x) > 0.1 || Math.abs(newY - positionRef.current.y) > 0.1) {
        positionRef.current = { x: newX, y: newY }
        bubbleRef.current.style.transform = `translate(${newX}px, ${newY}px)`
      }

      frameRef.current = requestAnimationFrame(updatePosition)
    }

    frameRef.current = requestAnimationFrame(updatePosition)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (bodyRef.current) {
        Matter.World.remove(engine.world, bodyRef.current)
        bodyRef.current = null
      }
    }
  }, [containerRef, engine, bubbleSize, id])

  return (
    <>
      <div 
        ref={bubbleRef}
        className="absolute cursor-pointer flex flex-col items-center justify-center rounded-full transition-transform hover:scale-110"
        style={{
          width: `${bubbleSize}px`,
          height: `${bubbleSize}px`,
          backgroundColor: bubbleColor,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          zIndex: isModalOpen ? 40 : 'auto'
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-1 mb-1">
          <img 
            src={getTokenInfo(tokenRequested).logoURI}
            alt={getTokenInfo(tokenRequested).symbol}
            className="w-5 h-5 rounded-full"
          />
          <FaArrowLeft className="text-white text-xs" />
          <img 
            src={getTokenInfo(collateralToken).logoURI}
            alt={getTokenInfo(collateralToken).symbol}
            className="w-5 h-5 rounded-full"
          />
        </div>
        <div className="text-white text-sm md:text-base font-medium">
          {(interest / 100).toFixed(2)}%
        </div>
        <div className="text-gray-300 text-xs">Interest</div>
      </div>

      {isModalOpen && createPortal(
        <LoanModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          loan={{
            tokenAmount,
            tokenRequested,
            collateralAmount,
            collateralToken,
            duration,
            interest,
            lender,
            borrower,
            status,
            canLiquidate,
            id,
            createdAt
          }}
          tokenPrices={tokenPrices}
          isPricesLoading={isPricesLoading}
          ansProfile={ansProfile}
        />,
        document.body
      )}
    </>
  )
}

export default LoanBubble 