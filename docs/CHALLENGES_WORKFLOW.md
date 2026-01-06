# Workflow: Working with Challenges

This document outlines the standard workflow for creating, implementing, and verifying challenges in the Abundance Effect platform.

## 1. Database & Seed Data
All system challenges reside in the `challenges` table. To add a new system challenge:

1.  **Create a SQL Migration**: Add a new file in `supabase/migrations/` (e.g., `20251221_add_new_challenge.sql`).
2.  **Define the Challenge**:
    - `title` and `description`: JSONB for multi-language support.
    - `type`: `'system'`.
    - `verification_type`: `'auto'` (for automated checks), `'manual_peer'` (for review by other users), or `'manual_creator'`.
    - `verification_logic`: A unique key (e.g., `'has_wish'`, `'calculate_time_to_goal'`) used to link to the verification function.
    - `reward_core`: Reward amount in Core tokens (e.g., `"1$"`).

Example SQL:
```sql
INSERT INTO public.challenges (title, description, type, verification_type, verification_logic, reward_core, owner_name)
VALUES (
  '{"en": "New Challenge", "ru": "Новый челлендж"}',
  '{"en": "Description", "ru": "Описание"}',
  'system', 'auto', 'my_custom_logic', '"1$"', 'System'
);
```

## 2. Server-Side Verification Logic
All verification logic is centralized in `utils/challengeVerifications.ts`.

1.  **Register the Logic**: Add the handler to the `CHALLENGE_VERIFICATIONS` object.
2.  **Implementation**:
    - For **Passive Actions** (e.g., checking if a user has a wish), query the database directly.
    - For **Explicit Actions** (e.g., clicking a specific button), check `progressData` passed from the client.

```typescript
// utils/challengeVerifications.ts
'my_custom_logic': {
  description: 'Explain what this verifies',
  verify: async (userId, challengeData, supabase, progressData) => {
    // 1. Passive Check (DB query)
    const { count } = await supabase.from('...').select('*').eq('user_id', userId);
    if (count > 0) return true;

    // 2. Explicit Proof (Progress Data)
    return !!progressData?.action_performed;
  }
}
```

## 3. Client-Side Implementation
To trigger progress or completion from the UI:

1.  **Use the Hook**: Import `useChallenges` in your component.
2.  **Step 1: Record Action (Optional but Recommended)**:
    When the user performs the required action, call `updateParticipation` with status `'active'` to record progress without closing the challenge.
    ```typescript
    const { challengesWithParticipation, updateParticipation } = useChallenges();

    const handleAction = async () => {
        // Perform the business logic...
        const challenge = challengesWithParticipation.find(c => c.verification_logic === 'my_custom_logic');
        if (challenge && challenge.userParticipation?.status === 'active') {
            await updateParticipation(challenge.id, 'active', { action_performed: true });
        }
    };
    ```
3.  **Step 2: Manual Verification**:
    The user returns to the **Challenges** tab and clicks "Check". The `ChallengesPage` component calls the same `updateParticipationAction` but with status `'completed'`. The server then runs the verification logic.

## 4. Specialized Challenge Forms
For complex challenges (like "App Testing"), you may need to collect specific data from the user.

1.  **Create a Form Component**: Place it in `components/challenges/`.
2.  **Integrate with Modal**: Update `components/ChallengeDetailModal.tsx` to render your form based on `verification_logic`.
3.  **Server Action**: Create a dedicated server action to store the form data in its own table.
4.  **Verification**: The `CHALLENGE_VERIFICATIONS` handler should check for the existence of this data.

## 5. UI Session Tracking
If a challenge requires visiting multiple pages:
- Use `localStorage` to track progress during the session.
- Pass the tracked data to `updateParticipation` or directly during the "Check" verification via `progress_data`.

## 6. Deployment Checklist
- [ ] SQL migration applied (`npx supabase db push`).
- [ ] Verification logic added to `utils/challengeVerifications.ts`.
- [ ] UI triggers implemented in relevant components.
- [ ] Specialized forms (if any) integrated into `ChallengeDetailModal.tsx`.
- [ ] Multi-language strings for title/description verified.
