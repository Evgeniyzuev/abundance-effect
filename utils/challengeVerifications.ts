import { createClient } from '@/utils/supabase/server';

export interface ChallengeVerification {
  description: string;
  verify: (userId: string, challengeData: any, supabase: any, progressData?: any) => Promise<boolean>;
}

export const CHALLENGE_VERIFICATIONS: Record<string, ChallengeVerification> = {
  'has_wish': {
    description: 'Check if user has at least one wish',
    verify: async (userId: string, challengeData: any, supabase: any, progressData?: any) => {
      try {
        const { count, error } = await supabase
          .from('user_wishes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        return !error && count > 0;
      } catch (error) {
        console.error('Error verifying has_wish:', error);
        return false;
      }
    }
  },

  'completed_tasks': {
    description: 'Check if user completed minimum number of tasks',
    verify: async (userId: string, challengeData: any, supabase: any, progressData?: any) => {
      try {
        const minTasks = challengeData?.verification_params?.min_tasks || 1;
        const { count, error } = await supabase
          .from('user_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('completed', true);
        return !error && count >= minTasks;
      } catch (error) {
        console.error('Error verifying completed_tasks:', error);
        return false;
      }
    }
  },

  'user_level': {
    description: 'Check if user reached minimum level',
    verify: async (userId: string, challengeData: any, supabase: any, progressData?: any) => {
      try {
        const minLevel = challengeData?.verification_params?.min_level || 1;
        const { data: userLevel, error } = await supabase
          .from('user_levels')
          .select('level')
          .eq('user_id', userId)
          .single();
        return !error && userLevel && userLevel.level >= minLevel;
      } catch (error) {
        console.error('Error verifying user_level:', error);
        return false;
      }
    }
  },
  'calculate_time_to_goal': {
    description: 'Check if user used the goal calculator',
    verify: async (userId: string, challengeData: any, supabase: any, progressData?: any) => {
      // Check for calculation proof from client
      return !!progressData?.calculated;
    }
  }
};
