# Plan: Challenge "Application Function Testing"

This document describes the design and implementation details for the 4th system challenge.

## Challenge Overview
- **Title**: Testing Application Functions (Тестирование функций приложения)
- **Reward**: 5$ (Core)
- **Description**: Explore all main sections of the application and share your feedback to help us improve.

## Requirements for Completion
1.  **Exploration**: Visit all 5 main navigation tabs:
    - [ ] Goals (Желания)
    - [ ] Challenges (Задачи)
    - [ ] AI (ИИ Помощник)
    - [ ] Wallet (Кошелек)
    - [ ] Social (Социум)
2.  **Feedback**: Submit a detailed review answering the following:
    - What functions did you test?
    - Did you find any errors or bugs?
    - What improvements or new features would you suggest?
    - How do you think AI developments can help people improve their lives, solve problems, or fulfill desires?
    - What would you personally need to start using this application daily in your life?

## Technical Implementation

### 1. Verification Logic (`auto`)
When the user clicks **"Check"**, the system will verify:
- Presence of a record in the `app_reviews` table for the current user.
- Tracking of tab visits (passed via `progress_data`).

### 2. Review Storage
A new database table `app_reviews` will be added:
```sql
CREATE TABLE public.app_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tested_functions text NOT NULL,
  errors_found text,
  suggestions text,
  ai_thoughts text,
  personal_usage_needs text,
  rating integer, -- optional 1-5
  created_at timestamp with time zone DEFAULT now()
);
```

### 3. Reviews Page
A new section in **Social** tab will be created to view all public reviews, allowing users to see what others think and suggest.

### 4. Progress Tracking
- Tabs visited are tracked in `localStorage` under `app-visited-tabs`.
- Once all 5 tabs are visited, the "Submit Review" button becomes active in the challenge window.
- Submission of the review triggers an automatic check to complete the challenge.
