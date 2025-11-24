import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { PersonalTask } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import {
    fetchTasksAction,
    addTaskAction,
    updateTaskAction,
    deleteTaskAction,
    completeTaskAction
} from '@/app/actions/tasks';

interface TasksCache {
    tasks: PersonalTask[];
    timestamp: number;
}

export function useTasks() {
    const { user } = useUser();
    const [tasks, setTasks] = useState<PersonalTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadFromCache = useCallback(() => {
        const cached = storage.get<TasksCache>(STORAGE_KEYS.TASKS_CACHE);
        if (cached) {
            const CACHE_AGE = 60 * 60 * 1000; // 1 hour
            if (Date.now() - cached.timestamp < CACHE_AGE) {
                setTasks(cached.tasks);
                return true;
            }
        }
        return false;
    }, []);

    const saveToCache = useCallback((tasks: PersonalTask[]) => {
        storage.set(STORAGE_KEYS.TASKS_CACHE, {
            tasks,
            timestamp: Date.now()
        });
    }, []);

    const fetchTasks = useCallback(async () => {
        if (!user) return;

        const result = await fetchTasksAction();

        if (result.success && result.data) {
            setTasks(result.data);
            saveToCache(result.data);
        } else {
            logger.error('Error fetching tasks:', result.error);
        }
    }, [user, saveToCache]);

    const addTask = async (taskData: Partial<PersonalTask>) => {
        if (!user) return false;
        setIsLoading(true);

        try {
            const result = await addTaskAction(taskData);

            if (result.success) {
                await fetchTasks();
                return true;
            } else {
                logger.error('Error adding task:', result.error);
                alert('Failed to add task: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error adding task', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateTask = async (id: string, updates: Partial<PersonalTask>) => {
        if (!user) return false;
        setIsLoading(true);

        try {
            const result = await updateTaskAction(id, updates);

            if (result.success) {
                await fetchTasks();
                return true;
            } else {
                logger.error('Error updating task:', result.error);
                alert('Failed to update task: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error updating task', e);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteTask = async (id: string) => {
        if (!user) return false;

        try {
            const result = await deleteTaskAction(id);

            if (result.success) {
                await fetchTasks();
                return true;
            } else {
                logger.error('Error deleting task:', result.error);
                alert('Failed to delete task: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error deleting task', e);
            return false;
        }
    };

    const completeTask = async (id: string) => {
        if (!user) return false;

        try {
            const result = await completeTaskAction(id);

            if (result.success) {
                await fetchTasks();
                return true;
            } else {
                logger.error('Error completing task:', result.error);
                alert('Failed to complete task: ' + result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error completing task', e);
            return false;
        }
    };

    return {
        tasks,
        isLoading,
        loadFromCache,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        completeTask
    };
}
