import { useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { PersonalTask } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { STORAGE_KEYS } from '@/utils/storage';
import { useSyncData } from '@/hooks/useSyncData';
import {
    fetchTasksAction,
    addTaskAction,
    updateTaskAction,
    deleteTaskAction,
    completeTaskAction
} from '@/app/actions/tasks';

export function useTasks() {
    const { user } = useUser();

    const {
        data: tasks,
        setData: setTasks,
        refresh: fetchTasks
    } = useSyncData<PersonalTask[]>({
        key: STORAGE_KEYS.TASKS_CACHE,
        fetcher: fetchTasksAction,
        initialValue: [],
        parse: (cached) => {
            // New format (raw array)
            if (Array.isArray(cached)) return cached;
            // New format (wrapped)
            if (cached.data && Array.isArray(cached.data)) return cached.data;
            // Old format
            if (cached.tasks && Array.isArray(cached.tasks)) return cached.tasks;

            return null;
        }
    });

    const addTask = async (taskData: Partial<PersonalTask>) => {
        if (!user) return false;

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const newTask = {
            id: tempId,
            user_id: user.id,
            title: taskData.title || '',
            description: taskData.description || null,
            type: taskData.type || 'one_time',
            status: 'active',
            streak_goal: taskData.streak_goal || null,
            streak_current: 0,
            progress_percentage: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...taskData
        } as PersonalTask;

        const previousTasks = [...tasks];
        setTasks(prev => [newTask, ...prev]);

        try {
            const result = await addTaskAction(taskData);

            if (result.success) {
                // Background sync to get real ID
                fetchTasks();
                return true;
            } else {
                // Revert
                setTasks(previousTasks);
                logger.error('Error adding task:', result.error);
                alert('Failed to add task: ' + result.error);
                return false;
            }
        } catch (e) {
            setTasks(previousTasks);
            logger.error('Error adding task', e);
            return false;
        }
    };

    const updateTask = async (id: string, updates: Partial<PersonalTask>) => {
        if (!user) return false;

        const previousTasks = [...tasks];
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));

        try {
            const result = await updateTaskAction(id, updates);

            if (result.success) {
                fetchTasks();
                return true;
            } else {
                setTasks(previousTasks);
                logger.error('Error updating task:', result.error);
                alert('Failed to update task: ' + result.error);
                return false;
            }
        } catch (e) {
            setTasks(previousTasks);
            logger.error('Error updating task', e);
            return false;
        }
    };

    const deleteTask = async (id: string) => {
        if (!user) return false;

        const previousTasks = [...tasks];
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            const result = await deleteTaskAction(id);

            if (result.success) {
                fetchTasks();
                return true;
            } else {
                setTasks(previousTasks);
                logger.error('Error deleting task:', result.error);
                alert('Failed to delete task: ' + result.error);
                return false;
            }
        } catch (e) {
            setTasks(previousTasks);
            logger.error('Error deleting task', e);
            return false;
        }
    };

    const completeTask = async (id: string) => {
        if (!user) return false;

        const previousTasks = [...tasks];
        // Optimistic completion logic (simplified)
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                if (t.type === 'one_time') {
                    return { ...t, status: 'completed', last_completed_at: new Date().toISOString() };
                }
                // For streak/daily, logic might be more complex, but we can optimistically update last_completed_at
                return { ...t, last_completed_at: new Date().toISOString() };
            }
            return t;
        }));

        try {
            const result = await completeTaskAction(id);

            if (result.success) {
                fetchTasks();
                return true;
            } else {
                setTasks(previousTasks);
                logger.error('Error completing task:', result.error);
                alert('Failed to complete task: ' + result.error);
                return false;
            }
        } catch (e) {
            setTasks(previousTasks);
            logger.error('Error completing task', e);
            return false;
        }
    };

    return {
        tasks,
        isLoading: false, // No longer blocking
        loadFromCache: () => { }, // No-op, handled internally
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask
    };
}
