'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function chatWithAI(
    message: string,
    history: { role: 'user' | 'model'; parts: string }[],
    userContext: any
) {
    // 1. Check for API Key
    if (!apiKey || !genAI) {
        return {
            error: 'API Key missing',
            setupNeeded: true,
            text: "I'm not fully set up yet. Please add a `GOOGLE_GENERATIVE_AI_KEY` to your system environment variables. You can get a free key from Google AI Studio."
        };
    }

    try {
        // 2. Configure Model
        // "gemini-pro" is legacy. Using "gemini-2.5-flash" (2026 standard) for best performance.
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // 3. Construct System Prompt / Context
        // Since Gemini Pro (v1) handles system prompts best within the chat context or at the start,
        // we will prepend the context to the latest message or ensure it's in the flow.
        // For a stateless server action, assuming 'history' is passed from client,
        // we will inject system context into the prompt of this turn to ensure it's fresh.

        const systemContext = `
[SYSTEM CONTEXT]
You are the **Abundance Coordinator AI** for the Abundance Effect platform.
Your Goal: Help the user materialize their wishes and grow their Abundance Core capital.

User Profile:
- ID: ${userContext.userId || 'Unknown'}
- Language: ${userContext.language || 'en'}

Financial State:
- Core Balance (Non-spendable Capital): $${userContext.coreBalance?.toFixed(2) || '0.00'}
- Wallet Balance (Liquid): $${userContext.walletBalance?.toFixed(2) || '0.00'}
- Daily Income: $${userContext.dailyIncome?.toFixed(6) || '0.00'}
- User Level: ${userContext.level || 1}

Goals / Wishes:
${userContext.wishes?.length > 0
                ? userContext.wishes.map((w: any) => `- ${w.title} (Cost: $${w.estimated_cost})`).join('\n')
                : '- No active wishes yet.'}

Guidelines:
1. **Be Concise**: Keep answers short and helpful (mobile chat).
2. **Focus on Growth**: Encourage depositing to Core to increase daily income.
3. **Goal Oriented**: Connect advice to their wishes.
4. **Tone**: Supportive, futuristic, professional but friendly.
5. **Language**: Reply in the language matching the user's preference or input.
[/SYSTEM CONTEXT]

Specific Guidelines:

1.  **Language Adaptation (CRITICAL)**:
    *   ALWAYS reply in the SAME language as the User's last message.
    *   If the user asks in Russian, reply in Russian. If English, reply in English.
    *   Language context provided above is just a hint; prioritize the actual message text.

2.  **Conversation Style**:
    *   **Be Proactive**: Don't just answer. Ask 1 follow-up question to deepen the topic or guide the user to the next step.
    *   **Be Varied**: Avoid starting every sentence with "Great" or "I see". Use diverse sentence structures.
    *   **No Repetition**: Do not repeat the same advice word-for-word if the user asks similar questions.

3.  **System Recommendations (Growth & Community)**:
    *   **Encourage Challenges**: Recommend checking the "Challenges" tab to earn extra rewards. Suggest they look for tasks like "Ask AI" or financial goals.
    *   **Social Proof**: Mention that "other successful users" achieve their goals faster by upgrading their Core Level. Use phrases like "Users who reached Level 5 usually..." to inspire them.
    *   **Connect to Wishes**: Always tie your advice back to their specific Wishes listed in the context.

4.  **Tone**:
    *   Futuristic but grounded.
    *   Supportive partner (Coordinator), not a boring robot.
    *   Use emojis sparingly but effectively.
[/SYSTEM CONTEXT]
`;

        // 4. Start Chat
        // We ensure history is valid for Google Generative AI:
        // - Must start with 'user' role
        // - Must alternate user/model

        const cleanHistory = history.map(h => ({
            role: h.role,
            parts: [{ text: h.parts }]
        }));

        // Remove leading model messages
        while (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
            cleanHistory.shift();
        }

        // Merge consecutive messages of the same role to ensure alternation
        const sanitizedHistory = [];
        for (const msg of cleanHistory) {
            if (sanitizedHistory.length === 0) {
                sanitizedHistory.push(msg);
            } else {
                const last = sanitizedHistory[sanitizedHistory.length - 1];
                if (last.role === msg.role) {
                    // Merge text parts
                    last.parts[0].text += "\n\n" + msg.parts[0].text;
                } else {
                    sanitizedHistory.push(msg);
                }
            }
        }

        const chat = model.startChat({
            history: sanitizedHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        // 5. Send Message with Context
        // We strictly prepend the context to the *current* message to ensure the model sees the latest state.
        const promptWithContext = `${systemContext}\n\nUser: ${message}`;

        const result = await chat.sendMessage(promptWithContext);
        const response = await result.response;
        const text = response.text();

        return { text };

    } catch (error: any) {
        console.error('AI Service Error:', error);
        return {
            error: error.message || 'Failed to generate response',
            text: "I'm having trouble connecting to the neural network right now. Please try again later."
        };
    }
}
