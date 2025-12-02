"use client"

import { PersonalTask } from "@/types/supabase"
import { X, Trash2, CheckCircle2, Calendar } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext'
import { storage } from '@/utils/storage'
import { useState, useEffect } from 'react'

interface TaskDetailModalProps {
    task: PersonalTask | null
    isOpen: boolean
    onClose: () => void
    onMarkDay: (taskId: string, date: string) => Promise<void>
    onComplete: (taskId: string) => Promise<void>
    onDelete: (taskId: string) => Promise<void>
}

export default function TaskDetailModal({
    task,
    isOpen,
    onClose,
    onMarkDay,
    onComplete,
    onDelete
}: TaskDetailModalProps) {
    const { t } = useLanguage()
    const [displayImage, setDisplayImage] = useState<string>("")

    useEffect(() => {
        if (task?.image_url) {
            if (task.image_url.startsWith('local://')) {
                const localId = task.image_url.replace('local://', '')
                const storedImage = storage.getTaskImage(localId)
                setDisplayImage(storedImage || "")
            } else {
                setDisplayImage(task.image_url)
            }
        } else {
            setDisplayImage("")
        }
    }, [task])

    if (!isOpen || !task) return null

    const isCompleted = task.status === 'completed'
    const dailyCompletions = (task.daily_completions as string[]) || []
    const today = new Date().toISOString().split('T')[0]
    const isTodayMarked = dailyCompletions.includes(today)

    // Generate current week calendar (Mon-Sun)
    const getWeeklyCalendar = () => {
        const days = []
        const today = new Date()
        const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
        const monday = new Date(today)
        monday.setDate(today.getDate() - dayOfWeek + 1) // Monday of current week

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            days.push(date.toISOString().split('T')[0])
        }
        return days
    }

    const handleMarkToday = async () => {
        if (!isTodayMarked && !isCompleted) {
            await onMarkDay(task.id, today)
        }
    }

    const handleComplete = async () => {
        if (!isCompleted) {
            await onComplete(task.id)
        }
    }

    const handleDelete = async () => {
        if (confirm(t('tasks.confirm_delete'))) {
            await onDelete(task.id)
            onClose()
        }
    }

    const canComplete = () => {
        if (task.type === 'one_time') return !isCompleted
        if (task.type === 'streak' && task.streak_goal) {
            return (task.streak_current || 0) >= task.streak_goal && !isCompleted
        }
        return false
    }

    const getTaskTypeLabel = () => {
        if (task.type === 'one_time') return t('tasks.type_one_time')
        if (task.type === 'streak') return t('tasks.type_streak')
        if (task.type === 'daily') return t('tasks.type_daily')
        return ''
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-gray-900">{t('tasks.task_details')}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Image */}
                    {displayImage && (
                        <div className="w-full">
                            <img
                                src={displayImage}
                                alt={task.title}
                                className="w-full h-64 object-cover rounded-xl"
                            />
                        </div>
                    )}

                    {/* Title and Type */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{task.title}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {getTaskTypeLabel()}
                            </span>
                        </div>
                        {task.description && (
                            <p className="text-gray-600">{task.description}</p>
                        )}
                    </div>

                    {/* Progress for Streak Tasks */}
                    {task.type === 'streak' && task.streak_goal && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {t('tasks.daily_progress')}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {task.streak_current || 0} / {task.streak_goal} {t('tasks.type_daily')}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min(100, ((task.streak_current || 0) / task.streak_goal) * 100)}%`
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Daily Completion Calendar for Streak/Daily Tasks */}
                    {(task.type === 'streak' || task.type === 'daily') && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar size={18} className="text-gray-600" />
                                <h4 className="text-sm font-medium text-gray-700">
                                    {t('tasks.daily_progress')} (Current Week)
                                </h4>
                            </div>
                            <div className="grid grid-cols-7 gap-1.5 mb-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} className="text-xs text-center font-medium text-gray-600">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                {getWeeklyCalendar().map((date) => {
                                    const isMarked = dailyCompletions.includes(date)
                                    const isToday = date === today
                                    const dayNumber = new Date(date).getDate()
                                    return (
                                        <div
                                            key={date}
                                            className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs relative ${isMarked
                                                    ? 'bg-green-500 text-white'
                                                    : isToday
                                                        ? 'bg-blue-100 border-2 border-blue-500'
                                                        : 'bg-gray-100 text-gray-400'
                                                }`}
                                            title={date}
                                        >
                                            <span>{dayNumber}</span>
                                            {isMarked && (
                                                <CheckCircle2 size={10} className="mt-0.5 opacity-80" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Green = completed, Blue border = today
                            </p>
                        </div>
                    )}

                    {/* Last Completed */}
                    {task.last_completed_at && (
                        <div className="text-sm text-gray-500">
                            Last completed: {new Date(task.last_completed_at).toLocaleDateString()}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-2 rounded-b-2xl">
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                        {t('common.delete')}
                    </button>

                    <div className="flex-1" />

                    {/* Mark Today Button (for streak/daily tasks) */}
                    {(task.type === 'streak' || task.type === 'daily') && !isCompleted && (
                        <button
                            onClick={handleMarkToday}
                            disabled={isTodayMarked}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isTodayMarked
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                        >
                            <CheckCircle2 size={18} />
                            {isTodayMarked ? 'Marked' : t('tasks.mark_today')}
                        </button>
                    )}

                    {/* Complete Task Button */}
                    <button
                        onClick={handleComplete}
                        disabled={!canComplete()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${canComplete()
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <CheckCircle2 size={18} />
                        {t('tasks.complete_task')}
                    </button>
                </div>
            </div>
        </div>
    )
}
