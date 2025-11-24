'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Search, CheckCircle2, Calendar } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

type ListType = 'today' | 'planned' | 'all' | 'completed' | `custom-${string}`;

export default function Notes() {
    const { user } = useUser();
    const { t } = useLanguage();
    const {
        notes,
        customLists,
        loadFromCache,
        fetchNotes,
        addNote,
        updateNote
    } = useNotes();

    const [currentListType, setCurrentListType] = useState<ListType>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>('');

    useEffect(() => {
        loadFromCache();
        fetchNotes();
    }, [user, loadFromCache, fetchNotes]);

    const handleAddNote = async () => {
        if (!user) return;

        const newNote = {
            title: '',
            content: '',
            priority: 'none' as const
        };

        const createdNote = await addNote(newNote);

        if (createdNote) {
            setEditingId(createdNote.id);
            setEditingText('');
        }
    };

    const handleToggleComplete = async (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (!note) return;

        await updateNote(noteId, { is_completed: !note.is_completed });
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editingText.trim()) {
            setEditingId(null);
            setEditingText('');
            return;
        }

        await updateNote(editingId, { title: editingText.trim() });

        setEditingId(null);
        setEditingText('');
    };

    const filterNotesByType = (listType: ListType) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split('T')[0];

        switch (listType) {
            case 'today':
                return notes.filter(note =>
                    !note.is_completed && note.scheduled_date === todayStr
                );
            case 'planned':
                return notes.filter(note =>
                    !note.is_completed && note.scheduled_date !== null
                );
            case 'completed':
                return notes.filter(note => note.is_completed);
            case 'all':
            default:
                return notes.filter(note => !note.is_completed);
        }
    };

    const getFilteredNotes = () => {
        if (currentListType.startsWith('custom-')) {
            const listId = currentListType.replace('custom-', '');
            return notes.filter(note => note.list_id === listId && !note.is_completed);
        }
        return filterNotesByType(currentListType);
    };

    const getListCount = (listType: ListType) => {
        if (listType.startsWith('custom-')) {
            const listId = listType.replace('custom-', '');
            return notes.filter(note => note.list_id === listId && !note.is_completed).length;
        }
        return filterNotesByType(listType).length;
    };

    const filteredNotes = getFilteredNotes();

    return (
        <div className="pb-20 px-4">
            {/* Search Bar */}
            <div className="bg-white border-b border-gray-200 -mx-4 px-4 py-3 sticky top-14 z-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('notes.search_placeholder')}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Smart Lists */}
            <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                    onClick={() => setCurrentListType('today')}
                    className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{new Date().getDate()}</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{getListCount('today')}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{t('notes.today')}</div>
                </button>

                <button
                    onClick={() => setCurrentListType('planned')}
                    className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{getListCount('planned')}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{t('notes.planned')}</div>
                </button>

                <button
                    onClick={() => setCurrentListType('all')}
                    className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">📋</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{getListCount('all')}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{t('notes.all')}</div>
                </button>

                <button
                    onClick={() => setCurrentListType('completed')}
                    className="bg-white rounded-xl p-4 text-left border border-gray-200 hover:bg-gray-50 transition-all"
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">{getListCount('completed')}</span>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{t('notes.completed')}</div>
                </button>
            </div>

            {/* Custom Lists */}
            {customLists.length > 0 && (
                <div className="mt-6">
                    <div className="space-y-2">
                        {customLists.map(list => (
                            <button
                                key={list.id}
                                onClick={() => setCurrentListType(`custom-${list.id}`)}
                                className="w-full bg-white rounded-lg p-3 flex items-center justify-between border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                                        style={{ backgroundColor: list.color + '20', color: list.color }}
                                    >
                                        {list.icon}
                                    </div>
                                    <span className="font-medium text-gray-900">{list.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{getListCount(`custom-${list.id}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Notes List */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">{t('notes.no_notes')}</div>
                ) : (
                    filteredNotes.map((note, index) => (
                        <div
                            key={note.id}
                            className={`px-4 py-3 flex items-center gap-3 ${index !== filteredNotes.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                        >
                            <div
                                onClick={() => handleToggleComplete(note.id)}
                                className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer"
                            >
                                {note.is_completed && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                            </div>
                            {editingId === note.id ? (
                                <input
                                    type="text"
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit();
                                        if (e.key === 'Escape') {
                                            setEditingId(null);
                                            setEditingText('');
                                        }
                                    }}
                                    className="flex-1 bg-transparent border-none focus:outline-none"
                                    autoFocus
                                />
                            ) : (
                                <div
                                    onClick={() => {
                                        setEditingId(note.id);
                                        setEditingText(note.title);
                                    }}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className={`font-medium ${note.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                                        {note.title || 'Untitled'}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Note Button */}
            <button
                onClick={handleAddNote}
                className="fixed bottom-24 right-4 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
                <Plus className="h-6 w-6" />
            </button>
        </div>
    );
}
