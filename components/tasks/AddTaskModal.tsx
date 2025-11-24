"use client"

import { useState, useEffect } from "react"
import { PersonalTask } from "@/types/supabase"
import { X } from "lucide-react"

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (taskData: Partial<PersonalTask>) => Promise<boolean>
    initialData?: PersonalTask | null
}

export default function AddTaskModal({ isOpen, onClose, onSave, initialData }: AddTaskModalProps) {
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
            alert("Please enter a task title")
            return
        }

        if (type === 'streak' && (!streakGoal || parseInt(streakGoal) <= 0)) {
            alert("Please enter a valid streak goal")
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
            <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-xl animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {initialData ? 'Edit Task' : 'New Task'}
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
                            Title *
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Task Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Task Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setType('one_time')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'one_time'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                One-time
                            </button>
                            <button
                                onClick={() => setType('streak')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'streak'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Streak
                            </button>
                            <button
                                onClick={() => setType('daily')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'daily'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Daily
                            </button>
                        </div>
                    </div>

                    {/* Streak Goal (only for streak type) */}
                    {type === 'streak' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Streak Goal (days) *
                            </label>
                            <input
                                type="number"
                                value={streakGoal}
                                onChange={(e) => setStreakGoal(e.target.value)}
                                placeholder="e.g., 30"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Type descriptions */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                            {type === 'one_time' && "Complete once and mark as done."}
                            {type === 'streak' && "Track consecutive days. Complete the goal to finish."}
                            {type === 'daily' && "Track daily without a limit. Complete anytime."}
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
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : (initialData ? 'Save' : 'Create')}
                    </button>
                </div>
            </div>
        </div>
    )
}
