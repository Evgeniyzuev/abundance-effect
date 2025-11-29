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
            personal_tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    type: 'one_time' | 'streak' | 'daily'
                    status: 'active' | 'completed' | 'canceled'
                    streak_goal: number | null
                    streak_current: number | null
                    progress_percentage: number | null
                    last_completed_at: string | null
                    image_url: string | null
                    daily_completions: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    type: 'one_time' | 'streak' | 'daily'
                    status?: 'active' | 'completed' | 'canceled'
                    streak_goal?: number | null
                    streak_current?: number | null
                    progress_percentage?: number | null
                    last_completed_at?: string | null
                    image_url?: string | null
                    daily_completions?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    type?: 'one_time' | 'streak' | 'daily'
                    status?: 'active' | 'completed' | 'canceled'
                    streak_goal?: number | null
                    streak_current?: number | null
                    progress_percentage?: number | null
                    last_completed_at?: string | null
                    image_url?: string | null
                    daily_completions?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            user_results: {
                Row: {
                    user_id: string
                    inventory: Json
                    knowledge: Json
                    unlocked_achievements: Json
                    selected_base_id: string | null
                    selected_character_id: string | null
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    inventory?: Json
                    knowledge?: Json
                    unlocked_achievements?: Json
                    selected_base_id?: string | null
                    selected_character_id?: string | null
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    inventory?: Json
                    knowledge?: Json
                    unlocked_achievements?: Json
                    selected_base_id?: string | null
                    selected_character_id?: string | null
                    updated_at?: string
                }
            }
            game_items: {
                Row: {
                    id: string
                    type: 'achievement' | 'item' | 'book' | 'base' | 'character'
                    title: string
                    description: string | null
                    image: string
                    subtitle: string | null
                    sort_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    type: 'achievement' | 'item' | 'book' | 'base' | 'character'
                    title: string
                    description?: string | null
                    image: string
                    subtitle?: string | null
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    type?: 'achievement' | 'item' | 'book' | 'base' | 'character'
                    title?: string
                    description?: string | null
                    image?: string
                    subtitle?: string | null
                    sort_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            challenges: {
                Row: {
                    id: string
                    title: Json
                    description: Json
                    type: 'system' | 'user_created' | 'event' | 'tournament'
                    category: string | null
                    level: number
                    reward_core: Json
                    reward_items: Json
                    max_participants: number
                    current_participants: number
                    deadline: string | null
                    verification_type: 'auto' | 'manual_peer' | 'manual_creator'
                    verification_logic: Json
                    owner_id: string | null
                    owner_name: string | null
                    image_url: string | null
                    is_active: boolean
                    priority: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title?: Json
                    description?: Json
                    type: 'system' | 'user_created' | 'event' | 'tournament'
                    category?: string | null
                    level?: number
                    reward_core?: Json
                    reward_items?: Json
                    max_participants?: number
                    current_participants?: number
                    deadline?: string | null
                    verification_type?: 'auto' | 'manual_peer' | 'manual_creator'
                    verification_logic?: Json
                    owner_id?: string | null
                    owner_name?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: Json
                    description?: Json
                    type?: 'system' | 'user_created' | 'event' | 'tournament'
                    category?: string | null
                    level?: number
                    reward_core?: Json
                    reward_items?: Json
                    max_participants?: number
                    current_participants?: number
                    deadline?: string | null
                    verification_type?: 'auto' | 'manual_peer' | 'manual_creator'
                    verification_logic?: Json
                    owner_id?: string | null
                    owner_name?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            challenge_participants: {
                Row: {
                    id: string
                    challenge_id: string
                    user_id: string
                    joined_at: string
                    status: 'active' | 'completed' | 'failed' | 'abandoned'
                    progress_data: Json
                    completed_at: string | null
                    rewards_claimed: Json
                    verification_data: Json
                }
                Insert: {
                    id?: string
                    challenge_id: string
                    user_id: string
                    joined_at?: string
                    status?: 'active' | 'completed' | 'failed' | 'abandoned'
                    progress_data?: Json
                    completed_at?: string | null
                    rewards_claimed?: Json
                    verification_data?: Json
                }
                Update: {
                    id?: string
                    challenge_id?: string
                    user_id?: string
                    joined_at?: string
                    status?: 'active' | 'completed' | 'failed' | 'abandoned'
                    progress_data?: Json
                    completed_at?: string | null
                    rewards_claimed?: Json
                    verification_data?: Json
                }
            }
            factions: {
                Row: {
                    id: string
                    name: Json
                    description: Json
                    mission: Json
                    goals: Json
                    values: Json
                    plan: Json
                    image_url: string | null
                    created_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name?: Json
                    description?: Json
                    mission?: Json
                    goals?: Json
                    values?: Json
                    plan?: Json
                    image_url?: string | null
                    created_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: Json
                    description?: Json
                    mission?: Json
                    goals?: Json
                    values?: Json
                    plan?: Json
                    image_url?: string | null
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            faction_members: {
                Row: {
                    id: string
                    faction_id: string
                    user_id: string
                    role: 'leader' | 'co_leader' | 'member'
                    joined_at: string
                }
                Insert: {
                    id?: string
                    faction_id: string
                    user_id: string
                    role?: 'leader' | 'co_leader' | 'member'
                    joined_at?: string
                }
                Update: {
                    id?: string
                    faction_id?: string
                    user_id?: string
                    role?: 'leader' | 'co_leader' | 'member'
                    joined_at?: string
                }
            }
        }
    }
}

export type UserWish = Database['public']['Tables']['user_wishes']['Row']
export type RecommendedWish = Database['public']['Tables']['recommended_wishes']['Row']
export type CustomList = Database['public']['Tables']['custom_lists']['Row']
export type UserNote = Database['public']['Tables']['user_notes']['Row']
export type PersonalTask = Database['public']['Tables']['personal_tasks']['Row']
export type UserResults = Database['public']['Tables']['user_results']['Row']
export type GameItem = Database['public']['Tables']['game_items']['Row']
export type Challenge = Database['public']['Tables']['challenges']['Row']
export type ChallengeParticipant = Database['public']['Tables']['challenge_participants']['Row']
export type Faction = Database['public']['Tables']['factions']['Row']
export type FactionMember = Database['public']['Tables']['faction_members']['Row']
