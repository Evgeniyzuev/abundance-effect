import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

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
    const [levelUpModal, setLevelUpModal] = useState<LevelUpModal | null>(null)
    const [levelThresholds, setLevelThresholds] = useState<LevelThreshold[]>(DEFAULT_LEVEL_THRESHOLDS)
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    // Load level thresholds from database
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
