'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getProjects() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: projects, error } = await supabase
        .from('projects')
        .select(`
            *,
            applications:project_applications(status)
        `)
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    // Map applications to a simple status for the current user
    return projects.map((project: any) => ({
        ...project,
        userApplication: user && project.applications ? project.applications[0] : null
    }));
}

export async function applyToProject(projectId: string, message?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be logged in to apply');
    }

    const { error } = await supabase
        .from('project_applications')
        .insert({
            project_id: projectId,
            user_id: user.id,
            message: message,
            status: 'pending'
        });

    if (error) {
        console.error('Error applying to project:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/projects');
    return { success: true };
}
