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
    const [isLoading, setIsLoading] = useState(false);

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

    const addNote = async (noteData: Partial<UserNote>) => {
        if (!user) return null;
        setIsLoading(true);

        try {
            const result = await addNoteAction(noteData);

            if (result.success && result.data) {
                await fetchNotes();
                return result.data;
            } else {
                logger.error('Error adding note:', result.error);
                alert('Failed to add note: ' + result.error);
                return null;
            }
        } catch (e) {
            logger.error('Error adding note', e);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateNote = async (id: string, updates: Partial<UserNote>) => {
        if (!user) return false;
        // Don't set global loading for small updates like toggle complete to keep UI snappy
        // Or handle it optimistically in UI

        try {
            const result = await updateNoteAction(id, updates);

            if (result.success) {
                await fetchNotes();
                return true;
            } else {
                logger.error('Error updating note:', result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error updating note', e);
            return false;
        }
    };

    const deleteNote = async (id: string) => {
        if (!user) return false;

        try {
            const result = await deleteNoteAction(id);

            if (result.success) {
                await fetchNotes();
                return true;
            } else {
                logger.error('Error deleting note:', result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error deleting note', e);
            return false;
        }
    };

    const addList = async (listData: Partial<CustomList>) => {
        if (!user) return null;
        setIsLoading(true);

        try {
            const result = await addListAction(listData);

            if (result.success && result.data) {
                await fetchNotes();
                return result.data;
            } else {
                logger.error('Error adding list:', result.error);
                return null;
            }
        } catch (e) {
            logger.error('Error adding list', e);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const updateList = async (id: string, updates: Partial<CustomList>) => {
        if (!user) return false;

        try {
            const result = await updateListAction(id, updates);

            if (result.success) {
                await fetchNotes();
                return true;
            } else {
                logger.error('Error updating list:', result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error updating list', e);
            return false;
        }
    };

    const deleteList = async (id: string) => {
        if (!user) return false;

        try {
            const result = await deleteListAction(id);

            if (result.success) {
                await fetchNotes();
                return true;
            } else {
                logger.error('Error deleting list:', result.error);
                return false;
            }
        } catch (e) {
            logger.error('Error deleting list', e);
            return false;
        }
    };

    return {
        notes,
        customLists,
        isLoading,
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
