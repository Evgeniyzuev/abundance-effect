"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { updateUserReinvest } from "@/app/actions/finance"
import { useLevelCheck } from "@/hooks/useLevelCheck"
import CoreHistory from "./CoreHistory"

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
        <div className="space-y-4 p-4">
            {/* Balance Card with Level */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm opacity-90 font-medium mb-1">Core Balance</p>
                        <h1 className="text-3xl font-bold">${coreBalance.toFixed(2)}</h1>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium">Level {currentLevel}</span>
                        <span className="opacity-90">${coreBalance.toFixed(2)} / ${nextLevelThreshold}</span>
                    </div>
                    <Progress value={progressPercentage} className="h-1.5 bg-white/20 rounded-full" />
                </div>
            </div>

            {/* Daily Income Card */}
            <Card className="w-full bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-base font-semibold text-gray-900">Daily Income</span>
                            </div>
                            <span className="text-base font-bold text-green-600">
                                ${calculateDailyIncome(coreBalance).total.toFixed(8)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Reinvest %</span>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="text"
                                        value={reinvestInputValue}
                                        onChange={(e) => handleReinvestChange(e.target.value)}
                                        className="h-8 text-sm w-16 text-center font-medium"
                                    />
                                    <span className="text-xs text-gray-500">%</span>
                                    {isReinvestChanged && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2"
                                            onClick={handleSaveReinvest}
                                        >
                                            <Check className="h-3 w-3 text-green-500" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <Progress value={Number(reinvestInputValue)} className="h-1.5 bg-gray-100" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-bold text-blue-700">
                                    💲 ${calculateDailyIncome(coreBalance).toWallet.toFixed(8)}
                                </span>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-bold text-green-700">
                                    ⚛️ ${calculateDailyIncome(coreBalance).toCore.toFixed(8)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Core Growth Calculator */}
            <Card className="w-full bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-base font-semibold text-gray-900">Core Growth Calculator</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-700">Start Core</label>
                                <Input
                                    type="number"
                                    value={startCore}
                                    onChange={(e) => setStartCore(e.target.value)}
                                    className="h-8 text-xs"
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-700">Daily Rewards</label>
                                <Input
                                    type="number"
                                    value={dailyRewards}
                                    onChange={(e) => setDailyRewards(e.target.value)}
                                    className="h-8 text-xs"
                                    min={0}
                                    placeholder="10"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-700">Years</label>
                                <Input
                                    type="number"
                                    value={yearsToCalculate}
                                    onChange={(e) => setYearsToCalculate(e.target.value)}
                                    className="h-8 text-xs"
                                    min={1}
                                    max={100}
                                    placeholder="30"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-xs text-gray-600 block mb-1">Future Core Balance</span>
                                <span className="text-sm font-bold text-blue-700">
                                    ${formatWithSpaces(calculateFutureCore())}
                                </span>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <span className="text-xs text-gray-600 block mb-1">Daily Income</span>
                                <span className="text-sm font-bold text-green-700">
                                    ${formatWithSpaces(calculateFutureCore() * DAILY_RATE)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Time to Target Calculator */}
            <Card className="w-full bg-white border border-gray-100 shadow-sm">
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-base font-semibold text-gray-900">Time to Target</span>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-700">Target Core Amount</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={targetCoreAmount}
                                        onChange={(e) => setTargetCoreAmount(e.target.value)}
                                        className="h-8 text-xs flex-1"
                                        placeholder="Enter target amount"
                                    />
                                    <Button
                                        className="h-8 px-4 text-xs"
                                        onClick={calculateTimeToTarget}
                                        disabled={!targetCoreAmount || Number(targetCoreAmount) <= coreBalance}
                                    >
                                        Calculate
                                    </Button>
                                </div>
                            </div>

                            {timeToTarget !== null && (
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="text-center">
                                        <span className="text-xs text-gray-600 block mb-1">Estimated time to reach target</span>
                                        <span className="text-lg font-bold text-purple-700 mb-1 block">
                                            {formatTimeToTarget(timeToTarget)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            Target date: {new Date(Date.now() + timeToTarget * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transfer Button */}
            <Button
                className="w-full h-14 bg-white border-2 border-green-100 hover:border-green-200 hover:bg-green-50 text-green-700 font-semibold flex items-center justify-center space-x-2"
                onClick={onTransfer}
                disabled={!userId}
            >
                <ArrowRight className="h-5 w-5" />
                <span className="text-sm">Transfer from Wallet</span>
            </Button>

            {/* Core History */}
            {userId && <CoreHistory userId={userId} />}
        </div>
    )
}
