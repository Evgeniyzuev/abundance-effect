'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
import Groq from 'groq-sdk';

// Initialize APIs
const geminiKey = process.env.GOOGLE_GENERATIVE_AI_KEY;
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

const groqKey = process.env.GROQ_API_KEY;
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null;

export type AIProvider = 'gemini' | 'groq';
export type GroqModel = 'llama-3.3-70b-versatile' | 'moonshotai/kimi-k2-instruct-0905';

export async function chatWithAI(
    message: string,
    history: { role: 'user' | 'model'; parts: string }[],
    userContext: any,
    provider: AIProvider = 'gemini',
    groqModel?: GroqModel
) {
    if (provider === 'gemini') {
        return chatWithGemini(message, history, userContext);
    } else if (provider === 'groq') {
        return chatWithGroq(message, history, userContext, groqModel);
    } else {
        return { error: 'Invalid provider', text: 'Selected AI provider is not available.' };
    }
}

// GEMINI IMPLEMENTATION
async function chatWithGemini(
    message: string,
    history: { role: 'user' | 'model'; parts: string }[],
    userContext: any
) {
    if (!geminiKey || !genAI) {
        return {
            error: 'API Key missing',
            setupNeeded: true,
            text: "Gemini is not configured. Please add `GOOGLE_GENERATIVE_AI_KEY`."
        };
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemContext = buildSystemContext(userContext);

        const cleanHistory = history.map(h => ({
            role: h.role,
            parts: [{ text: h.parts }]
        }));

        while (cleanHistory.length > 0 && cleanHistory[0].role === 'model') {
            cleanHistory.shift();
        }

        const sanitizedHistory = [];
        for (const msg of cleanHistory) {
            if (sanitizedHistory.length === 0) {
                sanitizedHistory.push(msg);
            } else {
                const last = sanitizedHistory[sanitizedHistory.length - 1];
                if (last.role === msg.role) {
                    last.parts[0].text += "\n\n" + msg.parts[0].text;
                } else {
                    sanitizedHistory.push(msg);
                }
            }
        }

        const chat = model.startChat({
            history: sanitizedHistory,
            generationConfig: { maxOutputTokens: 1000 },
        });

        const promptWithContext = `${systemContext}\n\nUser: ${message}`;
        const result = await chat.sendMessage(promptWithContext);
        const text = result.response.text();

        return { text };

    } catch (error: any) {
        console.error('Gemini Error:', error);
        return { error: error.message, text: "Gemini is currently unavailable." };
    }
}

// GROQ IMPLEMENTATION
async function chatWithGroq(
    message: string,
    history: { role: 'user' | 'model'; parts: string }[],
    userContext: any,
    groqModel?: GroqModel
) {
    if (!groqKey || !groq) {
        return {
            error: 'API Key missing',
            setupNeeded: true,
            text: "Groq is not configured. Please add `GROQ_API_KEY`."
        };
    }

    try {
        const systemContext = buildSystemContext(userContext);

        // Convert history to OpenAI format
        const messages: any[] = [
            { role: 'system', content: systemContext },
            ...history.map(h => ({
                role: h.role === 'model' ? 'assistant' : 'user',
                content: h.parts
            })),
            { role: 'user', content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: groqModel || 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        return { text: completion.choices[0]?.message?.content || '' };

    } catch (error: any) {
        console.error('Groq Error:', error);
        return { error: error.message, text: "Groq is currently unavailable." };
    }
}

function buildSystemContext(userContext: any) {
    return `
[SYSTEM CONTEXT]
You are the **Abundance Coordinator AI** for the Abundance Effect platform.
Your Goal: Help the user materialize their wishes and grow their Abundance Core capital.

User Profile:
- ID: ${userContext.userId || 'Unknown'}
- Language: ${userContext.language || 'en'}

Financial State:
- Core Balance: $${userContext.coreBalance?.toFixed(2) || '0.00'}
- Wallet Balance: $${userContext.walletBalance?.toFixed(2) || '0.00'}
- Level: ${userContext.level || 1}

Level Requirements:
- Level 1-5: $2 → $32 (Getting Started)
- Level 6-10: $64 → $1,000 (Building Momentum)
- Level 11-15: $2,000 → $32,000 (Growing Wealth)
- Level 16-20: $64,000 → $1,000,000 (Significant Progress)
- Level 21-25: $2M → $32M (Wealth Building)
- Level 26-30: $64M → $1B (Major Milestones)
- Level 31-35: $2B → $32B (High Net Worth)
- Level 36-40: $64B → $1T (Elite Status)
- *Each level requires ~2x more Core than the previous*

Goals / Wishes:
${userContext.wishes?.length > 0
            ? userContext.wishes.map((w: any) => `- ${w.title} ($${w.estimated_cost})`).join('\n')
            : '- No active wishes yet.'}

Guidelines:
1. **Be Concise**: Keep answers short (mobile chat).
2. **Focus on Growth**: Encourage depositing to Core.
3. **Goal Oriented**: Connect advice to their wishes.
4. **Tone**: Supportive, futuristic, professional but friendly.
5. **Language**: Reply in the language matching the user's preference or input.
6. **Proactive**: Ask follow-up questions.
7. **Recommendations**: Suggest checking "Challenges" tab and "Projects".
8. **Level Guidance**: Help users understand how much Core they need for next level.
[/SYSTEM CONTEXT]
`;
}
