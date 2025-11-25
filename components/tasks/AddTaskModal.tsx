"use client"

import { useState, useEffect } from "react"
import { useLanguage } from '@/context/LanguageContext'
import { PersonalTask } from "@/types/supabase"
import { X } from "lucide-react"

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (taskData: Partial<PersonalTask>) => Promise<boolean>
    initialData?: PersonalTask | null
}

export default function AddTaskModal({ isOpen, onClose, onSave, initialData }: AddTaskModalProps) {
    const { t } = useLanguage()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<'one_time' | 'streak' | 'daily'>('one_time')
    const [streakGoal, setStreakGoal] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title)
            setDescription(initialData.description || "")
            setType(initialData.type)
            setStreakGoal(initialData.streak_goal?.toString() || "")
        } else {
            setTitle("")
            setDescription("")
            setType('one_time')
            setStreakGoal("")
        }
    }, [initialData, isOpen])

    const handleSave = async () => {
        if (!title.trim()) {
            alert(t('tasks.title_placeholder'))
            return
        }

        if (type === 'streak' && (!streakGoal || parseInt(streakGoal) <= 0)) {
            alert(t('tasks.streak_goal'))
            return
        }

        setIsSaving(true)

        const taskData: Partial<PersonalTask> = {
            title: title.trim(),
            description: description.trim() || null,
            type,
            streak_goal: type === 'streak' ? parseInt(streakGoal) : null,
            streak_current: 0,
            progress_percentage: 0
        }

        const success = await onSave(taskData)
        setIsSaving(false)

        if (success) {
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
            <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-xl animate-slide-up mb-16">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {initialData ? t('tasks.edit_task') : t('tasks.new_task')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('tasks.title_field')} *
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('tasks.title_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('tasks.description_field')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('tasks.description_placeholder')}
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Task Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('tasks.task_type')}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setType('one_time')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'one_time'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_one_time')}
                            </button>
                            <button
                                onClick={() => setType('streak')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'streak'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_streak')}
                            </button>
                            <button
                                onClick={() => setType('daily')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'daily'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_daily')}
                            </button>
                        </div>
                    </div>

                    {/* Streak Goal (only for streak type) */}
                    {type === 'streak' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('tasks.streak_goal')} *
                            </label>
                            <input
                                type="number"
                                value={streakGoal}
                                onChange={(e) => setStreakGoal(e.target.value)}
                                placeholder={t('tasks.streak_goal_placeholder')}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Type descriptions */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                            {type === 'one_time' && t('tasks.type_one_time_desc')}
                            {type === 'streak' && t('tasks.type_streak_desc')}
                            {type === 'daily' && t('tasks.type_daily_desc')}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {isSaving ? t('tasks.saving') : (initialData ? t('common.save') : t('common.create'))}
                    </button>
                </div>
            </div>
        </div>
    )
}
