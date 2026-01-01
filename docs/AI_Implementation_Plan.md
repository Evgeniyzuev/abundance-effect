# Abundance Effect: AI Assistant Implementation Plan

## 1. Goal
Implement an AI Assistant ("Abundance System") that helps users:
1.  Achieve their wishes (from `Wishboard`).
2.  Grow their capital (Abundance Core).
3.  Coordinate with the system.

The AI will have context about the user's specific state (Wishes, Core Balance, Level) and general system knowledge.

## 2. Architecture

### 2.1. Tech Stack
*   **Frontend**: Next.js 14, React, Tailwind CSS (Chat UI).
*   **Backend**: Server Actions (`app/actions/ai.ts`) to handle API requests securely.
*   **AI Provider**: Google Gemini API (Free Tier available) or OpenAI (if user has key).
    *   *Recommendation*: Use Google Gemini API (Flash model) as it has a generous free tier.

### 2.2. Data Context Injection
To give the AI "system awareness", we will dynamically inject the following JSON data into the **System Prompt** for each session/message:
*   **User Profile**: Name, Language.
*   **Core Stats**: Core Balance, User Level, Reinvest %, Daily Income.
*   **Wishes**: List of active wishes (Title, Cost, Difficulty).
*   **System Rules**: "The Abundance System is a coordination AI..."

### 2.3. System Prompt Structure
```text
You are the Abundance AI, a coordinator ensuring the user's prosperity.
User Context:
- Level: {level}
- Core Balance: ${balance} (Daily Income: ${daily})
- Wishes: {wishes_list}

Your Goal:
1. Help the user achieve their wishes.
2. Encourage depositing into Core to reach the next level.
3. Be supportive, concise, and use the user's language.
```

## 3. Implementation Steps

### Step 1: Server Side (AI Logic)
*   **File**: `app/actions/ai.ts`
*   **Function**: `chatWithAI(messages, userContext)`
*   **Logic**:
    1.  Validate User.
    2.  Construct System Prompt with `userContext`.
    3.  Call LLM API (Gemini).
    4.  Return stream or text response.

### Step 2: Client Side (Chat UI)
*   **File**: `app/(main)/ai/page.tsx`
*   **Components**:
    *   `ChatInterface`: Message list, Input field.
    *   `MessageBubble`: Styling for User vs AI.
    *   `ContextLoader`: Fetches user data (Wishes, Core) to pass to the Server Action.

### Step 3: Setup Instructions (Docs)
*   Create a guide on how to get a Google Gemini API Key.
*   Where to put it in `.env`.

## 4. API & Free LLM Setup
We will use **Google Generative AI (Gemini)** via the `google-generative-ai` package/SDK or direct REST call.
It is free for low/medium usage.

### Env Variables
```env
GOOGLE_GENERATIVE_AI_KEY=AIzaSy...
```
