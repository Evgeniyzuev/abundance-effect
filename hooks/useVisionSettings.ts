import { useState, useEffect, useCallback } from 'react';
import { getAvatarSettingsAction, updateAvatarSettingsAction } from '@/app/actions/vision';
import { AvatarSettings } from '@/types';

export function useVisionSettings(userId: string | null) {
    const [settings, setSettings] = useState<AvatarSettings | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const result = await getAvatarSettingsAction();
            if (result.success) {
                setSettings(result.data || null);
            } else {
                setError(result.error || 'Failed to fetch avatar settings');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const updateSettings = async (newSettings: Partial<AvatarSettings>) => {
        setLoading(true);
        try {
            const result = await updateAvatarSettingsAction(newSettings);
            if (result.success && result.data) {
                setSettings(result.data);
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err: any) {
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchSettings();
        }
    }, [userId, fetchSettings]);

    return {
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        updateSettings
    };
}
