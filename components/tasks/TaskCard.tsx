"use client"

import { PersonalTask } from "@/types/supabase"
import { CheckSquare } from "lucide-react"
import { storage } from '@/utils/storage'
import { useState, useEffect } from 'react'

interface TaskCardProps {
    task: PersonalTask
    onClick: () => void
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
    const [thumbnailImage, setThumbnailImage] = useState<string>("")

    useEffect(() => {
        if (task.image_url) {
            if (task.image_url.startsWith('local://')) {
                const localId = task.image_url.replace('local://', '')
                const storedImage = storage.getTaskImage(localId)
                setThumbnailImage(storedImage || "")
            } else {
                setThumbnailImage(task.image_url)
            }
        } else {
            setThumbnailImage("")
        }
    }, [task.image_url])

    const isCompleted = task.status === 'completed'

    const getTaskTypeLabel = () => {
        if (task.type === 'one_time') return 'One-time'
        if (task.type === 'streak') return `${task.streak_current || 0}/${task.streak_goal || 0}`
        if (task.type === 'daily') return `${task.streak_current || 0} days`
        return ''
    }

    return (
        <div
            onClick={onClick}
            className={`bg-white border-b border-gray-100 p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${isCompleted ? 'opacity-60' : ''
                }`}
        >
            {/* Thumbnail Image */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {thumbnailImage ? (
                    <img
                        src={thumbnailImage}
                        alt={task.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <CheckSquare size={24} className="text-gray-400" />
                )}
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className={`font-medium text-gray-900 truncate ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {getTaskTypeLabel()}
                    </span>
                </div>

                {/* Progress bar for streak tasks */}
                {task.type === 'streak' && task.streak_goal && (
                    <div className="mt-1.5">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: `${Math.min(100, ((task.streak_current || 0) / task.streak_goal) * 100)}%`
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
