'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Search, CheckCircle2, Calendar, X, ChevronRight, List, Info, ChevronLeft } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { CustomList } from '@/types/supabase';

type ListType = 'today' | 'planned' | 'all' | 'completed' | `custom-${string}`;
type ViewMode = 'lists' | 'notes';

export default function Notes() {
    const { user } = useUser();
    const { t } = useLanguage();
    const {
        notes,
        customLists,
        loadFromCache,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        addList,
        updateList,
        deleteList
    } = useNotes();

    // Navigation State
    const [viewMode, setViewMode] = useState<ViewMode>('lists');
    const [currentListType, setCurrentListType] = useState<ListType>('all');

    // Note Interaction State
    const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingNoteText, setEditingNoteText] = useState<string>(''); // combined title and content
    const [showNoteDetails, setShowNoteDetails] = useState<string | null>(null); // ID of note to show details for

    // List Creation/Editing State
    const [showCreateList, setShowCreateList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState('#007AFF');
    const [newListIcon, setNewListIcon] = useState('📝');
    const [editingList, setEditingList] = useState<CustomList | null>(null);

    // Long Press Logic
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPress = useRef(false);

    useEffect(() => {
        loadFromCache();
        fetchNotes();
    }, [user, loadFromCache, fetchNotes]);

    const handleTouchStart = (list: CustomList) => {
        isLongPress.current = false;
        longPressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            handleEditList(list);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const handleListClick = (type: ListType) => {
        if (!isLongPress.current) {
            setCurrentListType(type);
            setViewMode('notes');
        }
    };

    const handleAddNote = async () => {
        if (!user) return;
        let scheduledDate = null;
        let listId = null;
        if (currentListType === 'today') {
            scheduledDate = new Date().toISOString().split('T')[0];
        } else if (currentListType.startsWith('custom-')) {
            listId = currentListType.replace('custom-', '');
        }
        const newNote = {
            title: '',
            content: '',
            priority: 'none' as const,
            scheduled_date: scheduledDate,
            list_id: listId
        };
        if (viewMode === 'lists') {
            setCurrentListType('all');
            setViewMode('notes');
        }

        await addNote(newNote, {
            onOptimisticAdd: (note) => {
                setEditingNoteId(note.id);
                setEditingNoteText('');
                setExpandedNoteId(note.id);
            },
            onIdChange: (oldId, newId) => {
                setEditingNoteId(prev => prev === oldId ? newId : prev);
                setExpandedNoteId(prev => prev === oldId ? newId : prev);
                setShowNoteDetails(prev => prev === oldId ? newId : prev);
            }
        });
    };

    const handleSaveNote = async () => {
        if (!editingNoteId) return;
        if (editingNoteText.trim()) {
            const lines = editingNoteText.split('\n');
            const title = lines[0];
            const content = lines.slice(1).join('\n');
            await updateNote(editingNoteId, { title, content });
        }
        setEditingNoteId(null);
    };

    const handleDeleteNote = async (noteId: string) => {
        if (confirm(t('notes.confirm_delete_note') || 'Delete this note?')) {
            await deleteNote(noteId);
            if (editingNoteId === noteId) {
                setEditingNoteId(null);
            }
            if (showNoteDetails === noteId) {
                setShowNoteDetails(null);
            }
        }
    };

    // List Management
    const openCreateListModal = () => {
        setEditingList(null);
        setNewListName('');
        setNewListColor('#007AFF');
        setNewListIcon('📝');
        setShowCreateList(true);
    };

    const handleEditList = (list: CustomList) => {
        setEditingList(list);
        setNewListName(list.name);
        setNewListColor(list.color);
        setNewListIcon(list.icon);
        setShowCreateList(true);
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;
        if (editingList) {
            await updateList(editingList.id, { name: newListName, color: newListColor, icon: newListIcon });
        } else {
            await addList({ name: newListName, color: newListColor, icon: newListIcon });
        }
        setShowCreateList(false);
        setNewListName('');
        setNewListColor('#007AFF');
        setNewListIcon('📝');
        setEditingList(null);
    };

    const handleDeleteList = async (listId: string) => {
        if (confirm(t('notes.confirm_delete_list') || 'Delete this list?')) {
            await deleteList(listId);
            setShowCreateList(false);
        }
    };

    // Filtering
    const filteredNotes = notes.filter(note => {
        if (currentListType === 'all') return !note.is_completed && !note.list_id;
        if (currentListType === 'today') {
            const today = new Date().toISOString().split('T')[0];
            return !note.is_completed && note.scheduled_date === today;
        }
        if (currentListType === 'planned') return !note.is_completed && note.scheduled_date;
        if (currentListType === 'completed') return note.is_completed;
        if (currentListType.startsWith('custom-')) {
            const listId = currentListType.replace('custom-', '');
            return !note.is_completed && note.list_id === listId;
        }
        return false;
    });

    const getListTitle = () => {
        if (currentListType === 'all') return t('notes.all');
        if (currentListType === 'today') return t('notes.today');
        if (currentListType === 'planned') return t('notes.planned');
        if (currentListType === 'completed') return t('notes.completed');
        if (currentListType.startsWith('custom-')) {
            const listId = currentListType.replace('custom-', '');
            const list = customLists.find(l => l.id === listId);
            return list ? list.name : t('notes.list');
        }
        return t('notes.all');
    };

    const getListColor = () => {
        if (currentListType === 'today') return '#007AFF'; // Blue
        if (currentListType === 'planned') return '#FF3B30'; // Red
        if (currentListType === 'all') return '#5E5CE6'; // Indigo
        if (currentListType === 'completed') return '#34C759'; // Green
        if (currentListType.startsWith('custom-')) {
            const listId = currentListType.replace('custom-', '');
            const list = customLists.find(l => l.id === listId);
            return list ? list.color : '#007AFF';
        }
        return '#007AFF';
    };

    const getCount = (type: ListType) => {
        if (type === 'all') return notes.filter(n => !n.is_completed && !n.list_id).length;
        if (type === 'today') {
            const today = new Date().toISOString().split('T')[0];
            return notes.filter(n => !n.is_completed && n.scheduled_date === today).length;
        }
        if (type === 'planned') return notes.filter(n => !n.is_completed && n.scheduled_date).length;
        if (type === 'completed') return notes.filter(n => n.is_completed).length;
        if (type.startsWith('custom-')) {
            const listId = type.replace('custom-', '');
            return notes.filter(n => !n.is_completed && n.list_id === listId).length;
        }
        return 0;
    };

    return (
        <div className="h-[calc(100vh-6rem)] bg-zinc-50 dark:bg-black overflow-hidden relative">
            {/* Lists View */}
            <div className={`absolute inset-0 transition-transform duration-300 ease-in-out ${viewMode === 'lists' ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-2 flex justify-end">
                        <button onClick={openCreateListModal} className="text-blue-500 text-sm font-medium">
                            {t('notes.create_list') || 'Add List'}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-4 mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                                type="text"
                                placeholder={t('notes.search_placeholder')}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-xl text-sm border-none focus:ring-0"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-32">
                        {/* Smart Lists Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button onClick={() => handleListClick('today')} className="bg-white dark:bg-zinc-900 p-3 rounded-xl flex flex-col justify-between h-20 shadow-sm">
                                <div className="flex justify-between items-start w-full">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{getCount('today')}</span>
                                </div>
                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 self-start">{t('notes.today')}</span>
                            </button>
                            <button onClick={() => handleListClick('planned')} className="bg-white dark:bg-zinc-900 p-3 rounded-xl flex flex-col justify-between h-20 shadow-sm">
                                <div className="flex justify-between items-start w-full">
                                    <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{getCount('planned')}</span>
                                </div>
                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 self-start">{t('notes.planned')}</span>
                            </button>
                            <button onClick={() => handleListClick('all')} className="bg-white dark:bg-zinc-900 p-3 rounded-xl flex flex-col justify-between h-20 shadow-sm">
                                <div className="flex justify-between items-start w-full">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 dark:bg-zinc-700 flex items-center justify-center">
                                        <List className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{getCount('all')}</span>
                                </div>
                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 self-start">{t('notes.all')}</span>
                            </button>
                            <button onClick={() => handleListClick('completed')} className="bg-white dark:bg-zinc-900 p-3 rounded-xl flex flex-col justify-between h-20 shadow-sm">
                                <div className="flex justify-between items-start w-full">
                                    <div className="w-8 h-8 rounded-full bg-zinc-500 dark:bg-zinc-600 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-zinc-900 dark:text-white">{getCount('completed')}</span>
                                </div>
                                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 self-start">{t('notes.completed')}</span>
                            </button>
                        </div>

                        {/* Custom Lists */}
                        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-4 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-900/50">
                                {t('notes.my_lists')}
                            </div>
                            {customLists.map((list, index) => (
                                <div
                                    key={list.id}
                                    onTouchStart={() => handleTouchStart(list)}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseDown={() => handleTouchStart(list)}
                                    onMouseUp={handleTouchEnd}
                                    onClick={() => handleListClick(`custom-${list.id}`)}
                                    className={`flex items-center gap-3 p-3 active:bg-zinc-100 dark:active:bg-zinc-800 cursor-pointer ${index !== customLists.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: list.color }}>
                                        <span className="text-lg">{list.icon}</span>
                                    </div>
                                    <span className="flex-1 font-medium text-zinc-900 dark:text-white">{list.name}</span>
                                    <span className="text-zinc-400 text-sm">{getCount(`custom-${list.id}`)}</span>
                                    <ChevronRight className="w-4 h-4 text-zinc-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes View */}
            <div className={`absolute inset-0 bg-white dark:bg-black transition-transform duration-300 ease-in-out flex flex-col ${viewMode === 'notes' ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900">
                    <button
                        onClick={() => setViewMode('lists')}
                        className="flex items-center gap-1 text-blue-500 font-medium"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        <span>{t('notes.back') || 'Lists'}</span>
                    </button>
                    <div className="flex gap-3">
                        {/* More options if needed */}
                    </div>
                </div>

                {/* Title */}
                <div className="px-4 py-4">
                    <h1 className="text-3xl font-bold" style={{ color: getListColor() }}>
                        {getListTitle()}
                    </h1>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto px-4 pb-32">
                    <div className="space-y-0">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                {t('notes.no_notes')}
                            </div>
                        ) : (
                            filteredNotes.map((note, index) => (
                                <div key={note.id} className="flex items-start gap-3 group">
                                    <button
                                        onClick={() => updateNote(note.id, { is_completed: !note.is_completed })}
                                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${note.is_completed
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {note.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>

                                    <div className={`flex-1 min-w-0 border-b border-zinc-100 dark:border-zinc-900 pb-4 ${index === 0 ? 'border-t pt-4' : ''}`}>
                                        {editingNoteId === note.id ? (
                                            <textarea
                                                autoFocus
                                                value={editingNoteText}
                                                onChange={e => setEditingNoteText(e.target.value)}
                                                onBlur={handleSaveNote}
                                                className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white text-base resize-none focus:ring-0"
                                                rows={4}
                                            />
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    if (expandedNoteId === note.id) {
                                                        // If already expanded, start editing
                                                        setEditingNoteId(note.id);
                                                        const combined = note.title + (note.content ? '\n' + note.content : '');
                                                        setEditingNoteText(combined);
                                                    } else {
                                                        // First click expands the note
                                                        setExpandedNoteId(note.id);
                                                    }
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <div className={`font-bold text-zinc-900 dark:text-white ${note.is_completed ? 'line-through text-zinc-400' : ''} ${expandedNoteId === note.id ? '' : 'line-clamp-1'}`}>
                                                    {note.title || (note.content ? note.content.split('\n')[0] : t('notes.add_note'))}
                                                </div>
                                                {note.content && expandedNoteId === note.id && (
                                                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                                                        {note.content.split('\n').slice(1).join('\n')}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {expandedNoteId === note.id && (
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                setShowNoteDetails(note.id);
                                            }}
                                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full flex-shrink-0"
                                        >
                                            <Info className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            <button
                onClick={handleAddNote}
                className="absolute bottom-24 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-40"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Create/Edit List Modal */}
            {showCreateList && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {editingList ? t('notes.edit_list') : t('notes.new_list')}
                            </h3>
                            <button
                                onClick={() => setShowCreateList(false)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-center mb-8">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg transition-colors relative overflow-hidden"
                                    style={{ backgroundColor: newListColor }}
                                >
                                    <input
                                        type="text"
                                        value={newListIcon}
                                        onChange={e => setNewListIcon(e.target.value)}
                                        className="w-full h-full text-center bg-transparent border-none focus:ring-0 text-4xl p-0 cursor-pointer"
                                        maxLength={2}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {t('notes.list_name')}
                                </label>
                                <input
                                    type="text"
                                    value={newListName}
                                    onChange={e => setNewListName(e.target.value)}
                                    placeholder={t('notes.list_name_placeholder')}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-6 gap-3">
                                {['#007AFF', '#FF9500', '#FF2D55', '#5856D6', '#AF52DE', '#FF3B30'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setNewListColor(color)}
                                        className={`w-10 h-10 rounded-full transition-transform ${newListColor === color ? 'scale-110 ring-2 ring-offset-2 ring-zinc-900 dark:ring-white' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                {editingList && (
                                    <button
                                        onClick={() => handleDeleteList(editingList.id)}
                                        className="flex-1 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        {t('common.delete')}
                                    </button>
                                )}
                                <button
                                    onClick={handleCreateList}
                                    disabled={!newListName.trim()}
                                    className="flex-1 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingList ? t('common.save') : t('common.create')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Details Modal */}
            {showNoteDetails && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-xl animate-slide-up mb-20 sm:mb-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {t('notes.details') || 'Details'}
                            </h3>
                            <button
                                onClick={() => setShowNoteDetails(null)}
                                className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Picker */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {t('notes.date')}
                                </label>
                                <input
                                    type="date"
                                    value={notes.find(n => n.id === showNoteDetails)?.scheduled_date || ''}
                                    onChange={e => updateNote(showNoteDetails, { scheduled_date: e.target.value })}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {t('notes.priority')}
                                </label>
                                <div className="flex gap-2">
                                    {['none', 'low', 'medium', 'high'].map(priority => (
                                        <button
                                            key={priority}
                                            onClick={() => updateNote(showNoteDetails, { priority: priority as 'none' | 'low' | 'medium' | 'high' })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${notes.find(n => n.id === showNoteDetails)?.priority === priority
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                                        >
                                            {t(`notes.priority_${priority}` as keyof typeof import('@/utils/translations').translations['en'])}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDeleteNote(showNoteDetails)}
                                className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            >
                                {t('notes.confirm_delete_note')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
