"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Check, TrendingUp, Calculator, Clock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { updateUserReinvest } from "@/app/actions/finance"
import { useLevelCheck } from "@/hooks/useLevelCheck"
import CoreHistory from "./CoreHistory"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import { useUser } from "@/context/UserContext"

interface CoreTabProps {
    coreBalance: number
    reinvestPercentage: number
    userId: string | null
    onTransfer: () => void
    onReinvestUpdate: (newPercentage: number) => void
    loading?: boolean
    error?: string | null
}

export default function CoreTab({ coreBalance, reinvestPercentage, userId, onTransfer, onReinvestUpdate, loading, error }: CoreTabProps) {
    const { t } = useLanguage()
    const { levelThresholds } = useLevelCheck()
    const { user } = useUser()
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

    // Calculate progress to next level (level is now stored in database)
    const calculateLevelProgress = (balance: number, userLevel: number) => {
        // Find current level threshold and next level threshold
        const currentLevelThreshold = levelThresholds.find(t => t.level === userLevel)?.core || 0
        const nextLevelThreshold = levelThresholds.find(t => t.level === userLevel + 1)?.core || (currentLevelThreshold * 2)

        // Calculate progress from current level threshold to next level threshold
        const progressRange = nextLevelThreshold - currentLevelThreshold
        const progressMade = balance - currentLevelThreshold
        const progressPercentage = progressRange > 0 ? (progressMade / progressRange) * 100 : 100

        return {
            currentLevel: userLevel,
            nextLevelThreshold,
            progressPercentage: Math.min(Math.max(progressPercentage, 0), 100)
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
            return `${years} ${t('wallet.years')}`
        } else {
            return `${years} ${t('wallet.years')} ${remainingDays} days`
        }
    }

    // Calculate time to target
    const calculateTimeToTarget = () => {
        if (!targetCoreAmount || Number(targetCoreAmount) <= coreBalance) return

        const days = findDaysToTarget(Number(targetCoreAmount))
        setTimeToTarget(days)
    }

    const { currentLevel, nextLevelThreshold, progressPercentage } = calculateLevelProgress(coreBalance, user?.level || 0)

    return (
        <div className="w-full bg-white min-h-full pb-20">
            {/* Core Balance Section */}
            <div className="flex flex-col items-center justify-center py-8 space-y-2 bg-gray-50 border-b border-gray-100">
                <p className="text-gray-500 text-sm font-medium">{t('wallet.core_balance')}</p>
                
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <span className="text-gray-500">Загрузка...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-red-500 text-sm">Ошибка загрузки</span>
                        <span className="text-red-400 text-xs">{error}</span>
                    </div>
                ) : (
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                        ${coreBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h1>
                )}

                {!loading && !error && (
                    <div className="w-full max-w-xs mt-4 space-y-2 px-4">
                        <div className="flex justify-between text-xs text-gray-500">
                            <span className="font-medium">{t('wallet.level')} {currentLevel}</span>
                            <span>${coreBalance.toFixed(0)} / ${nextLevelThreshold}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2 bg-gray-200" />
                    </div>
                )}
            </div>

            <div className="p-4 space-y-6">
                {/* Daily Income & Reinvest */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-gray-900">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="font-semibold">{t('wallet.daily_income')}</span>
                        </div>
                        <span className="font-bold text-green-600">
                            ${calculateDailyIncome(coreBalance).total.toFixed(6)}
                        </span>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600">{t('wallet.reinvest')}</span>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        value={reinvestInputValue}
                                        onChange={(e) => handleReinvestChange(e.target.value)}
                                        className="h-8 w-16 text-center text-sm font-medium pr-6"
                                    />
                                    <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                                </div>
                                {isReinvestChanged && (
                                    <button
                                        onClick={handleSaveReinvest}
                                        className="h-8 w-8 flex items-center justify-center bg-green-500 rounded-lg text-white shadow-sm hover:bg-green-600 transition-colors"
                                    >
                                        <Check className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <Progress value={Number(reinvestInputValue)} className="h-1.5 bg-gray-100" />

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="text-gray-500 block mb-1">Wallet</span>
                                <span className="font-semibold text-gray-900">${calculateDailyIncome(coreBalance).toWallet.toFixed(6)}</span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg text-center">
                                <span className="text-gray-500 block mb-1">Core</span>
                                <span className="font-semibold text-gray-900">${calculateDailyIncome(coreBalance).toCore.toFixed(6)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calculators Section */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Growth Calculator */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
                        <div className="flex items-center space-x-2 text-gray-900 mb-2">
                            <Calculator className="w-5 h-5 text-blue-500" />
                            <span className="font-semibold">{t('wallet.core_growth_calculator')}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t('wallet.start_core')}</label>
                                <Input
                                    type="number"
                                    value={startCore}
                                    onChange={(e) => setStartCore(e.target.value)}
                                    className="h-9 text-sm bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t('wallet.daily_rewards')}</label>
                                <Input
                                    type="number"
                                    value={dailyRewards}
                                    onChange={(e) => setDailyRewards(e.target.value)}
                                    className="h-9 text-sm bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{t('wallet.years')}</label>
                                <Input
                                    type="number"
                                    value={yearsToCalculate}
                                    onChange={(e) => setYearsToCalculate(e.target.value)}
                                    className="h-9 text-sm bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-blue-600 font-medium">{t('wallet.future_core')}</span>
                                <span className="text-sm font-bold text-blue-700">${formatWithSpaces(calculateFutureCore())}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-blue-600/70">{t('wallet.daily_income')}</span>
                                <span className="text-xs font-semibold text-blue-700/70">${formatWithSpaces(calculateFutureCore() * DAILY_RATE)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Time to Target */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-4">
                        <div className="flex items-center space-x-2 text-gray-900 mb-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            <span className="font-semibold">{t('wallet.time_to_target')}</span>
                        </div>

                        <div className="flex gap-2">
                            <Input
                                type="number"
                                value={targetCoreAmount}
                                onChange={(e) => setTargetCoreAmount(e.target.value)}
                                className="h-10 flex-1 bg-gray-50 border-gray-200"
                                placeholder={t('wallet.target_amount')}
                            />
                            <button
                                className="h-10 px-4 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors disabled:opacity-50"
                                onClick={calculateTimeToTarget}
                                disabled={!targetCoreAmount || Number(targetCoreAmount) <= coreBalance}
                            >
                                {t('wallet.calculate')}
                            </button>
                        </div>

                        {timeToTarget !== null && (
                            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 text-center">
                                <span className="text-xs text-purple-600 block mb-1">{t('wallet.estimated_time')}</span>
                                <span className="text-lg font-bold text-purple-800 block mb-1">
                                    {formatTimeToTarget(timeToTarget)}
                                </span>
                                <span className="text-xs text-purple-600/70">
                                    {t('wallet.target_date')}: {new Date(Date.now() + timeToTarget * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Transfer Button */}
                <button
                    className="w-full h-12 bg-black text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all disabled:opacity-50 shadow-sm"
                    onClick={onTransfer}
                    disabled={!userId || loading}
                >
                    <ArrowRight className="h-4 w-4" />
                    <span>{t('wallet.transfer_from_wallet')}</span>
                </button>

                {/* Core History */}
                {userId && (
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('wallet.core_history')}</h3>
                        <CoreHistory userId={userId} />
                    </div>
                )}
            </div>
        </div>
    )
}
