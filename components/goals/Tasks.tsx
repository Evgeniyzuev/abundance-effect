'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTasks } from '@/hooks/useTasks';
import { PersonalTask } from '@/types/supabase';
import TaskCard from '@/components/tasks/TaskCard';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskDetailModal from '@/components/tasks/TaskDetailModal';
import TabataTimer from '@/components/tasks/TabataTimer';
import { Plus } from 'lucide-react';
import { markDayCompletedAction } from '@/app/actions/tasks';

export default function Tasks() {
    const { user } = useUser();
    const { t } = useLanguage();
    const {
        tasks,
        loadFromCache,
        fetchTasks,
        addTask,
        deleteTask,
        completeTask
    } = useTasks();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
    const [selectedTask, setSelectedTask] = useState<PersonalTask | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        loadFromCache();
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleAddTask = async (taskData: Partial<PersonalTask>) => {
        const success = await addTask(taskData);
        return success;
    };

    const handleMarkDay = async (taskId: string, date: string) => {
        // Find the task in current tasks
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            alert('Task not found');
            return;
        }

        // Check if already marked locally
        const completions = (task.daily_completions as string[]) || [];
        if (completions.includes(date)) {
            alert('Day already marked');
            return;
        }

        // Optimistic update: update selectedTask immediately
        const newCompletions = [...completions, date];
        const newCurrent = newCompletions.length;
        const optimisticTask = {
            ...task,
            daily_completions: newCompletions,
            streak_current: newCurrent,
            last_completed_at: new Date().toISOString()
        };
        setSelectedTask(optimisticTask);

        try {
            const result = await markDayCompletedAction(taskId, date);
            if (result.success && result.data) {
                setSelectedTask(result.data);
                await fetchTasks();
            } else {
                // Revert optimistic update on error
                setSelectedTask(task);
                if (result.error) {
                    alert('Failed to mark day: ' + result.error);
                }
            }
        } catch (error) {
            // Revert optimistic update on error
            setSelectedTask(task);
            alert('Network error. Please try again.');
        }
    };

    const handleCompleteTask = async (id: string) => {
        await completeTask(id);
        setIsDetailModalOpen(false);
        setSelectedTask(null);
    };

    const handleDeleteTask = async (id: string) => {
        await deleteTask(id);
        setIsDetailModalOpen(false);
        setSelectedTask(null);
    };

    const handleTaskClick = (task: PersonalTask) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const activeTasks = tasks.filter(t => t.status === 'active');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="pb-32 bg-gray-50 min-h-screen">
            {/* Active Tasks */}
            <div className="bg-white">
                {activeTasks.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">{t('tasks.no_active')}</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={20} className="mr-2 inline" />
                            {t('tasks.create_first')}
                        </button>
                    </div>
                ) : (
                    <div>
                        {activeTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onClick={() => handleTaskClick(task)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Tasks - Collapsible */}
            {completedTasks.length > 0 && (
                <div className="mt-4 bg-white">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700">{t('tasks.completed')}</h4>
                        <button
                            onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                            className="text-blue-500 hover:text-blue-600 px-3 py-1 rounded transition-colors text-sm"
                        >
                            {isCompletedExpanded ? t('tasks.collapse') : t('tasks.expand')}
                        </button>
                    </div>

                    {isCompletedExpanded && (
                        <div>
                            {completedTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onClick={() => handleTaskClick(task)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Tabata Timer */}
            <div className="mt-4 px-4">
                <TabataTimer />
            </div>

            {/* Floating Action Button */}
            {activeTasks.length > 0 && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-40"
                >
                    <Plus size={24} />
                </button>
            )}

            {/* Add Task Modal */}
            <AddTaskModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddTask}
            />

            {/* Task Detail Modal */}
            <TaskDetailModal
                task={selectedTask}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedTask(null);
                }}
                onMarkDay={handleMarkDay}
                onComplete={handleCompleteTask}
                onDelete={handleDeleteTask}
            />
        </div>
    );
}
