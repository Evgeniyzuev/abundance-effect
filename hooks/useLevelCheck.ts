import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@/context/UserContext'

export interface LevelThreshold {
    level: number
    core: number
}

// Default fallback levels (in case DB is unavailable)
const DEFAULT_LEVEL_THRESHOLDS: LevelThreshold[] = [
    { level: 1, core: 2 },
    { level: 2, core: 4 },
    { level: 3, core: 8 },
    { level: 4, core: 16 },
    { level: 5, core: 32 },
    { level: 6, core: 64 },
    { level: 7, core: 128 },
    { level: 8, core: 250 },
    { level: 9, core: 500 },
    { level: 10, core: 1000 },
]

interface LevelUpModal {
    isOpen: boolean
    newLevel: number
}

export function useLevelCheck() {
    const { user } = useUser()
    const [previousLevel, setPreviousLevel] = useState<number | null>(null)
    const [levelUpModal, setLevelUpModal] = useState<LevelUpModal | null>(null)
    const [levelThresholds, setLevelThresholds] = useState<LevelThreshold[]>(DEFAULT_LEVEL_THRESHOLDS)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Load level thresholds from database (still needed for UI display)
    useEffect(() => {
        const loadLevelThresholds = async () => {
            try {
                const { data, error } = await supabase
                    .from('level_thresholds')
                    .select('level, core_required')
                    .order('level', { ascending: true })

                if (error) {
                    console.error('Error loading level thresholds:', error)
                    return
                }

                if (data && data.length > 0) {
                    const thresholds: LevelThreshold[] = data.map(item => ({
                        level: item.level,
                        core: Number(item.core_required)
                    }))
                    setLevelThresholds(thresholds)
                }
            } catch (error) {
                console.error('Unexpected error loading level thresholds:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadLevelThresholds()
    }, [])

    // Check for level up when user level changes (level is now stored in database)
    useEffect(() => {
        if (!user || user.level === undefined) return

        const currentLevel = user.level

        // If we have a previous level recorded, check if level increased
        if (previousLevel !== null && currentLevel > previousLevel) {
            // Level up detected!
            setLevelUpModal({
                isOpen: true,
                newLevel: currentLevel
            })
        }

        // Always update previous level to current
        setPreviousLevel(currentLevel)
    }, [user?.level, previousLevel])

    const handleLevelUpModalClose = () => {
        setLevelUpModal(null)
    }

    return {
        levelUpModal,
        handleLevelUpModalClose,
        levelThresholds,
        isLoading
    }
}
