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

## 4. Manual Peer Review (Future)
For challenges with `verification_type: 'manual_peer'`:
- The user will upload a "proof" (text or image) which is stored in `verification_data`.
- Other users (Peers) will be able to view these proofs and vote/verify.
- Once a threshold is reached, the challenge is marked as completed.

## 5. Deployment Checklist
- [ ] SQL migration applied (`npx supabase db push`).
- [ ] Verification logic added to `utils/challengeVerifications.ts`.
- [ ] UI triggers implemented in relevant components.
- [ ] Multi-language strings for title/description verified.
