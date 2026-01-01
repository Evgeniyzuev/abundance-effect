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
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
`;

        // 4. Start Chat
        // We construct the history for the model.
        // Note: Gemini expects roles 'user' and 'model'.
        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role,
                parts: [{ text: h.parts }]
            })),
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
