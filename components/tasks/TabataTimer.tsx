"use client"

import { useState, useEffect } from "react"

type TabataTimerProps = {
    className?: string
}

export default function TabataTimer({ className = "" }: TabataTimerProps) {
    const [workDurationInput, setWorkDurationInput] = useState("")
    const [restDurationInput, setRestDurationInput] = useState("")
    const [roundsInput, setRoundsInput] = useState("")
    const [workDurationMinutes, setWorkDurationMinutes] = useState(25)
    const [restDurationMinutes, setRestDurationMinutes] = useState(5)
    const [rounds, setRounds] = useState(4)

    const formatTime = (minutes: number) => {
        const mins = Math.floor(minutes)
        const secs = Math.round((minutes - mins) * 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const parseTimeInput = (input: string) => {
        const parts = input.split(':')
        if (parts.length === 3) {
            const hours = parseInt(parts[0]) || 0
            const mins = parseInt(parts[1]) || 0
            const secs = parseInt(parts[2]) || 0
            return hours * 60 + mins + secs / 60
        } else if (parts.length === 2) {
            const mins = parseInt(parts[0]) || 0
            const secs = parseInt(parts[1]) || 0
            return mins + secs / 60
        }
        return parseFloat(input) || 0
    }

    const [isRunning, setIsRunning] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [currentRound, setCurrentRound] = useState(0)
    const [isWorkPhase, setIsWorkPhase] = useState(true)
    const [timeLeft, setTimeLeft] = useState(25 * 60)
    const [totalWorkTime, setTotalWorkTime] = useState(0)
    const [isBlinking, setIsBlinking] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [timerStartTime, setTimerStartTime] = useState<number | null>(null)

    useEffect(() => {
        let loadedWorkDurationMinutes = 25
        let loadedRestDurationMinutes = 5
        let loadedRounds = 4

        const savedSettings = localStorage.getItem('tabataSettings')
        if (savedSettings) {
            const settings = JSON.parse(savedSettings)
            loadedWorkDurationMinutes = settings.work || 25
            loadedRestDurationMinutes = settings.rest || 5
            loadedRounds = settings.rounds || 4

            setWorkDurationMinutes(loadedWorkDurationMinutes)
            setRestDurationMinutes(loadedRestDurationMinutes)
            setRounds(loadedRounds)
            if (settings.workInput) setWorkDurationInput(settings.workInput)
            if (settings.restInput) setRestDurationInput(settings.restInput)
            if (settings.roundsInput) setRoundsInput(settings.roundsInput)
        }

        const savedTimerStartTime = localStorage.getItem('tabataTimerStartTime')
        const savedTimerSettings = localStorage.getItem('tabataTimerSettings')

        if (savedTimerStartTime && savedTimerSettings) {
            const startTime = parseInt(savedTimerStartTime)
            const timerSettings = JSON.parse(savedTimerSettings)
            const now = Date.now()
            const elapsedSeconds = Math.floor((now - startTime) / 1000)

            const savedWorkDuration = Math.round(timerSettings.workDurationMinutes * 60)
            const savedRestDuration = Math.round(timerSettings.restDurationMinutes * 60)
            const savedRounds = timerSettings.rounds
            const totalDuration = savedRounds * (savedWorkDuration + savedRestDuration)

            if (elapsedSeconds < totalDuration) {
                let remainingTime = elapsedSeconds
                let currentRound = 0
                let isWorkPhase = true
                let timeLeftInPhase = savedWorkDuration
                let completedWorkTime = 0

                while (remainingTime > 0 && currentRound < savedRounds) {
                    if (remainingTime >= timeLeftInPhase) {
                        remainingTime -= timeLeftInPhase

                        if (isWorkPhase) {
                            completedWorkTime += savedWorkDuration
                            if (currentRound < savedRounds - 1) {
                                isWorkPhase = false
                                timeLeftInPhase = savedRestDuration
                            } else {
                                break
                            }
                        } else {
                            currentRound++
                            isWorkPhase = true
                            timeLeftInPhase = savedWorkDuration
                        }
                    } else {
                        if (isWorkPhase) {
                            completedWorkTime += (timeLeftInPhase - remainingTime)
                        }
                        timeLeftInPhase -= remainingTime
                        remainingTime = 0
                    }
                }

                setTimerStartTime(startTime)
                setIsRunning(true)
                setHasStarted(true)
                setCurrentRound(currentRound)
                setIsWorkPhase(isWorkPhase)
                setTimeLeft(timeLeftInPhase)
                setTotalWorkTime(completedWorkTime)
            } else {
                setIsCompleted(true)
                setTimerStartTime(null)
                localStorage.removeItem('tabataTimerStartTime')
                localStorage.removeItem('tabataTimerSettings')
            }
        } else {
            const workDuration = Math.round(workDurationMinutes * 60)
            setTimeLeft(workDuration)
        }
    }, [])

    useEffect(() => {
        const settings = {
            work: workDurationMinutes,
            rest: restDurationMinutes,
            rounds: rounds,
            workInput: workDurationInput,
            restInput: restDurationInput,
            roundsInput: roundsInput,
        }
        localStorage.setItem('tabataSettings', JSON.stringify(settings))
    }, [workDurationMinutes, restDurationMinutes, rounds, workDurationInput, restDurationInput, roundsInput])

    const workDuration = Math.round(workDurationMinutes * 60)
    const restDuration = Math.round(restDurationMinutes * 60)

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (isRunning) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (isWorkPhase) {
                            setTotalWorkTime((prevTotal) => prevTotal + workDuration)
                            playBeep()
                            setIsBlinking(true)
                            setTimeout(() => setIsBlinking(false), 5000)
                            if (currentRound < rounds - 1) {
                                setIsWorkPhase(false)
                                return restDuration
                            } else {
                                setIsRunning(false)
                                setIsCompleted(true)
                                setCurrentRound(0)
                                setIsWorkPhase(true)
                                playCompletionSound()
                                return workDuration
                            }
                        } else {
                            playBeep()
                            setIsBlinking(true)
                            setTimeout(() => setIsBlinking(false), 5000)
                            setCurrentRound((prevRound) => prevRound + 1)
                            setIsWorkPhase(true)
                            return workDuration
                        }
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isRunning, isWorkPhase, currentRound, rounds, workDuration, restDuration, totalWorkTime])

    const playBeep = () => {
        if (isMuted) return
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 0.5)
        } catch (error) {
            console.log('Audio not supported')
        }
    }

    const playCompletionSound = () => {
        if (isMuted) return
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 600
            oscillator.type = 'sine'

            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

            oscillator.start(audioContext.currentTime)
            oscillator.stop(audioContext.currentTime + 1)
        } catch (error) {
            console.log('Audio not supported')
        }
    }

    const startStop = () => {
        if (isRunning) {
            setIsRunning(false)
            setTimerStartTime(null)
            localStorage.removeItem('tabataTimerStartTime')
            localStorage.removeItem('tabataTimerSettings')
        } else {
            if (!hasStarted) {
                setHasStarted(true)
                setCurrentRound(0)
                setIsWorkPhase(true)
                setTimeLeft(workDuration)
                const startTime = Date.now()
                const timerSettings = {
                    workDurationMinutes,
                    restDurationMinutes,
                    rounds,
                    startTime
                }
                setTimerStartTime(startTime)
                localStorage.setItem('tabataTimerStartTime', startTime.toString())
                localStorage.setItem('tabataTimerSettings', JSON.stringify(timerSettings))
            }
            setIsRunning(true)
        }
    }

    const reset = () => {
        setIsRunning(false)
        setHasStarted(false)
        setCurrentRound(0)
        setIsWorkPhase(true)
        setTimeLeft(workDuration)
        setIsBlinking(false)
        setIsCompleted(false)
        setTimerStartTime(null)
        localStorage.removeItem('tabataTimerStartTime')
        localStorage.removeItem('tabataTimerSettings')
    }

    useEffect(() => {
        const work = workDurationInput ? parseTimeInput(workDurationInput) : 25
        const rest = restDurationInput ? parseTimeInput(restDurationInput) : 5
        const r = roundsInput ? parseInt(roundsInput) : 4
        setWorkDurationMinutes(work)
        setRestDurationMinutes(rest)
        setRounds(r)
    }, [workDurationInput, restDurationInput, roundsInput])

    return (
        <div className={`mx-0 bg-white rounded-3xl shadow-lg overflow-hidden ${className}`}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 text-white">
                <div className="grid grid-cols-3 gap-3 h-full">
                    {/* Left Container */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-1">
                            <div className="text-sm opacity-90">Round {currentRound + 1} of {rounds}</div>
                            <div className="text-lg font-medium">{isWorkPhase ? 'Work' : 'Rest'}</div>
                            <div className="text-xs opacity-80">
                                Today: {Math.floor(totalWorkTime / 60)}:{(totalWorkTime % 60).toString().padStart(2, '0')} worked
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <button
                                onClick={startStop}
                                className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-semibold shadow-lg transition-colors"
                            >
                                {isRunning ? 'Stop' : (hasStarted ? 'Continue' : 'Start')}
                            </button>
                        </div>
                    </div>

                    {/* Center Container */}
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-base font-semibold mb-2">Tabata Timer</h2>

                        {/* Timer with Circular Progress */}
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeWidth="6"
                                    fill="none"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    stroke="rgba(255,255,255,0.8)"
                                    strokeWidth="6"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 54}`}
                                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - (isWorkPhase ?
                                        (workDuration - timeLeft) / Math.max(workDuration, 1) :
                                        (restDuration - timeLeft) / Math.max(restDuration, 1)
                                    ))}`}
                                    strokeLinecap="round"
                                    className="transition-all duration-300"
                                />
                            </svg>

                            {/* Timer Display */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`text-center transition-all duration-300 ${isCompleted ? 'text-green-300' :
                                    isBlinking ? 'text-red-300 animate-pulse' :
                                        'text-white'
                                    }`}>
                                    <div className="text-3xl font-bold">
                                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Container */}
                    <div className="flex flex-col items-end justify-between">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white hover:bg-white/20 p-2 self-end rounded transition-colors"
                        >
                            {isMuted ? '🔇' : '🔊'}
                        </button>

                        <div className="space-y-1">
                            <div className="flex items-center justify-end space-x-2">
                                <label className="text-xs opacity-80 text-white">Work</label>
                                <input
                                    type="text"
                                    value={workDurationInput}
                                    onChange={(e) => setWorkDurationInput(e.target.value)}
                                    placeholder={formatTime(workDurationMinutes)}
                                    className="w-14 h-6 text-xs bg-white/20 border-white/30 text-white placeholder-white/70 rounded px-2"
                                    style={{ color: 'white' }}
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                                <label className="text-xs opacity-80 text-white">Rest</label>
                                <input
                                    type="text"
                                    value={restDurationInput}
                                    onChange={(e) => setRestDurationInput(e.target.value)}
                                    placeholder={formatTime(restDurationMinutes)}
                                    className="w-14 h-6 text-xs bg-white/20 border-white/30 text-white placeholder-white/70 rounded px-2"
                                    style={{ color: 'white' }}
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                                <label className="text-xs opacity-80 text-white">Rounds</label>
                                <input
                                    type="text"
                                    value={roundsInput}
                                    onChange={(e) => setRoundsInput(e.target.value)}
                                    placeholder={rounds.toString()}
                                    className="w-14 h-6 text-xs bg-white/20 border-white/30 text-white placeholder-white/70 rounded px-2"
                                    style={{ color: 'white' }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={reset}
                            className="bg-gray-600 text-white hover:bg-gray-700 rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
