'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useProjects } from '@/hooks/useProjects';
import { Rocket, Loader2, RotateCcw, Clock, MapPin, Users } from 'lucide-react';
import ChallengesProjectsNav from '@/components/ChallengesProjectsNav';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { TranslationKey } from '@/utils/translations';

export default function ProjectsPage() {
    const { t, language } = useLanguage();
    const { projects, loading, applying, joinProject, fetchProjects } = useProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const selectedProject = selectedProjectId
        ? projects.find(p => p.id === selectedProjectId)
        : null;

    const getProjectTitle = (project: any) => {
        return project.title[language] || project.title['en'] || project.title['ru'] || '';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const ProjectCard = ({ project }: { project: any }) => {
        const title = getProjectTitle(project);
        const isApplying = applying.has(project.id);
        const status = project.userApplication?.status;

        return (
            <div
                onClick={() => setSelectedProjectId(project.id)}
                className="ios-card p-1 mb-2 relative cursor-pointer active:opacity-70 transition-opacity"
            >
                {/* Project Image */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center">
                    {project.image_url ? (
                        <img
                            src={project.image_url}
                            alt={title}
                            className="w-20 h-full rounded-lg object-cover bg-gray-100"
                        />
                    ) : (
                        <div className="w-20 h-full rounded-lg bg-gray-200 flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-24 min-h-[80px] p-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm text-gray-900 truncate">
                                {title}
                            </h3>
                            {status && (
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getStatusColor(status)}`}>
                                    {t(`projects.${status}` as TranslationKey)}
                                </span>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {project.description[language] || project.description['en']}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                            <span className="flex items-center gap-1">
                                <Users size={12} />
                                {project.current_participants}/{project.max_participants || '∞'}
                            </span>
                            {project.category && (
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 capitalize">
                                    {project.category}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="m-0 h-full flex flex-col bg-gray-50 overflow-hidden">
            <ChallengesProjectsNav />

            <div className="flex-1 pt-12 pb-20 px-4 overflow-y-auto">
                <div className="pt-4 pb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">{t('projects.title')}</h1>
                    <button
                        onClick={() => fetchProjects()}
                        className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw className="w-5 h-5" />}
                    </button>
                </div>

                <div className="space-y-2">
                    {loading && projects.length === 0 ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="ios-card p-8 text-center text-gray-500">
                            {t('projects.no_projects')}
                        </div>
                    ) : (
                        projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))
                    )}
                </div>
            </div>

            <ProjectDetailModal
                isOpen={!!selectedProjectId}
                onClose={() => setSelectedProjectId(null)}
                project={selectedProject}
                isApplying={selectedProjectId ? applying.has(selectedProjectId) : false}
                onApply={async (message: string) => {
                    if (selectedProjectId) {
                        await joinProject(selectedProjectId, message);
                    }
                }}
            />
        </div>
    );
}
