import { useCallback, useOptimistic } from 'react';
import { useUser } from '@/context/UserContext';
import { UserNote, CustomList } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { STORAGE_KEYS } from '@/utils/storage';
import { useSyncData } from '@/hooks/useSyncData';
import {
    fetchNotesAction,
    addNoteAction,
    updateNoteAction,
    deleteNoteAction,
    addListAction,
    updateListAction,
    deleteListAction
} from '@/app/actions/notes';

type OptimisticNoteAction =
    | { type: 'add'; item: UserNote }
    | { type: 'update'; id: string; updates: Partial<UserNote> }
    | { type: 'delete'; id: string }
    | { type: 'revert delete'; item: UserNote };

type OptimisticListAction =
    | { type: 'add'; item: CustomList }
    | { type: 'update'; id: string; updates: Partial<CustomList> }
    | { type: 'delete'; id: string }
    | { type: 'revert delete'; item: CustomList };

export function useNotes() {
    const { user } = useUser();

    const {
        data,
        setData,
        refresh: fetchNotes
    } = useSyncData<{ notes: UserNote[]; lists: CustomList[] }>({
        key: STORAGE_KEYS.NOTES_CACHE,
        fetcher: fetchNotesAction,
        initialValue: { notes: [], lists: [] },
        parse: (cached) => {
            // New format (wrapped in data or direct)
            if (cached.notes && Array.isArray(cached.notes)) return cached;
            if (cached.data && cached.data.notes && Array.isArray(cached.data.notes)) return cached.data;

            // Old format migration
            if (cached.userNotes && Array.isArray(cached.userNotes)) {
                return {
                    notes: cached.userNotes,
                    lists: cached.customLists || []
                };
            }
            return null;
        }
    });

    const notes = data.notes;
    const customLists = data.lists;

    const [optimisticNotes, addOptimisticNote] = useOptimistic<UserNote[], OptimisticNoteAction>(notes, (prevNotes, action) => {
        switch (action.type) {
            case 'add':
                return [action.item, ...prevNotes];
            case 'update':
                return prevNotes.map(note => note.id === action.id ? { ...note, ...action.updates } : note);
            case 'delete':
                return prevNotes.filter(note => note.id !== action.id);
            case 'revert delete':
                return [action.item, ...prevNotes];
            default:
                return prevNotes;
        }
    });

    const [optimisticLists, addOptimisticList] = useOptimistic<CustomList[], OptimisticListAction>(customLists, (prevLists, action) => {
        switch (action.type) {
            case 'add':
                return [...prevLists, action.item];
            case 'update':
                return prevLists.map(list => list.id === action.id ? { ...list, ...action.updates } : list);
            case 'delete':
                return prevLists.filter(list => list.id !== action.id);
            case 'revert delete':
                return [...prevLists, action.item];
            default:
                return prevLists;
        }
    });

    const addNote = useCallback(async (note: Partial<UserNote>, callbacks?: { onOptimisticAdd?: (note: UserNote) => void, onIdChange?: (oldId: string, newId: string) => void }) => {
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

        const previousData = { ...data };
        setData(prev => ({ ...prev, notes: [optimisticNote, ...prev.notes] }));

        // Notify UI immediately
        if (callbacks?.onOptimisticAdd) {
            callbacks.onOptimisticAdd(optimisticNote);
        }

        try {
            const result = await addNoteAction(note);
            if (result.success && result.data) {
                // Replace temp note with real note
                setData(prev => ({
                    ...prev,
                    notes: prev.notes.map(n => n.id === tempId ? result.data! : n)
                }));

                // Notify UI of ID change
                if (callbacks?.onIdChange) {
                    callbacks.onIdChange(tempId, result.data.id);
                }

                return result.data;
            } else {
                // Revert on failure
                setData(previousData);
                logger.error('Failed to add note:', result.error);
                return null;
            }
        } catch (error) {
            setData(previousData);
            logger.error('Error adding note:', error);
            return null;
        }
    }, [user, data, setData]);

    const updateNote = useCallback(async (id: string, updates: Partial<UserNote>) => {
        const previousData = { ...data };
        setData(prev => ({
            ...prev,
            notes: prev.notes.map(n => n.id === id ? { ...n, ...updates } : n)
        }));

        try {
            const result = await updateNoteAction(id, updates);
            if (!result.success) {
                setData(previousData);
                logger.error('Failed to update note:', result.error);
            }
        } catch (error) {
            setData(previousData);
            logger.error('Error updating note:', error);
        }
    }, [data, setData]);

    const deleteNote = useCallback(async (id: string) => {
        const previousData = { ...data };
        setData(prev => ({
            ...prev,
            notes: prev.notes.filter(n => n.id !== id)
        }));

        try {
            const result = await deleteNoteAction(id);
            if (!result.success) {
                setData(previousData);
                logger.error('Failed to delete note:', result.error);
            }
        } catch (error) {
            setData(previousData);
            logger.error('Error deleting note:', error);
        }
    }, [data, setData]);

    const addList = useCallback(async (list: Partial<CustomList>) => {
        const tempId = `temp-${Date.now()}`;
        const optimisticList = {
            ...list,
            id: tempId,
            created_at: new Date().toISOString(),
            user_id: user?.id || ''
        } as CustomList;

        const previousData = { ...data };
        setData(prev => ({ ...prev, lists: [...prev.lists, optimisticList] }));

        try {
            const result = await addListAction(list);
            if (result.success && result.data) {
                setData(prev => ({
                    ...prev,
                    lists: prev.lists.map(l => l.id === tempId ? result.data! : l)
                }));
                return result.data;
            } else {
                setData(previousData);
                return null;
            }
        } catch (error) {
            setData(previousData);
            return null;
        }
    }, [user, data, setData]);

    const updateList = useCallback(async (id: string, updates: Partial<CustomList>) => {
        const previousData = { ...data };
        setData(prev => ({
            ...prev,
            lists: prev.lists.map(l => l.id === id ? { ...l, ...updates } : l)
        }));

        try {
            const result = await updateListAction(id, updates);
            if (!result.success) {
                setData(previousData);
            }
        } catch (error) {
            setData(previousData);
        }
    }, [data, setData]);

    const deleteList = useCallback(async (id: string) => {
        const previousData = { ...data };
        setData(prev => ({
            ...prev,
            lists: prev.lists.filter(l => l.id !== id)
        }));

        try {
            const result = await deleteListAction(id);
            if (!result.success) {
                setData(previousData);
            }
        } catch (error) {
            setData(previousData);
        }
    }, [data, setData]);

    return {
        notes: optimisticNotes,
        customLists: optimisticLists,
        loading: false,
        loadFromCache: () => { }, // No-op
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        addList,
        updateList,
        deleteList
    };
}
