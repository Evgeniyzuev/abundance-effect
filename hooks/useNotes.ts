import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { UserNote, CustomList } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { storage, STORAGE_KEYS } from '@/utils/storage';
import {
    fetchNotesAction,
    addNoteAction,
    updateNoteAction,
    deleteNoteAction,
    addListAction,
    updateListAction,
    deleteListAction
} from '@/app/actions/notes';

interface NotesCache {
    notes: UserNote[];
    lists: CustomList[];
    timestamp: number;
}

export function useNotes() {
    const { user } = useUser();
    const [notes, setNotes] = useState<UserNote[]>([]);
    const [customLists, setCustomLists] = useState<CustomList[]>([]);

    const loadFromCache = useCallback(() => {
        const cached = storage.get<NotesCache>(STORAGE_KEYS.NOTES_CACHE);
        if (cached) {
            setNotes(cached.notes || []);
            setCustomLists(cached.lists || []);
            return true;
        }
        return false;
    }, []);

    const saveToCache = useCallback((ns: UserNote[], cls: CustomList[]) => {
        storage.set(STORAGE_KEYS.NOTES_CACHE, {
            notes: ns,
            lists: cls,
            timestamp: Date.now()
        });
    }, []);

    const fetchNotes = useCallback(async () => {
        if (!user) return;

        const result = await fetchNotesAction();
        if (result.success && result.data) {
            setNotes(result.data.notes);
            setCustomLists(result.data.lists);
            saveToCache(result.data.notes, result.data.lists);
        } else {
            logger.error('Error fetching notes:', result.error);
        }
    }, [user, saveToCache]);

    const addNote = useCallback(async (note: Partial<UserNote>, callbacks?: { onOptimisticAdd?: (note: UserNote) => void, onIdChange?: (oldId: string, newId: string) => void }) => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticNote: UserNote = {
            id: tempId,
            user_id: user?.id || '',
            title: note.title || '',
            content: note.content || null,
            list_id: note.list_id || null,
            is_completed: note.is_completed || false,
            scheduled_date: note.scheduled_date || null,
            scheduled_time: note.scheduled_time || null,
            tags: note.tags || null,
            priority: note.priority || 'none',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const previousNotes = [...notes];
        setNotes(prev => [optimisticNote, ...prev]);

        // Notify UI immediately
        if (callbacks?.onOptimisticAdd) {
            callbacks.onOptimisticAdd(optimisticNote);
        }

        try {
            const result = await addNoteAction(note);
            if (result.success && result.data) {
                // Fetch to sync real id
                await fetchNotes();
                if (callbacks?.onIdChange) {
                    callbacks.onIdChange(tempId, result.data.id);
                }
                return result.data;
            } else {
                setNotes(previousNotes);
                logger.error('Failed to add note:', result.error);
                return null;
            }
        } catch (error) {
            setNotes(previousNotes);
            logger.error('Error adding note:', error);
            return null;
        }
    }, [user, notes, fetchNotes]);

    const updateNote = useCallback(async (id: string, updates: Partial<UserNote>) => {
        const previousNotes = [...notes];
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n));

        try {
            const result = await updateNoteAction(id, updates);
            if (result.success) {
                fetchNotes();
                return true;
            } else {
                setNotes(previousNotes);
                logger.error('Failed to update note:', result.error);
                return false;
            }
        } catch (error) {
            setNotes(previousNotes);
            logger.error('Error updating note:', error);
            return false;
        }
    }, [notes, fetchNotes]);

    const deleteNote = useCallback(async (id: string) => {
        const previousNotes = [...notes];
        setNotes(prev => prev.filter(n => n.id !== id));

        try {
            const result = await deleteNoteAction(id);
            if (result.success) {
                fetchNotes();
                return true;
            } else {
                setNotes(previousNotes);
                logger.error('Failed to delete note:', result.error);
                return false;
            }
        } catch (error) {
            setNotes(previousNotes);
            logger.error('Error deleting note:', error);
            return false;
        }
    }, [notes, fetchNotes]);

    const addList = useCallback(async (list: Partial<CustomList>) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticList: CustomList = {
            id: tempId,
            user_id: user?.id || '',
            name: list.name || '',
            color: list.color || '#007AFF',
            icon: list.icon || '📝',
            created_at: new Date().toISOString()
        };

        const previousLists = [...customLists];
        setCustomLists(prev => [...prev, optimisticList]);

        try {
            const result = await addListAction(list);
            if (result.success && result.data) {
                await fetchNotes();
                return result.data;
            } else {
                setCustomLists(previousLists);
                logger.error('Failed to add list:', result.error);
                return null;
            }
        } catch (error) {
            setCustomLists(previousLists);
            logger.error('Error adding list:', error);
            return null;
        }
    }, [user, customLists, fetchNotes]);

    const updateList = useCallback(async (id: string, updates: Partial<CustomList>) => {
        const previousLists = [...customLists];
        setCustomLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

        try {
            const result = await updateListAction(id, updates);
            if (result.success) {
                fetchNotes();
                return true;
            } else {
                setCustomLists(previousLists);
                logger.error('Failed to update list:', result.error);
                return false;
            }
        } catch (error) {
            setCustomLists(previousLists);
            logger.error('Error updating list:', error);
            return false;
        }
    }, [customLists, fetchNotes]);

    const deleteList = useCallback(async (id: string) => {
        const previousLists = [...customLists];
        setCustomLists(prev => prev.filter(l => l.id !== id));

        try {
            const result = await deleteListAction(id);
            if (result.success) {
                fetchNotes();
                return true;
            } else {
                setCustomLists(previousLists);
                logger.error('Failed to delete list:', result.error);
                return false;
            }
        } catch (error) {
            setCustomLists(previousLists);
            logger.error('Error deleting list:', error);
            return false;
        }
    }, [customLists, fetchNotes]);

    return {
        notes,
        customLists,
        loading: false,
        loadFromCache,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        addList,
        updateList,
        deleteList
    };
}
