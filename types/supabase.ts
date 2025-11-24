export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_wishes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    image_url: string | null
                    estimated_cost: string | null
                    difficulty_level: number
                    is_completed: boolean
                    recommended_source_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    image_url?: string | null
                    estimated_cost?: string | null
                    difficulty_level?: number
                    is_completed?: boolean
                    recommended_source_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    image_url?: string | null
                    estimated_cost?: string | null
                    difficulty_level?: number
                    is_completed?: boolean
                    recommended_source_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            recommended_wishes: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    image_url: string | null
                    category: string | null
                    estimated_cost: string | null
                    difficulty_level: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    image_url?: string | null
                    category?: string | null
                    estimated_cost?: string | null
                    difficulty_level?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    image_url?: string | null
                    category?: string | null
                    estimated_cost?: string | null
                    difficulty_level?: number
                    created_at?: string
                }
            }
            custom_lists: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    icon: string
                    color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    icon?: string
                    color?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    icon?: string
                    color?: string
                    created_at?: string
                }
            }
            user_notes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    content: string | null
                    list_id: string | null
                    is_completed: boolean
                    scheduled_date: string | null
                    scheduled_time: string | null
                    tags: string | null
                    priority: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    content?: string | null
                    list_id?: string | null
                    is_completed?: boolean
                    scheduled_date?: string | null
                    scheduled_time?: string | null
                    tags?: string | null
                    priority?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    content?: string | null
                    list_id?: string | null
                    is_completed?: boolean
                    scheduled_date?: string | null
                    scheduled_time?: string | null
                    tags?: string | null
                    priority?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type UserWish = Database['public']['Tables']['user_wishes']['Row']
export type RecommendedWish = Database['public']['Tables']['recommended_wishes']['Row']
export type CustomList = Database['public']['Tables']['custom_lists']['Row']
export type UserNote = Database['public']['Tables']['user_notes']['Row']
