import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { level, message, data } = body;

        const logData = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
        };

        // This console.log will appear in Vercel Function Logs
        if (level === 'error') {
            console.error('[CLIENT-ERROR]', JSON.stringify(logData, null, 2));
        } else {
            console.log('[CLIENT-LOG]', JSON.stringify(logData, null, 2));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
