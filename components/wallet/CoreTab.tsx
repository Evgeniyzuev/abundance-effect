"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { updateUserReinvest } from "@/app/actions/finance"
import { useLevelCheck } from "@/hooks/useLevelCheck"
import CoreHistory from "./CoreHistory"
import { motion } from "framer-motion"

interface CoreTabProps {
    coreBalance: number
    reinvestPercentage: number
    userId: string | null
    onTransfer: () => void
    onReinvestUpdate: (newPercentage: number) => void
}

export default function CoreTab({ coreBalance, reinvestPercentage, userId, onTransfer, onReinvestUpdate }: CoreTabProps) {
    const { levelThresholds } = useLevelCheck()
    const [reinvestInputValue, setReinvestInputValue] = useState(reinvestPercentage.toString())
    const [isReinvestChanged, setIsReinvestChanged] = useState(false)
    const [startCore, setStartCore] = useState(coreBalance.toString())
    const [dailyRewards, setDailyRewards] = useState('10')
    const [yearsToCalculate, setYearsToCalculate] = useState('30')
    const [targetCoreAmount, setTargetCoreAmount] = useState('0')
    const [timeToTarget, setTimeToTarget] = useState<number | null>(null)

    const DAILY_RATE = 0.000633

    // Update startCore when coreBalance changes
    useEffect(() => {
        setStartCore(coreBalance.toString())
    }, [coreBalance])

    // Update reinvest input when prop changes
    useEffect(() => {
        setReinvestInputValue(reinvestPercentage.toString())
    }, [reinvestPercentage])

    // Calculate daily income
    const calculateDailyIncome = (balance: number) => {
        const dailyIncome = balance * DAILY_RATE
        const toCore = dailyIncome * (reinvestPercentage / 100)
        const toWallet = dailyIncome * ((100 - reinvestPercentage) / 100)
        return { total: dailyIncome, toCore, toWallet }
    }

    // Calculate level and progress
    const calculateLevelProgress = (balance: number) => {
        let currentLevel = 0
        let nextLevelThreshold = levelThresholds[0].core

        for (let i = levelThresholds.length - 1; i >= 0; i--) {
            if (balance >= levelThresholds[i].core) {
                currentLevel = levelThresholds[i].level
                nextLevelThreshold = levelThresholds[i + 1]?.core || levelThresholds[i].core * 2
                break
            }
        }

        const currentLevelThreshold = currentLevel > 0
            ? levelThresholds.find(t => t.level === currentLevel)?.core || 0
            : 0

        const progressToNext = balance - currentLevelThreshold
        const totalNeeded = nextLevelThreshold - currentLevelThreshold
        const progressPercentage = (progressToNext / totalNeeded) * 100

        return {
            currentLevel,
            nextLevelThreshold,
            progressPercentage: Math.min(progressPercentage, 100)
        }
    }

    // Handle reinvest change
    const handleReinvestChange = (value: string) => {
        setReinvestInputValue(value)
        if (value === '') {
            setIsReinvestChanged(true)
            return
        }

        const num = Number(value)
        if (!isNaN(num) && num >= 0 && num <= 100) {
            setIsReinvestChanged(true)
        }
    }

    // Save reinvest percentage
    const handleSaveReinvest = async () => {
        if (!userId) return

        const num = Number(reinvestInputValue)
        if (isNaN(num) || num < 0 || num > 100) {
            setReinvestInputValue(reinvestPercentage.toString())
            setIsReinvestChanged(false)
            return
        }

        try {
            await updateUserReinvest(userId, num)
            onReinvestUpdate(num)
            setIsReinvestChanged(false)
        } catch (error) {
            console.error('Error updating reinvest:', error)
        }
    }

    // Format number with spaces
    const formatWithSpaces = (num: number) => {
        const [int, dec] = num.toFixed(2).split('.')
        const formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
        return `${formattedInt}.${dec}`
    }

    // Calculate future core value
    const calculateFutureCore = () => {
        const yearsNum = parseFloat(yearsToCalculate) || 0
        const daysToCalculate = yearsNum * 365.25
        const reinvestRate = DAILY_RATE * (reinvestPercentage / 100)
        const startCoreNum = parseFloat(startCore) || 0
        const dailyRewardsNum = parseFloat(dailyRewards) || 0

        const futureInitialCore = startCoreNum * Math.pow(1 + reinvestRate, daysToCalculate)
        const futureDailyRewards = dailyRewardsNum * ((Math.pow(1 + reinvestRate, daysToCalculate) - 1) / reinvestRate)

        return futureInitialCore + futureDailyRewards
    }

    // Calculate core at specific day
    const calculateCoreAtDay = (days: number) => {
        const reinvestRate = DAILY_RATE * (reinvestPercentage / 100)
        const startCoreNum = parseFloat(startCore) || 0
        const dailyRewardsNum = parseFloat(dailyRewards) || 0

        const futureInitialCore = startCoreNum * Math.pow(1 + reinvestRate, days)
        const futureDailyRewards = dailyRewardsNum * ((Math.pow(1 + reinvestRate, days) - 1) / reinvestRate)

        return futureInitialCore + futureDailyRewards
    }

    // Binary search to find days to target
    const findDaysToTarget = (target: number) => {
        let left = 0
        let right = 36525 // 100 years

        while (left < right - 1) {
            const mid = Math.floor((left + right) / 2)
            const midValue = calculateCoreAtDay(mid)

            if (Math.abs(midValue - target) < 0.01) {
                return mid
            }

            if (midValue < target) {
                left = mid
            } else {
                right = mid
            }
        }

        return right
    }

    // Format time to target
    const formatTimeToTarget = (days: number) => {
        const years = Math.floor(days / 365.25)
        const remainingDays = Math.round(days % 365.25)

        if (years === 0) {
            return `${remainingDays} days`
        } else if (remainingDays === 0) {
            return `${years} year${years > 1 ? 's' : ''}`
        } else {
            return `${years} year${years > 1 ? 's' : ''} ${remainingDays} day${remainingDays > 1 ? 's' : ''}`
        }
    }

    // Calculate time to target
    const calculateTimeToTarget = () => {
        if (!targetCoreAmount || Number(targetCoreAmount) <= coreBalance) return

        const days = findDaysToTarget(Number(targetCoreAmount))
        setTimeToTarget(days)
    }

    const { currentLevel, nextLevelThreshold, progressPercentage } = calculateLevelProgress(coreBalance)

    return (
        <div className="relative min-h-[calc(100vh-140px)] w-full overflow-hidden">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 z-0">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 space-y-4 pb-20">
                {/* Balance Card with Level */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white shadow-xl"
                >
                    <p className="text-sm opacity-80 font-medium mb-2">Core Balance</p>
                    <h1 className="text-4xl font-bold mb-4">${coreBalance.toFixed(2)}</h1>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="font-medium">Level {currentLevel}</span>
                            <span className="opacity-90">${coreBalance.toFixed(2)} / ${nextLevelThreshold}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-white/20 rounded-full" />
                    </div>
                </motion.div>

                {/* Daily Income Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-base font-semibold">Daily Income</span>
                            </div>
                            <span className="text-base font-bold text-green-300">
                                ${calculateDailyIncome(coreBalance).total.toFixed(8)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium opacity-90">Reinvest %</span>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="text"
                                        value={reinvestInputValue}
                                        onChange={(e) => handleReinvestChange(e.target.value)}
                                        className="h-8 text-sm w-16 text-center font-medium bg-white/20 border-white/30 text-white placeholder:text-white/50"
                                    />
                                    <span className="text-xs opacity-70">%</span>
                                    {isReinvestChanged && (
                                        <button
                                            onClick={handleSaveReinvest}
                                            className="h-6 px-2 bg-green-500/30 hover:bg-green-500/50 rounded border border-green-400/50 transition-colors"
                                        >
                                            <Check className="h-3 w-3 text-green-300" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Progress value={Number(reinvestInputValue)} className="h-2 bg-white/20 rounded-full" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                                <span className="text-sm font-bold text-blue-200">
                                    💲 ${calculateDailyIncome(coreBalance).toWallet.toFixed(8)}
                                </span>
                            </div>
                            <div className="text-center p-3 bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                                <span className="text-sm font-bold text-green-200">
                                    ⚛️ ${calculateDailyIncome(coreBalance).toCore.toFixed(8)}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Core Growth Calculator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl"
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-base font-semibold">Core Growth Calculator</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium opacity-80">Start Core</label>
                                <Input
                                    type="number"
                                    value={startCore}
                                    onChange={(e) => setStartCore(e.target.value)}
                                    className="h-8 text-xs bg-white/20 border-white/30 text-white placeholder:text-white/50"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium opacity-80">Daily Rewards</label>
                                <Input
                                    type="number"
                                    value={dailyRewards}
                                    onChange={(e) => setDailyRewards(e.target.value)}
                                    className="h-8 text-xs bg-white/20 border-white/30 text-white placeholder:text-white/50"
                                    min={0}
                                    placeholder="10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium opacity-80">Years</label>
                                <Input
                                    type="number"
                                    value={yearsToCalculate}
                                    onChange={(e) => setYearsToCalculate(e.target.value)}
                                    className="h-8 text-xs bg-white/20 border-white/30 text-white placeholder:text-white/50"
                                    min={1}
                                    max={100}
                                    placeholder="30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
                                <span className="text-xs opacity-80 block mb-1">Future Core</span>
                                <span className="text-sm font-bold text-blue-200">
                                    ${formatWithSpaces(calculateFutureCore())}
                                </span>
                            </div>
                            <div className="text-center p-3 bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-400/30">
                                <span className="text-xs opacity-80 block mb-1">Daily Income</span>
                                <span className="text-sm font-bold text-green-200">
                                    ${formatWithSpaces(calculateFutureCore() * DAILY_RATE)}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Time to Target Calculator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white shadow-xl"
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-base font-semibold">Time to Target</span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium opacity-80">Target Core Amount</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={targetCoreAmount}
                                        onChange={(e) => setTargetCoreAmount(e.target.value)}
                                        className="h-8 text-xs flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50"
                                        placeholder="Enter target amount"
                                    />
                                    <button
                                        className="h-8 px-4 text-xs bg-purple-500/30 hover:bg-purple-500/50 rounded-lg border border-purple-400/50 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                                        onClick={calculateTimeToTarget}
                                        disabled={!targetCoreAmount || Number(targetCoreAmount) <= coreBalance}
                                    >
                                        Calculate
                                    </button>
                                </div>
                            </div>

                            {timeToTarget !== null && (
                                <div className="p-3 bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-400/30">
                                    <div className="text-center">
                                        <span className="text-xs opacity-80 block mb-1">Estimated time to reach target</span>
                                        <span className="text-lg font-bold text-purple-200 mb-1 block">
                                            {formatTimeToTarget(timeToTarget)}
                                        </span>
                                        <span className="text-xs opacity-70">
                                            Target date: {new Date(Date.now() + timeToTarget * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Transfer Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="w-full h-14 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl text-white font-semibold flex items-center justify-center space-x-2 hover:bg-white/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    onClick={onTransfer}
                    disabled={!userId}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-sm">Transfer from Wallet</span>
                </motion.button>

                {/* Core History */}
                {userId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <CoreHistory userId={userId} />
                    </motion.div>
                )}
            </div>
        </div>
    )
}
