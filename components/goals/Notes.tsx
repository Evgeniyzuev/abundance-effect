'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { Plus, Search, CheckCircle2, Calendar, MoreHorizontal, Trash2, X, ChevronRight, List, Edit2 } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { CustomList } from '@/types/supabase';

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
        updateNote,
        deleteNote,
        addList,
        updateList,
        deleteList
    } = useNotes();

    const [currentListType, setCurrentListType] = useState<ListType>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState<string>('');

    // List Creation State
    const [showCreateList, setShowCreateList] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [newListColor, setNewListColor] = useState('#007AFF');
    const [newListIcon, setNewListIcon] = useState('📝');
    const [editingList, setEditingList] = useState<CustomList | null>(null);

    // List Menu State
    const [activeListMenu, setActiveListMenu] = useState<string | null>(null);

    useEffect(() => {
        loadFromCache();
        fetchNotes();
    }, [user, loadFromCache, fetchNotes]);

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
        if (!editingId) return;

        if (!editingText.trim()) {
            // If empty, maybe delete? For now just save empty or previous
            // But if it was a new note and empty, we might want to delete it.
            // Let's just save for now.
        }

        await updateNote(editingId, { title: editingText.trim() });

        setEditingId(null);
        setEditingText('');
    };

    const handleDeleteNote = async (noteId: string) => {
        if (confirm(t('notes.confirm_delete_note') || 'Delete this note?')) {
            await deleteNote(noteId);
            if (editingId === noteId) {
                setEditingId(null);
                setEditingText('');
            }
        }
    };

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
        setActiveListMenu(null);
    };

    const handleCreateList = async () => {
        if (!newListName.trim()) return;

        if (editingList) {
            await updateList(editingList.id, {
                name: newListName,
                color: newListColor,
                icon: newListIcon
            });
        } else {
            await addList({
                name: newListName,
                color: newListColor,
                icon: newListIcon
            });
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
            if (currentListType === `custom-${listId}`) {
                setCurrentListType('all');
            }
        }
    };

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

    return (
        <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-50 dark:bg-zinc-900/50 border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder={t('notes.search_placeholder')}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 space-y-6">
                    {/* Smart Lists */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setCurrentListType('all')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentListType === 'all'
                                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            {t('notes.all')}
                        </button>
                        <button
                            onClick={() => setCurrentListType('today')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentListType === 'today'
                                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            {t('notes.today')}
                        </button>
                        <button
                            onClick={() => setCurrentListType('planned')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentListType === 'planned'
                                    ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            {t('notes.planned')}
                        </button>
                        <button
                            onClick={() => setCurrentListType('completed')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentListType === 'completed'
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                }`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            {t('notes.completed')}
                        </button>
                    </div>

                    {/* Custom Lists */}
                    <div className="space-y-1">
                        <div className="px-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                            {t('notes.my_lists')}
                        </div>
                        {customLists.map(list => (
                            <div key={list.id} className="group relative flex items-center">
                                <button
                                    onClick={() => setCurrentListType(`custom-${list.id}`)}
                                    className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${currentListType === `custom-${list.id}`
                                            ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                        }`}
                                >
                                    <span style={{ color: list.color }}>{list.icon}</span>
                                    {list.name}
                                </button>
                                <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveListMenu(activeListMenu === list.id ? null : list.id);
                                        }}
                                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg"
                                    >
                                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                                    </button>

                                    {activeListMenu === list.id && (
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 py-1 z-50">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditList(list);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                {t('notes.edit_list')}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteList(list.id);
                                                }}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                {t('notes.delete_list')}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={openCreateListModal}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('notes.create_list')}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900">
                <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {getListTitle()}
                    </h2>
                    <button
                        onClick={handleAddNote}
                        className="p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-2">
                        {filteredNotes.length === 0 ? (
                            <div className="text-center py-20 text-zinc-400">
                                {t('notes.no_notes')}
                            </div>
                        ) : (
                            filteredNotes.map(note => (
                                <div
                                    key={note.id}
                                    className="group flex items-start gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <button
                                        onClick={() => handleToggleComplete(note.id)}
                                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${note.is_completed
                                                ? 'bg-blue-500 border-blue-500 text-white'
                                                : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {note.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        {editingId === note.id ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                onBlur={handleSaveEdit}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit();
                                                }}
                                                className="w-full bg-transparent border-none p-0 text-zinc-900 dark:text-white focus:ring-0 placeholder-zinc-400"
                                                placeholder={t('notes.add_note')}
                                            />
                                        ) : (
                                            <div
                                                onClick={() => {
                                                    setEditingId(note.id);
                                                    setEditingText(note.title);
                                                }}
                                                className={`text-zinc-900 dark:text-white cursor-text ${note.is_completed ? 'line-through text-zinc-400' : ''
                                                    }`}
                                            >
                                                {note.title || t('notes.add_note')}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mt-2">
                                            {note.scheduled_date && (
                                                <div className="flex items-center gap-1 text-xs text-zinc-400">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(note.scheduled_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                                        <button
                                            onClick={() => handleDeleteNote(note.id)}
                                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <ChevronRight className="w-4 h-4 text-zinc-300" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

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
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg transition-colors"
                                    style={{ backgroundColor: newListColor }}
                                >
                                    {newListIcon}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                                    {t('notes.list_name')}
                                </label>
                                <input
                                    type="text"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    placeholder={t('notes.list_name_placeholder')}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-6 gap-3">
                                {['#007AFF', '#FF9500', '#FF2D55', '#5856D6', '#AF52DE', '#FF3B30'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setNewListColor(color)}
                                        className={`w-10 h-10 rounded-full transition-transform ${newListColor === color ? 'scale-110 ring-2 ring-offset-2 ring-zinc-900 dark:ring-white' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleCreateList}
                                disabled={!newListName.trim()}
                                className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingList ? t('common.save') : t('common.create')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
