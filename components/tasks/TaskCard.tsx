"use client"

import { PersonalTask } from "@/types/supabase"
import { Trash2, CheckCircle2, Circle } from "lucide-react"

interface TaskCardProps {
    task: PersonalTask
    onComplete: (id: string) => void
    onDelete: (id: string) => void
}

export default function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
    const isCompleted = task.status === 'completed'
    const isCanceled = task.status === 'canceled'

    const getTaskTypeLabel = () => {
        if (task.type === 'one_time') return 'One-time'
        if (task.type === 'streak') return `Streak ${task.streak_current || 0}/${task.streak_goal || 0}`
        if (task.type === 'daily') return `Daily (${task.streak_current || 0} days)`
        return ''
    }

    const getProgressPercentage = () => {
        if (task.type === 'one_time') {
            return isCompleted ? 100 : 0
        }
        if (task.type === 'streak' && task.streak_goal) {
            return Math.round(((task.streak_current || 0) / task.streak_goal) * 100)
        }
        return 0
    }

    return (
        <div className={`bg-white border-b border-gray-100 p-4 ${isCanceled ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium text-gray-900 ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                            {getTaskTypeLabel()}
                        </span>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    )}

                    {/* Progress bar for streak tasks */}
                    {task.type === 'streak' && task.streak_goal && (
                        <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {task.last_completed_at && (
                        <p className="text-xs text-gray-400 mt-1">
                            Last completed: {new Date(task.last_completed_at).toLocaleDateString()}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {!isCompleted && !isCanceled && (
                        <button
                            onClick={() => onComplete(task.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded transition-colors"
                        >
                            {task.type === 'one_time' ? (
                                <CheckCircle2 size={20} />
                            ) : (
                                <Circle size={20} />
                            )}
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
