'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProjects, applyToProject } from '@/app/actions/projects';

export function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<Set<string>>(new Set());

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const joinProject = async (projectId: string, message?: string) => {
        if (applying.has(projectId)) return;

        setApplying(prev => new Set(prev).add(projectId));

        // Optimistic UI
        setProjects(prev => prev.map(p =>
            p.id === projectId
                ? { ...p, userApplication: { status: 'pending' } }
                : p
        ));

        try {
            const result = await applyToProject(projectId, message);
            if (!result.success) {
                // Rollback if failed
                await fetchProjects();
            }
        } catch (error) {
            console.error('Failed to apply to project:', error);
            await fetchProjects();
        } finally {
            setApplying(prev => {
                const next = new Set(prev);
                next.delete(projectId);
                return next;
            });
        }
    };

    return {
        projects,
        loading,
        applying,
        joinProject,
        fetchProjects
    };
}
