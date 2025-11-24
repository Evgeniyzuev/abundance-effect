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
    userNotes: UserNote[];
    customLists: CustomList[];
    timestamp: number;
}

export function useNotes() {
    const { user } = useUser();
    const [notes, setNotes] = useState<UserNote[]>([]);
    const [customLists, setCustomLists] = useState<CustomList[]>([]);
    const [loading, setLoading] = useState(false);

    const loadFromCache = useCallback(() => {
        const cached = storage.get<NotesCache>(STORAGE_KEYS.NOTES_CACHE);
        if (cached) {
            const CACHE_AGE = 60 * 60 * 1000;
            if (Date.now() - cached.timestamp < CACHE_AGE) {
                setNotes(cached.userNotes);
                setCustomLists(cached.customLists);
                return true;
            }
        }
        return false;
    }, []);

    const saveToCache = useCallback((userNotes: UserNote[], lists: CustomList[]) => {
        storage.set(STORAGE_KEYS.NOTES_CACHE, {
            userNotes,
            customLists: lists,
            timestamp: Date.now()
        });
    }, []);

    const fetchNotes = useCallback(async () => {
        if (!user) return;

        const result = await fetchNotesAction();

        if (result.success && result.data) {
            const { notes: fetchedNotes, lists } = result.data;
            setNotes(fetchedNotes);
            setCustomLists(lists);
            saveToCache(fetchedNotes, lists);
        } else {
            logger.error('Error fetching notes:', result.error);
        }
    }, [user, saveToCache]);

    const addNote = useCallback(async (note: Partial<UserNote>) => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticNote = {
            ...note,
            id: tempId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: user?.id || '',
            is_completed: note.is_completed || false,
            priority: note.priority || 'none'
        } as UserNote;

        setNotes(prev => [optimisticNote, ...prev]);

        try {
            const result = await addNoteAction(note);
            if (result.success && result.data) {
                // Replace temp note with real note
                setNotes(prev => prev.map(n => n.id === tempId ? result.data! : n));
                return result.data;
            } else {
                // Revert on failure
                setNotes(prev => prev.filter(n => n.id !== tempId));
                logger.error('Failed to add note:', result.error);
                return null;
            }
        } catch (error) {
            setNotes(prev => prev.filter(n => n.id !== tempId));
            logger.error('Error adding note:', error);
            return null;
        }
    }, [user]);

    const updateNote = useCallback(async (id: string, updates: Partial<UserNote>) => {
        // Optimistic update
        const originalNotes = [...notes];
        setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));

        try {
            const result = await updateNoteAction(id, updates);
            if (!result.success) {
                // Revert on failure
                setNotes(originalNotes);
                logger.error('Failed to update note:', result.error);
            }
        } catch (error) {
            setNotes(originalNotes);
            logger.error('Error updating note:', error);
        }
    }, [notes]);

    const deleteNote = useCallback(async (id: string) => {
        // Optimistic update
        const originalNotes = [...notes];
        setNotes(prev => prev.filter(n => n.id !== id));

        try {
            const result = await deleteNoteAction(id);
            if (!result.success) {
                // Revert on failure
                setNotes(originalNotes);
                logger.error('Failed to delete note:', result.error);
            }
        } catch (error) {
            setNotes(originalNotes);
            logger.error('Error deleting note:', error);
        }
    }, [notes]);

    const addList = useCallback(async (list: Partial<CustomList>) => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticList = {
            ...list,
            id: tempId,
            created_at: new Date().toISOString(),
            user_id: user?.id || ''
        } as CustomList;

        setCustomLists(prev => [...prev, optimisticList]);

        try {
            const result = await addListAction(list);
            if (result.success && result.data) {
                setCustomLists(prev => prev.map(l => l.id === tempId ? result.data! : l));
                return result.data;
            } else {
                setCustomLists(prev => prev.filter(l => l.id !== tempId));
                return null;
            }
        } catch (error) {
            setCustomLists(prev => prev.filter(l => l.id !== tempId));
            return null;
        }
    }, [user]);

    const updateList = useCallback(async (id: string, updates: Partial<CustomList>) => {
        const originalLists = [...customLists];
        setCustomLists(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));

        try {
            const result = await updateListAction(id, updates);
            if (!result.success) {
                setCustomLists(originalLists);
            }
        } catch (error) {
            setCustomLists(originalLists);
        }
    }, [customLists]);

    const deleteList = useCallback(async (id: string) => {
        const originalLists = [...customLists];
        setCustomLists(prev => prev.filter(l => l.id !== id));

        try {
            const result = await deleteListAction(id);
            if (!result.success) {
                setCustomLists(originalLists);
            }
        } catch (error) {
            setCustomLists(originalLists);
        }
    }, [customLists]);

    return {
        notes,
        customLists,
        loading,
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
