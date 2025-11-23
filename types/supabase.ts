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
        }
    }
}

export type UserWish = Database['public']['Tables']['user_wishes']['Row']
export type RecommendedWish = Database['public']['Tables']['recommended_wishes']['Row']
